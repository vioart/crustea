"use client";

import HardwareProductViewModal from "@/components/dashboard/product/hardware/hardware-product-view-modal";
import HardwareProductDeleteModal from "@/components/dashboard/product/hardware/hardware-product-delete-modal";

import { useRouter } from "next/navigation";
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

type Product = {
  id: number;
  category: string;
  slug: string;
  name_idn: string;
  name_en: string;
  description_idn: string;
  description_en: string;
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
    pageTitle: "Hardware",
    dashboard: "Dashboard",
    product: "Produk",
    addProduct: "Tambah Produk",
    searchPlaceholder: "Cari produk hardware...",
    filter: "Filter",
    closeFilter: "Tutup filter",
    category: "Kategori",
    allCategory: "Semua Kategori",
    hardware: "Hardware",
    reset: "Reset",
    apply: "Terapkan",
    rowsPerPage: "Baris per halaman",
    number: "No.",
    name: "Nama Produk",
    description: "Deskripsi",
    action: "Aksi",
    loading: "Memuat data produk...",
    loadFailed: "Gagal memuat produk",
    notFound: "Produk tidak ditemukan",
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
    products: "produk",
    success: "Berhasil",
    failed: "Gagal",
    productAdded: "Produk berhasil ditambahkan.",
    productUpdated: "Produk berhasil diperbarui.",
    productDeleted: "Produk berhasil dihapus.",
    confirmDelete: "Yakin ingin menghapus produk ini?",
    deleteFailed: "Gagal menghapus produk.",
    tokenMissing: "Token autentikasi tidak ditemukan.",
  },

  en: {
    pageTitle: "Hardware",
    dashboard: "Dashboard",
    product: "Products",
    addProduct: "Add Product",
    searchPlaceholder: "Search hardware products...",
    filter: "Filter",
    closeFilter: "Close filter",
    category: "Category",
    allCategory: "All Categories",
    hardware: "Hardware",
    reset: "Reset",
    apply: "Apply",
    rowsPerPage: "Rows per page",
    number: "No.",
    name: "Product Name",
    description: "Description",
    action: "Actions",
    loading: "Loading products...",
    loadFailed: "Failed to load products",
    notFound: "No products found",
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
    products: "products",
    success: "Success",
    failed: "Failed",
    productAdded: "Product successfully added.",
    productUpdated: "Product successfully updated.",
    productDeleted: "Product successfully deleted.",
    confirmDelete: "Are you sure you want to delete this product?",
    deleteFailed: "Failed to delete product.",
    tokenMissing: "Authentication token not found.",
  },
};

export default function HardwarePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filterSort, setFilterSort] = useState("az");
  const [sort, setSort] = useState("az");
  const [filterOpen, setFilterOpen] = useState(false);
  const [openAction, setOpenAction] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const sortOptions = [
    { value: "az", label: "Nama A–Z" },
    { value: "za", label: "Nama Z–A" },
  ];

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength).trimEnd()}...`;
  }

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return products
      .filter((item) => {
        const name = language === "id" ? item.name_idn : item.name_en;

        const matchesSearch =
          name.toLowerCase().includes(searchValue) ||
          item.slug.toLowerCase().includes(searchValue);

        return matchesSearch;
      })
      .sort((a, b) => {
        const nameA = (
          language === "id" ? a.name_idn : a.name_en
        ).toLowerCase();

        const nameB = (
          language === "id" ? b.name_idn : b.name_en
        ).toLowerCase();

        return sort === "az"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  }, [products, search, sort, language]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / rowsPerPage),
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, rowsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleApplyFilter = () => {
    setSort(filterSort);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const handleResetFilter = () => {
    setFilterSort("az");
    setSort("az");
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const startItem =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  const endItem = Math.min(currentPage * rowsPerPage, filteredProducts.length);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.tokenMissing);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/hardware`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (language === "id"
              ? "Gagal mengambil data produk."
              : "Failed to fetch products."),
        );
      }

      const productData: Product[] = Array.isArray(data.data) ? data.data : [];

      setProducts(productData);
    } catch (error) {
      console.error("Get products error:", error);

      setError(
        error instanceof Error
          ? error.message
          : language === "id"
            ? "Gagal mengambil data produk."
            : "Failed to fetch products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      void fetchProducts();
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

              <span className="text-muted-foreground">{t.product}</span>

              <span className="text-muted-foreground">/</span>

              <span className="font-medium text-brand-dark">{t.pageTitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/portal/produk/hardware/tambah")}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            <Plus className="size-4" />
            {t.addProduct}
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
                    <button
                      type="button"
                      aria-label={t.closeFilter}
                      onClick={() => setFilterOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />

                    <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-[360px] overflow-hidden rounded-xl border border-border bg-background shadow-xl">
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

                      <div className="p-5">
                        <div>
                          <label
                            htmlFor="product-sort"
                            className="mb-2 block text-sm font-semibold text-foreground"
                          >
                            {language === "id"
                              ? "Urutkan Nama"
                              : "Sort by Name"}
                          </label>

                          <div className="relative">
                            <select
                              id="product-sort"
                              value={filterSort}
                              onChange={(event) =>
                                setFilterSort(event.target.value)
                              }
                              className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-10 text-sm text-muted-foreground outline-none transition-colors focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                            >
                              {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

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

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[30%]">
                    {t.name}
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-bold tracking-wide text-foreground lg:w-[35%]">
                    {t.description}
                  </th>
                  <th className="w-[90px] px-5 py-3 text-center text-sm font-bold tracking-wide text-foreground lg:w-[10%]">
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
                    <td colSpan={4} className="px-5 py-12">
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
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((item, index) => {
                    const name =
                      language === "id" ? item.name_idn : item.name_en;

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

                        {/* Product Name */}
                        <td className="px-5 py-3">
                          <div className="max-w-[420px] lg:max-w-full">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {truncateText(name, 70)}
                            </p>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-5 py-3">
                          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                            {truncateText(
                              language === "id"
                                ? item.description_idn
                                : item.description_en,
                              150,
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

                              const isOpening = openAction !== item.id;

                              setOpenAction(isOpening ? item.id : null);

                              if (isOpening) {
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
                            aria-label={`${t.openAction} ${name}`}
                            aria-expanded={openAction === item.id}
                          >
                            <MoreVertical className="size-5" />
                          </button>

                          {openAction === item.id && actionMenuPosition && (
                            <>
                              <button
                                type="button"
                                aria-label={t.closeActionMenu}
                                onClick={() => {
                                  setOpenAction(null);
                                  setActionMenuPosition(null);
                                }}
                                className="fixed inset-0 z-[9998] cursor-default"
                              />

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
                                    setViewProduct(item);
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
                                    router.push(
                                      `/portal/produk/hardware/${item.slug}/edit`,
                                    );
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
                                    setDeleteProduct(item);
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
                {filteredProducts.length}
              </span>{" "}
              {t.products}
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

      <HardwareProductViewModal
        open={viewProduct !== null}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />

      <HardwareProductDeleteModal
        open={deleteProduct !== null}
        product={deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onSuccess={() => {
          if (deleteProduct) {
            setProducts((previous) =>
              previous.filter((item) => item.id !== deleteProduct.id),
            );
          }

          setToast({
            type: "success",
            message: t.productDeleted,
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
