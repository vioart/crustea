
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

import {
  Image as ImageIcon,
  LoaderCircle,
  Upload,
  X,
  Plus,
  Trash2,
  Clock,
  Users,
  Banknote,
  ListChecks,
  Gift,
  Package,
} from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import type { DestinationPackage } from "@/app/portal/(dashboard)/akuatur/[id]/page";

/* =========================================================
   TYPES
========================================================= */

type Language = "id" | "en";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  destinationId: string;
  packageData: DestinationPackage | null;
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

type FormState = {
  title: string;
  category: string;
  duration: string;
  participants: string;
  price: string;
  price_note: string;
  description: string;
  highlights: string[];
  benefits: string[];
  sort_order: number;
  is_active: boolean;
};

type FieldErrors = Partial<
  Record<
    | "title"
    | "category"
    | "duration"
    | "participants"
    | "price"
    | "description"
    | "image",
    string
  >
>;

/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const DESTINATION_ENDPOINT = "/api/admin/destinations";
const PACKAGE_ENDPOINT = "/api/admin/packages";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   TRANSLATIONS
========================================================= */

const copy = {
  id: {
    createTitle: "Tambah Package",
    editTitle: "Edit Package",

    createDescription: "Lengkapi informasi package wisata berikut.",
    editDescription: "Perbarui informasi package wisata.",

    basicInformation: "Informasi Package",
    title: "Nama Package",
    titlePlaceholder: "Contoh: Paket Wisata Sunrise Merapi",

    category: "Kategori",
    categoryPlaceholder: "Pilih kategori",
    categoryRegular: "Reguler",
    categoryGroup: "Grup",

    duration: "Durasi",
    durationPlaceholder: "Contoh: 2 Hari 1 Malam",

    participants: "Jumlah Peserta",
    participantsPlaceholder: "Contoh: 2-5 Orang",

    price: "Harga",
    pricePlaceholder: "Contoh: 150000",

    priceNote: "Catatan Harga",
    priceNotePlaceholder: "Contoh: Harga per orang",

    description: "Deskripsi",
    descriptionPlaceholder: "Tuliskan deskripsi package wisata...",

    highlights: "Highlights",
    highlightsDescription: "Keunggulan atau aktivitas utama package.",
    highlightsPlaceholder: "Masukkan highlights...",
    addHighlight: "Tambah Highlight",

    benefits: "Benefits",
    benefitsDescription: "Fasilitas atau manfaat yang didapat peserta.",
    benefitsPlaceholder: "Masukkan benefits...",
    addBenefit: "Tambah Benefit",

    image: "Foto Package",
    imageHint: "Format JPG, PNG, atau WEBP. Maksimal 2 MiB.",
    chooseImage: "Pilih Foto",
    changeImage: "Ganti Foto",
    removeImage: "Hapus Foto",

    sortOrder: "Urutan Tampilan",
    autoOrder: "Otomatis ditentukan oleh sistem",

    publication: "Status Publikasi",
    active: "Aktif",
    inactive: "Tidak Aktif",

    save: "Simpan Package",
    saving: "Menyimpan...",
    cancel: "Batal",
    close: "Tutup",

    loading: "Menyiapkan formulir...",

    requiredTitle: "Nama package wajib diisi.",
    requiredCategory: "Kategori wajib diisi.",
    requiredDuration: "Durasi wajib diisi.",
    requiredParticipants: "Jumlah peserta wajib diisi.",
    requiredPrice: "Harga wajib diisi.",
    invalidPrice: "Harga harus berupa angka lebih dari atau sama dengan nol.",
    requiredDescription: "Deskripsi package wajib diisi.",

    invalidImage: "Gunakan foto JPG, PNG, atau WEBP.",
    imageTooLarge: "Ukuran foto maksimal 2 MiB.",

    authError: "Token autentikasi tidak ditemukan.",
    createError: "Gagal menambahkan package.",
    updateError: "Gagal memperbarui package.",
    sortError: "Gagal menentukan urutan package otomatis.",
  },

  en: {
    createTitle: "Add Package",
    editTitle: "Edit Package",

    createDescription: "Complete the tourism package information.",
    editDescription: "Update tourism package information.",

    basicInformation: "Package Information",
    title: "Package Name",
    titlePlaceholder: "Example: Merapi Sunrise Tour",

    category: "Category",
    categoryPlaceholder: "Select category",
    categoryRegular: "Regular",
    categoryGroup: "Group",

    duration: "Duration",
    durationPlaceholder: "Example: 2 Days 1 Night",

    participants: "Participants",
    participantsPlaceholder: "Example: 2-5 People",

    price: "Price",
    pricePlaceholder: "Example: 150000",

    priceNote: "Price Note",
    priceNotePlaceholder: "Example: Price per person",

    description: "Description",
    descriptionPlaceholder: "Write the package description...",

    highlights: "Highlights",
    highlightsDescription: "Main activities or package highlights.",
    highlightsPlaceholder: "Enter a highlight...",
    addHighlight: "Add Highlight",

    benefits: "Benefits",
    benefitsDescription: "Facilities or benefits included.",
    benefitsPlaceholder: "Enter a benefit...",
    addBenefit: "Add Benefit",

    image: "Package Image",
    imageHint: "JPG, PNG, or WEBP. Maximum 2 MiB.",
    chooseImage: "Choose Image",
    changeImage: "Change Image",
    removeImage: "Remove Image",

    sortOrder: "Display Order",
    autoOrder: "Automatically assigned by the system",

    publication: "Publication Status",
    active: "Active",
    inactive: "Inactive",

    save: "Save Package",
    saving: "Saving...",
    cancel: "Cancel",
    close: "Close",

    loading: "Preparing form...",

    requiredTitle: "Package name is required.",
    requiredCategory: "Category is required.",
    requiredDuration: "Duration is required.",
    requiredParticipants: "Participants are required.",
    requiredPrice: "Price is required.",
    invalidPrice: "Price must be a non-negative number.",
    requiredDescription: "Package description is required.",

    invalidImage: "Use a JPG, PNG, or WEBP image.",
    imageTooLarge: "Image size must not exceed 2 MiB.",

    authError: "Authentication token not found.",
    createError: "Failed to add package.",
    updateError: "Failed to update package.",
    sortError: "Failed to determine the automatic package order.",
  },
} as const;

