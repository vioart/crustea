"use client";

import { Image as ImageIcon, UserRound, X } from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
};

type UserViewModalProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
};

const translations = {
  id: {
    title: "Detail Pengguna",
    description: "Detail informasi pengguna.",

    noAvatar: "Tidak ada avatar",
    close: "Tutup",
    closeModal: "Tutup modal",
  },

  en: {
    title: "User Detail",
    description: "Details of the user information.",

    noAvatar: "No avatar",
    close: "Close",
    closeModal: "Close modal",
  },
};

export default function UserViewModal({
  open,
  user,
  onClose,
}: UserViewModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!open || !user) {
    return null;
  }

  const avatarUrl = user.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`
    : null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
              <UserRound className="size-6" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {t.title}
                </h2>

                <span className="text-xs text-muted-foreground">
                  #{user.id}
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
          {/* Profile */}
          <section className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="size-20 shrink-0 rounded-full border border-border object-cover"
                />
              ) : (
                <div
                  className="inline-flex size-20 shrink-0 items-center justify-center rounded-full bg-muted"
                  aria-label={t.noAvatar}
                >
                  <ImageIcon className="size-7 text-muted-foreground" />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-base font-bold text-foreground">
                  {user.name}
                </p>

                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </section>
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
