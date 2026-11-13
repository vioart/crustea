"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import dynamic from "next/dynamic";
import {
  Image as ImageIcon,
  LoaderCircle,
  MapPin,
  Upload,
  X,
} from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import cities from "@/data/cities.json";
export type Destination = {
  id: string;
  city: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  status: "regular" | "by-order";
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
};

const DestinationMapPicker = dynamic(() => import("./destination-map-picker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
      Memuat peta...
    </div>
  ),
});

type Language = "id" | "en";
type DestinationStatus = "regular" | "by-order";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  destination: Destination | null;
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

type FormState = {
  city: string;
  name: string;
  latitude: string;
  longitude: string;
  status: DestinationStatus;
  description: string;
  sort_order: number;
  is_active: boolean;
};

type FieldErrors = Partial<
  Record<"city" | "name" | "description" | "coordinates" | "image", string>
>;

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const ENDPOINT = "/api/admin/destinations";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const copy = {
  id: {
    createTitle: "Tambah Destinasi",
    editTitle: "Edit Destinasi",
    createDescription: "Lengkapi informasi lokasi wisata berikut.",
    editDescription: "Perbarui informasi destinasi wisata.",
    name: "Nama Destinasi",
    city: "Kabupaten/Kota",
    chooseCity: "Pilih Kabupaten/Kota",
    description: "Deskripsi",
    image: "Foto Destinasi",
    imageHint: "Format JPG, PNG, atau WEBP. Maksimal 2 MB.",
    chooseImage: "Pilih Foto",
    changeImage: "Ganti Foto",
    removeImage: "Hapus Foto",
    coordinates: "Tentukan Lokasi Destinasi",
    mapHint: "Klik peta atau geser marker untuk menentukan titik lokasi.",
    latitude: "Latitude",
    longitude: "Longitude",
    coordinateRequired: "Pilih titik lokasi pada peta.",
    status: "Jenis Destinasi",
    regular: "Reguler",
    byOrder: "By Order",
    regularDescription: "Destinasi tersedia sebagai pilihan wisata reguler.",
    orderDescription: "Destinasi melayani kunjungan berdasarkan permintaan atau kesepakatan.",
    sortOrder: "Urutan Tampilan",
    autoOrder: "Otomatis ditentukan oleh sistem",
    publication: "Status Publikasi",
    active: "Aktif",
    inactive: "Tidak Aktif",
    save: "Simpan Destinasi",
    saving: "Menyimpan...",
    cancel: "Batal",
    close: "Tutup",
    loading: "Menyiapkan formulir...",
    requiredName: "Nama destinasi wajib diisi.",
    requiredCity: "Kabupaten/Kota wajib dipilih.",
    requiredDescription: "Deskripsi destinasi wajib diisi.",
    invalidImage: "Gunakan foto JPG, PNG, atau WEBP.",
    imageTooLarge: "Ukuran foto maksimal 2 MB.",
    authError: "Token autentikasi tidak ditemukan.",
    createError: "Gagal menambahkan destinasi.",
    updateError: "Gagal memperbarui destinasi.",
    sortError: "Gagal menentukan urutan destinasi otomatis.",
  },
  en: {
    createTitle: "Add Destination",
    editTitle: "Edit Destination",
    createDescription: "Complete the tourism destination information.",
    editDescription: "Update destination information.",
    name: "Destination Name",
    city: "Regency/City",
    chooseCity: "Select Regency/City",
    description: "Description",
    image: "Destination Image",
    imageHint: "JPG, PNG, or WEBP. Maximum 2 MB.",
    chooseImage: "Choose Image",
    changeImage: "Change Image",
    removeImage: "Remove Image",
    coordinates: "Set Destination Location",
    mapHint: "Click the map or drag the marker to select the location.",
    latitude: "Latitude",
    longitude: "Longitude",
    coordinateRequired: "Select a point on the map.",
    status: "Destination Type",
    regular: "Regular",
    byOrder: "By Order",
    regularDescription: "Available as a regular destination.",
    orderDescription: "Available upon request only.",
    sortOrder: "Display Order",
    autoOrder: "Automatically assigned by the system",
    publication: "Publication Status",
    active: "Active",
    inactive: "Inactive",
    save: "Save Destination",
    saving: "Saving...",
    cancel: "Cancel",
    close: "Close",
    loading: "Preparing form...",
    requiredName: "Destination name is required.",
    requiredCity: "Select a regency/city.",
    requiredDescription: "Destination description is required.",
    invalidImage: "Use a JPG, PNG, or WEBP image.",
    imageTooLarge: "Image size must not exceed 2 MB.",
    authError: "Authentication token not found.",
    createError: "Failed to add destination.",
    updateError: "Failed to update destination.",
    sortError: "Failed to determine the automatic destination order.",
  },
} as const;

function getImageUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }
  return data;
}

function initialState(destination: Destination | null): FormState {
  return {
    city: destination?.city ?? "",
    name: destination?.name ?? "",
    latitude: destination?.latitude?.toString() ?? "",
    longitude: destination?.longitude?.toString() ?? "",
    status: destination?.status ?? "regular",
    description: destination?.description ?? "",
    sort_order: destination?.sort_order ?? 1,
    is_active: destination?.is_active ?? true,
  };
}

export default function DestinationFormModal({
  open,
  mode,
  destination,
  language,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const t = copy[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(() => initialState(destination));
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [sortLoading, setSortLoading] = useState(mode === "create");

  const cityOptions = useMemo(
    () => [...new Set(cities)].sort((a, b) => a.localeCompare(b, "id")),
    [],
  );

  const existingImage = destination?.image_url
    ? getImageUrl(destination.image_url)
    : "";

  // For create mode, derive the next order from the current destination list.
  // For edit mode, retain the existing order without exposing a manual input.
  const getNextSortOrder = useCallback(async () => {
    const token = getAuthToken();
    if (!token) throw new Error(t.authError);

    const response = await fetch(`${API_URL}${ENDPOINT}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await parseResponse(response);
    const rows = Array.isArray(data.data) ? data.data : [];
    const highest = rows.reduce(
      (max: number, item: { sort_order?: number }) =>
        Math.max(max, Number(item.sort_order) || 0),
      0,
    );
    return highest + 1;
  }, [t.authError]);

  // Load automatic order only when creating a new destination.
  useEffect(() => {
    if (mode !== "create") return;

    let cancelled = false;

    async function loadNextOrder() {
      try {
        const next = await getNextSortOrder();
        if (!cancelled) {
          setForm((previous) => ({ ...previous, sort_order: next }));
        }
      } catch (error) {
        if (!cancelled) {
          setServerError(error instanceof Error ? error.message : t.sortError);
        }
      } finally {
        if (!cancelled) setSortLoading(false);
      }
    }

    void loadNextOrder();
    return () => {
      cancelled = true;
    };
  }, [mode, getNextSortOrder, t.sortError]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setServerError("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((previous) => ({ ...previous, image: t.invalidImage }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((previous) => ({ ...previous, image: t.imageTooLarge }));
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((previous) => ({ ...previous, image: undefined }));
    setServerError("");
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setErrors((previous) => ({ ...previous, image: undefined }));
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (!form.name.trim()) next.name = t.requiredName;
    if (!form.city) next.city = t.requiredCity;
    if (!form.description.trim()) next.description = t.requiredDescription;

    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (
      !form.latitude ||
      !form.longitude ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      next.coordinates = t.coordinateRequired;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      setSaving(true);
      const token = getAuthToken();
      if (!token) throw new Error(t.authError);
      if (mode === "edit" && !destination?.id) {
        throw new Error(t.updateError);
      }

      const payload = new FormData();
      payload.append("city", form.city.trim());
      payload.append("name", form.name.trim());
      payload.append("latitude", form.latitude);
      payload.append("longitude", form.longitude);
      payload.append("status", form.status);
      payload.append("description", form.description.trim());
      payload.append("sort_order", String(form.sort_order));
      payload.append("is_active", String(form.is_active));

      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      if (mode === "edit" && !preview && destination?.image_url) {
        payload.append("remove_image", "true");
      }

      const url =
        mode === "create"
          ? `${API_URL}${ENDPOINT}`
          : `${API_URL}${ENDPOINT}/${encodeURIComponent(destination!.id)}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      await parseResponse(response);
      onSuccess();
    } catch (error) {
      console.error("Save destination error:", error);
      const message =
        error instanceof Error
          ? error.message
          : mode === "create"
            ? t.createError
            : t.updateError;
      setServerError(message);
      onError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10";
  const labelClass = "text-sm font-medium text-foreground";
  const preview = imagePreview || existingImage;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="destination-form-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2
              id="destination-form-title"
              className="text-lg font-bold text-foreground"
            >
              {mode === "create" ? t.createTitle : t.editTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "create" ? t.createDescription : t.editDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label={t.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-5 p-6">
            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="destination-name" className={labelClass}>
                  {t.name} <span className="text-red-500">*</span>
                </label>
                <input
                  id="destination-name"
                  maxLength={150}
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="destination-city" className={labelClass}>
                  {t.city} <span className="text-red-500">*</span>
                </label>
                <select
                  id="destination-city"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  className={inputClass}
                >
                  <option value="">{t.chooseCity}</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="destination-description" className={labelClass}>
                {t.description} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="destination-description"
                rows={4}
                maxLength={1000}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>{t.image}</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="mt-1.5 flex flex-col gap-4 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-center">
                <div className="flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={form.name || t.image}
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-10 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white hover:bg-brand-dark/90"
                  >
                    <Upload className="size-4" />
                    {preview ? t.changeImage : t.chooseImage}
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="h-10 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
                    >
                      {t.removeImage}
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t.imageHint}
              </p>
              {errors.image && (
                <p className="mt-1 text-xs text-red-500">{errors.image}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="size-4 text-brand-dark" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t.coordinates}
                </h3>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{t.mapHint}</p>
              <DestinationMapPicker
                latitude={form.latitude ? Number(form.latitude) : null}
                longitude={form.longitude ? Number(form.longitude) : null}
                onChange={(latitude, longitude) => {
                  updateField("latitude", latitude.toFixed(7));
                  updateField("longitude", longitude.toFixed(7));
                }}
              />
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>{t.latitude}</label>
                  <input
                    readOnly
                    value={form.latitude}
                    className={`${inputClass} bg-muted`}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t.longitude}</label>
                  <input
                    readOnly
                    value={form.longitude}
                    className={`${inputClass} bg-muted`}
                  />
                </div>
              </div>
              {errors.coordinates && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.coordinates}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="destination-status" className={labelClass}>
                  {t.status}
                </label>
                <select
                  id="destination-status"
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as DestinationStatus,
                    )
                  }
                  className={inputClass}
                >
                  <option value="regular">{t.regular}</option>
                  <option value="by-order">{t.byOrder}</option>
                </select>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {form.status === "regular"
                    ? t.regularDescription
                    : t.orderDescription}
                </p>
              </div>

              <div>
                <label className={labelClass}>{t.sortOrder}</label>
                <div className="mt-1.5 flex h-10 items-center rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground">
                  {sortLoading ? (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  ) : (
                    <span className="mr-2 font-semibold text-foreground">
                      #{form.sort_order}
                    </span>
                  )}
                  {t.autoOrder}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t.publication}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {form.is_active ? t.active : t.inactive}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.is_active}
                onClick={() => updateField("is_active", !form.is_active)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  form.is_active ? "bg-green-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
                    form.is_active ? "translate-x-[26px]" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={saving || sortLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <LoaderCircle className="size-4 animate-spin" />}
              {saving ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
