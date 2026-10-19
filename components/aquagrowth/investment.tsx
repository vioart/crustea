"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  MapPinned,
  Waves,
  Wallet,
  TrendingUp,
  Percent,
  CalendarDays,
  ChevronRight,
  LocateFixed,
} from "lucide-react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

type InvestmentRegion = {
  id: string;
  name: string;
  coordinates: [number, number];
  area: string;
  ponds: number;
  investment: string;
  profit: string;
  profitShare: string;
  period: string;
};

const investmentRegions: InvestmentRegion[] = [
  {
    id: "aceh",
    name: "Aceh",
    coordinates: [5.5483, 95.3238],
    area: "2.300 m²",
    ponds: 2,
    investment: "Rp 456,0 Jt",
    profit: "Rp 77,9–117,6 Jt",
    profitShare: "70%",
    period: "3 Siklus / 12 bln",
  },
  {
    id: "jogja",
    name: "Jogja",
    coordinates: [-7.7956, 110.3695],
    area: "1.000 m²",
    ponds: 1,
    investment: "Rp 235,6 Jt",
    profit: "Rp 20,6–43,9 Jt",
    profitShare: "70%",
    period: "3 Siklus / 12 bln",
  },
  {
    id: "jepara",
    name: "Jepara",
    coordinates: [-6.5888, 110.6673],
    area: "1.000 m²",
    ponds: 1,
    investment: "Rp 276,9 Jt",
    profit: "Rp 57,5–92,5 Jt",
    profitShare: "70%",
    period: "3 Siklus / 12 bln",
  },
  {
    id: "kendal",
    name: "Kendal",
    coordinates: [-6.9201, 110.2057],
    area: "1.800 m²",
    ponds: 2,
    investment: "Rp 461,6 Jt",
    profit: "Rp 91,2–127,7 Jt",
    profitShare: "70%",
    period: "3 Siklus / 12 bln",
  },
  {
    id: "tuban",
    name: "Tuban",
    coordinates: [-6.8948, 112.0649],
    area: "5.500 m²",
    ponds: 11,
    investment: "Rp 8,33 Miliar",
    profit: "Rp 3,5–5,8 Miliar",
    profitShare: "70%",
    period: "3 Siklus / 12 bln",
  },
];

type InvestmentMetricProps = {
  icon: React.ElementType;
  label: string;
  value: string;
};

function InvestmentMetric({
  icon: Icon,
  label,
  value,
}: InvestmentMetricProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4 transition-colors hover:border-brand-secondary/40">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon
          className="size-4 shrink-0 text-brand-secondary"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className="text-xs font-medium">{label}</span>
      </div>

      <p className="mt-2 text-base font-semibold leading-snug text-foreground sm:text-lg">
        {value}
      </p>
    </div>
  );
}

