
"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type * as Leaflet from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  LocateFixed,
  MapPin,
  MapPinned,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

export type AkuaturDestination = {
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

export type DestinationFilter = "all" | "regular" | "by-order";

type DestinationMapSectionProps = {
  destinations: AkuaturDestination[];
  selectedCity: string;
  selectedDestinationId: string;
  destinationFilter: DestinationFilter;
  onSelectCity: (city: string) => void;
  onSelectDestination: (destinationId: string) => void;
  onDestinationFilterChange: (filter: DestinationFilter) => void;
  onShowPackages: () => void;
};

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

// =========================================================
// HELPERS
// =========================================================

function getImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (!API_BASE_URL) {
    return imageUrl;
  }

  return `${API_BASE_URL}/${imageUrl.replace(/^\/+/, "")}`;
}

function hasValidCoordinates(destination: AkuaturDestination): boolean {
  const { latitude, longitude } = destination;

  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

// =========================================================
// COMPONENT
// =========================================================

export default function DestinationMapSection({
  destinations,
  selectedCity,
  selectedDestinationId,
  destinationFilter,
  onSelectCity,
  onSelectDestination,
  onDestinationFilterChange,
  onShowPackages,
}: DestinationMapSectionProps) {
  // Namespace mengikuti struktur i18n terbaru: Akuatur.destinations
  const t = useTranslations("Akuatur.destinations");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersRef = useRef<Record<string, Leaflet.Marker>>({});
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  // -------------------------------------------------------
  // DESTINATION DATA
  // -------------------------------------------------------

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          destinations
            .filter((item) => item.is_active)
            .map((item) => item.city),
        ),
      ),
    [destinations],
  );

  const filteredDestinations = useMemo(
    () =>
      destinations
        .filter((item) => {
          const matchesStatus =
            destinationFilter === "all" ||
            item.status === destinationFilter;

          return item.is_active && matchesStatus;
        })
        .sort((a, b) => a.sort_order - b.sort_order),
    [destinations, destinationFilter],
  );

  const selectedDestination = useMemo(
    () =>
      destinations.find(
        (item) =>
          item.id === selectedDestinationId && item.is_active,
      ) ?? null,
    [destinations, selectedDestinationId],
  );

  const mappedDestinations = useMemo(
    () =>
      destinations
        .filter(
          (item) =>
            item.is_active && hasValidCoordinates(item),
        )
        .sort((a, b) => a.sort_order - b.sort_order),
    [destinations],
  );

  // -------------------------------------------------------
  // MAP INITIALIZATION
  // -------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = await import("leaflet");

      if (cancelled || !mapContainerRef.current) return;

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
      });

      mapRef.current = map;

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        },
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      map.setView([-2.5, 118], 5);

      requestAnimationFrame(() => {
        if (!cancelled) {
          map.invalidateSize();
        }
      });
    }

    void initializeMap();

    return () => {
      cancelled = true;

      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // -------------------------------------------------------
  // UPDATE MAP MARKERS
  // -------------------------------------------------------

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;

    if (!map || !L) return;

    Object.values(markersRef.current).forEach((marker) => {
      marker.remove();
    });

    markersRef.current = {};

    mappedDestinations.forEach((destination, index) => {
      if (!hasValidCoordinates(destination)) return;

      const markerIcon = L.divIcon({
        className: "akuatur-map-marker-wrapper",
        html: `
          <div class="akuatur-map-marker ${
            destination.status === "regular"
              ? "is-regular"
              : "is-order"
          }" aria-hidden="true">
            <span>${index + 1}</span>
          </div>
        `,
        iconSize: [38, 46],
        iconAnchor: [19, 42],
      });

      const marker = L.marker(
        [destination.latitude!, destination.longitude!],
        {
          icon: markerIcon,
          title: `${destination.name}, ${destination.city}`,
          alt: `${destination.name}, ${destination.city}`,
          keyboard: true,
        },
      ).addTo(map);

      const destinationName = escapeHTML(destination.name);
      const destinationCity = escapeHTML(destination.city);

      marker.bindTooltip(
        `<strong>${destinationName}</strong><br/>${destinationCity}`,
        {
          direction: "top",
          offset: [0, -32],
        },
      );

      marker.on("click", () => {
        onSelectDestination(destination.id);
      });

      markersRef.current[destination.id] = marker;
    });

    if (mappedDestinations.length > 0) {
      const bounds = L.latLngBounds(
        mappedDestinations.map((destination) => [
          destination.latitude!,
          destination.longitude!,
        ]),
      );

      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 12,
      });
    } else {
      map.setView([-2.5, 118], 5);
    }

    requestAnimationFrame(() => {
      map.invalidateSize();
    });
  }, [mappedDestinations, onSelectDestination]);

  // -------------------------------------------------------
  // SELECTED MARKER
  // -------------------------------------------------------

  useEffect(() => {
    const map = mapRef.current;
    const marker = markersRef.current[selectedDestinationId];

    Object.entries(markersRef.current).forEach(([id, item]) => {
      const element = item.getElement();

      if (!element) return;

      element.classList.toggle(
        "akuatur-map-marker-selected",
        id === selectedDestinationId,
      );
    });

    if (!map || !marker) return;

    map.panTo(marker.getLatLng(), {
      animate: true,
      duration: 0.5,
    });
  }, [selectedDestinationId, mappedDestinations]);

  // -------------------------------------------------------
  // MAP ACTIONS
  // -------------------------------------------------------

  const handleShowAllDestinations = useCallback(() => {
    const map = mapRef.current;
    const L = leafletRef.current;

    if (!map || !L) return;

    if (mappedDestinations.length === 0) {
      map.setView([-2.5, 118], 5, {
        animate: true,
      });

      return;
    }

    map.fitBounds(
      L.latLngBounds(
        mappedDestinations.map((item) => [
          item.latitude!,
          item.longitude!,
        ]),
      ),
      {
        padding: [35, 35],
        maxZoom: 12,
        animate: true,
      },
    );
  }, [mappedDestinations]);

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  const filterOptions: {
    value: DestinationFilter;
    label: string;
  }[] = [
    { value: "all", label: t("list.filters.all") },
    { value: "regular", label: t("list.filters.regular") },
    { value: "by-order", label: t("list.filters.byOrder") },
  ];

  return (
    <section
      id="lokasi"
      className="relative overflow-hidden bg-muted"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-8 lg:py-24">

        {/* SECTION HEADING */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <MapPinned
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

        {/* MAP + DESTINATION LIST */}
        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] lg:gap-6">

          {/* MAP PANEL */}
          <div className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary">
                  <MapPin className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {t("map.title")}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("map.description")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleShowAllDestinations}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand-secondary/40 hover:bg-secondary"
              >
                <LocateFixed className="size-4" />
                {t("map.showAll")}
              </button>
            </div>

            <div
              ref={mapContainerRef}
              className="akuatur-leaflet-map h-[320px] w-full bg-secondary sm:h-[420px] lg:h-[470px]"
              aria-label={t("map.ariaLabel")}
            />

            {/* MAP LEGEND */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5 sm:px-6">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-primary" />
                  {t("map.legend.regular")}
                </span>

                <span className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-orange-500" />
                  {t("map.legend.byOrder")}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground">
                {t("map.pointsCount", {
                  count: mappedDestinations.length,
                })}
              </p>
            </div>

            <div className="border-t border-border bg-secondary/40 px-5 py-3 sm:px-6">
              <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                <CircleHelp className="mt-0.5 size-3.5 shrink-0 text-brand-secondary" />
                {t("map.coordinateNote")}
              </p>
            </div>
          </div>

          {/* DESTINATION LIST PANEL */}
          <aside className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm">

            <div className="border-b border-border px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t("list.title")}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("list.description")}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-brand-secondary">
                  {t("list.cityCount", {
                    count: cityOptions.length,
                  })}
                </span>
              </div>

              {/* DESTINATION FILTER */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {filterOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={destinationFilter === item.value}
                    onClick={() =>
                      onDestinationFilterChange(item.value)
                    }
                    className={`min-h-9 rounded-xl px-2 py-2 text-xs font-semibold transition-all ${
                      destinationFilter === item.value
                        ? "bg-brand-dark text-white shadow-sm"
                        : "bg-secondary text-brand-secondary hover:bg-accent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CITY GROUPS */}
            <div className="max-h-[430px] flex-1 space-y-3 overflow-y-auto p-3 sm:p-4 lg:max-h-[510px]">
              {cityOptions.map((city, cityIndex) => {
                const cityDestinations = filteredDestinations.filter(
                  (item) => item.city === city,
                );

                if (cityDestinations.length === 0) return null;

                const isCitySelected = selectedCity === city;

                return (
                  <details
                    key={city}
                    open={isCitySelected}
                    className={`group overflow-hidden rounded-2xl border transition-colors ${
                      isCitySelected
                        ? "border-brand-secondary bg-accent/40"
                        : "border-border bg-background"
                    }`}
                  >
                    <summary
                      onClick={() => onSelectCity(city)}
                      className="flex cursor-pointer list-none items-center gap-3 p-3 text-left [&::-webkit-details-marker]:hidden"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-dark text-xs font-bold text-white">
                        {(cityIndex + 1).toString().padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {city}
                        </span>

                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {t("list.destinationCount", {
                            count: cityDestinations.length,
                          })}
                        </span>
                      </span>

                      {isCitySelected && (
                        <span className="rounded-full bg-brand-dark/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-brand-dark">
                          {t("list.selectedCity")}
                        </span>
                      )}

                      <span
                        aria-hidden="true"
                        className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-brand-secondary transition-transform duration-200 group-open:rotate-180"
                      >
                        <ChevronDown className="size-4" />
                      </span>
                    </summary>

                    <div className="space-y-1 border-t border-border/70 p-2">
                      {cityDestinations.map((destination) => {
                        const isDestinationSelected =
                          selectedDestinationId === destination.id;

                        const hasCoordinates =
                          hasValidCoordinates(destination);

                        return (
                          <button
                            key={destination.id}
                            type="button"
                            onClick={() =>
                              onSelectDestination(destination.id)
                            }
                            aria-pressed={isDestinationSelected}
                            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                              isDestinationSelected
                                ? "bg-brand-dark text-white"
                                : "text-foreground hover:bg-secondary"
                            }`}
                          >
                            <MapPin
                              className={`size-3.5 shrink-0 ${
                                isDestinationSelected
                                  ? "text-primary"
                                  : "text-brand-secondary"
                              }`}
                            />

                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-semibold">
                                {destination.name}
                              </span>

                              {!hasCoordinates && (
                                <span
                                  className={`mt-0.5 block text-[10px] ${
                                    isDestinationSelected
                                      ? "text-white/60"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {t("list.coordinatesUnavailable")}
                                </span>
                              )}
                            </span>

                            {isDestinationSelected && (
                              <Check className="size-4 shrink-0 text-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </details>
                );
              })}

              {filteredDestinations.length === 0 && (
                <p className="rounded-xl bg-secondary/60 px-4 py-8 text-center text-sm text-muted-foreground">
                  {t("list.empty")}
                </p>
              )}
            </div>

            {/* ACTIVE DESTINATION INFO */}
            <div className="border-t border-border bg-secondary/40 px-5 py-3">
              <p className="text-xs leading-5 text-muted-foreground">
                <span className="font-semibold text-brand-dark">
                  {t("detail.cityLabel")}
                </span>{" "}
                {selectedCity || "-"}

                {selectedDestination && (
                  <>
                    {" · "}
                    <span className="font-semibold text-brand-dark">
                      {t("detail.selectedPlaceLabel")}
                    </span>{" "}
                    {selectedDestination.name}
                  </>
                )}
              </p>
            </div>
          </aside>
        </div>

        {/* SELECTED DESTINATION DETAIL */}
        {selectedDestination && (
          <article
            aria-live="polite"
            className="mt-6 grid overflow-hidden rounded-[24px] border border-border bg-card shadow-sm md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.5fr)]"
          >
            {/* DESTINATION IMAGE */}
            <div className="relative min-h-[220px] overflow-hidden bg-brand-dark">
              {getImageUrl(selectedDestination.image_url) ? (
                <Image
                  key={selectedDestination.image_url}
                  src={getImageUrl(selectedDestination.image_url)!}
                  alt={`${selectedDestination.name}, ${selectedDestination.city}`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700"
                />
              ) : (
                <div className="flex h-full min-h-[220px] items-center justify-center">
                  <MapPin className="size-12 text-white/50" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/85 via-brand-dark/15 to-transparent md:bg-gradient-to-r md:from-transparent md:via-brand-dark/10 md:to-brand-dark/25" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-brand-dark/65 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                  <MapPin className="size-3.5 text-primary" />
                  {selectedDestination.city}
                </span>

                <span
                  className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${
                    selectedDestination.status === "regular"
                      ? "bg-primary text-brand-dark"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {selectedDestination.status === "regular"
                    ? t("list.filters.regular")
                    : t("list.filters.byOrder")}
                </span>
              </div>
            </div>

            {/* DESTINATION INFORMATION */}
            <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                <span>{t("detail.eyebrow")}</span>
                <span className="size-1 rounded-full bg-primary" />
                <span>{t("detail.category")}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                    {selectedDestination.name}
                  </h3>

                  <p className="mt-1.5 text-sm font-medium text-brand-secondary">
                    {selectedDestination.city}
                  </p>
                </div>

                <span className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-brand-secondary sm:flex">
                  <MapPinned className="size-5" />
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                {selectedDestination.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-muted-foreground">
                  {t("detail.packageDescription")}
                </p>

                <button
                  type="button"
                  onClick={onShowPackages}
                  className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {t("detail.packageButton", {
                    city: selectedDestination.city,
                  })}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
