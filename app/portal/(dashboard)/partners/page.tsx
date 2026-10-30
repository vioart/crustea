"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Image as ImageIcon,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState, startTransition } from "react";

import { useLanguage } from "@/components/language/language-provider";
import { getAuthToken } from "@/lib/auth";

// Modal Partners — akan dibuat pada tahap berikutnya.
import PartnerFormModal from "@/components/dashboard/partners/partner-form-modal";
import PartnerViewModal from "@/components/dashboard/partners/partner-view-modal";
import PartnerDeleteModal from "@/components/dashboard/partners/partner-delete-modal";

type Partner = {
  id: number;
  name: string;
  logo: string;
  created_at: string;
  updated_at: string;
};

type ToastType = "success" | "error";

type Toast = {
  type: ToastType;
  message: string;
};

type PartnerModalMode = "create" | "edit" | "view" | "delete" | null;

const rowsPerPageOptions = [5, 10, 25, 50, 100];

const translations = {
  id: {
    pageTitle: "Partners",
    dashboard: "Dashboard",

    addPartner: "Tambah Partner",
    searchPlaceholder: "Cari partner...",

    rowsPerPage: "Baris per halaman",

    number: "No.",
    name: "Nama Partner",
    logo: "Logo Partner",
    action: "Aksi",

    loading: "Memuat data partner...",
    loadFailed: "Gagal memuat partner",
    notFound: "Partner tidak ditemukan",
    notFoundDescription: "Coba ubah kata pencarian.",

    view: "Lihat",
    edit: "Edit",
    delete: "Hapus",

    closeNotification: "Tutup notifikasi",
    closeActionMenu: "Tutup menu aksi",
    previousPage: "Halaman sebelumnya",
    nextPage: "Halaman berikutnya",
    openAction: "Buka aksi untuk",

    showing: "Menampilkan",
    from: "dari",
    partner: "partner",

    success: "Berhasil",
    failed: "Gagal",

    partnerAdded: "Partner berhasil ditambahkan.",
    partnerUpdated: "Partner berhasil diperbarui.",
    partnerDeleted: "Partner berhasil dihapus.",

    authError: "Token autentikasi tidak ditemukan.",
    loadError: "Terjadi kesalahan saat memuat data partner.",
  },

  en: {
    pageTitle: "Partners",
    dashboard: "Dashboard",

    addPartner: "Add Partner",
    searchPlaceholder: "Search partners...",

    rowsPerPage: "Rows per page",

    number: "No.",
    name: "Partner Name",
    logo: "Partner Logo",
    action: "Actions",

    loading: "Loading partners...",
    loadFailed: "Failed to load partners",
    notFound: "No partners found",
    notFoundDescription: "Try changing your search keyword.",

    view: "View",
    edit: "Edit",
    delete: "Delete",

    closeNotification: "Close notification",
    closeActionMenu: "Close action menu",
    previousPage: "Previous page",
    nextPage: "Next page",
    openAction: "Open actions for",

    showing: "Showing",
    from: "of",
    partner: "partners",

    success: "Success",
    failed: "Failed",

    partnerAdded: "Partner successfully added.",
    partnerUpdated: "Partner successfully updated.",
    partnerDeleted: "Partner successfully deleted.",

    authError: "Authentication token not found.",
    loadError: "An error occurred while loading partners.",
  },
};

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getLogoUrl(logo: string | null | undefined) {
  if (!logo) {
    return "";
  }

  // Jika logo berupa URL absolut, gunakan langsung.
  if (/^https?:\/\//i.test(logo)) {
    return logo;
  }

  // Jika logo merupakan path relatif, gabungkan dengan API URL.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  return `${apiUrl.replace(/\/$/, "")}/${logo.replace(/^\//, "")}`;
}

