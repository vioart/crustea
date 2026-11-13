
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Waves,
  Fish,
  Leaf,
  GraduationCap,
  Mountain,
  Users,
  Building2,
} from "lucide-react";

// =========================================================
// AKUATUR SECTIONS
// =========================================================

import HeroSection from "@/components/akuatur/hero-section";
import IntroductionSection from "@/components/akuatur/introduction-section";

import DestinationMapSection, {
  type AkuaturDestination,
  type DestinationFilter,
} from "@/components/akuatur/destination-map-section";

import DestinationPackageSection, {
  type AkuaturPackage,
  type AkuaturPackageFilter,
} from "@/components/akuatur/destination-package-section";

import TargetAudienceSection from "@/components/akuatur/target-audience-section";
import PriceTableSection from "@/components/akuatur/price-table-section";
import BookingStepsSection from "@/components/akuatur/booking-steps-section";
import PackageDetailModal from "@/components/akuatur/package-detail-modal";

// =========================================================
// UI COMPONENTS
// =========================================================

import WhatsAppBubble from "@/components/ui/buble-wa";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(
  /\/+$/,
  "",
);

// =========================================================
// API TYPES
// =========================================================

type ApiResponse<T> = {
  data: T[];
  message?: string;
};

// Tipe destinasi dari backend.
type ApiDestination = AkuaturDestination;

// Tipe paket dari backend.
// Icon tidak dikirim backend karena hanya digunakan untuk UI.
type ApiPackage = Omit<
  AkuaturPackage,
  "icon" | "image_url" | "highlights" | "benefits"
> & {
  image_url: string | null;
  highlights?: string[] | null;
  benefits?: string[] | null;
};

// =========================================================
// PACKAGE ICON MAPPING
// =========================================================

const packageIconMap: Record<string, typeof Waves> = {
  "rafting-batoo": Waves,
  "mancing-monster": Fish,
  "albitech-singkat": Leaf,
  "albitech-kelas": GraduationCap,
  karaharjan: Waves,
  "akuatrip-imorenggo": Mountain,
  "edu-trip": GraduationCap,
  pembudidaya: Users,
  investor: Building2,
};

function getPackageIcon(item: ApiPackage): typeof Waves {
  return (
    packageIconMap[item.id] ??
    (item.category === "group" ? Users : Waves)
  );
}

// =========================================================
// API FETCH HELPER
// =========================================================

