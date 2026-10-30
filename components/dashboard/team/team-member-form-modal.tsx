"use client";

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Image as ImageIcon,
  LoaderCircle,
  X,
} from "lucide-react";

import { FaLinkedinIn } from "react-icons/fa";

import { getAuthToken } from "@/lib/auth";

import type { TeamMember } from "@/components/dashboard/team/team-member-delete-modal";

// ============================================================
// TYPES
// ============================================================

type Language = "id" | "en";

type TeamForm = {
  name: string;
  position: string;
  linkedin_url: string;
  photo: File | null;
};

type FieldErrors = {
  name?: string;
  position?: string;
  photo?: string;
  linkedin_url?: string;
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  member: TeamMember | null;
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
  id: {
    photo: "Foto Anggota",
    linkedinOptional: "LinkedIn (Opsional)",
    name: "Nama Lengkap",
    position: "Jabatan",

    namePlaceholder: "Masukkan nama lengkap",
    positionPlaceholder: "Contoh: Software Engineer",
    linkedinPlaceholder: "https://linkedin.com/in/username",

    photoHint: "Format JPG, PNG, atau WEBP. Maksimal 2 MB.",
    changePhoto: "Ganti Foto",
    selectPhoto: "Pilih Foto",
    removePhoto: "Hapus pilihan foto",
    currentPhoto: "Foto saat ini",

    createTitle: "Tambah Anggota Tim",
    createDescription: "Lengkapi informasi anggota tim baru.",
    editTitle: "Edit Anggota Tim",
    editDescription: "Perbarui informasi anggota tim.",

    createError: "Gagal menambahkan anggota tim.",
    updateError: "Gagal memperbarui anggota tim.",
    authError: "Token autentikasi tidak ditemukan.",

    requiredName: "Nama wajib diisi.",
    nameTooLong: "Nama maksimal 150 karakter.",
    requiredPosition: "Jabatan wajib diisi.",
    positionTooLong: "Jabatan maksimal 100 karakter.",
    invalidLinkedin: "Masukkan URL LinkedIn yang valid.",
    requiredPhoto: "Foto anggota wajib dipilih.",
    invalidPhoto: "Format foto harus JPG, PNG, atau WEBP.",
    photoTooLarge: "Ukuran foto maksimal 2 MB.",

    save: "Simpan",
    saving: "Menyimpan...",
    cancel: "Batal",
    close: "Tutup",
  },

  en: {
    photo: "Member Photo",
    linkedinOptional: "LinkedIn (Optional)",
    name: "Full Name",
    position: "Position",

    namePlaceholder: "Enter full name",
    positionPlaceholder: "Example: Software Engineer",
    linkedinPlaceholder: "https://linkedin.com/in/username",

    photoHint: "JPG, PNG, or WEBP. Maximum size 2 MB.",
    changePhoto: "Change Photo",
    selectPhoto: "Choose Photo",
    removePhoto: "Remove selected photo",
    currentPhoto: "Current photo",

    createTitle: "Add Team Member",
    createDescription: "Complete the new team member's information.",
    editTitle: "Edit Team Member",
    editDescription: "Update team member information.",

    createError: "Failed to add team member.",
    updateError: "Failed to update team member.",
    authError: "Authentication token not found.",

    requiredName: "Name is required.",
    nameTooLong: "Name must not exceed 150 characters.",
    requiredPosition: "Position is required.",
    positionTooLong: "Position must not exceed 100 characters.",
    invalidLinkedin: "Enter a valid LinkedIn URL.",
    requiredPhoto: "A member photo is required.",
    invalidPhoto: "Photo must be JPG, PNG, or WEBP.",
    photoTooLarge: "Photo size must not exceed 2 MB.",

    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    close: "Close",
  },
} as const;

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? ""
).replace(/\/$/, "");

const EMPTY_FORM: TeamForm = {
  name: "",
  position: "",
  linkedin_url: "",
  photo: null,
};

function createInitialForm(
  member: TeamMember | null,
): TeamForm {
  return {
    name: member?.name ?? "",
    position: member?.position ?? "",
    linkedin_url: member?.linkedin_url ?? "",
    photo: null,
  };
}

