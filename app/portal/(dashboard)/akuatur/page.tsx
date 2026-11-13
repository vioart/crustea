"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  MapPinned,
  MapPin,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  LoaderCircle,
  CircleAlert,
  Image as ImageIcon,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ChevronDown,
} from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { getAuthToken } from "@/lib/auth";

import cities from "@/data/cities.json";

import DestinationFormModal, {
  type Destination,
} from "@/components/dashboard/akuatur/destination-form-modal";

import DestinationDeleteModal from "@/components/dashboard/akuatur/destination-delete-modal";

/* =========================================================
   TYPES
========================================================= */

type ModalMode = "create" | "edit" | "delete" | null;

type Toast = {
  type: "success" | "error";
  message: string;
};

type StatusFilter = "all" | "active" | "inactive";

type PaginationSize = 6 | 9 | 12 | 18 | 24;

/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const DESTINATION_ENDPOINT = "/api/admin/destinations";

// Jumlah card default dalam satu halaman
const DEFAULT_PAGE_SIZE: PaginationSize = 9;

// Pilihan jumlah card per halaman
const PAGE_SIZE_OPTIONS: PaginationSize[] = [6, 9, 12, 18, 24];

// Batas karakter untuk tampilan card
const DESTINATION_NAME_MAX_LENGTH = 150;
const DESTINATION_DESCRIPTION_MAX_LENGTH = 1000;

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  id: {
    pageTitle: "Destinasi Akuatur",
    breadcrumb: "Dashboard",
    description:
      "Kelola lokasi wisata edukasi Akuatur yang ditampilkan pada website.",

    add: "Tambah Destinasi",
    refresh: "Muat Ulang",
    search: "Cari nama destinasi atau kota...",

    all: "Semua Status",
    active: "Aktif",
    inactive: "Tidak Aktif",

    city: "Kabupaten/Kota",
    allCities: "Semua Kabupaten/Kota",
    status: "Status Publikasi",

    regular: "Reguler",
    byOrder: "By Order",

    total: "Total Destinasi",
    activeTotal: "Destinasi Aktif",
    inactiveTotal: "Destinasi Nonaktif",

    empty: "Belum ada destinasi",
    emptyDescription:
      "Tambahkan destinasi wisata pertama untuk mulai mengelola lokasi Akuatur.",

    noResults: "Destinasi tidak ditemukan.",
    noResultsDescription:
      "Coba ubah kata kunci pencarian atau filter yang digunakan.",

    view: "Lihat",
    edit: "Edit",
    delete: "Hapus",
    activate: "Aktifkan",
    deactivate: "Nonaktifkan",
    viewImage: "Lihat Foto",

    createSuccess: "Destinasi berhasil ditambahkan.",
    updateSuccess: "Destinasi berhasil diperbarui.",
    deleteSuccess: "Destinasi berhasil dihapus.",
    statusSuccess: "Status destinasi berhasil diperbarui.",
    orderSuccess: "Urutan destinasi berhasil diperbarui.",

    loading: "Memuat data destinasi...",
    loadingError: "Gagal memuat data destinasi.",
    authError: "Token autentikasi tidak ditemukan.",
    deleteError: "Gagal menghapus destinasi.",
    statusError: "Gagal memperbarui status destinasi.",
    orderError: "Gagal memperbarui urutan destinasi.",
    unexpectedError: "Terjadi kesalahan. Silakan coba lagi.",

    success: "Berhasil",
    failed: "Gagal",
    close: "Tutup",

    order: "Urutan",
    dragToReorder: "Geser card untuk mengubah urutan destinasi.",

    pagination: "Jumlah per halaman",
    showing: "Menampilkan",
    of: "dari",
    destinations: "destinasi",
    previous: "Sebelumnya",
    next: "Berikutnya",
    page: "Halaman",

    noImage: "Foto belum tersedia",
  },

  en: {
    pageTitle: "Akuatur Destinations",
    breadcrumb: "Dashboard",
    description:
      "Manage Akuatur educational tourism destinations displayed on the website.",

    add: "Add Destination",
    refresh: "Refresh",
    search: "Search destination or city...",

    all: "All Statuses",
    active: "Active",
    inactive: "Inactive",

    city: "Regency/City",
    allCities: "All Regencies/Cities",
    status: "Publication Status",

    regular: "Regular",
    byOrder: "By Order",

    total: "Total Destinations",
    activeTotal: "Active Destinations",
    inactiveTotal: "Inactive Destinations",

    empty: "No destinations yet",
    emptyDescription:
      "Add your first tourism destination to start managing Akuatur locations.",

    noResults: "No destinations found.",
    noResultsDescription:
      "Try changing your search keyword or selected filters.",

    view: "View",
    edit: "Edit",
    delete: "Delete",
    activate: "Activate",
    deactivate: "Deactivate",
    viewImage: "View Image",

    createSuccess: "Destination added successfully.",
    updateSuccess: "Destination updated successfully.",
    deleteSuccess: "Destination deleted successfully.",
    statusSuccess: "Destination status updated successfully.",
    orderSuccess: "Destination order updated successfully.",

    loading: "Loading destinations...",
    loadingError: "Failed to load destinations.",
    authError: "Authentication token not found.",
    deleteError: "Failed to delete destination.",
    statusError: "Failed to update destination status.",
    orderError: "Failed to update destination order.",
    unexpectedError: "Something went wrong. Please try again.",

    success: "Success",
    failed: "Failed",
    close: "Close",

    order: "Order",
    dragToReorder: "Drag cards to change destination order.",

    pagination: "Items per page",
    showing: "Showing",
    of: "of",
    destinations: "destinations",
    previous: "Previous",
    next: "Next",
    page: "Page",

    noImage: "Image unavailable",
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

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getImageUrl(path: string) {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Menghindari duplikasi nama kota dari JSON
const CITY_OPTIONS = [...new Set(cities)]
  .filter(
    (city): city is string => typeof city === "string" && city.trim() !== "",
  )
  .sort((a, b) => a.localeCompare(b, "id"));

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AkuaturPage() {
  const { language } = useLanguage();
  const t = translations[language];

  /* ---------------------------------------------------------
     DATA & LOADING STATE
  --------------------------------------------------------- */

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState(false);

  /* ---------------------------------------------------------
     SEARCH & FILTER STATE
  --------------------------------------------------------- */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [cityFilter, setCityFilter] = useState("all");

  /* ---------------------------------------------------------
     PAGINATION STATE
  --------------------------------------------------------- */

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PaginationSize>(DEFAULT_PAGE_SIZE);

  /* ---------------------------------------------------------
     DRAG & DROP STATE
  --------------------------------------------------------- */

  const [draggedDestinationId, setDraggedDestinationId] = useState<
    string | null
  >(null);

  const [dragOverDestinationId, setDragOverDestinationId] = useState<
    string | null
  >(null);

  /* ---------------------------------------------------------
     MODAL STATE
  --------------------------------------------------------- */

  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  /* ---------------------------------------------------------
     TOAST STATE
  --------------------------------------------------------- */

  const [toast, setToast] = useState<Toast | null>(null);

  /* ---------------------------------------------------------
     API HEADERS
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
    setToast({
      type: "success",
      message,
    });
  }, []);

  const showError = useCallback((message: string) => {
    setToast({
      type: "error",
      message,
    });
  }, []);

  /* ---------------------------------------------------------
     FETCH DESTINATIONS
  --------------------------------------------------------- */

  // Hanya mengambil data dari API.
  // Tidak mengubah state agar aman dipanggil dari useEffect.
  const loadDestinations = useCallback(async (): Promise<Destination[]> => {
    const response = await fetch(`${API_URL}${DESTINATION_ENDPOINT}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });

    const data = await parseResponse(response);

    const result: Destination[] = Array.isArray(data.data) ? data.data : [];

    return [...result].sort(
      (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name),
    );
  }, [getHeaders]);

  // Refresh manual dan refresh setelah CRUD.
  const fetchDestinations = useCallback(async () => {
    setLoading(true);

    try {
      const result = await loadDestinations();

      setDestinations(result);
    } catch (error) {
      console.error("Fetch destinations error:", error);

      showError(getErrorMessage(error, t.loadingError));
    } finally {
      setLoading(false);
    }
  }, [loadDestinations, showError, t.loadingError]);

  /* ---------------------------------------------------------
     INITIAL LOAD
  --------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function loadInitialDestinations() {
      try {
        const result = await loadDestinations();

        if (!cancelled) {
          setDestinations(result);
        }
      } catch (error) {
        console.error("Fetch destinations error:", error);

        if (!cancelled) {
          showError(getErrorMessage(error, t.loadingError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialDestinations();

    return () => {
      cancelled = true;
    };
  }, [loadDestinations, showError, t.loadingError]);

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
     FILTERING
  --------------------------------------------------------- */

  const filteredDestinations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesSearch =
        !keyword ||
        destination.name.toLowerCase().includes(keyword) ||
        destination.city.toLowerCase().includes(keyword) ||
        destination.description.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && destination.is_active) ||
        (statusFilter === "inactive" && !destination.is_active);

      const matchesCity =
        cityFilter === "all" || destination.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [destinations, search, statusFilter, cityFilter]);

  /* ---------------------------------------------------------
     SUMMARY COUNTS
  --------------------------------------------------------- */

  const activeCount = destinations.filter((item) => item.is_active).length;

  const inactiveCount = destinations.length - activeCount;

  /* ---------------------------------------------------------
     PAGINATION CALCULATION
  --------------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDestinations.length / pageSize),
  );

  // Menentukan halaman yang valid tanpa setState di useEffect.
  const effectiveCurrentPage = Math.min(currentPage, totalPages);

  // Menampilkan maksimal 5 nomor halaman.
  const visiblePageNumbers = useMemo(() => {
    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      effectiveCurrentPage - Math.floor(maxVisiblePages / 2),
    );

    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Menyesuaikan posisi jika halaman berada di bagian akhir.
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  }, [effectiveCurrentPage, totalPages]);

  const paginatedDestinations = useMemo(() => {
    const startIndex = (effectiveCurrentPage - 1) * pageSize;

    return filteredDestinations.slice(startIndex, startIndex + pageSize);
  }, [filteredDestinations, effectiveCurrentPage, pageSize]);

  const startItem =
    filteredDestinations.length === 0
      ? 0
      : (effectiveCurrentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    effectiveCurrentPage * pageSize,
    filteredDestinations.length,
  );

  /* ---------------------------------------------------------
   PAGINATION HANDLER
--------------------------------------------------------- */

  function resetPagination() {
    setCurrentPage(1);
  }

  /* ---------------------------------------------------------
     FILTER OPTIONS
  --------------------------------------------------------- */

  const availableCities = useMemo(() => {
    const destinationCities = destinations
      .map((item) => item.city)
      .filter(Boolean);

    return [...new Set(destinationCities)].sort((a, b) =>
      a.localeCompare(b, "id"),
    );
  }, [destinations]);

  /* ---------------------------------------------------------
     DRAG & DROP
  --------------------------------------------------------- */

  // Drag hanya aktif saat tidak ada filter/pencarian.
  // Tujuannya agar urutan global tidak membingungkan.
  const canReorder =
    search.trim() === "" && statusFilter === "all" && cityFilter === "all";

  function handleDragStart(
    event: React.DragEvent<HTMLElement>,
    destinationId: string,
  ) {
    if (!canReorder || updatingOrder) {
      event.preventDefault();
      return;
    }

    setDraggedDestinationId(destinationId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", destinationId);
  }

  function handleDragOver(
    event: React.DragEvent<HTMLElement>,
    destinationId: string,
  ) {
    event.preventDefault();

    if (
      !canReorder ||
      !draggedDestinationId ||
      draggedDestinationId === destinationId
    ) {
      return;
    }

    setDragOverDestinationId(destinationId);
    event.dataTransfer.dropEffect = "move";
  }

  function handleDragLeave() {
    setDragOverDestinationId(null);
  }

  async function handleDrop(
    event: React.DragEvent<HTMLElement>,
    targetDestinationId: string,
  ) {
    event.preventDefault();

    const sourceId =
      event.dataTransfer.getData("text/plain") || draggedDestinationId;

    setDraggedDestinationId(null);
    setDragOverDestinationId(null);

    if (
      !canReorder ||
      !sourceId ||
      sourceId === targetDestinationId ||
      updatingOrder
    ) {
      return;
    }

    const previousDestinations = [...destinations];

    const reordered = [...destinations];

    const sourceIndex = reordered.findIndex((item) => item.id === sourceId);

    const targetIndex = reordered.findIndex(
      (item) => item.id === targetDestinationId,
    );

    if (sourceIndex === -1 || targetIndex === -1) {
      return;
    }

    const [movedItem] = reordered.splice(sourceIndex, 1);

    reordered.splice(targetIndex, 0, movedItem);

    const updatedDestinations = reordered.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    // Optimistic UI: urutan langsung berubah.
    setDestinations(updatedDestinations);
    setUpdatingOrder(true);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      // Simpan perubahan urutan ke backend.
      await Promise.all(
        updatedDestinations.map(async (destination) => {
          const previousItem = previousDestinations.find(
            (item) => item.id === destination.id,
          );

          if (
            previousItem &&
            previousItem.sort_order === destination.sort_order
          ) {
            return;
          }

          const response = await fetch(
            `${API_URL}${DESTINATION_ENDPOINT}/${encodeURIComponent(destination.id)}/order`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                sort_order: destination.sort_order,
              }),
            },
          );

          await parseResponse(response);
        }),
      );

      showSuccess(t.orderSuccess);
    } catch (error) {
      console.error("Reorder destinations error:", error);

      // Kembalikan urutan sebelumnya jika gagal.
      setDestinations(previousDestinations);

      showError(getErrorMessage(error, t.orderError));
    } finally {
      setUpdatingOrder(false);
    }
  }

  function handleDragEnd() {
    setDraggedDestinationId(null);
    setDragOverDestinationId(null);
  }

  /* ---------------------------------------------------------
     MODAL HANDLERS
  --------------------------------------------------------- */

  function openCreateModal() {
    setSelectedDestination(null);
    setModalMode("create");
  }

  function openEditModal(destination: Destination) {
    setSelectedDestination(destination);
    setModalMode("edit");
  }

  function openDeleteModal(destination: Destination) {
    setSelectedDestination(destination);
    setModalMode("delete");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedDestination(null);
  }

  /* ---------------------------------------------------------
     MODAL SUCCESS HANDLERS
  --------------------------------------------------------- */

  async function handleCreateSuccess() {
    closeModal();

    await fetchDestinations();

    showSuccess(t.createSuccess);
  }

  async function handleEditSuccess() {
    closeModal();

    await fetchDestinations();

    showSuccess(t.updateSuccess);
  }

  async function handleDeleteSuccess() {
    closeModal();

    await fetchDestinations();

    showSuccess(t.deleteSuccess);
  }

  /* ---------------------------------------------------------
     ACTIVE STATUS
  --------------------------------------------------------- */

  async function handleToggleStatus(destination: Destination) {
    try {
      setUpdatingStatus(destination.id);

      const response = await fetch(
        `${API_URL}${DESTINATION_ENDPOINT}/${encodeURIComponent(destination.id)}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            is_active: !destination.is_active,
          }),
        },
      );

      await parseResponse(response);

      setDestinations((previous) =>
        previous.map((item) =>
          item.id === destination.id
            ? {
                ...item,
                is_active: !item.is_active,
              }
            : item,
        ),
      );

      showSuccess(t.statusSuccess);
    } catch (error) {
      console.error("Update destination status error:", error);

      showError(getErrorMessage(error, t.statusError));
    } finally {
      setUpdatingStatus(null);
    }
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
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.pageTitle}
            </h1>

            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.breadcrumb}</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-brand-dark">{t.pageTitle}</span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {t.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void fetchDestinations()}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
              {t.refresh}
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition hover:bg-brand-dark/90"
            >
              <Plus className="size-4" />
              {t.add}
            </button>
          </div>
        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label={t.total}
            value={destinations.length}
            icon={<MapPinned className="size-5" />}
          />

          <SummaryCard
            label={t.activeTotal}
            value={activeCount}
            icon={<CheckCircle2 className="size-5" />}
          />

          <SummaryCard
            label={t.inactiveTotal}
            value={inactiveCount}
            icon={<CircleAlert className="size-5" />}
          />
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <section className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          {/* =====================================================
              SEARCH & FILTER
          ===================================================== */}
          <div className="flex flex-col gap-4 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* SEARCH */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    resetPagination();
                  }}
                  placeholder={t.search}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                />
              </div>

              {/* FILTER DROPDOWNS */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="size-4" />
                  <span className="text-xs font-medium">Filter:</span>
                </div>

                {/* STATUS FILTER */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value as StatusFilter);
                      resetPagination();
                    }}
                    aria-label={t.status}
                    className="h-10 w-full min-w-0 appearance-none rounded-lg border border-border bg-background pl-3 pr-10 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 sm:min-w-[160px]"
                  >
                    <option value="all">{t.all}</option>
                    <option value="active">{t.active}</option>
                    <option value="inactive">{t.inactive}</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-dark" />
                </div>

                {/* CITY FILTER */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={cityFilter}
                    onChange={(event) => {
                      setCityFilter(event.target.value);
                      resetPagination();
                    }}
                    aria-label={t.city}
                    className="h-10 w-full min-w-0 appearance-none rounded-lg border border-border bg-background pl-3 pr-10 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 sm:min-w-[190px]"
                  >
                    <option value="all">{t.allCities}</option>

                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-dark" />
                </div>
              </div>
            </div>

            {/* ACTIVE FILTER INFO */}
            {(search || statusFilter !== "all" || cityFilter !== "all") && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {filteredDestinations.length} {t.destinations}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setCityFilter("all");
                    resetPagination();
                  }}
                  className="text-xs font-semibold text-brand-dark transition hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

          {/* =====================================================
              DESTINATION CONTENT
          ===================================================== */}
          <div className="p-5">
            {/* LOADING */}
            {loading ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3">
                <LoaderCircle className="size-7 animate-spin text-brand-dark" />
                <p className="text-sm text-muted-foreground">{t.loading}</p>
              </div>
            ) : destinations.length === 0 ? (
              /* EMPTY */
              <EmptyState
                icon={<MapPinned className="size-7" />}
                title={t.empty}
                description={t.emptyDescription}
                action={
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark/90"
                  >
                    <Plus className="size-4" />
                    {t.add}
                  </button>
                }
              />
            ) : filteredDestinations.length === 0 ? (
              /* NO SEARCH RESULT */
              <EmptyState
                icon={<Search className="size-7" />}
                title={t.noResults}
                description={t.noResultsDescription}
              />
            ) : (
              <>
                {/* DRAG INFORMATION */}
                {canReorder && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
                    <GripVertical className="size-4 shrink-0" />
                    <span>{t.dragToReorder}</span>
                    {updatingOrder && (
                      <LoaderCircle className="ml-auto size-4 animate-spin text-brand-dark" />
                    )}
                  </div>
                )}

                {/* DESTINATION GRID */}
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedDestinations.map((destination) => (
                    <article
                      key={destination.id}
                      draggable={canReorder && !updatingOrder}
                      onDragStart={(event) =>
                        handleDragStart(event, destination.id)
                      }
                      onDragOver={(event) =>
                        handleDragOver(event, destination.id)
                      }
                      onDragLeave={handleDragLeave}
                      onDrop={(event) => void handleDrop(event, destination.id)}
                      onDragEnd={handleDragEnd}
                      className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 ${
                        canReorder ? "cursor-grab active:cursor-grabbing" : ""
                      } ${
                        draggedDestinationId === destination.id
                          ? "opacity-40"
                          : "opacity-100"
                      } ${
                        dragOverDestinationId === destination.id
                          ? "border-brand-dark ring-2 ring-brand-dark/20"
                          : ""
                      } hover:-translate-y-0.5 hover:shadow-md`}
                    >
                      {/* IMAGE */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                        {destination.image_url ? (
                          <img
                            src={getImageUrl(destination.image_url)}
                            alt={destination.name}
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

                        {/* DESTINATION TYPE BADGE */}
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                              destination.status === "regular"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {destination.status === "regular"
                              ? t.regular
                              : t.byOrder}
                          </span>
                        </div>

                        {/* DRAG INDICATOR */}
                        {canReorder && (
                          <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-sm">
                            <GripVertical className="size-4" />
                          </div>
                        )}
                      </div>

                      {/* INFORMATION */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* CITY & SORT ORDER */}
                        <div className="flex items-center justify-between gap-2 text-[11px] font-medium">
                          <div className="flex min-w-0 items-center gap-1.5 text-brand-secondary">
                            <MapPin className="size-3.5 shrink-0" />
                            <span className="truncate">{destination.city}</span>
                          </div>

                          <span className="shrink-0 font-semibold text-brand-dark">
                            #{destination.sort_order}
                          </span>
                        </div>

                        {/* DESTINATION NAME */}
                        <h2
                          className="mt-2 break-words text-base font-bold leading-6 text-foreground line-clamp-2"
                          title={destination.name}
                        >
                          {destination.name.length > DESTINATION_NAME_MAX_LENGTH
                            ? `${destination.name.slice(0, DESTINATION_NAME_MAX_LENGTH)}...`
                            : destination.name}
                        </h2>

                        {/* DESCRIPTION */}
                        <p
                          className="mt-1.5 break-words text-xs leading-5 text-muted-foreground line-clamp-2"
                          title={destination.description}
                        >
                          {destination.description.length >
                          DESTINATION_DESCRIPTION_MAX_LENGTH
                            ? `${destination.description.slice(0, DESTINATION_DESCRIPTION_MAX_LENGTH)}...`
                            : destination.description}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/20 px-4 py-3">
                        {/* PUBLICATION TOGGLE */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={destination.is_active}
                          aria-label={
                            destination.is_active ? t.deactivate : t.activate
                          }
                          onClick={() => void handleToggleStatus(destination)}
                          disabled={updatingStatus === destination.id}
                          className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                              destination.is_active
                                ? "bg-green-600"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${
                                destination.is_active
                                  ? "translate-x-[22px]"
                                  : "translate-x-0.5"
                              }`}
                            />

                            {updatingStatus === destination.id && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <LoaderCircle className="size-3 animate-spin text-slate-700" />
                              </span>
                            )}
                          </span>

                          <span>
                            {destination.is_active ? t.active : t.inactive}
                          </span>
                        </button>

                        {/* VIEW, EDIT & DELETE */}
                        <div className="flex items-center gap-1">
                          {/* VIEW */}
                          <Link
                            href={`/portal/akuatur/${encodeURIComponent(destination.id)}`}
                            title={t.view}
                            aria-label={`${t.view} ${destination.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-lg text-brand-dark transition hover:bg-brand-dark/10"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() => openEditModal(destination)}
                            title={t.edit}
                            aria-label={`${t.edit} ${destination.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                          >
                            <Pencil className="size-4" />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => openDeleteModal(destination)}
                            title={t.delete}
                            aria-label={`${t.delete} ${destination.name}`}
                            className="inline-flex size-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}
                <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* PAGINATION INFO */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{t.showing}</span>
                    <span className="font-semibold text-foreground">
                      {startItem}-{endItem}
                    </span>
                    <span>{t.of}</span>
                    <span className="font-semibold text-foreground">
                      {filteredDestinations.length}
                    </span>
                    <span>{t.destinations}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* PAGE SIZE */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="destination-page-size"
                        className="whitespace-nowrap text-xs text-muted-foreground"
                      >
                        {t.pagination}
                      </label>

                      <select
                        id="destination-page-size"
                        value={pageSize}
                        onChange={(event) => {
                          setPageSize(
                            Number(event.target.value) as PaginationSize,
                          );
                          setCurrentPage(1);
                        }}
                        className="h-9 rounded-lg border border-border bg-background px-2 text-xs font-medium text-foreground outline-none focus:border-brand-dark"
                      >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* PAGE NAVIGATION */}
                    <div className="flex items-center gap-1.5">
                      {/* PREVIOUS */}
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((previous) =>
                            Math.max(1, Math.min(previous, totalPages) - 1),
                          )
                        }
                        disabled={effectiveCurrentPage <= 1}
                        aria-label={t.previous}
                        className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-brand-secondary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="size-5" />
                      </button>

                      {/* PAGE NUMBERS */}
                      {visiblePageNumbers.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setCurrentPage(pageNumber)}
                          aria-label={`${t.page} ${pageNumber}`}
                          aria-current={
                            effectiveCurrentPage === pageNumber
                              ? "page"
                              : undefined
                          }
                          className={`flex size-10 items-center justify-center rounded-lg text-sm font-semibold transition ${
                            effectiveCurrentPage === pageNumber
                              ? "bg-brand-dark text-white shadow-sm"
                              : "bg-transparent text-brand-secondary hover:bg-muted"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      {/* NEXT */}
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((previous) =>
                            Math.min(
                              totalPages,
                              Math.min(previous, totalPages) + 1,
                            ),
                          )
                        }
                        disabled={effectiveCurrentPage >= totalPages}
                        aria-label={t.next}
                        className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-brand-secondary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}
      {modalMode === "create" && (
        <DestinationFormModal
          key="create"
          open
          mode="create"
          destination={null}
          language={language}
          onClose={closeModal}
          onSuccess={handleCreateSuccess}
          onError={showError}
        />
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}
      {modalMode === "edit" && (
        <DestinationFormModal
          key={`edit-${selectedDestination?.id ?? "empty"}`}
          open
          mode="edit"
          destination={selectedDestination}
          language={language}
          onClose={closeModal}
          onSuccess={handleEditSuccess}
          onError={showError}
        />
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}
      <DestinationDeleteModal
        key={`delete-${selectedDestination?.id ?? "empty"}`}
        open={modalMode === "delete"}
        destination={selectedDestination}
        language={language}
        onClose={closeModal}
        onSuccess={handleDeleteSuccess}
        onError={showError}
      />
    </div>
  );
}

/* =========================================================
   REUSABLE LOCAL COMPONENTS
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
      <div
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-brand-dark"
      >
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
    <div className="flex min-h-64 flex-col items-center justify-center px-4 py-8 text-center">
      <div
        aria-hidden="true"
        className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
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