async function fetchApi<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T[]> {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum dikonfigurasi di environment.",
    );
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil data dari ${endpoint}. Status: ${response.status}`,
    );
  }

  const result: ApiResponse<T> = await response.json();

  if (!result || !Array.isArray(result.data)) {
    throw new Error(
      `Format respons API ${endpoint} tidak sesuai. Data harus berupa array.`,
    );
  }

  return result.data;
}

// =========================================================
// MAIN PAGE
// =========================================================

export default function AkuaturPage() {
  // =======================================================
  // API DATA STATE
  // =======================================================

  const [destinations, setDestinations] = useState<
    AkuaturDestination[]
  >([]);

  const [packages, setPackages] = useState<AkuaturPackage[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // =======================================================
  // FILTER STATE
  // =======================================================

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] =
    useState("");

  const [destinationFilter, setDestinationFilter] =
    useState<DestinationFilter>("all");

  const [packageFilter, setPackageFilter] =
    useState<AkuaturPackageFilter>("all");

  // =======================================================
  // MODAL STATE
  // =======================================================

  const [selectedPackage, setSelectedPackage] =
    useState<AkuaturPackage | null>(null);

  // =======================================================
  // FETCH DESTINATIONS & PACKAGES
  // =======================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadAkuaturData() {
      try {
        setIsLoading(true);
        setApiError(null);

        // Ambil data destinasi dan paket secara bersamaan.
        const [destinationData, packageData] = await Promise.all([
          fetchApi<ApiDestination>(
            "/api/destinations",
            controller.signal,
          ),

          fetchApi<ApiPackage>(
            "/api/packages",
            controller.signal,
          ),
        ]);

        // -------------------------------------------------
        // NORMALIZE DESTINATIONS
        // -------------------------------------------------

        const activeDestinations: AkuaturDestination[] =
          destinationData
            .filter((item) => item.is_active)
            .sort(
              (a, b) => a.sort_order - b.sort_order,
            );

        // -------------------------------------------------
        // NORMALIZE PACKAGES
        // -------------------------------------------------

        const activePackages: AkuaturPackage[] =
          packageData
            .filter((item) => item.is_active)
            .sort(
              (a, b) => a.sort_order - b.sort_order,
            )
            .map((item) => ({
              ...item,

              // Pastikan array tersedia untuk komponen UI.
              highlights: item.highlights ?? [],
              benefits: item.benefits ?? [],

              // Pastikan image_url sesuai tipe katalog.
              image_url: item.image_url ?? "",

              // Icon ditentukan oleh frontend.
              icon: getPackageIcon(item),
            }));

        // -------------------------------------------------
        // SAVE API DATA
        // -------------------------------------------------

        setDestinations(activeDestinations);
        setPackages(activePackages);

        // -------------------------------------------------
        // DEFAULT DESTINATION
        // -------------------------------------------------

        const firstDestination = activeDestinations[0];

        if (firstDestination) {
          setSelectedCity(firstDestination.city);
          setSelectedDestinationId(firstDestination.id);
        } else {
          setSelectedCity("");
          setSelectedDestinationId("");
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("[Akuatur API]", error);

        setApiError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data Akuatur.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadAkuaturData();

    return () => {
      controller.abort();
    };
  }, []);

  // =======================================================
  // CITY OPTIONS
  // =======================================================

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          destinations.map((item) => item.city),
        ),
      ),
    [destinations],
  );

  // =======================================================
  // FILTERED PACKAGES
  // =======================================================

  const filteredPackages = useMemo(
    () =>
      packages.filter((item) => {
        if (!item.is_active) return false;

        // Filter kategori paket.
        const matchesCategory =
          packageFilter === "all" ||
          item.category === packageFilter;

        // Cari destinasi berdasarkan destination_id.
        const destination = item.destination_id
          ? destinations.find(
              (destinationItem) =>
                destinationItem.id === item.destination_id,
            )
          : null;

        /*
         * Paket dengan destination_id:
         * Hanya tampil pada kota destinasi terkait.
         *
         * Paket tanpa destination_id:
         * Tetap tersedia pada semua kota.
         */
        const matchesCity =
          !destination ||
          destination.city === selectedCity;

        return matchesCategory && matchesCity;
      }),
    [packages, destinations, packageFilter, selectedCity],
  );

  // =======================================================
  // DESTINATION HANDLERS
  // =======================================================

  const handleSelectCity = useCallback(
    (city: string) => {
      setSelectedCity(city);
      setPackageFilter("all");

      const firstDestination = destinations.find(
        (item) => item.city === city,
      );

      setSelectedDestinationId(
        firstDestination?.id ?? "",
      );
    },
    [destinations],
  );

  const handleSelectDestination = useCallback(
    (destinationId: string) => {
      const destination = destinations.find(
        (item) => item.id === destinationId,
      );

      if (!destination) return;

      setSelectedCity(destination.city);
      setSelectedDestinationId(destination.id);
      setPackageFilter("all");
    },
    [destinations],
  );

  // =======================================================
  // SHOW PACKAGES HANDLER
  // =======================================================

  const handleShowPackages = useCallback(() => {
    setPackageFilter("all");

    document
      .getElementById("paket")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, []);

  // =======================================================
  // RESET FILTER
  // =======================================================

  const handleResetFilters = useCallback(() => {
    const firstCity = cityOptions[0] ?? "";

    handleSelectCity(firstCity);

    setDestinationFilter("all");
    setPackageFilter("all");
  }, [cityOptions, handleSelectCity]);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      <main className="overflow-hidden bg-background">
        {/* HERO */}
        <HeroSection />

        {/* INTRODUCTION */}
        <IntroductionSection />

        {/* API LOADING */}
        {isLoading && (
          <div className="mx-auto max-w-7xl px-5 py-6 text-center text-sm text-muted-foreground">
            Memuat data destinasi dan paket wisata...
          </div>
        )}

        {/* API ERROR */}
        {apiError && !isLoading && (
          <div className="mx-auto max-w-7xl px-5 py-6">
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
            >
              <p className="font-semibold">
                Gagal memuat data Akuatur.
              </p>

              <p className="mt-1">
                {apiError}
              </p>
            </div>
          </div>
        )}

        {/* ============================================= */}
        {/* DESTINATION MAP */}
        {/* ============================================= */}

        <DestinationMapSection
          destinations={destinations}
          selectedCity={selectedCity}
          selectedDestinationId={selectedDestinationId}
          destinationFilter={destinationFilter}
          onSelectCity={handleSelectCity}
          onSelectDestination={handleSelectDestination}
          onDestinationFilterChange={setDestinationFilter}
          onShowPackages={handleShowPackages}
        />

        {/* ============================================= */}
        {/* PACKAGE CATALOG */}
        {/* ============================================= */}

        <DestinationPackageSection
          destinations={destinations}
          selectedCity={selectedCity}
          packageFilter={packageFilter}
          filteredPackages={filteredPackages}
          onPackageFilterChange={setPackageFilter}
          onResetFilters={handleResetFilters}
          onPackageDetail={setSelectedPackage}
        />

        {/* TARGET AUDIENCE */}
        <TargetAudienceSection />

        {/* ============================================= */}
        {/* PRICE TABLE */}
        {/* ============================================= */}

        <PriceTableSection
          packages={packages}
          destinations={destinations}
        />

        {/* BOOKING STEPS */}
        <BookingStepsSection />
      </main>

      {/* =============================================== */}
      {/* PACKAGE DETAIL MODAL */}
      {/* =============================================== */}

      <PackageDetailModal
        packageItem={selectedPackage}
        destinations={destinations}
        onClose={() => setSelectedPackage(null)}
      />

      {/* WHATSAPP FLOATING BUTTON */}
      <WhatsAppBubble />
    </>
  );
}