function getPhotoUrl(photoPath: string) {
  if (!photoPath) return "";

  if (/^https?:\/\//i.test(photoPath)) {
    return photoPath;
  }

  return `${API_URL}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  return error instanceof Error ? error.message : fallback;
}

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Request failed.",
    );
  }

  return data;
}

// ============================================================
// PHOTO PREVIEW
// ============================================================

function PhotoPreview({
  file,
  fallbackUrl,
  alt,
}: {
  file: File | null;
  fallbackUrl: string;
  alt: string;
}) {
  const [imageElement, setImageElement] =
    useState<HTMLImageElement | null>(null);

  const imageRef = useCallback(
    (element: HTMLImageElement | null) => {
      setImageElement(element);
    },
    [],
  );

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

  return (
    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
      {src ? (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="size-full object-cover"
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

export default function TeamMemberFormModal({
  open,
  mode,
  member,
  language,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const t = translations[language];

  const [form, setForm] = useState<TeamForm>(
    () => createInitialForm(member),
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const previousOpenRef = useRef(false);

  // ----------------------------------------------------------
  // RESET FORM WHEN OPEN STATE CHANGES
  // ----------------------------------------------------------

  /*
   * Reset form dilakukan saat modal dibuka melalui handler,
   * bukan melalui useEffect yang memanggil setState.
   */

  const resetForm = useCallback(() => {
    setForm(createInitialForm(member));
    setErrors({});
    setServerError("");
  }, [member]);

  const handleOpen = useCallback(() => {
    resetForm();
  }, [resetForm]);

  /*
   * Perhatikan:
   * Komponen ini tidak melakukan reset state otomatis lewat
   * useEffect. Parent perlu memberikan key baru ketika modal
   * dibuka ulang atau data anggota berubah.
   */

  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = t.requiredName;
    } else if (form.name.trim().length > 150) {
      nextErrors.name = t.nameTooLong;
    }

    if (!form.position.trim()) {
      nextErrors.position = t.requiredPosition;
    } else if (form.position.trim().length > 100) {
      nextErrors.position = t.positionTooLong;
    }

    if (mode === "create" && !form.photo) {
      nextErrors.photo = t.requiredPhoto;
    }

    if (form.photo) {
      if (!ALLOWED_PHOTO_TYPES.includes(form.photo.type)) {
        nextErrors.photo = t.invalidPhoto;
      } else if (form.photo.size > MAX_PHOTO_SIZE) {
        nextErrors.photo = t.photoTooLarge;
      }
    }

    const linkedin = form.linkedin_url.trim();

    if (linkedin) {
      try {
        const url = new URL(linkedin);

        if (
          !["http:", "https:"].includes(url.protocol) ||
          !/(^|\.)linkedin\.com$/i.test(url.hostname)
        ) {
          nextErrors.linkedin_url = t.invalidLinkedin;
        }
      } catch {
        nextErrors.linkedin_url = t.invalidLinkedin;
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // ----------------------------------------------------------
  // PHOTO HANDLER
  // ----------------------------------------------------------

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

    setForm((previous) => ({
      ...previous,
      photo: file,
    }));

    setErrors((previous) => ({
      ...previous,
      photo: undefined,
    }));

    event.target.value = "";
  };

  const handleRemovePhoto = () => {
    setForm((previous) => ({
      ...previous,
      photo: null,
    }));

    setErrors((previous) => ({
      ...previous,
      photo:
        mode === "create" ? t.requiredPhoto : undefined,
    }));
  };

  // ----------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setServerError("");

    if (!validate()) return;

    try {
      setSaving(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const payload = new FormData();

      payload.append("name", form.name.trim());
      payload.append("position", form.position.trim());
      payload.append(
        "linkedin_url",
        form.linkedin_url.trim(),
      );

      if (form.photo) {
        payload.append("photo", form.photo);
      }

      const url =
        mode === "create"
          ? `${API_URL}/api/admin/team`
          : `${API_URL}/api/admin/team/${member?.id}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      await parseResponse(response);

      onSuccess();
    } catch (err) {
      console.error("Save team member error:", err);

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

  // ----------------------------------------------------------
  // CLOSE MODAL
  // ----------------------------------------------------------

  const handleClose = () => {
    if (saving) return;

    onClose();
  };

  // ----------------------------------------------------------
  // STYLING HELPERS
  // ----------------------------------------------------------

  const inputClass = (hasError: boolean) =>
    `mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-brand-dark/10 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-border focus:border-brand-dark"
    }`;

  const labelClass = "text-sm font-medium text-foreground";

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

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
        aria-labelledby="team-form-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-5">
          <div>
            <h2
              id="team-form-title"
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
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* PHOTO */}
            <div>
              <label className={labelClass}>
                {t.photo}
                {mode === "create" && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </label>

              <div className="mt-2 flex flex-col gap-4 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-center">
                <PhotoPreview
                  file={form.photo}
                  fallbackUrl={
                    member?.photo_path
                      ? getPhotoUrl(member.photo_path)
                      : ""
                  }
                  alt={member?.name ?? t.photo}
                />

                <div className="min-w-0 flex-1">
                  <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted">
                    {form.photo || member?.photo_path
                      ? t.changePhoto
                      : t.selectPhoto}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="sr-only"
                    />
                  </label>

                  {form.photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="ml-2 inline-flex h-9 items-center rounded-lg px-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      {t.removePhoto}
                    </button>
                  )}

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {t.photoHint}
                  </p>
                </div>
              </div>

              {errors.photo && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.photo}
                </p>
              )}
            </div>

            {/* NAME */}
            <div>
              <label htmlFor="team-name" className={labelClass}>
                {t.name}
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="team-name"
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
                }}
                placeholder={t.namePlaceholder}
                className={inputClass(Boolean(errors.name))}
                aria-invalid={Boolean(errors.name)}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* POSITION */}
            <div>
              <label
                htmlFor="team-position"
                className={labelClass}
              >
                {t.position}
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="team-position"
                type="text"
                maxLength={100}
                value={form.position}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    position: event.target.value,
                  }));

                  setErrors((previous) => ({
                    ...previous,
                    position: undefined,
                  }));
                }}
                placeholder={t.positionPlaceholder}
                className={inputClass(Boolean(errors.position))}
                aria-invalid={Boolean(errors.position)}
              />

              {errors.position && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.position}
                </p>
              )}
            </div>

            {/* LINKEDIN */}
            <div>
              <label
                htmlFor="team-linkedin"
                className={labelClass}
              >
                {t.linkedinOptional}
              </label>

              <div className="relative mt-1.5">
                <FaLinkedinIn className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="team-linkedin"
                  type="url"
                  value={form.linkedin_url}
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      linkedin_url: event.target.value,
                    }));

                    setErrors((previous) => ({
                      ...previous,
                      linkedin_url: undefined,
                    }));
                  }}
                  placeholder={t.linkedinPlaceholder}
                  className={`h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-brand-dark/10 ${
                    errors.linkedin_url
                      ? "border-red-400 focus:border-red-500"
                      : "border-border focus:border-brand-dark"
                  }`}
                  aria-invalid={Boolean(errors.linkedin_url)}
                />
              </div>

              {errors.linkedin_url && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.linkedin_url}
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