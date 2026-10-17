"use client";

import { useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

type Product = {
  id: number;
  category: string;
  slug: string;
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
  created_at: string;
  updated_at: string;
};

type HardwareProductDeleteModalProps = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

const translations = {
  id: {
    title: "Hapus Produk",
    description:
      "Apakah Anda yakin ingin menghapus produk ini? Data yang sudah dihapus tidak dapat dikembalikan.",
    cancel: "Batal",
    delete: "Hapus",
    deleting: "Menghapus...",
    authError: "Token autentikasi tidak ditemukan.",
    deleteError: "Gagal menghapus produk.",
    closeModal: "Tutup modal",
  },
  en: {
    title: "Delete Product",
    description:
      "Are you sure you want to delete this product? Deleted data cannot be recovered.",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    authError: "Authentication token not found.",
    deleteError: "Failed to delete product.",
    closeModal: "Close modal",
  },
};

export default function HardwareProductDeleteModal({
  open,
  product,
  onClose,
  onSuccess,
  onError,
}: HardwareProductDeleteModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [deleting, setDeleting] = useState(false);

  if (!open || !product) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(t.deleteError);
      }

      const response = await fetch(
        `${apiUrl}/api/admin/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || t.deleteError);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Delete hardware product error:", error);

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
        className="relative w-full max-w-[440px] overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Content */}
        <div className="px-6 py-7">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2 className="size-7" strokeWidth={2} />
            </div>
          </div>

          {/* Text */}
          <div className="mt-5 text-center">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {t.title}
            </h2>

            <p className="mx-auto mt-3 max-w-[380px] text-sm leading-6 text-muted-foreground">
              {t.description}
            </p>
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

        {/* Close */}
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