export default function AquaGrowthInvestment() {
  const t = useTranslations("AquaGrowth.investment");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersRef = useRef<Record<string, Leaflet.Marker>>({});
  const [selectedRegionId, setSelectedRegionId] = useState("kendal");

  const selectedRegion =
    investmentRegions.find((region) => region.id === selectedRegionId) ??
    investmentRegions[0];

  // Initialize Leaflet map on the client.
  useEffect(() => {
    let cancelled = false;
    let initializedMap: Leaflet.Map | null = null;

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = await import("leaflet");

      if (cancelled || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
      });

      initializedMap = map;
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      const bounds = L.latLngBounds(
        investmentRegions.map((region) => region.coordinates),
      );

      investmentRegions.forEach((region) => {
        const markerIcon = L.divIcon({
          className: "aquagrowth-map-marker-wrapper",
          html: `
            <div class="aquagrowth-map-marker" aria-hidden="true">
              <span></span>
            </div>
          `,
          iconSize: [32, 42],
          iconAnchor: [16, 38],
        });

        const marker = L.marker(region.coordinates, {
          icon: markerIcon,
          title: region.name,
          alt: region.name,
          keyboard: true,
        }).addTo(map);

        marker.bindTooltip(region.name, {
          direction: "top",
          offset: [0, -30],
        });

        marker.on("click", () => {
          setSelectedRegionId(region.id);
        });

        markersRef.current[region.id] = marker;
      });

      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 6,
      });

      // Leaflet needs a size recalculation after the layout settles.
      requestAnimationFrame(() => {
        if (!cancelled) {
          map.invalidateSize();
        }
      });
    }

    void initializeMap();

    return () => {
      cancelled = true;
      initializedMap?.remove();

      if (mapRef.current === initializedMap) {
        mapRef.current = null;
      }

      markersRef.current = {};
    };
  }, []);

  // Focus the map when a location is selected from the list.
  useEffect(() => {
    const map = mapRef.current;
    const marker = markersRef.current[selectedRegionId];

    if (!map || !marker) return;

    map.panTo(marker.getLatLng(), {
      animate: true,
      duration: 0.5,
    });

    Object.entries(markersRef.current).forEach(([id, item]) => {
      const element = item.getElement();
      if (!element) return;

      element.classList.toggle(
        "aquagrowth-map-marker-selected",
        id === selectedRegionId,
      );
    });
  }, [selectedRegionId]);

  function handleSelectRegion(region: InvestmentRegion) {
    setSelectedRegionId(region.id);
  }

  function handleShowAllLocations() {
    const map = mapRef.current;
    if (!map) return;

    const bounds = mapRef.current
      ? investmentRegions.map((region) => region.coordinates)
      : [];

    if (bounds.length > 0) {
      import("leaflet").then((L) => {
        if (!mapRef.current) return;

        mapRef.current.fitBounds(
          L.latLngBounds(bounds),
          {
            padding: [35, 35],
            maxZoom: 6,
            animate: true,
          },
        );
      });
    }
  }

  return (
    <section
      id="paket-investasi"
      className="relative overflow-hidden bg-background"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-20 size-[420px] rounded-full bg-lime-300/15 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-0 size-[420px] rounded-full bg-cyan-800/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Section heading */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/20 bg-secondary/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
            <MapPinned className="size-4" aria-hidden="true" />
            {t("eyebrow")}
          </span>

          <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("description")}
          </p>
        </div>

        {/* Map + investment information */}
        <div className="mt-10 grid items-start gap-6 lg:mt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          {/* Map column */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-brand-secondary">
                    <MapPin className="size-5" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {t("mapTitle")}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("mapSubtitle")}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShowAllLocations}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-brand-secondary/40 hover:bg-secondary"
                >
                  <LocateFixed className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">
                    {t("showAll")}
                  </span>
                </button>
              </div>

              <div
                ref={mapContainerRef}
                className="aquagrowth-leaflet-map h-[350px] w-full bg-secondary sm:h-[430px] lg:h-[510px]"
                aria-label={t("mapAccessibleLabel")}
              />

              <div className="border-t border-border bg-card px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-secondary" />

                  <p className="text-xs leading-6 text-muted-foreground">
                    {t("mapFootnote")}
                  </p>
                </div>
              </div>
            </div>

            {/* Location selector */}
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("locationListTitle")}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {investmentRegions.length} {t("locations")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {investmentRegions.map((region) => {
                  const isSelected = region.id === selectedRegionId;

                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => handleSelectRegion(region)}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-brand-secondary bg-secondary shadow-sm"
                          : "border-border bg-card hover:border-brand-secondary/40 hover:bg-secondary/40"
                      }`}
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-brand-secondary text-white"
                            : "bg-secondary text-brand-secondary"
                        }`}
                      >
                        <MapPin
                          className="size-4"
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {region.name}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          {region.area}
                        </span>
                      </span>

                      <ChevronRight
                        className={`size-4 shrink-0 ${
                          isSelected
                            ? "text-brand-secondary"
                            : "text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Investment detail column */}
          <aside className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              {/* Selected region header */}
              <div className="relative overflow-hidden bg-brand-dark px-6 py-7 text-white sm:px-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full border-[30px] border-white/5"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      <MapPin className="size-4" aria-hidden="true" />
                      {t("selectedLocation")}
                    </span>

                    <h3 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                      {selectedRegion.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/75">
                      {t("investmentPackage")}
                    </p>
                  </div>

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <Waves className="size-6" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {/* Main investment value */}
                <div className="rounded-2xl border border-brand-secondary/20 bg-secondary/50 p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet
                      className="size-4 text-brand-secondary"
                      aria-hidden="true"
                    />
                    {t("investmentAmount")}
                  </div>

                  <p className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                    {selectedRegion.investment}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {t("investmentDisclaimer")}
                  </p>
                </div>

                {/* Investment metrics */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InvestmentMetric
                    icon={Waves}
                    label={t("area")}
                    value={selectedRegion.area}
                  />

                  <InvestmentMetric
                    icon={MapPinned}
                    label={t("pondCount")}
                    value={`${selectedRegion.ponds} ${t("ponds")}`}
                  />

                  <InvestmentMetric
                    icon={TrendingUp}
                    label={t("potentialProfit")}
                    value={selectedRegion.profit}
                  />

                  <InvestmentMetric
                    icon={Percent}
                    label={t("profitShare")}
                    value={selectedRegion.profitShare}
                  />
                </div>

                {/* Period */}
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary">
                    <CalendarDays
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("period")}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {t("periodValue", {
                        period: selectedRegion.period,
                      })}
                    </p>
                  </div>
                </div>

                {/* Selection hint */}
                <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-brand-secondary"
                    aria-hidden="true"
                  />

                  <p className="text-xs leading-6 text-muted-foreground">
                    {t("selectionHint")}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>

      {/* Leaflet marker styling */}
      <style jsx global>{`
        .aquagrowth-leaflet-map {
          z-index: 0;
        }

        .aquagrowth-map-marker-wrapper {
          background: transparent;
          border: 0;
        }

        .aquagrowth-map-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          background: #0b596b;
          box-shadow: 0 4px 14px rgb(0 0 0 / 22%);
          transform: rotate(-45deg);
          transition:
            background 180ms ease,
            transform 180ms ease;
        }

        .aquagrowth-map-marker span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #b6d34a;
        }

        .aquagrowth-map-marker-selected .aquagrowth-map-marker {
          background: #a6c63b;
          transform: rotate(-45deg) scale(1.15);
        }

        .aquagrowth-map-marker-selected .aquagrowth-map-marker span {
          background: #ffffff;
        }

        .aquagrowth-leaflet-map .leaflet-tooltip {
          border: 0;
          border-radius: 8px;
          padding: 6px 10px;
          color: #0b596b;
          font-weight: 600;
          box-shadow: 0 3px 12px rgb(0 0 0 / 12%);
        }

        .aquagrowth-leaflet-map .leaflet-control-zoom a {
          color: #0b596b;
        }
      `}</style>
    </section>
  );
}