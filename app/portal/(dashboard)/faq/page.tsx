"use client";

import FaqCreateModal from "@/components/dashboard/faq/faq-create-modal";
import FaqViewModal from "@/components/dashboard/faq/faq-view-modal";
import FaqEditModal from "@/components/dashboard/faq/faq-edit-modal";
import FaqDeleteModal from "@/components/dashboard/faq/faq-delete-modal";

import { useLanguage } from "@/components/language/language-provider";
import { useEffect, useMemo, useState, startTransition } from "react";
import { getAuthToken } from "@/lib/auth";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type Faq = {
  id: number;
  category: "product" | "service" | "partnership";
  question_idn: string;
  question_en: string;
  answer_idn: string;
  answer_en: string;
  created_at: string;
  updated_at: string;
};

type ToastType = "success" | "error";

type Toast = {
  type: ToastType;
  message: string;
};

const rowsPerPageOptions = [5, 10, 25, 50, 100];

const translations = {
  id: {
    pageTitle: "FAQ",
    dashboard: "Dashboard",

    addFaq: "Tambah FAQ",

    searchPlaceholder: "Cari FAQ...",
    filter: "Filter",
    closeFilter: "Tutup filter",
    category: "Kategori",
    allCategories: "Semua Kategori",
    product: "Produk",
    service: "Layanan",
    partnership: "Kemitraan",
    reset: "Reset",
    apply: "Apply",

    rowsPerPage: "Baris per halaman",
    number: "No.",
    question: "Pertanyaan",
    answer: "Jawaban",
    action: "Aksi",

    loading: "Memuat data FAQ...",
    loadFailed: "Gagal memuat FAQ",
    notFound: "FAQ tidak ditemukan",
    notFoundDescription: "Coba ubah kata pencarian atau filter kategori.",

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
    faq: "FAQ",

    success: "Berhasil",
    failed: "Gagal",
    faqAdded: "FAQ berhasil ditambahkan.",
    faqUpdated: "FAQ berhasil diperbarui.",
    faqDeleted: "FAQ berhasil dihapus.",
  },

  en: {
    pageTitle: "FAQ",
    dashboard: "Dashboard",

    addFaq: "Add FAQ",

    searchPlaceholder: "Search FAQ...",
    filter: "Filter",
    closeFilter: "Close filter",
    category: "Category",
    allCategories: "All Categories",
    product: "Product",
    service: "Service",
    partnership: "Partnership",
    reset: "Reset",
    apply: "Apply",

    rowsPerPage: "Rows per page",
    number: "No.",
    question: "Question",
    answer: "Answer",
    action: "Actions",

    loading: "Loading FAQ data...",
    loadFailed: "Failed to load FAQ",
    notFound: "No FAQ found",
    notFoundDescription: "Try changing your search keyword or category filter.",

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
    faq: "FAQ",

    success: "Success",
    failed: "Failed",
    faqAdded: "FAQ successfully added.",
    faqUpdated: "FAQ successfully updated.",
    faqDeleted: "FAQ successfully deleted.",
  },
};

