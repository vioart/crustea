"use client";

import { FormEvent, useState } from "react";
import { Loader2, Sparkles, Tags, X } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

const translations = {
  id: {
    title: "Edit Kategori Berita",
    description:
      "Perbarui informasi kategori berita yang akan digunakan pada website.",

    nameIDN: "Nama Kategori (Indonesia)",
    nameEN: "Nama Kategori (English)",
    slug: "Slug",
    status: "Status",

    nameIDNPlaceholder: "Masukkan nama kategori dalam Bahasa Indonesia...",
    nameENPlaceholder: "Masukkan nama kategori dalam Bahasa Inggris...",
    slugPlaceholder: "Contoh: berita-terbaru",

    active: "Aktif",
    inactive: "Tidak Aktif",

    translate: "Terjemahkan",
    translating: "Menerjemahkan...",

    close: "Tutup modal",
    cancel: "Batal",
    save: "Simpan Perubahan",
    saving: "Menyimpan...",

    authError: "Token autentikasi tidak ditemukan.",
    translationFailed: "Gagal menerjemahkan.",
    translationResultError: "Hasil terjemahan tidak ditemukan.",
    translationError: "Gagal menerjemahkan. Silakan coba lagi.",
    updateError: "Gagal mengubah kategori berita.",

    requiredNameIDN: "Nama kategori Bahasa Indonesia wajib diisi.",
    requiredNameEN: "Nama kategori Bahasa Inggris wajib diisi.",
    requiredSlug: "Slug wajib diisi.",
  },

  en: {
    title: "Edit News Category",
    description:
      "Update the news category information that will be used on the website.",

    nameIDN: "Category Name (Indonesian)",
    nameEN: "Category Name (English)",
    slug: "Slug",
    status: "Status",

    nameIDNPlaceholder: "Enter the category name in Indonesian...",
    nameENPlaceholder: "Enter the category name in English...",
    slugPlaceholder: "Example: latest-news",

    active: "Active",
    inactive: "Inactive",

    translate: "Translate",
    translating: "Translating...",

    close: "Close modal",
    cancel: "Cancel",
    save: "Save Changes",
    saving: "Saving...",

    authError: "Authentication token not found.",
    translationFailed: "Translation failed.",
    translationResultError: "Translation result not found.",
    translationError: "Failed to translate. Please try again.",
    updateError: "Failed to update news category.",

    requiredNameIDN: "Indonesian category name is required.",
    requiredNameEN: "English category name is required.",
    requiredSlug: "Slug is required.",
  },
};

