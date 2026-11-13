
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Compass,
  MapPin,
  Users,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export type AkuaturPackage = {
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
  image_url: string;
  sort_order: number;
  is_active: boolean;
  icon: LucideIcon;
};

export type AkuaturPackageFilter = "all" | "regular" | "group";

export type AkuaturPackageDestination = {
  id: string;
  city: string;
  name: string;
  is_active: boolean;
};

type DestinationPackageSectionProps = {
  destinations: AkuaturPackageDestination[];
  selectedCity: string;
  packageFilter: AkuaturPackageFilter;
  filteredPackages: AkuaturPackage[];

  isLoading?: boolean;

  onPackageFilterChange: (filter: AkuaturPackageFilter) => void;
  onResetFilters: () => void;
  onPackageDetail: (item: AkuaturPackage) => void;
};

/* =========================================================
   CONFIGURATION
========================================================= */

const WHATSAPP_NUMBER = "6282283784119";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(
  /\/+$/,
  "",
);

// Batas karakter deskripsi pada card.
const DESCRIPTION_MAX_LENGTH = 120;

/* =========================================================
   HELPERS
========================================================= */

function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (API_BASE_URL) {
    return `${API_BASE_URL}/${imageUrl.replace(/^\/+/, "")}`;
  }

  return imageUrl;
}

function truncateDescription(
  description: string | null | undefined,
  fallback: string,
  maxLength = DESCRIPTION_MAX_LENGTH,
): string {
  if (!description) return fallback;

  const cleanDescription = description.trim();

  if (cleanDescription.length <= maxLength) {
    return cleanDescription;
  }

  return `${cleanDescription.slice(0, maxLength).trimEnd()}...`;
}

function formatPrice(
  price: string | null | undefined,
  fallback: string,
): string {
  if (!price) return fallback;

  const cleanPrice = price.trim();

  const match = cleanPrice.match(
    /^(?:Rp\.?\s*)?([\d.,]+)(.*)$/i,
  );

  if (!match) return cleanPrice;

  const [, rawAmount, suffix] = match;

  const numericValue = Number(rawAmount.replace(/[.,]/g, ""));

  if (!Number.isFinite(numericValue)) {
    return cleanPrice;
  }

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(numericValue);

  return `Rp ${formattedAmount}${suffix}`;
}

function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}

