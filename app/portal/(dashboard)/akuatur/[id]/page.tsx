"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  MapPinned,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Package,
  Clock,
  Users,
  Banknote,
  Image as ImageIcon,
} from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { getAuthToken } from "@/lib/auth";

import PackageFormModal from "@/components/dashboard/akuatur/package-form-modal";
import PackageDeleteModal from "@/components/dashboard/akuatur/package-delete-modal";

/* =========================================================
   TYPES
========================================================= */

type Destination = {
  id: string;
  city: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "regular" | "by-order";
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DestinationPackage = {
  id: string;
  destination_id: string | null;
  title: string;
  category: string;
  duration: string;
  participants: string;
  price: number;
  price_note: string;
  description: string;
  highlights: string[];
  benefits: string[];
  image_url: string;
  icon_key: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type ModalMode = "create" | "edit" | "delete" | null;

type Toast = {
  type: "success" | "error";
  message: string;
};

/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const DESTINATION_ENDPOINT = "/api/admin/destinations";
const PACKAGE_ENDPOINT = "/api/admin/packages";

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  id: {
    pageTitle: "Detail Destinasi",
    breadcrumb: "Dashboard",
    back: "Kembali ke Destinasi",
    description: "Kelola informasi dan package wisata pada destinasi ini.",

    destinationInfo: "Informasi Destinasi",
    packageManagement: "Pengelolaan Package",
    packageDescription:
      "Daftar package wisata yang tersedia pada destinasi ini.",

    addPackage: "Tambah Package",
    refresh: "Muat Ulang",
    search: "Cari nama package atau kategori...",

    total: "Total Package",
    active: "Package Aktif",
    inactive: "Package Nonaktif",

    title: "Nama Package",
    category: "Kategori",
    duration: "Durasi",
    participants: "Peserta",
    price: "Harga",
    descriptionLabel: "Deskripsi",
    order: "Urutan",
    status: "Status",

    activeStatus: "Aktif",
    inactiveStatus: "Tidak Aktif",

    regular: "Reguler",
    byOrder: "By Order",

    noImage: "Foto belum tersedia",
    noPackage: "Belum ada package",
    noPackageDescription: "Tambahkan package pertama untuk destinasi ini.",
    noResults: "Package tidak ditemukan.",
    noResultsDescription: "Coba ubah kata kunci pencarian.",

    view: "Lihat",
    edit: "Edit",
    delete: "Hapus",

    loading: "Memuat data...",
    destinationError: "Gagal memuat data destinasi.",
    packageError: "Gagal memuat data package.",
    authError: "Token autentikasi tidak ditemukan.",
    notFound: "Destinasi tidak ditemukan.",

    createSuccess: "Package berhasil ditambahkan.",
    updateSuccess: "Package berhasil diperbarui.",
    deleteSuccess: "Package berhasil dihapus.",

    success: "Berhasil",
    failed: "Gagal",
    close: "Tutup",
    showing: "Menampilkan",
    of: "dari",
    packages: "package",
  },

  en: {
    pageTitle: "Destination Details",
    breadcrumb: "Dashboard",
    back: "Back to Destinations",
    description: "Manage destination information and tourism packages.",

    destinationInfo: "Destination Information",
    packageManagement: "Package Management",
    packageDescription: "Tourism packages available at this destination.",

    addPackage: "Add Package",
    refresh: "Refresh",
    search: "Search package name or category...",

    total: "Total Packages",
    active: "Active Packages",
    inactive: "Inactive Packages",

    title: "Package Name",
    category: "Category",
    duration: "Duration",
    participants: "Participants",
    price: "Price",
    descriptionLabel: "Description",
    order: "Order",
    status: "Status",

    activeStatus: "Active",
    inactiveStatus: "Inactive",

    regular: "Regular",
    byOrder: "By Order",

    noImage: "Image unavailable",
    noPackage: "No packages yet",
    noPackageDescription: "Add the first package for this destination.",
    noResults: "No packages found.",
    noResultsDescription: "Try changing your search keyword.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    loading: "Loading data...",
    destinationError: "Failed to load destination.",
    packageError: "Failed to load packages.",
    authError: "Authentication token not found.",
    notFound: "Destination not found.",

    createSuccess: "Package added successfully.",
    updateSuccess: "Package updated successfully.",
    deleteSuccess: "Package deleted successfully.",

    success: "Success",
    failed: "Failed",
    close: "Close",
    showing: "Showing",
    of: "of",
    packages: "packages",
  },
} as const;

/* =========================================================
   HELPERS
========================================================= */

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return data;
}

