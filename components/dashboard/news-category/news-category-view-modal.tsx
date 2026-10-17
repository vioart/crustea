"use client";

import { Tags, X } from "lucide-react";
import { useLanguage } from "@/components/language/language-provider";

type NewsCategory = {
  id: number;
  slug: string;
  name_idn: string;
  name_en: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type NewsCategoryViewModalProps = {
  open: boolean;
  category: NewsCategory | null;
  onClose: () => void;
};

const translations = {
  id: {
    title: "Detail Kategori Berita",
    description: "Detail informasi kategori berita.",

    slug: "Slug",
    status: "Status",
    active: "Aktif",
    inactive: "Tidak Aktif",

    indonesian: "Bahasa Indonesia",
    english: "English",

    name: "Nama Kategori",

    close: "Tutup",
    closeModal: "Tutup modal",
  },

  en: {
    title: "News Category Detail",
    description: "Details of the news category.",

    slug: "Slug",
    status: "Status",
    active: "Active",
    inactive: "Inactive",

    indonesian: "Indonesian",
    english: "English",

    name: "Category Name",

    close: "Close",
    closeModal: "Close modal",
  },
};

export default function NewsCategoryViewModal({
  open,
  category,
  onClose,
}: NewsCategoryViewModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!open || !category) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
              <Tags className="size-6" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {t.title}
                </h2>

                <span className="text-xs text-muted-foreground">
                  #{category.id}
                </span>
              </div>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {t.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t.closeModal}
          >
            <X className="size-5" />
          </button>
        </div>
        {/* Content */}
        <div className="space-y-6 overflow-y-auto px-6 py-6">
          {/* Slug & Status */}
          <div className="grid grid-cols-2 gap-4">
            {/* Slug */}
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">
                {t.slug}
              </p>

              <span className="inline-flex rounded-md bg-muted px-3 py-1.5 font-mono text-xs font-medium text-foreground">
                {category.slug}
              </span>
            </div>

            {/* Status */}
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">
                {t.status}
              </p>

              <span
                className={`inline-flex rounded-md px-3 py-1.5 text-xs font-medium text-white ${
                  category.is_active ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {category.is_active ? t.active : t.inactive}
              </span>
            </div>
          </div>

          {/* Names */}
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              {t.name}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Indonesian */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="inline-flex rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                  ID
                </span>

                <p className="mt-3 text-sm font-semibold leading-6 text-foreground">
                  {category.name_idn}
                </p>
              </div>

              {/* English */}
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="inline-flex rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                  EN
                </span>

                <p className="mt-3 text-sm font-semibold leading-6 text-foreground">
                  {category.name_en}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
