"use client";

import { useRouter } from "next/navigation";
import NewsDeleteModal from "@/components/dashboard/news/news-delete-modal";

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

type News = {
  id: number;
  category_id: number;
  author_id: number;
  slug: string;
  thumbnail: string | null;
  title_idn: string;
  title_en: string;
  content_idn: string;
  content_en: string;
  status: "draft" | "published";
  published_at: string | null;
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
    pageTitle: "Berita",
    dashboard: "Dashboard",

    addNews: "Tambah Berita",

    searchPlaceholder: "Cari berita...",
    filter: "Filter",
    closeFilter: "Tutup filter",
    status: "Status",
    allStatus: "Semua Status",
    draft: "Draft",
    published: "Published",
    reset: "Reset",
    apply: "Apply",

    rowsPerPage: "Baris per halaman",
    number: "No.",
    title: "Judul",
    author: "Author",
    date: "Tanggal Update",
    action: "Aksi",

    loading: "Memuat data berita...",
    loadFailed: "Gagal memuat berita",
    notFound: "Berita tidak ditemukan",
    notFoundDescription: "Coba ubah kata pencarian atau filter status.",

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
    news: "berita",

    success: "Berhasil",
    failed: "Gagal",
    newsAdded: "Berita berhasil ditambahkan.",
    newsUpdated: "Berita berhasil diperbarui.",
    newsDeleted: "Berita berhasil dihapus.",
  },

  en: {
    pageTitle: "News",
    dashboard: "Dashboard",

    addNews: "Add News",

    searchPlaceholder: "Search news...",
    filter: "Filter",
    closeFilter: "Close filter",
    status: "Status",
    allStatus: "All Status",
    draft: "Draft",
    published: "Published",
    reset: "Reset",
    apply: "Apply",

    rowsPerPage: "Rows per page",
    number: "No.",
    title: "Title",
    author: "Author",
    date: "Updated Date",
    action: "Actions",

    loading: "Loading news data...",
    loadFailed: "Failed to load news",
    notFound: "No news found",
    notFoundDescription: "Try changing your search keyword or status filter.",

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
    news: "news",

    success: "Success",
    failed: "Failed",
    newsAdded: "News successfully added.",
    newsUpdated: "News successfully updated.",
    newsDeleted: "News successfully deleted.",
  },
};

export default function NewsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [viewNews, setViewNews] = useState<News | null>(null);
  const [editNews, setEditNews] = useState<News | null>(null);
  const [deleteNews, setDeleteNews] = useState<News | null>(null);

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const statusOptions = [
    {
      value: "all",
      label: t.allStatus,
    },
    {
      value: "draft",
      label: t.draft,
    },
    {
      value: "published",
      label: t.published,
    },
  ];

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength).trimEnd()}...`;
  }

  const filteredNews = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return news.filter((item) => {
      const title = language === "id" ? item.title_idn : item.title_en;

      const matchesSearch = title.toLowerCase().includes(searchValue);

      const matchesStatus = status === "all" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [news, search, status, language]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / rowsPerPage));

  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredNews.slice(startIndex, endIndex);
  }, [filteredNews, currentPage, rowsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleApplyFilter = () => {
    setStatus(filterStatus);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const handleResetFilter = () => {
    setFilterStatus("all");
    setStatus("all");
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const startItem =
    filteredNews.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  const endItem = Math.min(currentPage * rowsPerPage, filteredNews.length);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data berita.");
      }

      setNews(data.data ?? []);
    } catch (error) {
      console.error("Get news error:", error);

      setError(
        error instanceof Error ? error.message : "Gagal mengambil data berita.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      void fetchNews();
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
            onClick={() => router.push("/portal/berita/post/tambah")}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            <Plus className="size-4" />
            {t.addNews}
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
                            htmlFor="news-status"
                            className="mb-2 block text-sm font-semibold text-foreground"
                          >
                            {t.status}
                          </label>

                          <div className="relative">
                            <select
                              id="news-status"
                              value={filterStatus}
                              onChange={(event) =>
                                setFilterStatus(event.target.value)
                              }
                              className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-10 text-sm text-muted-foreground outline-none transition-colors focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                            >
                              {statusOptions.map((option) => (
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

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[40%]">
                    {t.title}
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[18%]">
                    {t.author}
                  </th>

                  <th className="w-[160px] px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[15%]">
                    {t.status}
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[17%]">
                    {t.date}
                  </th>

                  <th className="w-[90px] px-5 py-3 text-center text-sm font-bold tracking-wide text-foreground lg:w-[10%]">
                    {t.action}
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t.loading}
                      </p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-red-50 text-red-500">
                          <CircleAlert className="size-5" />
                        </div>

                        <p className="text-sm font-semibold text-foreground">
                          {t.loadFailed}
                        </p>

                        <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                          {error}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedNews.length > 0 ? (
                  paginatedNews.map((item, index) => {
                    const title =
                      language === "id" ? item.title_idn : item.title_en;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border last:border-b-0 transition-colors hover:bg-muted/20"
                      >
                        <td className="px-5 py-3 text-sm font-medium text-muted-foreground">
                          {String(
                            (currentPage - 1) * rowsPerPage + index + 1,
                          ).padStart(2, "0")}
                        </td>

                        {/* Title */}
                        <td className="px-5 py-3">
                          <div className="max-w-[420px] lg:max-w-full">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {truncateText(title, 70)}
                            </p>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="px-5 py-3">
                          <p className="text-sm text-muted-foreground">
                            {item.author_id}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium text-white ${
                              item.status === "published"
                                ? "bg-[#22C55E]"
                                : "bg-[#F59E0B]"
                            }`}
                          >
                            {item.status === "published"
                              ? t.published
                              : t.draft}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3">
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.updated_at).toLocaleDateString(
                              language === "id" ? "id-ID" : "en-US",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={(event) => {
                              const rect =
                                event.currentTarget.getBoundingClientRect();

                              setOpenAction(
                                openAction === item.id ? null : item.id,
                              );

                              if (openAction !== item.id) {
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
                            aria-label={`${t.openAction} ${title}`}
                            aria-expanded={openAction === item.id}
                          >
                            <MoreVertical className="size-5" />
                          </button>

                          {openAction === item.id && actionMenuPosition && (
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
                                    router.push(`/portal/berita/post/${item.slug}`);
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
                                    router.push(`/portal/berita/post/${item.slug}/edit`);
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
                                    setDeleteNews(item);
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
                    <td colSpan={6} className="px-5 py-12 text-center">
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
                {filteredNews.length}
              </span>{" "}
              {t.news}
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

        {/* Delete News Modal */}
        <NewsDeleteModal
          open={deleteModalOpen}
          news={deleteNews}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteNews(null);
          }}
          onSuccess={() => {
            setDeleteModalOpen(false);
            setDeleteNews(null);
            fetchNews();

            setToast({
              type: "success",
              message: t.newsDeleted,
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
    </div>
  );
}
