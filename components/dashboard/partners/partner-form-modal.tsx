"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Image as ImageIcon, LoaderCircle, X } from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

// ============================================================
// TYPES
// ============================================================

type Language = "id" | "en";

type PartnerForm = {
  name: string;
  logo: File | null;
};

type FieldErrors = {
  name?: string;
  logo?: string;
};

export type Partner = {
  id: number;
  name: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  partner: Partner | null;
  onClose: () => void;
  onCreateSuccess: () => void;
  onEditSuccess: () => void;
  onError: (message: string) => void;
};

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
  id: {
    logo: "Logo Partner",
    name: "Nama Partner",
    namePlaceholder: "Masukkan nama partner",

    logoHint: "Format JPG, PNG, atau WEBP. Maksimal 2 MB.",
    selectLogo: "Pilih Logo",
    changeLogo: "Ganti Logo",
    removeLogo: "Hapus pilihan logo",
    currentLogo: "Logo saat ini",

    createTitle: "Tambah Partner",
    createDescription: "Lengkapi informasi partner baru.",
    editTitle: "Edit Partner",
    editDescription: "Perbarui informasi partner.",

    createError: "Gagal menambahkan partner.",
    updateError: "Gagal memperbarui partner.",
    authError: "Token autentikasi tidak ditemukan.",

    requiredName: "Nama partner wajib diisi.",
    nameTooLong: "Nama partner maksimal 150 karakter.",
    requiredLogo: "Logo partner wajib dipilih.",
    invalidLogo: "Format logo harus JPG, PNG, atau WEBP.",
    logoTooLarge: "Ukuran logo maksimal 2 MB.",

    save: "Simpan",
    saving: "Menyimpan...",
    cancel: "Batal",
    close: "Tutup",
  },

  en: {
    logo: "Partner Logo",
    name: "Partner Name",
    namePlaceholder: "Enter partner name",

    logoHint: "JPG, PNG, or WEBP. Maximum size 2 MB.",
    selectLogo: "Choose Logo",
    changeLogo: "Change Logo",
    removeLogo: "Remove selected logo",
    currentLogo: "Current logo",

    createTitle: "Add Partner",
    createDescription: "Complete the new partner's information.",
    editTitle: "Edit Partner",
    editDescription: "Update partner information.",

    createError: "Failed to add partner.",
    updateError: "Failed to update partner.",
    authError: "Authentication token not found.",

    requiredName: "Partner name is required.",
    nameTooLong: "Partner name must not exceed 150 characters.",
    requiredLogo: "A partner logo is required.",
    invalidLogo: "Logo must be JPG, PNG, or WEBP.",
    logoTooLarge: "Logo size must not exceed 2 MB.",

    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    close: "Close",
  },
} as const;

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function createInitialForm(partner: Partner | null): PartnerForm {
  return {
    name: partner?.name ?? "",
    logo: null,
  };
}

function getLogoUrl(logoPath: string | null | undefined): string {
  if (!logoPath) return "";

  if (/^https?:\/\//i.test(logoPath)) {
    return logoPath;
  }

  // Sesuaikan jika backend menggunakan struktur URL yang berbeda.
  if (logoPath.startsWith("/")) {
    return `${API_URL}${logoPath}`;
  }

  return `${API_URL}/uploads/${logoPath}`;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return data;
}

// ============================================================
// LOGO PREVIEW
// ============================================================

function LogoPreview({
  file,
  fallbackUrl,
  alt,
}: {
  file: File | null;
  fallbackUrl: string;
  alt: string;
}) {
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const src = objectUrl || fallbackUrl;

  // Status error mengikuti sumber gambar yang gagal dimuat.
  const [failedSrc, setFailedSrc] = useState("");

  const imageError = failedSrc === src;

  return (
    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-contain p-2"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <ImageIcon className="size-8 text-muted-foreground" />
      )}
    </div>
  );
}

// ============================================================
// FORM MODAL
// ============================================================

