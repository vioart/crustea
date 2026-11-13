
"use client";

import { useState } from "react";

import {
  Image as ImageIcon,
  LoaderCircle,
  Trash2,
  X,
  MapPin,
} from "lucide-react";

import { getAuthToken } from "@/lib/auth";

import type { Destination } from "@/components/dashboard/akuatur/destination-form-modal";

// ============================================================
// TYPES
// ============================================================

type Language = "id" | "en";

type Props = {
  open: boolean;
  destination: Destination | null;
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
    deleteTitle: "Hapus Destinasi",
    deleteDescription:
      "Apakah kamu yakin ingin menghapus destinasi ini? Data destinasi yang sudah dihapus tidak dapat dikembalikan.",

    destinationName: "Nama Destinasi",
    destinationCity: "Kota",
    destinationStatus: "Jenis Destinasi",
    regular: "Reguler",
    byOrder: "By Order",
    active: "Aktif",
    inactive: "Tidak Aktif",

    deleteError: "Gagal menghapus destinasi.",
    authError: "Token autentikasi tidak ditemukan.",

    cancel: "Batal",
    deleting: "Menghapus...",
    confirm: "Ya, Hapus Destinasi",
    close: "Tutup",
  },

  en: {
    deleteTitle: "Delete Destination",
    deleteDescription:
      "Are you sure you want to delete this destination? Deleted destination data cannot be recovered.",

    destinationName: "Destination Name",
    destinationCity: "City",
    destinationStatus: "Destination Type",
    regular: "Regular",
    byOrder: "By Order",
    active: "Active",
    inactive: "Inactive",

    deleteError: "Failed to delete destination.",
    authError: "Authentication token not found.",

    cancel: "Cancel",
    deleting: "Deleting...",
    confirm: "Yes, Delete Destination",
    close: "Close",
  },
} as const;

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? ""
).replace(/\/$/, "");

const DESTINATION_ENDPOINT = "/api/admin/destinations";

function getImageUrl(path: string) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
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
// DELETE MODAL
// ============================================================

export default function DestinationDeleteModal({
  open,
  destination,
  language,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const t = translations[language];

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !destination) return null;

  // ----------------------------------------------------------
  // DELETE DESTINATION
  // ----------------------------------------------------------

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${API_URL}${DESTINATION_ENDPOINT}/${encodeURIComponent(destination.id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await parseResponse(response);

      onSuccess();
    } catch (err) {
      console.error("Delete destination error:", err);

      const message = getErrorMessage(
        err,
        t.deleteError,
      );

      setError(message);
      onError(message);
    } finally {
      setDeleting(false);
    }
  };

  // ----------------------------------------------------------
  // CLOSE MODAL
  // ----------------------------------------------------------

  const handleClose = () => {
    if (deleting) return;

    setError("");
    onClose();
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

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
        aria-labelledby="destination-delete-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2
              id="destination-delete-title"
              className="text-lg font-bold text-foreground"
            >
              {t.deleteTitle}
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {t.deleteDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            aria-label={t.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* DESTINATION INFORMATION */}
        <div className="p-6">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
            {/* IMAGE */}
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {destination.image_url ? (
                <img
                  src={getImageUrl(destination.image_url)}
                  alt={destination.name}
                  className="size-full object-cover"
                />
              ) : (
                <ImageIcon className="size-6 text-muted-foreground" />
              )}
            </div>

            {/* INFORMATION */}
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-semibold text-foreground">
                {destination.name}
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                <span className="break-words">
                  {destination.city}
                </span>
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    destination.status === "regular"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {destination.status === "regular"
                    ? t.regular
                    : t.byOrder}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    destination.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {destination.is_active
                    ? t.active
                    : t.inactive}
                </span>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}

            {deleting ? t.deleting : t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