function getDestinationById(
  destinations: AkuaturPackageDestination[],
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

function getPackageLocationLabel(
  item: AkuaturPackage,
  destinations: AkuaturPackageDestination[],
  fallback: string,
) {
  const destination = getDestinationById(
    destinations,
    item.destination_id,
  );

  if (!destination) {
    return fallback;
  }

  return `${destination.name}, ${destination.city}`;
}

/* =========================================================
   PACKAGE CARD
========================================================= */

type PackageCardProps = {
  item: AkuaturPackage;
  destinations: AkuaturPackageDestination[];
  onDetail: (item: AkuaturPackage) => void;
  onWhatsApp: (item: AkuaturPackage) => string;
  locationFallback: string;
  descriptionFallback: string;
  priceFallback: string;
  categoryLabels: {
    regular: string;
    group: string;
  };
  labels: {
    duration: string;
    participants: string;
    startingFrom: string;
    detail: string;
    order: string;
  };
};

function PackageCard({
  item,
  destinations,
  onDetail,
  onWhatsApp,
  locationFallback,
  descriptionFallback,
  priceFallback,
  categoryLabels,
  labels,
}: PackageCardProps) {
  const destinationLabel = getPackageLocationLabel(
    item,
    destinations,
    locationFallback,
  );

  const packageImage = getImageUrl(item.image_url);

  const shortDescription = truncateDescription(
    item.description,
    descriptionFallback,
  );

  const formattedPrice = formatPrice(item.price, priceFallback);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg">

      {/* PACKAGE IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {packageImage ? (
          <Image
            src={packageImage}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Compass className="size-12 text-brand-secondary/50" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/55 via-transparent to-brand-dark/10" />

        {/* PACKAGE CATEGORY */}
        <span
          className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
            item.category === "group"
              ? "bg-orange-100 text-orange-800"
              : "bg-accent text-brand-dark"
          }`}
        >
          {item.category === "group"
            ? categoryLabels.group
            : categoryLabels.regular}
        </span>
      </div>

      {/* PACKAGE INFORMATION */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* DESTINATION */}
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-secondary">
          <MapPin className="size-3.5 shrink-0" />

          <span className="line-clamp-1">
            {destinationLabel}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="mt-3 line-clamp-2 font-display text-xl font-semibold leading-snug text-foreground">
          {item.title}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="mt-3 min-h-[72px] text-sm leading-6 text-muted-foreground"
          title={item.description}
        >
          {shortDescription}
        </p>

        {/* DURATION & PARTICIPANTS */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-secondary/70 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="size-3.5" />
              {labels.duration}
            </div>

            <p className="mt-1.5 text-sm font-semibold text-foreground">
              {item.duration}
            </p>
          </div>

          <div className="rounded-xl bg-secondary/70 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              {labels.participants}
            </div>

            <p className="mt-1.5 text-sm font-semibold text-foreground">
              {item.participants}
            </p>
          </div>

        </div>

        {/* PACKAGE PRICE */}
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs font-medium text-muted-foreground">
            {labels.startingFrom}
          </p>

          <p className="mt-1 font-display text-xl font-bold tracking-tight text-brand-dark">
            {formattedPrice}
          </p>

          {item.price_note && (
            <p className="mt-1 text-xs text-muted-foreground">
              {item.price_note}
            </p>
          )}
        </div>

        {/* DETAIL BUTTON */}
        <button
          type="button"
          onClick={() => onDetail(item)}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-secondary/30 bg-background px-4 py-3 text-sm font-semibold text-brand-dark transition-all duration-300 hover:border-primary hover:bg-accent"
        >
          {labels.detail}
          <ArrowUpRight className="size-4" />
        </button>

        {/* WHATSAPP BUTTON */}
        <a
          href={onWhatsApp(item)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          {labels.order}
          <ArrowRight className="size-4" />
        </a>

      </div>
    </article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DestinationPackageSection({
  destinations,
  selectedCity,
  packageFilter,
  filteredPackages,
  isLoading = false,
  onPackageFilterChange,
  onResetFilters,
  onPackageDetail,
}: DestinationPackageSectionProps) {
  // Namespace mengikuti struktur i18n terbaru: Akuatur.packages
  const t = useTranslations("Akuatur.packages");

  const filterOptions: {
    value: AkuaturPackageFilter;
    label: string;
  }[] = [
    { value: "all", label: t("filters.all") },
    { value: "regular", label: t("filters.regular") },
    { value: "group", label: t("filters.group") },
  ];

  const categoryLabels = {
    regular: t("categories.regular"),
    group: t("categories.group"),
  };

  const cardLabels = {
    duration: t("card.duration"),
    participants: t("card.participants"),
    startingFrom: t("card.startingFrom"),
    detail: t("card.detail"),
    order: t("card.order"),
  };

  const getPackageWhatsAppUrl = (item: AkuaturPackage) => {
    const destinationLabel = getPackageLocationLabel(
      item,
      destinations,
      t("fallback.location"),
    );

    const message = t("whatsapp.packageMessage", {
      title: item.title,
      destination: destinationLabel,
      price: formatPrice(item.price, t("fallback.price")),
    });

    return getWhatsAppUrl(message);
  };

  const getCityConsultationUrl = () => {
    const message = t("whatsapp.cityMessage", {
      city: selectedCity,
    });

    return getWhatsAppUrl(message);
  };

  return (
    <section id="paket" className="bg-muted">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">

        {/* SECTION HEADING */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Compass
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t("eyebrow")}
          </p>

          <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]">
            {t("heading")}
            <span className="mt-1 block text-primary">
              {t("headingHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </div>

        {/* PACKAGE FILTER */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {filterOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={packageFilter === item.value}
              onClick={() => onPackageFilterChange(item.value)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                packageFilter === item.value
                  ? "bg-brand-dark text-white shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-brand-secondary/40 hover:bg-secondary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* PACKAGE COUNT & RESET */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {t("results.showing")}{" "}
            <strong className="text-foreground">
              {isLoading
                ? "..."
                : t("results.packageCount", {
                    count: filteredPackages.length,
                  })}
            </strong>{" "}
            {t("results.forCity")}{" "}
            <strong className="text-brand-dark">
              {selectedCity || "-"}
            </strong>
          </p>

          <button
            type="button"
            onClick={onResetFilters}
            disabled={isLoading}
            className="text-xs font-semibold text-brand-secondary transition-colors hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("filters.reset")}
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[24px] border border-border bg-card"
              >
                <div className="aspect-[16/9] animate-pulse bg-secondary" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
                  <div className="h-6 w-2/3 animate-pulse rounded bg-secondary" />
                  <div className="h-12 animate-pulse rounded bg-secondary" />
                  <div className="h-16 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PACKAGE GRID */}
        {!isLoading && filteredPackages.length > 0 && (
          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((item) => (
              <PackageCard
                key={item.id}
                item={item}
                destinations={destinations}
                onDetail={onPackageDetail}
                onWhatsApp={getPackageWhatsAppUrl}
                locationFallback={t("fallback.location")}
                descriptionFallback={t("fallback.description")}
                priceFallback={t("fallback.price")}
                categoryLabels={categoryLabels}
                labels={cardLabels}
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && filteredPackages.length === 0 && (
          <div className="mt-8 rounded-[24px] border border-border bg-card px-6 py-12 text-center">
            <MapPin className="mx-auto size-9 text-brand-secondary" />

            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              {t("empty.title")}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              {t("empty.description")}
            </p>

            <a
              href={getCityConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              {t("empty.button")}
              <ArrowRight className="size-4" />
            </a>
          </div>
        )}

        {/* FOOTER NOTE */}
        <p className="mt-8 text-center text-xs leading-6 text-muted-foreground">
          {t("footerNote")}
        </p>

      </div>
    </section>
  );
}
