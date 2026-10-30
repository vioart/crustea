"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Image as ImageIcon, X } from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";

// ============================================================
// TYPES
// ============================================================

type Partner = {
  id: number;
  name: string;
  logo: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PartnershipProject = {
  id: number;
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
  image: string | null;
  start_period: number | string;
  end_period: number | string | null;
  created_at: string;
  updated_at: string;
  partners: Partner[];
};

type Props = {
  open: boolean;
  project: PartnershipProject | null;
  onClose: () => void;
};

// ============================================================
// CONSTANTS & HELPERS
// ============================================================

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/**
 * Mengubah path gambar menjadi URL /uploads/.
 *
 * Contoh:
 * partners/partner-123.png
 * -> http://localhost:8080/uploads/partners/partner-123.png
 *
 * /storage/partners/partner-123.png
 * -> http://localhost:8080/uploads/partners/partner-123.png
 *
 * URL eksternal tetap digunakan sebagaimana adanya,
 * kecuali jika URL tersebut masih menggunakan /storage/.
 */
function getUploadUrl(path: string | null | undefined): string {
  if (!path) return "";

  const normalizedPath = path.trim();

  if (!normalizedPath) return "";

  // Pertahankan URL eksternal, tetapi ubah /storage/ menjadi /uploads/.
  if (/^https?:\/\//i.test(normalizedPath)) {
    try {
      const url = new URL(normalizedPath);

      url.pathname = url.pathname.replace(/\/storage\//i, "/uploads/");

      return url.toString();
    } catch {
      return normalizedPath.replace(/\/storage\//i, "/uploads/");
    }
  }

  // Hilangkan slash di awal agar path dapat diproses konsisten.
  let cleanPath = normalizedPath.replace(/^\/+/, "");

  // Jika path masih memiliki prefix storage/, ubah menjadi uploads/.
  cleanPath = cleanPath.replace(/^storage\//i, "");
  cleanPath = cleanPath.replace(/^uploads\//i, "");

  if (!API_URL) {
    return `/uploads/${cleanPath}`;
  }

  return `${API_URL}/uploads/${cleanPath}`;
}

/**
 * Format periode menjadi nama bulan dan tahun jika data
 * menggunakan format YYYY-MM, atau tahun jika hanya tahun.
 */
function formatMonthYear(
  value: number | string | null | undefined,
  language: "id" | "en",
  isEnd = false,
): string {
  if (value === null || value === undefined || value === "") {
    return isEnd ? (language === "id" ? "Sekarang" : "Present") : "—";
  }

  const locale = language === "id" ? "id-ID" : "en-US";

  if (typeof value === "string") {
    const normalizedValue = value.trim();
    const match = normalizedValue.match(/^(\d{4})-(\d{2})/);

    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);

      if (
        Number.isInteger(year) &&
        year >= 1000 &&
        year <= 9999 &&
        month >= 1 &&
        month <= 12
      ) {
        return new Intl.DateTimeFormat(locale, {
          month: "long",
          year: "numeric",
        }).format(new Date(year, month - 1, 1));
      }

      return "—";
    }
  }

  const year = Number(value);

  if (Number.isInteger(year) && year >= 1000 && year <= 9999) {
    return String(year);
  }

  return "—";
}

/**
 * Format tanggal pembuatan dan pembaruan data.
 */
function formatDate(
  value: string | null | undefined,
  language: "id" | "en",
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ============================================================
// MODAL
// ============================================================

export default function PartnershipViewModal({
  open,
  project,
  onClose,
}: Props) {
  const { language } = useLanguage();
  const lang = language === "en" ? "en" : "id";

  const [failedImages, setFailedImages] = useState<string[]>([]);

  // ============================================================
  // TRANSLATIONS
  // ============================================================

  const t = useMemo(
    () =>
      ({
        id: {
          title: "Detail Project Kemitraan",
          subtitle: "Informasi lengkap project kemitraan.",
          projectImage: "Gambar Project",
          projectName: "Nama Project",
          description: "Deskripsi",
          period: "Periode Project",
          partners: "Partner Kemitraan",
          noPartners: "Belum ada partner yang terhubung dengan project ini.",
          noImage: "Gambar tidak tersedia",
          createdAt: "Dibuat pada",
          updatedAt: "Terakhir diperbarui",
          close: "Tutup",
          partnerLogo: "Logo partner",
        },
        en: {
          title: "Partnership Project Details",
          subtitle: "Complete information about this partnership project.",
          projectImage: "Project Image",
          projectName: "Project Name",
          description: "Description",
          period: "Project Period",
          partners: "Partnership Members",
          noPartners: "No partners are connected to this project yet.",
          noImage: "Image not available",
          createdAt: "Created at",
          updatedAt: "Last updated",
          close: "Close",
          partnerLogo: "Partner logo",
        },
      })[lang],
    [lang],
  );

  // ============================================================
  // PROJECT DATA
  // ============================================================

  const projectImage = getUploadUrl(project?.image);

  const partnerList = Array.isArray(project?.partners) ? project.partners : [];

  const title = lang === "id" ? project?.name_idn : project?.name_en;

  const description =
    lang === "id" ? project?.description_idn : project?.description_en;

  const startPeriod = formatMonthYear(project?.start_period, lang);

  const endPeriod = formatMonthYear(project?.end_period, lang, true);

  const periodText = `${startPeriod} - ${endPeriod}`;
  const isImageFailed = (src: string) =>
    failedImages.includes(`${project?.id}:${src}`);

  const markImageFailed = (src: string) => {
    const imageKey = `${project?.id}:${src}`;

    setFailedImages((current) =>
      current.includes(imageKey) ? current : [...current, imageKey],
    );
  };

  // ============================================================
  // MODAL EVENTS
  // ============================================================

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !project) return null;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="partnership-view-modal-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* HEADER */}
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-6">
          <div className="min-w-0">
            <h2
              id="partnership-view-modal-title"
              className="text-base font-semibold leading-6 text-foreground sm:text-lg"
            >
              {t.title}
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-muted-foreground sm:text-sm">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
            {/* PROJECT IMAGE */}
            <section>
              <h3 className="mb-2 text-xs font-semibold text-foreground sm:text-sm">
                {t.projectImage}
              </h3>

              <div className="flex max-h-[300px] min-h-[160px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted sm:min-h-[200px]">
                {projectImage && !isImageFailed(projectImage) ? (
                  <img
                    src={projectImage}
                    alt={t.projectImage}
                    className="max-h-[300px] w-full object-contain"
                    onError={() => markImageFailed(projectImage)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-muted-foreground">
                    <ImageIcon className="size-9" />
                    <span className="text-xs sm:text-sm">{t.noImage}</span>
                  </div>
                )}
              </div>
            </section>

            {/* PROJECT NAME & DESCRIPTION */}
            <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {t.projectName}
                </p>

                <h3 className="mt-1.5 break-words text-lg font-semibold leading-snug text-foreground sm:text-xl">
                  {title?.trim() || "—"}
                </h3>
              </div>

              <div className="mt-4 border-t border-border pt-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                  {t.description}
                </p>

                <p className="mt-1.5 whitespace-pre-wrap break-words text-xs leading-6 text-foreground sm:text-sm sm:leading-7">
                  {description?.trim() || "—"}
                </p>
              </div>
            </section>

            {/* PROJECT PERIOD */}
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground sm:text-sm">
                <CalendarDays className="size-4 text-muted-foreground" />
                {t.period}
              </h3>

              <div className="rounded-xl border border-border bg-card px-4 py-3.5 sm:px-5">
                <p className="break-words text-sm font-medium text-foreground sm:text-base">
                  {periodText}
                </p>
              </div>
            </section>

            {/* PARTNER LOGOS ONLY */}
            <section>
              <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-foreground sm:text-sm">
                {t.partners}

                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:text-xs">
                  {partnerList.length}
                </span>
              </h3>

              {partnerList.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
                  {partnerList.map((partner) => {
                    const logoUrl = getUploadUrl(partner.logo);

                    return (
                      <div
                        key={partner.id}
                        className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-2.5 sm:rounded-xl sm:p-3"
                        title={partner.name}
                      >
                        {logoUrl && !isImageFailed(logoUrl) ? (
                          <img
                            src={logoUrl}
                            alt={`${t.partnerLogo}: ${partner.name}`}
                            className="size-full object-contain"
                            loading="lazy"
                            onError={() => markImageFailed(logoUrl)}
                          />
                        ) : (
                          <ImageIcon className="size-6 text-muted-foreground sm:size-7" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-5 text-center text-xs leading-5 text-muted-foreground sm:text-sm">
                  {t.noPartners}
                </div>
              )}
            </section>

            {/* CREATED & UPDATED DATES */}
            <section className="grid grid-cols-1 gap-2.5 border-t border-border pt-3.5 text-[11px] leading-5 text-muted-foreground sm:grid-cols-2 sm:text-xs">
              <p>
                <span className="font-medium text-foreground">
                  {t.createdAt}:
                </span>{" "}
                {formatDate(project.created_at, lang)}
              </p>

              <p>
                <span className="font-medium text-foreground">
                  {t.updatedAt}:
                </span>{" "}
                {formatDate(project.updated_at, lang)}
              </p>
            </section>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="flex shrink-0 justify-end border-t border-border px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-brand-dark px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-dark/30 focus:ring-offset-2 sm:text-sm"
          >
            {t.close}
          </button>
        </footer>
      </section>
    </div>
  );
}
