"use client";

import { useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

import type { Partner } from "./partner-form-modal";

// ============================================================
// TYPES
// ============================================================

type PartnerDeleteModalProps = {
  open: boolean;
  partner: Partner | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
  id: {
    title: "Hapus Partner",
    descriptionBefore: "Apakah Anda yakin ingin menghapus partner",
    descriptionAfter:
      "? Data yang sudah dihapus tidak dapat dikembalikan.",

    cancel: "Batal",
    delete: "Hapus",
    deleting: "Menghapus...",

    authError: "Token autentikasi tidak ditemukan.",
    deleteError: "Gagal menghapus partner.",

    closeModal: "Tutup modal",
  },

  en: {
    title: "Delete Partner",
    descriptionBefore: "Are you sure you want to delete the partner",
    descriptionAfter: "? Deleted data cannot be recovered.",

    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",

    authError: "Authentication token not found.",
    deleteError: "Failed to delete partner.",

    closeModal: "Close modal",
  },
} as const;

// ============================================================
// DELETE MODAL
// ============================================================

export default function PartnerDeleteModal({
  open,
  partner,
  onClose,
  onSuccess,
  onError,
}: PartnerDeleteModalProps) {
  const { language } = useLanguage();

  const t = translations[language === "en" ? "en" : "id"];

  const [deleting, setDeleting] = useState(false);

  if (!open || !partner) {
    return null;
  }

  // ============================================================
  // DELETE HANDLER
  // ============================================================

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
        /\/$/,
        "",
      );

      const response = await fetch(
        `${apiUrl}/api/admin/partners/${partner.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || t.deleteError);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Delete partner error:", error);

      onError(
        error instanceof Error ? error.message : t.deleteError,
      );
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!deleting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-delete-title"
        className="relative w-full max-w-[440px] overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* CONTENT */}
        <div className="px-6 py-7">
          {/* ICON */}
          <div className="flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2 className="size-7" strokeWidth={2} />
            </div>
          </div>

          {/* TEXT */}
          <div className="mt-5 text-center">
            <h2
              id="partner-delete-title"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              {t.title}
            </h2>

            <p className="mx-auto mt-3 max-w-[380px] text-sm leading-6 text-muted-foreground">
              {t.descriptionBefore}{" "}
              <span className="font-semibold text-foreground">
                {partner.name}
              </span>
              {t.descriptionAfter}
            </p>
          </div>
        </div>

        {/* FOOTER */}
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

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t.closeModal}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}