type NewsCategory = {
  id: number;
  slug: string;
  name_idn: string;
  name_en: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type NewsCategoryEditModalProps = {
  open: boolean;
  category: NewsCategory | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function NewsCategoryEditModal({
  open,
  category,
  onClose,
  onSuccess,
  onError,
}: NewsCategoryEditModalProps) {
  if (!open || !category) {
    return null;
  }

  return (
    <NewsCategoryEditForm
      key={category.id}
      category={category}
      onClose={onClose}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}

type NewsCategoryEditFormProps = {
  category: NewsCategory;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

function NewsCategoryEditForm({
  category,
  onClose,
  onSuccess,
  onError,
}: NewsCategoryEditFormProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [nameIDN, setNameIDN] = useState(category.name_idn ?? "");
  const [nameEN, setNameEN] = useState(category.name_en ?? "");
  const [slug, setSlug] = useState(category.slug ?? "");
  const [isActive, setIsActive] = useState(category.is_active ?? true);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({
    nameIDN: "",
    nameEN: "",
    slug: "",
  });

  const generateSlug = (value: string) => {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const translateText = async () => {
    if (!nameIDN.trim()) {
      return;
    }

    try {
      setTranslating(true);
      setTranslateError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          q: nameIDN,
          source: "id",
          target: "en",
        }),
      });

      if (!response.ok) {
        throw new Error(t.translationFailed);
      }

      const data = (await response.json()) as {
        translatedText?: string;
      };

      if (!data.translatedText) {
        throw new Error(t.translationResultError);
      }

      setNameEN(data.translatedText);

      if (errors.nameEN) {
        setErrors((prev) => ({
          ...prev,
          nameEN: "",
        }));
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslateError(t.translationError);
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      nameIDN: "",
      nameEN: "",
      slug: "",
    };

    if (!nameIDN.trim()) {
      newErrors.nameIDN = t.requiredNameIDN;
    }

    if (!nameEN.trim()) {
      newErrors.nameEN = t.requiredNameEN;
    }

    if (!slug.trim()) {
      newErrors.slug = t.requiredSlug;
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    try {
      setSaving(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news-categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            slug: slug.trim(),
            name_idn: nameIDN.trim(),
            name_en: nameEN.trim(),
            is_active: isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.updateError);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Update news category error:", error);

      onError(error instanceof Error ? error.message : t.updateError);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setNameIDN("");
    setNameEN("");
    setSlug("");
    setIsActive(true);

    setSlugManuallyEdited(false);
    setTranslating(false);
    setTranslateError("");

    setErrors({
      nameIDN: "",
      nameEN: "",
      slug: "",
    });

    onClose();
  };

  const inputClass = (error: string) =>
    `h-11 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 ${
      error
        ? "border-red-500 ring-2 ring-red-500/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
        : "border-border focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
    }`;
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[620px] overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
                <Tags className="size-6" strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {t.title}
                </h2>

                <p className="mt-1 max-w-[460px] text-sm leading-5 text-muted-foreground">
                  {t.description}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="ml-4 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t.close}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-280px)] space-y-5 overflow-y-auto px-6 py-6">
            {/* Name IDN */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="news-category-edit-name-idn"
                  className="block text-sm font-semibold text-foreground"
                >
                  {t.nameIDN} <span className="text-red-500">*</span>
                </label>

                <button
                  type="button"
                  onClick={translateText}
                  disabled={!nameIDN.trim() || translating || saving}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-accent px-2.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {translating ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}

                  {translating ? t.translating : t.translate}
                </button>
              </div>

              <input
                id="news-category-edit-name-idn"
                type="text"
                value={nameIDN}
                onChange={(event) => {
                  const value = event.target.value;

                  setNameIDN(value);

                  if (!slugManuallyEdited) {
                    setSlug(generateSlug(value));
                  }

                  if (errors.nameIDN) {
                    setErrors((prev) => ({
                      ...prev,
                      nameIDN: "",
                    }));
                  }
                }}
                placeholder={t.nameIDNPlaceholder}
                required
                disabled={saving}
                className={inputClass(errors.nameIDN)}
              />

              {errors.nameIDN && (
                <span className="mt-1.5 block text-xs font-medium text-red-500">
                  {errors.nameIDN}
                </span>
              )}
            </div>

            {/* Name EN */}
            <div>
              <label
                htmlFor="news-category-edit-name-en"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                {t.nameEN} <span className="text-red-500">*</span>
              </label>

              <input
                id="news-category-edit-name-en"
                type="text"
                value={nameEN}
                onChange={(event) => {
                  setNameEN(event.target.value);

                  if (errors.nameEN) {
                    setErrors((prev) => ({
                      ...prev,
                      nameEN: "",
                    }));
                  }
                }}
                placeholder={t.nameENPlaceholder}
                required
                disabled={saving}
                className={inputClass(errors.nameEN)}
              />

              {errors.nameEN && (
                <span className="mt-1.5 block text-xs font-medium text-red-500">
                  {errors.nameEN}
                </span>
              )}
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="news-category-edit-slug"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                {t.slug} <span className="text-red-500">*</span>
              </label>

              <input
                id="news-category-edit-slug"
                type="text"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugManuallyEdited(true);

                  if (errors.slug) {
                    setErrors((prev) => ({
                      ...prev,
                      slug: "",
                    }));
                  }
                }}
                placeholder={t.slugPlaceholder}
                required
                disabled={saving}
                className={inputClass(errors.slug)}
              />

              {errors.slug && (
                <span className="mt-1.5 block text-xs font-medium text-red-500">
                  {errors.slug}
                </span>
              )}
            </div>

            {/* Status */}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t.status}
              </p>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  aria-label={t.status}
                  onClick={() => setIsActive((value) => !value)}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    isActive ? "bg-brand-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                      isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>

                <span className="text-xs font-medium text-muted-foreground">
                  {isActive ? t.active : t.inactive}
                </span>
              </div>
            </div>

            {/* Translation Error */}
            {translateError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {translateError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="h-10 rounded-lg border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving || translating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.save
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