function getImageUrl(path: string) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DestinationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const destinationId = params.id;

  const { language } = useLanguage();
  const t = translations[language];

  /* ---------------------------------------------------------
     DATA STATE
  --------------------------------------------------------- */

  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<DestinationPackage[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  const [search, setSearch] = useState("");

  /* ---------------------------------------------------------
     MODAL
  --------------------------------------------------------- */

  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const [selectedPackage, setSelectedPackage] =
    useState<DestinationPackage | null>(null);

  /* ---------------------------------------------------------
     TOAST
  --------------------------------------------------------- */

  const [toast, setToast] = useState<Toast | null>(null);

  /* ---------------------------------------------------------
     AUTH HEADERS
  --------------------------------------------------------- */

  const getHeaders = useCallback(() => {
    const token = getAuthToken();

    if (!token) {
      throw new Error(t.authError);
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [t.authError]);

  /* ---------------------------------------------------------
     TOAST HANDLERS
  --------------------------------------------------------- */

  const showSuccess = useCallback((message: string) => {
    setToast({ type: "success", message });
  }, []);

  const showError = useCallback((message: string) => {
    setToast({ type: "error", message });
  }, []);

  /* ---------------------------------------------------------
     FETCH DESTINATION
  --------------------------------------------------------- */

  const fetchDestination = useCallback(async () => {
    const response = await fetch(
      `${API_URL}${DESTINATION_ENDPOINT}/${encodeURIComponent(destinationId)}`,
      {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      },
    );

    const data = await parseResponse(response);

    setDestination(data.data ?? data);
  }, [destinationId, getHeaders]);

  /* ---------------------------------------------------------
     FETCH PACKAGES
  --------------------------------------------------------- */

  const fetchPackages = useCallback(async () => {
    setLoadingPackages(true);

    try {
      const response = await fetch(
        `${API_URL}${DESTINATION_ENDPOINT}/${encodeURIComponent(destinationId)}/packages`,
        {
          method: "GET",
          headers: getHeaders(),
          cache: "no-store",
        },
      );

      const data = await parseResponse(response);

      const result: DestinationPackage[] = Array.isArray(data.data)
        ? data.data
        : [];

      setPackages(
        [...result].sort(
          (a, b) =>
            a.sort_order - b.sort_order || a.title.localeCompare(b.title),
        ),
      );
    } catch (error) {
      console.error("Fetch packages error:", error);
      showError(error instanceof Error ? error.message : t.packageError);
    } finally {
      setLoadingPackages(false);
    }
  }, [destinationId, getHeaders, showError, t.packageError]);

  /* ---------------------------------------------------------
     INITIAL LOAD
  --------------------------------------------------------- */

  const fetchAll = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([fetchDestination(), fetchPackages()]);
    } catch (error) {
      console.error("Fetch destination detail error:", error);

      showError(error instanceof Error ? error.message : t.destinationError);
    } finally {
      setLoading(false);
    }
  }, [fetchDestination, fetchPackages, showError, t.destinationError]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  /* ---------------------------------------------------------
     TOAST AUTO DISMISS
  --------------------------------------------------------- */

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  /* ---------------------------------------------------------
     FILTER PACKAGES
  --------------------------------------------------------- */

  const filteredPackages = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return packages;

    return packages.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    );
  }, [packages, search]);

  /* ---------------------------------------------------------
     SUMMARY
  --------------------------------------------------------- */

  const activeCount = packages.filter((item) => item.is_active).length;
  const inactiveCount = packages.length - activeCount;

  /* ---------------------------------------------------------
     MODAL HANDLERS
  --------------------------------------------------------- */

  function openCreateModal() {
    setSelectedPackage(null);
    setModalMode("create");
  }

  function openEditModal(item: DestinationPackage) {
    setSelectedPackage(item);
    setModalMode("edit");
  }

  function openDeleteModal(item: DestinationPackage) {
    setSelectedPackage(item);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedPackage(null);
  }

  /* ---------------------------------------------------------
     MODAL SUCCESS
  --------------------------------------------------------- */

  async function handleCreateSuccess() {
    closeModal();
    await fetchPackages();
    showSuccess(t.createSuccess);
  }

  async function handleEditSuccess() {
    closeModal();
    await fetchPackages();
    showSuccess(t.updateSuccess);
  }

  async function handleDeleteSuccess() {
    closeModal();
    await fetchPackages();
    showSuccess(t.deleteSuccess);
  }

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3 bg-muted/30">
        <LoaderCircle className="size-8 animate-spin text-brand-dark" />
        <p className="text-sm text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 bg-muted/30 px-4 text-center">
        <CircleAlert className="size-10 text-red-500" />

        <h2 className="text-lg font-semibold text-foreground">{t.notFound}</h2>

        <Link
          href="/portal/akuatur"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white"
        >
          <ArrowLeft className="size-4" />
          {t.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div className="fixed right-4 top-20 z-[500] w-[calc(100%-2rem)] max-w-md sm:right-6">
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
            ) : (
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-red-600" />
            )}

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.type === "success" ? t.success : t.failed}
              </p>

              <p className="mt-1 break-words text-xs leading-5 text-slate-600">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label={t.close}
              className="text-slate-500 hover:text-slate-800"
            >
              <span className="sr-only">{t.close}</span>×
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="-mx-4 -mt-6 mb-6 border-b border-border bg-white sm:-mx-6 lg:-mx-8">
          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* TITLE & BREADCRUMB */}
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {t.pageTitle}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{t.breadcrumb}</span>

                  <span>/</span>

                  <span>Akuatur</span>

                  <span>/</span>

                  <span className="font-medium text-brand-dark">
                    {destination.name}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex shrink-0 items-center gap-3">
                {/* BACK */}
                <button
                  type="button"
                  onClick={() => router.push("/portal/akuatur")}
                  className="
            inline-flex h-10 items-center gap-2
            rounded-lg border border-border
            bg-white px-4
            text-sm font-semibold
            text-brand-secondary
            transition-colors
            hover:bg-muted
            hover:text-foreground
          "
                >
                  <ArrowLeft className="size-4" />
                  {language === "id" ? "Kembali" : "Back"}
                </button>

                {/* REFRESH */}
                <button
                  type="button"
                  onClick={() => void fetchAll()}
                  disabled={loading || loadingPackages}
                  className="
            inline-flex h-10 items-center gap-2
            rounded-lg
            bg-brand-primary
            px-4
            text-sm font-semibold
            text-white
            transition-colors
            hover:brightness-95
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                >
                  <RefreshCw
                    className={`size-4 ${
                      loading || loadingPackages ? "animate-spin" : ""
                    }`}
                  />

                  {t.refresh}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            DESTINATION INFORMATION
        ===================================================== */}

        <section className="mb-6 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-foreground">
              {t.destinationInfo}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[280px_1fr]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted md:aspect-square">
              {destination.image_url ? (
                <img
                  src={getImageUrl(destination.image_url)}
                  alt={destination.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <ImageIcon className="size-12 text-muted-foreground/50" />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    destination.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {destination.is_active ? t.activeStatus : t.inactiveStatus}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    destination.status === "regular"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {destination.status === "regular" ? t.regular : t.byOrder}
                </span>
              </div>

              <h3 className="mt-3 text-xl font-bold text-foreground">
                {destination.name}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-sm text-brand-secondary">
                <MapPin className="size-4 shrink-0" />
                <span>{destination.city}</span>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {destination.description}
              </p>

              <div className="mt-auto grid grid-cols-1 gap-3 pt-5 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPinned className="size-4" />
                    Koordinat Lokasi
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka lokasi di Google Maps"
                    className="
      mt-1 inline-flex flex-wrap items-center gap-1.5
      text-sm font-medium text-brand-dark
      transition-colors hover:text-brand-secondary
      hover:underline
    "
                  >
                    <span className="break-all">
                      {destination.latitude}, {destination.longitude}
                    </span>

                    <MapPin className="size-4 shrink-0" />
                  </a>
                </div>

                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="text-xs text-muted-foreground">{t.order}</div>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    #{destination.sort_order}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PACKAGE SUMMARY
        ===================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label={t.total}
            value={packages.length}
            icon={<Package className="size-5" />}
          />

          <SummaryCard
            label={t.active}
            value={activeCount}
            icon={<CheckCircle2 className="size-5" />}
          />

          <SummaryCard
            label={t.inactive}
            value={inactiveCount}
            icon={<CircleAlert className="size-5" />}
          />
        </div>

        {/* =====================================================
            PACKAGE MANAGEMENT
        ===================================================== */}

        <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          {/* HEADER */}

          <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {t.packageManagement}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {t.packageDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition hover:bg-brand-dark/90"
            >
              <Plus className="size-4" />
              {t.addPackage}
            </button>
          </div>

          {/* SEARCH */}

          <div className="border-b border-border px-5 py-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.search}
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>
          </div>

          {/* CONTENT */}

          <div className="p-5">
            {loadingPackages ? (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3">
                <LoaderCircle className="size-7 animate-spin text-brand-dark" />
                <p className="text-sm text-muted-foreground">{t.loading}</p>
              </div>
            ) : packages.length === 0 ? (
              <EmptyState
                icon={<Package className="size-7" />}
                title={t.noPackage}
                description={t.noPackageDescription}
                action={
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Plus className="size-4" />
                    {t.addPackage}
                  </button>
                }
              />
            ) : filteredPackages.length === 0 ? (
              <EmptyState
                icon={<Search className="size-7" />}
                title={t.noResults}
                description={t.noResultsDescription}
              />
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredPackages.map((item) => (
                  <article
                    key={item.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* IMAGE */}

                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      {item.image_url ? (
                        <img
                          src={getImageUrl(item.image_url)}
                          alt={item.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-2">
                          <ImageIcon className="size-10 text-muted-foreground/50" />
                          <span className="text-xs text-muted-foreground">
                            {t.noImage}
                          </span>
                        </div>
                      )}

                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-brand-dark shadow-sm backdrop-blur">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute right-3 top-3">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                            item.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.is_active ? t.activeStatus : t.inactiveStatus}
                        </span>
                      </div>
                    </div>

                    {/* INFORMATION */}

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 break-words text-base font-bold leading-6 text-foreground">
                          {item.title}
                        </h3>

                        <span className="shrink-0 text-xs font-semibold text-brand-dark">
                          #{item.sort_order}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="size-4 shrink-0 text-brand-secondary" />
                          <span className="truncate">
                            {item.duration || "-"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="size-4 shrink-0 text-brand-secondary" />
                          <span className="truncate">
                            {item.participants || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                        <Banknote className="size-4 shrink-0 text-brand-secondary" />

                        <span className="text-sm font-bold text-brand-dark">
                          {formatPrice(item.price)}
                        </span>

                        {item.price_note && (
                          <span className="truncate text-[11px] text-muted-foreground">
                            {item.price_note}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center justify-end gap-1 border-t border-border bg-muted/20 px-4 py-3">
                      <button
                        type="button"
                        title={t.view}
                        aria-label={`${t.view} ${item.title}`}
                        onClick={() => openEditModal(item)}
                        className="inline-flex size-9 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-dark/10"
                      >
                        <Eye className="size-4" />
                      </button>

                      <button
                        type="button"
                        title={t.edit}
                        aria-label={`${t.edit} ${item.title}`}
                        onClick={() => openEditModal(item)}
                        className="inline-flex size-9 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                      >
                        <Pencil className="size-4" />
                      </button>

                      <button
                        type="button"
                        title={t.delete}
                        aria-label={`${t.delete} ${item.title}`}
                        onClick={() => openDeleteModal(item)}
                        className="inline-flex size-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* FOOTER */}

            {!loadingPackages && filteredPackages.length > 0 && (
              <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
                {t.showing}{" "}
                <span className="font-semibold text-foreground">
                  {filteredPackages.length}
                </span>{" "}
                {t.of}{" "}
                <span className="font-semibold text-foreground">
                  {packages.length}
                </span>{" "}
                {t.packages}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =====================================================
          CREATE PACKAGE MODAL
      ===================================================== */}

      {modalMode === "create" && (
        <PackageFormModal
          key="create"
          open
          mode="create"
          destinationId={destinationId}
          packageData={null}
          language={language}
          onClose={closeModal}
          onSuccess={handleCreateSuccess}
          onError={showError}
        />
      )}

      {/* =====================================================
          EDIT PACKAGE MODAL
      ===================================================== */}

      {modalMode === "edit" && (
        <PackageFormModal
          key={`edit-${selectedPackage?.id ?? "empty"}`}
          open
          mode="edit"
          destinationId={destinationId}
          packageData={selectedPackage}
          language={language}
          onClose={closeModal}
          onSuccess={handleEditSuccess}
          onError={showError}
        />
      )}

      {/* =====================================================
          DELETE PACKAGE MODAL
      ===================================================== */}

      <PackageDeleteModal
        key={`delete-${selectedPackage?.id ?? "empty"}`}
        open={modalMode === "delete"}
        packageData={selectedPackage}
        language={language}
        onClose={closeModal}
        onSuccess={handleDeleteSuccess}
        onError={showError}
      />
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-brand-dark">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
          {value.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-4 py-8 text-center">
      <div className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
