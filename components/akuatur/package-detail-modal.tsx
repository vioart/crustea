
"use client";

import Image from "next/image";
import {
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  PackageCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export type AkuaturPackageDetail = {
  id: string;
  destination_id: string | null;
  title: string;
  category: "regular" | "group";
  duration: string;
  participants: string;
  price: string;
  price_note: string | null;
  description: string;
  highlights: string[];
  benefits: string[];
  image_url: string | null;
  sort_order: number;
  is_active: boolean;

  // Icon hanya untuk kebutuhan UI, bukan data dari API.
  icon: LucideIcon;
};

export type AkuaturDestinationDetail = {
  id: string;
  city: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  status: "regular" | "by-order";
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type PackageDetailModalProps = {
  packageItem: AkuaturPackageDetail | null;
  destinations: AkuaturDestinationDetail[];
  onClose: () => void;
};

// =========================================================
// CONFIGURATION
// =========================================================

const WHATSAPP_NUMBER = "6282283784119";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(
  /\/+$/,
  "",
);

// =========================================================
// HELPERS
// =========================================================

function getImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) return null;

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/") && API_BASE_URL) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  return imageUrl;
}

function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}

function getDestinationById(
  destinations: AkuaturDestinationDetail[],
  destinationId: string | null,
) {
  if (!destinationId) return null;

  return (
    destinations.find(
      (destination) =>
        destination.id === destinationId &&
        destination.is_active,
    ) ?? null
  );
}

function formatPrice(price: string | null | undefined): string {
  if (!price) return "Hubungi kami";

  const cleanPrice = price.trim();

  const match = cleanPrice.match(
    /^(?:Rp\.?\s*)?([\d.,]+)(.*)$/i,
  );

  if (!match) return cleanPrice;

  const [, rawAmount, suffix] = match;
  const numericValue = Number(rawAmount.replace(/[.,]/g, ""));

  if (!Number.isFinite(numericValue)) return cleanPrice;

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(numericValue);

  return `Rp ${formattedAmount}${suffix}`;
}

function getPackageWhatsAppUrl(
  item: AkuaturPackageDetail,
  destinationLabel: string,
) {
  const message = [
    "Halo Akuatur, saya tertarik dengan paket berikut:",
    "",
    `Nama Paket: ${item.title}`,
    `Destinasi: ${destinationLabel}`,
    `Kategori: ${
      item.category === "group"
        ? "Program Grup"
        : "Paket Reguler"
    }`,
    `Harga: ${formatPrice(item.price)}`,
    "",
    "Mohon informasi lebih lanjut mengenai jadwal, fasilitas, dan pemesanan.",
  ].join("\n");

  return getWhatsAppUrl(message);
}

// =========================================================
// MAIN COMPONENT
// =========================================================

export default function PackageDetailModal({
  packageItem,
  destinations,
  onClose,
}: PackageDetailModalProps) {
  if (!packageItem) return null;

  const packageDestination = getDestinationById(
    destinations,
    packageItem.destination_id,
  );

  const destinationLabel = packageDestination
    ? `${packageDestination.name}, ${packageDestination.city}`
    : "Program By Order";

  const packageImage = getImageUrl(packageItem.image_url);

  const activities = Array.isArray(packageItem.highlights)
    ? packageItem.highlights
    : [];

  const benefits = Array.isArray(packageItem.benefits)
    ? packageItem.benefits
    : [];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-brand-dark/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-modal-title"
        className="relative my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-card shadow-2xl"
      >
        {/* MODAL HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4 sm:px-7">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
            Detail Paket Akuatur
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail paket"
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-brand-dark transition-colors hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-5 sm:p-7">

          {/* PACKAGE CATEGORY & DESTINATION */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-brand-secondary">
              <MapPin className="size-3.5" />
              {destinationLabel}
            </span>

            <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-brand-dark">
              {packageItem.category === "group"
                ? "Program Grup"
                : "Paket Reguler"}
            </span>
          </div>

          {/* PACKAGE IMAGE */}
          <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl bg-secondary">
            {packageImage ? (
              <Image
                src={packageImage}
                alt={packageItem.title}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <PackageCheck className="size-16 text-brand-secondary/50" />
              </div>
            )}
          </div>

          {/* PACKAGE TITLE */}
          <h2
            id="package-modal-title"
            className="mt-5 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl"
          >
            {packageItem.title}
          </h2>

          {/* PACKAGE DESCRIPTION */}
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {packageItem.description}
          </p>

          {/* PACKAGE INFORMATION */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-secondary/70 p-4">
              <Clock3 className="size-5 text-brand-secondary" />

              <p className="mt-3 text-xs text-muted-foreground">
                Durasi
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {packageItem.duration}
              </p>
            </div>

            <div className="rounded-2xl bg-secondary/70 p-4">
              <Users className="size-5 text-brand-secondary" />

              <p className="mt-3 text-xs text-muted-foreground">
                Peserta
              </p>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {packageItem.participants}
              </p>
            </div>
          </div>

          {/* PACKAGE ACTIVITIES */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-foreground">
              Aktivitas Wisata
            </h3>

            {activities.length > 0 ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {activities.map((item, index) => (
                  <li
                    key={`${index}-${item}`}
                    className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                  >
                    <Check className="mt-1 size-4 shrink-0 text-brand-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Informasi aktivitas wisata belum tersedia.
              </p>
            )}
          </div>

          {/* PACKAGE BENEFITS */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-foreground">
              Termasuk dalam Paket
            </h3>

            {benefits.length > 0 ? (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {benefits.map((item, index) => (
                  <li
                    key={`${index}-${item}`}
                    className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                  >
                    <PackageCheck className="mt-1 size-4 shrink-0 text-brand-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Informasi fasilitas belum tersedia.
              </p>
            )}
          </div>

          {/* PACKAGE PRICE */}
          <div className="mt-7 rounded-2xl border border-brand-secondary/20 bg-secondary/50 p-5">
            <p className="text-xs font-semibold text-muted-foreground">
              Harga paket
            </p>

            <p className="mt-2 font-display text-2xl font-bold text-brand-dark">
              {formatPrice(packageItem.price)}
            </p>

            {packageItem.price_note && (
              <p className="mt-1 text-xs text-muted-foreground">
                {packageItem.price_note}
              </p>
            )}
          </div>

          {/* WHATSAPP CTA */}
          <a
            href={getPackageWhatsAppUrl(
              packageItem,
              destinationLabel,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Konsultasi & Pesan Paket
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