export default function PartnersPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [search, setSearch] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toast, setToast] = useState<Toast | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [openAction, setOpenAction] = useState<number | null>(null);

  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const [modalMode, setModalMode] = useState<PartnerModalMode>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Filter partner berdasarkan nama.
  const filteredPartners = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return partners;
    }

    return partners.filter((partner) =>
      partner.name.toLowerCase().includes(searchValue),
    );
  }, [partners, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPartners.length / rowsPerPage),
  );

  // Pagination.
  const paginatedPartners = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredPartners.slice(startIndex, endIndex);
  }, [filteredPartners, currentPage, rowsPerPage]);

  const startItem =
    filteredPartners.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  const endItem = Math.min(currentPage * rowsPerPage, filteredPartners.length);

  // Mengambil data partner dari backend.
  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/admin/partners`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.loadError);
      }

      if (!Array.isArray(data.data)) {
        throw new Error(t.loadError);
      }

      setPartners(data.data);
    } catch (error) {
      console.error("Get partners error:", error);

      setError(error instanceof Error ? error.message : t.loadError);
    } finally {
      setLoading(false);
    }
  };

  // Memuat data pertama kali.
  useEffect(() => {
    startTransition(() => {
      void fetchPartners();
    });
    // Mengikuti pola halaman Users yang menjadi referensi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Menutup toast secara otomatis setelah 3 detik.
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // Jika hasil pencarian berubah, kembali ke halaman pertama.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Mengubah jumlah baris per halaman.
  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // Membuka modal Create.
  const openCreateModal = () => {
    setSelectedPartner(null);
    setModalMode("create");
  };

  // Membuka modal Edit.
  const openEditModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setModalMode("edit");
  };

  // Membuka modal View.
  const openViewModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setModalMode("view");
  };

  // Membuka modal Delete.
  const openDeleteModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setModalMode("delete");
  };

  // Menutup modal.
  const closeModal = () => {
    setModalMode(null);
    setSelectedPartner(null);
  };

  // Callback setelah Create berhasil.
  const handleCreateSuccess = async () => {
    closeModal();

    await fetchPartners();

    setToast({
      type: "success",
      message: t.partnerAdded,
    });
  };

  // Callback ketika Create gagal.
  const handleCreateError = (message: string) => {
    setToast({
      type: "error",
      message,
    });
  };

  // Callback setelah Update berhasil.
  const handleEditSuccess = async () => {
    closeModal();

    await fetchPartners();

    setToast({
      type: "success",
      message: t.partnerUpdated,
    });
  };

  // Callback ketika Update gagal.
  const handleEditError = (message: string) => {
    setToast({
      type: "error",
      message,
    });
  };

  // Callback setelah Delete berhasil.
  const handleDeleteSuccess = async () => {
    closeModal();

    await fetchPartners();

    setToast({
      type: "success",
      message: t.partnerDeleted,
    });
  };

  // Callback ketika Delete gagal.
  const handleDeleteError = (message: string) => {
    setToast({
      type: "error",
      message,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-6 top-20 z-[200]">
          <div
            className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div
              className={`mt-0.5 shrink-0 ${
                toast.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <CircleAlert className="size-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.type === "success" ? t.success : t.failed}
              </p>

              <p
                className={`mt-0.5 text-xs leading-5 ${
                  toast.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className={`shrink-0 transition-colors ${
                toast.type === "success"
                  ? "text-green-600 hover:text-green-800"
                  : "text-red-600 hover:text-red-800"
              }`}
              aria-label={t.closeNotification}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t.pageTitle}
            </h1>

            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.dashboard}</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-brand-dark">{t.pageTitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            <Plus className="size-4" />
            {t.addPartner}
          </button>
        </div>

        {/* Content */}
        <div className="relative rounded-xl border border-border bg-background shadow-sm">
          {/* Toolbar */}
          <div className="relative z-50 flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>

            {/* Rows per page */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">{t.rowsPerPage}:</span>

              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(event) =>
                    handleRowsPerPageChange(Number(event.target.value))
                  }
                  className="h-10 w-[75px] appearance-none rounded-lg border border-border bg-background px-3 pr-9 text-sm font-medium text-foreground outline-none transition-colors focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                  aria-label={t.rowsPerPage}
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto lg:overflow-x-visible">
            <table className="w-full min-w-[700px] border-collapse lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="w-[70px] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground">
                    {t.number}
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[42%]">
                    {t.name}
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[35%]">
                    {t.logo}
                  </th>

                  <th className="w-[90px] px-5 py-3 text-center text-sm font-bold tracking-wide text-foreground lg:w-[8%]">
                    {t.action}
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t.loading}
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-red-500">
                        {t.loadFailed}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={() => void fetchPartners()}
                        className="mt-4 rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
                      >
                        Coba Lagi
                      </button>
                    </td>
                  </tr>
                ) : paginatedPartners.length > 0 ? (
                  paginatedPartners.map((partner, index) => (
                    <tr
                      key={partner.id}
                      className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                    >
                      {/* Number */}
                      <td className="px-5 py-3 text-sm font-medium text-muted-foreground">
                        {String(
                          (currentPage - 1) * rowsPerPage + index + 1,
                        ).padStart(2, "0")}
                      </td>

                      {/* Partner Name */}
                      <td className="px-5 py-3">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {truncateText(partner.name, 60)}
                        </p>
                      </td>

                      {/* Partner Logo */}
                      <td className="px-5 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {partner.logo ? (
                            <img
                              src={getLogoUrl(partner.logo)}
                              alt={`Logo ${partner.name}`}
                              className="size-12 shrink-0 rounded-lg border border-border bg-white object-contain p-1.5"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                              <ImageIcon className="size-5 text-muted-foreground" />
                            </div>
                          )}

                          <p
                            className="min-w-0 truncate text-xs text-muted-foreground"
                            title={partner.logo}
                          >
                            {truncateText(partner.logo || "-", 50)}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={(event) => {
                            const rect =
                              event.currentTarget.getBoundingClientRect();

                            if (openAction === partner.id) {
                              setOpenAction(null);
                              setActionMenuPosition(null);
                              return;
                            }

                            const menuHeight = 130;
                            const menuGap = 4;
                            const spaceBelow = window.innerHeight - rect.bottom;

                            const top =
                              spaceBelow >= menuHeight + menuGap
                                ? rect.bottom + menuGap
                                : Math.max(8, rect.top - menuHeight - menuGap);

                            setOpenAction(partner.id);
                            setActionMenuPosition({
                              top,
                              right: window.innerWidth - rect.right,
                            });
                          }}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label={`${t.openAction} ${partner.name}`}
                          aria-expanded={openAction === partner.id}
                        >
                          <MoreVertical className="size-5" />
                        </button>

                        {openAction === partner.id && actionMenuPosition && (
                          <>
                            {/* Overlay */}
                            <button
                              type="button"
                              aria-label={t.closeActionMenu}
                              onClick={() => {
                                setOpenAction(null);
                                setActionMenuPosition(null);
                              }}
                              className="fixed inset-0 z-[9998] cursor-default"
                            />

                            {/* Action Menu */}
                            <div
                              className="fixed z-[9999] w-40 overflow-hidden rounded-lg border border-border bg-background p-1.5 text-left shadow-lg"
                              style={{
                                top: `${actionMenuPosition.top}px`,
                                right: `${actionMenuPosition.right}px`,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  openViewModal(partner);
                                  setOpenAction(null);
                                  setActionMenuPosition(null);
                                }}
                                className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                              >
                                <Eye className="size-4" />
                                {t.view}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  openEditModal(partner);
                                  setOpenAction(null);
                                  setActionMenuPosition(null);
                                }}
                                className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                              >
                                <Pencil className="size-4" />
                                {t.edit}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  openDeleteModal(partner);
                                  setOpenAction(null);
                                  setActionMenuPosition(null);
                                }}
                                className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="size-4" />
                                {t.delete}
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Search className="size-5" />
                        </div>

                        <p className="text-sm font-medium text-foreground">
                          {t.notFound}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {t.notFoundDescription}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              {t.showing}{" "}
              <span className="font-medium text-foreground">
                {startItem}-{endItem}
              </span>{" "}
              {t.from}{" "}
              <span className="font-medium text-foreground">
                {filteredPartners.length}
              </span>{" "}
              {t.partner}
            </p>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t.previousPage}
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-brand-dark text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={t.nextPage}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal: Create dan Edit */}
      <PartnerFormModal
        key={`${modalMode}-${selectedPartner?.id ?? "new"}`}
        open={modalMode === "create" || modalMode === "edit"}
        mode={modalMode === "edit" ? "edit" : "create"}
        partner={selectedPartner}
        onClose={closeModal}
        onCreateSuccess={handleCreateSuccess}
        onEditSuccess={handleEditSuccess}
        onError={modalMode === "edit" ? handleEditError : handleCreateError}
      />

      {/* View Modal */}
      <PartnerViewModal
        open={modalMode === "view"}
        partner={selectedPartner}
        onClose={closeModal}
      />

      {/* Delete Modal */}
      <PartnerDeleteModal
        open={modalMode === "delete"}
        partner={selectedPartner}
        onClose={closeModal}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />
    </div>
  );
}
