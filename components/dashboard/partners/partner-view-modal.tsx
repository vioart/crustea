"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Image as ImageIcon, X } from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import type { Partner } from "./partner-form-modal";

// ============================================================
// TYPES
// ============================================================

type Props = {
  open: boolean;
  partner: Partner | null;
  onClose: () => void;
};

// ============================================================
// TRANSLATIONS
// ============================================================

const translations = {
  id: {
    title: "Detail Partner",
    description: "Informasi lengkap partner.",
    logo: "Logo Partner",
    name: "Nama Partner",
    id: "ID Partner",
    createdAt: "Tanggal Dibuat",
    updatedAt: "Terakhir Diperbarui",
    noLogo: "Logo tidak tersedia",
    noName: "Nama tidak tersedia",
    close: "Tutup",
    invalidDate: "Tidak tersedia",
  },
  en: {
    title: "Partner Details",
    description: "Complete partner information.",
    logo: "Partner Logo",
    name: "Partner Name",
    id: "Partner ID",
    createdAt: "Created At",
    updatedAt: "Last Updated",
    noLogo: "No logo available",
    noName: "No name available",
    close: "Close",
    invalidDate: "Not available",
  },
} as const;

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function getLogoUrl(logoPath: string | null | undefined): string {
  if (!logoPath) return "";

  if (/^https?:\/\//i.test(logoPath)) {
    return logoPath;
  }

  if (logoPath.startsWith("/")) {
    return `${API_URL}${logoPath}`;
  }

  return `${API_URL}/uploads/${logoPath}`;
}

function formatDate(
  dateString: string | null | undefined,
  language: "id" | "en",
  fallback: string,
): string {
  if (!dateString) return fallback;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(
    language === "en" ? "en-US" : "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

// ============================================================
// LOGO PREVIEW
// ============================================================

function PartnerLogo({
  logoUrl,
  name,
  noLogo,
}: {
  logoUrl: string;
  name: string;
  noLogo: string;
}) {
  const [failedSrc, setFailedSrc] = useState("");

  const hasError = failedSrc === logoUrl;

  if (!logoUrl || hasError) {
    return (
      <div className="flex size-32 items-center justify-center rounded-2xl border border-border bg-muted">
        <div className="flex flex-col items-center gap-2 px-3 text-center">
          <ImageIcon className="size-9 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{noLogo}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-3">
      <img
        src={logoUrl}
        alt={name}
        className="size-full object-contain"
        onError={() => setFailedSrc(logoUrl)}
      />
    </div>
  );
}

// ============================================================
// DETAIL ITEM
// ============================================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-muted/20 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 break-words text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// VIEW MODAL
// ============================================================

export default function PartnerViewModal({
  open,
  partner,
  onClose,
}: Props) {
  const { language } = useLanguage();

  const lang = language === "en" ? "en" : "id";
  const t = translations[lang];

  // Menutup modal menggunakan tombol Escape.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !partner) return null;

  const logoUrl = getLogoUrl(partner.logo);

  const partnerName = partner.name?.trim() || t.noName;

  const createdAt = formatDate(
    partner.created_at,
    lang,
    t.invalidDate,
  );

  const updatedAt = formatDate(
    partner.updated_at,
    lang,
    t.invalidDate,
  );

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-view-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-5">
          <div>
            <h2
              id="partner-view-title"
              className="text-lg font-bold text-foreground"
            >
              {t.title}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-6 p-6">
          {/* PARTNER IDENTITY */}
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/20 p-6 sm:flex-row sm:items-center">
            <PartnerLogo
              logoUrl={logoUrl}
              name={partnerName}
              noLogo={t.noLogo}
            />

            <div className="min-w-0 text-center sm:text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.name}
              </p>

              <h3 className="mt-2 break-words text-xl font-bold text-foreground">
                {partnerName}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {t.id}: #{partner.id}
              </p>
            </div>
          </div>

          {/* PARTNER DETAILS */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t.title}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label={t.name}
                value={partnerName}
              />

              <DetailItem
                label={t.id}
                value={`#${partner.id}`}
              />
            </div>
          </section>

          {/* TIMESTAMPS */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {lang === "id" ? "Informasi Waktu" : "Time Information"}
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="size-5 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t.createdAt}
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-foreground">
                    {createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="size-5 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t.updatedAt}
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-foreground">
                    {updatedAt}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-border bg-muted/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition hover:bg-brand-dark/90"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}