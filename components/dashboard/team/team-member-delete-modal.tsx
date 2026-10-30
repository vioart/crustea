"use client";

import { useState } from "react";
import { Image as ImageIcon, LoaderCircle, Trash2, X } from "lucide-react";

import { getAuthToken } from "@/lib/auth";

// ============================================================
// TYPES
// ============================================================

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  photo_path: string;
  linkedin_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type Language = "id" | "en";

type Props = {
  open: boolean;
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
    deleteTitle: "Hapus Anggota Tim",
    deleteDescription:
      "Apakah kamu yakin ingin menghapus anggota tim ini? Foto anggota juga dapat terhapus dari penyimpanan.",
    deleteError: "Gagal menghapus anggota tim.",
    authError: "Token autentikasi tidak ditemukan.",
    cancel: "Batal",
    deleting: "Menghapus...",
    confirm: "Ya, Hapus Anggota",
    close: "Tutup",
  },
  en: {
    deleteTitle: "Delete Team Member",
    deleteDescription:
      "Are you sure you want to delete this team member? Their photo may also be deleted from storage.",
    deleteError: "Failed to delete team member.",
    authError: "Authentication token not found.",
    cancel: "Cancel",
    deleting: "Deleting...",
    confirm: "Yes, Delete Member",
    close: "Close",
  },
} as const;

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? ""
).replace(/\/$/, "");

function getPhotoUrl(photoPath: string) {
  if (!photoPath) return "";

  if (/^https?:\/\//i.test(photoPath)) {
    return photoPath;
  }

  return `${API_URL}${photoPath.startsWith("/") ? "" : "/"}${photoPath}`;
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
// DELETE MODAL
// ============================================================

export default function TeamMemberDeleteModal({
  open,
  member,
  language,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const t = translations[language];

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !member) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${API_URL}/api/admin/team/${member.id}`,
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
      console.error("Delete team member error:", err);

      const message = getErrorMessage(err, t.deleteError);

      setError(message);
      onError(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return;

    setError("");
    onClose();
  };

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
        aria-labelledby="team-delete-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2
              id="team-delete-title"
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
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {member.photo_path ? (
                <img
                  src={getPhotoUrl(member.photo_path)}
                  alt={member.name}
                  className="size-full object-cover"
                />
              ) : (
                <ImageIcon className="size-5 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0">
              <p className="break-words text-sm font-semibold text-foreground">
                {member.name}
              </p>

              <p className="mt-1 break-words text-xs text-muted-foreground">
                {member.position}
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

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
            {deleting && (
              <LoaderCircle className="size-4 animate-spin" />
            )}

            <Trash2 className="size-4" />

            {deleting ? t.deleting : t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}