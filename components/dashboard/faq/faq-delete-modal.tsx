"use client";

import { useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

type Faq = {
  id: number;
  category: "product" | "service" | "partnership";
  question_idn: string;
  question_en: string;
  answer_idn: string;
  answer_en: string;
  created_at: string;
  updated_at: string;
};

type FaqDeleteModalProps = {
  open: boolean;
  faq: Faq | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

const translations = {
  id: {
    title: "Hapus FAQ",
    description:
      "Apakah Anda yakin ingin menghapus FAQ ini? Data yang sudah dihapus tidak dapat dikembalikan.",
    questionLabel: "Pertanyaan",
    cancel: "Batal",
    delete: "Hapus",
    deleting: "Menghapus...",
    authError: "Token autentikasi tidak ditemukan.",
    deleteError: "Gagal menghapus FAQ.",
  },
  en: {
    title: "Delete FAQ",
    description:
      "Are you sure you want to delete this FAQ? Deleted data cannot be recovered.",
    questionLabel: "Question",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    authError: "Authentication token not found.",
    deleteError: "Failed to delete FAQ.",
  },
};

export default function FaqDeleteModal({
  open,
  faq,
  onClose,
  onSuccess,
  onError,
}: FaqDeleteModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [deleting, setDeleting] = useState(false);

  if (!open || !faq) {
    return null;
  }

  const question = language === "id" ? faq.question_idn : faq.question_en;

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/faqs/${faq.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.deleteError);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Delete FAQ error:", error);

      onError(error instanceof Error ? error.message : t.deleteError);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Trash2 className="size-6" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {t.title}
              </h2>

              <p className="mt-1 max-w-[380px] text-sm leading-5 text-muted-foreground">
                {t.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="ml-4 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t.cancel}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="mb-2 text-sm font-semibold text-foreground">
            {t.questionLabel}
          </p>

          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="text-sm leading-6 text-foreground">{question}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="h-10 rounded-lg border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t.deleting}
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                {t.delete}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