export default function FaqPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewFAQ, setViewFAQ] = useState<Faq | null>(null);
  const [editFAQ, setEditFAQ] = useState<Faq | null>(null);
  const [deleteFAQ, setDeleteFAQ] = useState<Faq | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const categoryOptions = [
    {
      value: "all",
      label: t.allCategories,
    },
    {
      value: "product",
      label: t.product,
    },
    {
      value: "service",
      label: t.service,
    },
    {
      value: "partnership",
      label: t.partnership,
    },
  ];

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength).trimEnd()}...`;
  }

  const filteredFaqs = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return faqs.filter((faq) => {
      /*
       * Search tetap mencari kedua bahasa.
       * Jadi meskipun UI sedang English,
       * data Bahasa Indonesia tetap bisa ditemukan.
       */
      const matchesSearch =
        faq.question_idn.toLowerCase().includes(searchValue) ||
        faq.question_en.toLowerCase().includes(searchValue) ||
        faq.answer_idn.toLowerCase().includes(searchValue) ||
        faq.answer_en.toLowerCase().includes(searchValue);

      const matchesCategory = category === "all" || faq.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [faqs, search, category]);

  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / rowsPerPage));

  const paginatedFaqs = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredFaqs.slice(startIndex, endIndex);
  }, [filteredFaqs, currentPage, rowsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleApplyFilter = () => {
    setCategory(filterCategory);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const handleResetFilter = () => {
    setFilterCategory("all");
    setCategory("all");
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const startItem =
    filteredFaqs.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  const endItem = Math.min(currentPage * rowsPerPage, filteredFaqs.length);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/faqs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data FAQ.");
      }

      setFaqs(data.data ?? []);
    } catch (error) {
      console.error("Get FAQ error:", error);

      setError(
        error instanceof Error ? error.message : "Gagal mengambil data FAQ.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      void fetchFaqs();
    });
  }, []);

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-20 z-[200]">
          <div
            className={`flex min-w-[320px] max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {/* Status Icon */}
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

            {/* Content */}
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

            {/* Close */}
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
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            <Plus className="size-4" />
            {t.addFaq}
          </button>
        </div>

        {/* Content */}
        <div className="relative rounded-xl border border-border bg-background shadow-sm">
          {/* Toolbar */}
          <div className="relative z-50 flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

              {/* Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFilterOpen((value) => !value)}
                  className={`inline-flex h-10 items-center gap-3 rounded-lg border px-4 text-sm font-medium transition-colors ${
                    filterOpen
                      ? "border-brand-dark bg-[#EDF4D6] text-brand-dark"
                      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-expanded={filterOpen}
                  aria-haspopup="true"
                >
                  <span>{t.filter}</span>

                  <ChevronDown
                    className={`size-4 transition-transform duration-200 ${
                      filterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {filterOpen && (
                  <>
                    {/* Overlay */}
                    <button
                      type="button"
                      aria-label={t.closeFilter}
                      onClick={() => setFilterOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />

                    {/* Filter Dropdown */}
                    <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-[360px] overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h3 className="text-base font-bold text-foreground">
                          {t.filter}
                        </h3>

                        <button
                          type="button"
                          onClick={() => setFilterOpen(false)}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label={t.closeFilter}
                        >
                          <X className="size-5" />
                        </button>
                      </div>

                      {/* Form */}
                      <div className="p-5">
                        <div>
                          <label
                            htmlFor="faq-category"
                            className="mb-2 block text-sm font-semibold text-foreground"
                          >
                            {t.category}
                          </label>

                          <div className="relative">
                            <select
                              id="faq-category"
                              value={filterCategory}
                              onChange={(event) =>
                                setFilterCategory(event.target.value)
                              }
                              className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-10 text-sm text-muted-foreground outline-none transition-colors focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                            >
                              {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={handleResetFilter}
                            className="h-11 rounded-lg bg-red-50 text-sm font-semibold text-red-500 transition-colors hover:bg-red-100"
                          >
                            {t.reset}
                          </button>

                          <button
                            type="button"
                            onClick={handleApplyFilter}
                            className="h-11 rounded-lg bg-brand-dark text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
                          >
                            {t.apply}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
            <table className="w-full min-w-[900px] border-collapse lg:min-w-0 lg:table-fixed">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="w-[70px] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground">
                    {t.number}
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[32%]">
                    {t.question}
                  </th>

                  <th className="w-[160px] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[14%]">
                    {t.category}
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[38%]">
                    {t.answer}
                  </th>

                  <th className="w-[90px] px-5 py-3 text-center text-sm font-bold tracking-wide text-foreground lg:w-[8%]">
                    {t.action}
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t.loading}
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-red-500">
                        {t.loadFailed}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {error}
                      </p>
                    </td>
                  </tr>
                ) : paginatedFaqs.length > 0 ? (
                  paginatedFaqs.map((faq, index) => {
                    /*
                     * Bahasa yang ditampilkan mengikuti
                     * language dari LanguageProvider.
                     */
                    const question =
                      language === "id" ? faq.question_idn : faq.question_en;

                    const answer =
                      language === "id" ? faq.answer_idn : faq.answer_en;

                    const categoryLabel =
                      faq.category === "product"
                        ? t.product
                        : faq.category === "service"
                          ? t.service
                          : t.partnership;

                    return (
                      <tr
                        key={faq.id}
                        className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3 text-sm font-medium text-muted-foreground">
                          {String(
                            (currentPage - 1) * rowsPerPage + index + 1,
                          ).padStart(2, "0")}
                        </td>

                        {/* Question */}
                        <td className="px-5 py-3">
                          <div className="max-w-[420px] lg:max-w-full">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {truncateText(question, 70)}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium text-white ${
                              faq.category === "product"
                                ? "bg-[#3B82F6]"
                                : faq.category === "service"
                                  ? "bg-[#8B5CF6]"
                                  : "bg-[#F59E0B]"
                            }`}
                          >
                            {categoryLabel}
                          </span>
                        </td>

                        {/* Answer */}
                        <td className="px-5 py-3">
                          <div className="max-w-[480px] lg:max-w-full">
                            <p className="truncate text-sm leading-6 text-muted-foreground">
                              {truncateText(answer, 100)}
                            </p>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={(event) => {
                              const rect =
                                event.currentTarget.getBoundingClientRect();

                              setOpenAction(
                                openAction === faq.id ? null : faq.id,
                              );

                              if (openAction !== faq.id) {
                                const menuHeight = 130;
                                const menuGap = 4;
                                const spaceBelow =
                                  window.innerHeight - rect.bottom;

                                const top =
                                  spaceBelow >= menuHeight + menuGap
                                    ? rect.bottom + menuGap
                                    : rect.top - menuHeight - menuGap;

                                setActionMenuPosition({
                                  top,
                                  right: window.innerWidth - rect.right,
                                });
                              } else {
                                setActionMenuPosition(null);
                              }
                            }}
                            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={`${t.openAction} ${question}`}
                            aria-expanded={openAction === faq.id}
                          >
                            <MoreVertical className="size-5" />
                          </button>

                          {openAction === faq.id && actionMenuPosition && (
                            <>
                              {/* Action Overlay */}
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
                                    setViewFAQ(faq);
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
                                    setEditFAQ(faq);
                                    setEditModalOpen(true);
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
                                    setDeleteFAQ(faq);
                                    setDeleteModalOpen(true);
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-foreground">
                        {t.notFound}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {t.notFoundDescription}
                      </p>
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
                {filteredFaqs.length}
              </span>{" "}
              {t.faq}
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

      {/* Create FAQ Modal */}
      <FaqCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          fetchFaqs();

          setToast({
            type: "success",
            message: t.faqAdded,
          });
        }}
        onError={(message) => {
          setToast({
            type: "error",
            message,
          });
        }}
      />

      <FaqViewModal
        open={viewFAQ !== null}
        faq={viewFAQ}
        onClose={() => setViewFAQ(null)}
      />

      <FaqEditModal
        key={editFAQ?.id ?? "empty"}
        open={editModalOpen}
        faq={editFAQ}
        onClose={() => {
          setEditModalOpen(false);
          setEditFAQ(null);
        }}
        onSuccess={() => {
          setEditModalOpen(false);
          setEditFAQ(null);
          fetchFaqs();

          setToast({
            type: "success",
            message: t.faqUpdated,
          });
        }}
        onError={(message) => {
          setToast({
            type: "error",
            message,
          });
        }}
      />

      <FaqDeleteModal
        open={deleteModalOpen}
        faq={deleteFAQ}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteFAQ(null);
        }}
        onSuccess={() => {
          setDeleteModalOpen(false);
          setDeleteFAQ(null);
          fetchFaqs();

          setToast({
            type: "success",
            message: t.faqDeleted,
          });
        }}
        onError={(message) => {
          setToast({
            type: "error",
            message,
          });
        }}
      />
    </div>
  );
}