export default function PartnerFormModal({
  open,
  mode,
  partner,
  onClose,
  onCreateSuccess,
  onEditSuccess,
  onError,
}: Props) {
  const { language } = useLanguage();

  const t = translations[
    (language === "en" ? "en" : "id") as Language
  ];

  const [form, setForm] = useState<PartnerForm>(() =>
    createInitialForm(partner),
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      nextErrors.name = t.requiredName;
    } else if (trimmedName.length > 150) {
      nextErrors.name = t.nameTooLong;
    }

    if (mode === "create" && !form.logo) {
      nextErrors.logo = t.requiredLogo;
    }

    if (form.logo) {
      if (!ALLOWED_LOGO_TYPES.includes(form.logo.type)) {
        nextErrors.logo = t.invalidLogo;
      } else if (form.logo.size > MAX_LOGO_SIZE) {
        nextErrors.logo = t.logoTooLarge;
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // ============================================================
  // LOGO HANDLER
  // ============================================================

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

    setForm((previous) => ({
      ...previous,
      logo: file,
    }));

    setErrors((previous) => ({
      ...previous,
      logo: undefined,
    }));

    setServerError("");

    // Memungkinkan file yang sama dipilih kembali.
    event.target.value = "";
  };

  const handleRemoveLogo = () => {
    setForm((previous) => ({
      ...previous,
      logo: null,
    }));

    setErrors((previous) => ({
      ...previous,
      logo: mode === "create" ? t.requiredLogo : undefined,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setServerError("");

    if (!validate()) return;

    try {
      setSaving(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      if (mode === "edit" && !partner?.id) {
        throw new Error(t.updateError);
      }

      const payload = new FormData();

      payload.append("name", form.name.trim());

      /*
       * Logo dikirim hanya jika pengguna memilih file baru.
       * Saat edit tanpa mengganti logo, backend harus
       * mempertahankan logo yang sudah tersimpan.
       */
      if (form.logo) {
        payload.append("logo", form.logo);
      }

      const url =
        mode === "create"
          ? `${API_URL}/api/admin/partners`
          : `${API_URL}/api/admin/partners/${partner!.id}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      await parseResponse(response);

      if (mode === "create") {
        onCreateSuccess();
      } else {
        onEditSuccess();
      }

      onClose();
    } catch (err) {
      console.error("Save partner error:", err);

      const message = getErrorMessage(
        err,
        mode === "create" ? t.createError : t.updateError,
      );

      setServerError(message);
      onError(message);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleClose = () => {
    if (saving) return;

    onClose();
  };

  // ============================================================
  // STYLING HELPERS
  // ============================================================

  const inputClass = (hasError: boolean) =>
    `mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-brand-dark/10 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-border focus:border-brand-dark"
    }`;

  const labelClass = "text-sm font-medium text-foreground";

  // ============================================================
  // RENDER
  // ============================================================

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
        aria-labelledby="partner-form-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-5">
          <div>
            <h2
              id="partner-form-title"
              className="text-lg font-bold text-foreground"
            >
              {mode === "create" ? t.createTitle : t.editTitle}
            </h2>

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
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 p-6">
            {serverError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {serverError}
              </div>
            )}

            {/* LOGO */}
            <div>
              <label className={labelClass}>
                {t.logo}

                {mode === "create" && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>

              <div className="mt-2 flex flex-col gap-4 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-center">
                <LogoPreview
                  file={form.logo}
                  fallbackUrl={
                    partner?.logo ? getLogoUrl(partner.logo) : ""
                  }
                  alt={partner?.name ?? t.logo}
                />

                <div className="min-w-0 flex-1">
                  <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted">
                    {form.logo || partner?.logo
                      ? t.changeLogo
                      : t.selectLogo}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoChange}
                      disabled={saving}
                      className="sr-only"
                    />
                  </label>

                  {form.logo && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={saving}
                      className="ml-2 inline-flex h-9 items-center rounded-lg px-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {t.removeLogo}
                    </button>
                  )}

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {t.logoHint}
                  </p>

                  {mode === "edit" && partner?.logo && !form.logo && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.currentLogo}
                    </p>
                  )}
                </div>
              </div>

              {errors.logo && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.logo}
                </p>
              )}
            </div>

            {/* PARTNER NAME */}
            <div>
              <label htmlFor="partner-name" className={labelClass}>
                {t.name}
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="partner-name"
                type="text"
                maxLength={150}
                value={form.name}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }));

                  setErrors((previous) => ({
                    ...previous,
                    name: undefined,
                  }));

                  setServerError("");
                }}
                placeholder={t.namePlaceholder}
                className={inputClass(Boolean(errors.name))}
                aria-invalid={Boolean(errors.name)}
                disabled={saving}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving}
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