/* =========================================================
   HELPERS
========================================================= */

function getImageUrl(path: string) {
  if (!path) return "";

  if (/^(https?:\/\/|blob:|data:)/i.test(path)) {
    return path;
  }

  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return data;
}

function initialState(
  packageData: DestinationPackage | null,
): FormState {
  return {
    title: packageData?.title ?? "",
    category: packageData?.category ?? "",
    duration: packageData?.duration ?? "",
    participants: packageData?.participants ?? "",
    price:
      packageData?.price !== undefined &&
      packageData?.price !== null
        ? String(packageData.price)
        : "",
    price_note: packageData?.price_note ?? "",
    description: packageData?.description ?? "",
    highlights: packageData?.highlights ?? [],
    benefits: packageData?.benefits ?? [],
    sort_order: packageData?.sort_order ?? 1,
    is_active: packageData?.is_active ?? true,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PackageFormModal({
  open,
  mode,
  destinationId,
  packageData,
  language,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const t = copy[language];

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------------------------------------------------
     FORM STATE
  --------------------------------------------------------- */

  const [form, setForm] = useState<FormState>(() =>
    initialState(packageData),
  );

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const [serverError, setServerError] = useState("");
  const [sortLoading, setSortLoading] = useState(mode === "create");

  /* ---------------------------------------------------------
     IMAGE
  --------------------------------------------------------- */

  const existingImage = packageData?.image_url
    ? getImageUrl(packageData.image_url)
    : "";

  const preview = imagePreview || existingImage;

  /* ---------------------------------------------------------
     AUTOMATIC SORT ORDER
  --------------------------------------------------------- */

  const getNextSortOrder = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      throw new Error(t.authError);
    }

    const response = await fetch(
      `${API_URL}${DESTINATION_ENDPOINT}/${encodeURIComponent(destinationId)}/packages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await parseResponse(response);

    const rows = Array.isArray(data.data) ? data.data : [];

    const highest = rows.reduce(
      (max: number, item: { sort_order?: number }) =>
        Math.max(max, Number(item.sort_order) || 0),
      0,
    );

    return highest + 1;
  }, [destinationId, t.authError]);

  useEffect(() => {
    // Tidak perlu mengubah state secara sinkron di dalam effect.
    // sortLoading sudah bernilai true sejak modal create pertama kali dibuat.
    if (!open || mode !== "create") return;

    let cancelled = false;

    async function loadNextOrder() {
      try {
        const next = await getNextSortOrder();

        if (!cancelled) {
          setForm((previous) => ({
            ...previous,
            sort_order: next,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setServerError(
            error instanceof Error ? error.message : t.sortError,
          );
        }
      } finally {
        if (!cancelled) {
          setSortLoading(false);
        }
      }
    }

    void loadNextOrder();

    return () => {
      cancelled = true;
    };
  }, [open, mode, getNextSortOrder, t.sortError]);

  /* ---------------------------------------------------------
     FORM FIELD HANDLER
  --------------------------------------------------------- */

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setServerError("");
  };

  /* ---------------------------------------------------------
     HIGHLIGHTS HANDLER
  --------------------------------------------------------- */

  const addHighlight = () => {
    setForm((previous) => ({
      ...previous,
      highlights: [...previous.highlights, ""],
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setForm((previous) => ({
      ...previous,
      highlights: previous.highlights.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const removeHighlight = (index: number) => {
    setForm((previous) => ({
      ...previous,
      highlights: previous.highlights.filter((_, i) => i !== index),
    }));
  };

  /* ---------------------------------------------------------
     BENEFITS HANDLER
  --------------------------------------------------------- */

  const addBenefit = () => {
    setForm((previous) => ({
      ...previous,
      benefits: [...previous.benefits, ""],
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setForm((previous) => ({
      ...previous,
      benefits: previous.benefits.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const removeBenefit = (index: number) => {
    setForm((previous) => ({
      ...previous,
      benefits: previous.benefits.filter((_, i) => i !== index),
    }));
  };

  /* ---------------------------------------------------------
     IMAGE HANDLER
  --------------------------------------------------------- */

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        image: t.invalidImage,
      }));

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((previous) => ({
        ...previous,
        image: t.imageTooLarge,
      }));

      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));

    setErrors((previous) => ({
      ...previous,
      image: undefined,
    }));

    setServerError("");
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");

    setErrors((previous) => ({
      ...previous,
      image: undefined,
    }));

    setServerError("");
  };

  /* ---------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */

  const validate = () => {
    const next: FieldErrors = {};

    if (!form.title.trim()) {
      next.title = t.requiredTitle;
    }

    if (!["regular", "group"].includes(form.category)) {
      next.category = t.requiredCategory;
    }

    if (!form.duration.trim()) {
      next.duration = t.requiredDuration;
    }

    if (!form.participants.trim()) {
      next.participants = t.requiredParticipants;
    }

    if (!form.price.trim()) {
      next.price = t.requiredPrice;
    } else {
      const price = Number(form.price);

      if (!Number.isFinite(price) || price < 0) {
        next.price = t.invalidPrice;
      }
    }

    if (!form.description.trim()) {
      next.description = t.requiredDescription;
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  /* ---------------------------------------------------------
     SUBMIT
  --------------------------------------------------------- */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setServerError("");

    if (!validate()) return;

    if (mode === "edit" && !packageData?.id) {
      const message = t.updateError;
      setServerError(message);
      onError(message);
      return;
    }

    try {
      setSaving(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const payload = new FormData();

      payload.append("title", form.title.trim());
      payload.append("category", form.category.trim());
      payload.append("duration", form.duration.trim());
      payload.append("participants", form.participants.trim());
      payload.append("price", form.price.trim());
      payload.append("price_note", form.price_note.trim());
      payload.append("description", form.description.trim());

      payload.append(
        "highlights",
        JSON.stringify(
          form.highlights
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      payload.append(
        "benefits",
        JSON.stringify(
          form.benefits
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      );

      payload.append("sort_order", String(form.sort_order));
      payload.append("is_active", String(form.is_active));

      if (mode === "edit") {
        payload.append("destination_id", destinationId);
      }

      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      const removeImage =
        mode === "edit" &&
        !preview &&
        Boolean(packageData?.image_url);

      if (removeImage) {
        payload.append("remove_image", "true");
      }

      const url =
        mode === "create"
          ? `${API_URL}${DESTINATION_ENDPOINT}/${encodeURIComponent(destinationId)}/packages`
          : `${API_URL}${PACKAGE_ENDPOINT}/${encodeURIComponent(packageData!.id)}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      await parseResponse(response);

      onSuccess();
    } catch (error) {
      console.error("Save package error:", error);

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

  /* ---------------------------------------------------------
     CLOSE
  --------------------------------------------------------- */

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  /* ---------------------------------------------------------
     STYLE
  --------------------------------------------------------- */

  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10";

  const labelClass = "text-sm font-medium text-foreground";

  const textareaClass =
    "mt-1.5 min-h-24 w-full resize-y rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10";

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-form-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Package className="size-5 text-brand-dark" />

              <h2
                id="package-form-title"
                className="text-lg font-bold text-foreground"
              >
                {mode === "create" ? t.createTitle : t.editTitle}
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "create"
                ? t.createDescription
                : t.editDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label={t.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* =====================================================
            FORM BODY
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {/* SERVER ERROR */}

            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Package className="size-4 text-brand-dark" />

                <h3 className="text-sm font-semibold text-foreground">
                  {t.basicInformation}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* TITLE */}

                <div>
                  <label htmlFor="package-title" className={labelClass}>
                    {t.title} <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="package-title"
                    type="text"
                    maxLength={150}
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder={t.titlePlaceholder}
                    className={inputClass}
                  />

                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* CATEGORY */}

                <div>
                  <label htmlFor="package-category" className={labelClass}>
                    {t.category} <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="package-category"
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="" disabled>
                      {t.categoryPlaceholder}
                    </option>
                    <option value="regular">{t.categoryRegular}</option>
                    <option value="group">{t.categoryGroup}</option>
                  </select>

                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* DURATION */}

                <div>
                  <label htmlFor="package-duration" className={labelClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5 text-brand-secondary" />
                      {t.duration}
                    </span>

                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    id="package-duration"
                    type="text"
                    maxLength={100}
                    value={form.duration}
                    onChange={(event) =>
                      updateField("duration", event.target.value)
                    }
                    placeholder={t.durationPlaceholder}
                    className={inputClass}
                  />

                  {errors.duration && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.duration}
                    </p>
                  )}
                </div>

                {/* PARTICIPANTS */}

                <div>
                  <label
                    htmlFor="package-participants"
                    className={labelClass}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5 text-brand-secondary" />
                      {t.participants}
                    </span>

                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    id="package-participants"
                    type="text"
                    maxLength={100}
                    value={form.participants}
                    onChange={(event) =>
                      updateField("participants", event.target.value)
                    }
                    placeholder={t.participantsPlaceholder}
                    className={inputClass}
                  />

                  {errors.participants && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.participants}
                    </p>
                  )}
                </div>

                {/* PRICE */}

                <div>
                  <label htmlFor="package-price" className={labelClass}>
                    <span className="inline-flex items-center gap-1.5">
                      <Banknote className="size-3.5 text-brand-secondary" />
                      {t.price}
                    </span>

                    <span className="text-red-500"> *</span>
                  </label>

                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      Rp
                    </span>

                    <input
                      id="package-price"
                      type="number"
                      min="0"
                      step="1"
                      value={form.price}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                      placeholder={t.pricePlaceholder}
                      className={`${inputClass} mt-0 pl-10`}
                    />
                  </div>

                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* PRICE NOTE */}

                <div>
                  <label htmlFor="package-price-note" className={labelClass}>
                    {t.priceNote}
                  </label>

                  <input
                    id="package-price-note"
                    type="text"
                    maxLength={150}
                    value={form.price_note}
                    onChange={(event) =>
                      updateField("price_note", event.target.value)
                    }
                    placeholder={t.priceNotePlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="package-description"
                  className={labelClass}
                >
                  {t.description} <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="package-description"
                  rows={4}
                  maxLength={2000}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder={t.descriptionPlaceholder}
                  className={textareaClass}
                />

                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </section>

            {/* =================================================
                HIGHLIGHTS
            ================================================= */}

            <section className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ListChecks className="size-4 text-brand-dark" />

                    <h3 className="text-sm font-semibold text-foreground">
                      {t.highlights}
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.highlightsDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addHighlight}
                  className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-border px-3 text-xs font-semibold text-brand-dark transition hover:bg-muted sm:self-auto"
                >
                  <Plus className="size-3.5" />
                  {t.addHighlight}
                </button>
              </div>

              {form.highlights.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center text-xs text-muted-foreground">
                  {language === "id"
                    ? "Belum ada highlight. Klik tombol Tambah Highlight."
                    : "No highlights yet. Click Add Highlight."}
                </div>
              ) : (
                <div className="space-y-2">
                  {form.highlights.map((item, index) => (
                    <div
                      key={`highlight-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>

                      <input
                        type="text"
                        value={item}
                        maxLength={250}
                        onChange={(event) =>
                          updateHighlight(index, event.target.value)
                        }
                        placeholder={t.highlightsPlaceholder}
                        className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                      />

                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        aria-label={`Remove highlight ${index + 1}`}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                BENEFITS
            ================================================= */}

            <section className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Gift className="size-4 text-brand-dark" />

                    <h3 className="text-sm font-semibold text-foreground">
                      {t.benefits}
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.benefitsDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addBenefit}
                  className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-border px-3 text-xs font-semibold text-brand-dark transition hover:bg-muted sm:self-auto"
                >
                  <Plus className="size-3.5" />
                  {t.addBenefit}
                </button>
              </div>

              {form.benefits.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center text-xs text-muted-foreground">
                  {language === "id"
                    ? "Belum ada benefit. Klik tombol Tambah Benefit."
                    : "No benefits yet. Click Add Benefit."}
                </div>
              ) : (
                <div className="space-y-2">
                  {form.benefits.map((item, index) => (
                    <div
                      key={`benefit-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>

                      <input
                        type="text"
                        value={item}
                        maxLength={250}
                        onChange={(event) =>
                          updateBenefit(index, event.target.value)
                        }
                        placeholder={t.benefitsPlaceholder}
                        className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                      />

                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        aria-label={`Remove benefit ${index + 1}`}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                IMAGE
            ================================================= */}

            <section>
              <label className={labelClass}>{t.image}</label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="mt-1.5 flex flex-col gap-4 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-center">
                <div className="flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:size-36 sm:aspect-square">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={form.title || t.image}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="size-10 text-muted-foreground/50" />

                      <span className="text-xs text-muted-foreground">
                        {language === "id"
                          ? "Belum ada foto"
                          : "No image selected"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition hover:bg-brand-dark/90"
                  >
                    <Upload className="size-4" />
                    {preview ? t.changeImage : t.chooseImage}
                  </button>

                  {preview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="h-10 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
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
                <p className="mt-1 text-xs text-red-500">
                  {errors.image}
                </p>
              )}
            </section>

            {/* =================================================
                ORDER & PUBLICATION
            ================================================= */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* SORT ORDER */}

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

              {/* PUBLICATION */}

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
                  onClick={() =>
                    updateField("is_active", !form.is_active)
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    form.is_active ? "bg-green-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
                      form.is_active
                        ? "translate-x-[26px]"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving || sortLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <LoaderCircle className="size-4 animate-spin" />
              )}

              {saving ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
