
"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const ITEMS_PER_PAGE = 6;

export type ProductCategory = "technology" | "krasty" | "trading";

type ApiImage = {
  id?: number;
  file_url?: string;
};

type ApiProduct = {
  id: number;
  category: string;
  slug: string;
  name_idn?: string;
  name_en?: string;
  description_idn?: string;
  description_en?: string;
  images?: ApiImage[] | null;
  created_at?: string;
};

type ApiResponse = {
  data?: ApiProduct[];
};

export type Product = {
  id: number;
  name: string;
  description: string;
  image?: string;
  slug: string;
  createdAt?: string;
};

type ProductSectionProps = {
  title: string;
  description: string;
  category: ProductCategory;
  basePath: string;
};

type FetchState = "loading" | "success" | "error";

function getImageUrl(path?: string): string {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

function normalizeCategory(category?: string): string {
  return (category || "")
    .toLowerCase()
    .trim()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
}

function matchesCategory(
  productCategory: string,
  selectedCategory: ProductCategory,
): boolean {
  const normalizedProductCategory = normalizeCategory(productCategory);

  if (selectedCategory === "krasty" || selectedCategory === "trading") {
    return (
      normalizedProductCategory === "krasty" ||
      normalizedProductCategory === "trading"
    );
  }

  return normalizedProductCategory === selectedCategory;
}

/**
 * Urutkan produk dari yang paling lama ke yang paling baru.
 * created_at menjadi acuan utama jika tersedia.
 * Jika tanggal tidak tersedia atau sama, gunakan ID terkecil dahulu.
 */
function sortProductsOldestFirst(products: ApiProduct[]): ApiProduct[] {
  return [...products].sort((a, b) => {
    const timeA = a.created_at
      ? new Date(a.created_at).getTime()
      : Number.NaN;

    const timeB = b.created_at
      ? new Date(b.created_at).getTime()
      : Number.NaN;

    const hasValidDateA = Number.isFinite(timeA);
    const hasValidDateB = Number.isFinite(timeB);

    if (hasValidDateA && hasValidDateB && timeA !== timeB) {
      return timeA - timeB;
    }

    if (hasValidDateA !== hasValidDateB) {
      return hasValidDateA ? -1 : 1;
    }

    return a.id - b.id;
  });
}

function mapProduct(product: ApiProduct, locale: string): Product {
  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = images.find((image) => image.file_url);

  const isEnglish = locale.startsWith("en");

  const name = isEnglish
    ? product.name_en || product.name_idn
    : product.name_idn || product.name_en;

  const description = isEnglish
    ? product.description_en || product.description_idn
    : product.description_idn || product.description_en;

  return {
    id: product.id,
    name: name || "—",
    description: description || "",
    image: getImageUrl(firstImage?.file_url) || undefined,
    slug: product.slug,
    createdAt: product.created_at,
  };
}

function ProductCard({
  product,
  basePath,
}: {
  product: Product;
  basePath: string;
}) {
  const t = useTranslations("Product.overview");
  const detailHref = `${basePath.replace(/\/+$/, "")}/${product.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={detailHref}
        aria-label={`${t("viewDetail")}: ${product.name}`}
        className="relative block overflow-hidden bg-muted"
      >
        <div className="aspect-[4/3] w-full">
          {product.image ? (
            <img
              src={product.image}
              alt={t("productImageAlt", { product: product.name })}
              width={800}
              height={600}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-background text-brand-secondary shadow-sm">
                <Package
                  className="size-9"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
          {product.name}
        </h2>

        <p className="mt-3 line-clamp-3 text-[14px] leading-[22px] text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-auto pt-6">
          <Button asChild className="group/detail w-full">
            <Link href={detailHref}>
              {t("viewDetail")}
              <ArrowRight className="transition-transform duration-300 group-hover/detail:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const t = useTranslations("Product.overview");

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={t("pagination")}
      className="mt-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t("previousPage")}
        className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:border-primary hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const active = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={t("pageNumber", { number: page })}
            aria-current={active ? "page" : undefined}
            className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border bg-card text-foreground hover:border-primary hover:bg-secondary"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t("nextPage")}
        className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:border-primary hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default function ProductSection({
  title,
  description,
  category,
  basePath,
}: ProductSectionProps) {
  const t = useTranslations("Product.overview");
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadProducts() {
      setFetchState("loading");

      try {
        const response = await fetch(`${API_BASE}/api/products`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `${t("loadError")} (${response.status})`,
          );
        }

        const result: ApiResponse = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error(t("loadError"));
        }

        const filteredProducts = sortProductsOldestFirst(
          result.data.filter((item) =>
            matchesCategory(item.category, category),
          ),
        ).map((item) => mapProduct(item, locale));

        if (!active) return;

        setProducts(filteredProducts);
        setCurrentPage(1);
        setError(null);
        setFetchState("success");
      } catch (err) {
        if (!active || controller.signal.aborted) return;

        console.error("Gagal mengambil produk:", err);

        setError(
          err instanceof Error ? err.message : t("loadError"),
        );

        setFetchState("error");
      }
    }

    void loadProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [category, locale, retryKey, t]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase(locale);

    if (!keyword) return products;

    return products.filter(
      (product) =>
        product.name.toLocaleLowerCase(locale).includes(keyword) ||
        product.description.toLocaleLowerCase(locale).includes(keyword),
    );
  }, [products, search, locale]);

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE,
  );

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const visibleProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleRetry() {
    setError(null);
    setFetchState("loading");
    setRetryKey((value) => value + 1);
  }

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute -left-48 top-20 size-[420px] rounded-full bg-secondary/40 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-48 top-[45%] size-[420px] rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
        {/* Section heading and search */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              {t("eyebrow")}
            </span>

            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>

            <p className="mt-4 text-[14px] leading-7 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <label htmlFor="product-search" className="sr-only">
              {t("searchLabel")}
            </label>

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-[14px] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Loading state */}
        {fetchState === "loading" ? (
          <div
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-live="polite"
            aria-label={t("loading")}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-[24px] border border-border bg-card"
              >
                <div className="aspect-[4/3] bg-muted" />

                <div className="space-y-3 p-6">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                  <div className="h-10 rounded-xl bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : fetchState === "error" ? (
          /* Error state */
          <div
            className="mt-8 rounded-[24px] border border-border bg-card px-6 py-16 text-center shadow-sm"
            role="alert"
          >
            <h3 className="font-display text-xl font-semibold text-foreground">
              {t("loadError")}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              {error}
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={handleRetry}
            >
              {t("retry")}
            </Button>
          </div>
        ) : (
          <>
            {/* Product count */}
            <div className="mt-8 flex items-center justify-between gap-4 border-b border-border pb-4">
              <p className="text-[14px] text-muted-foreground">
                {t("showingProducts")}{" "}
                <span className="font-semibold text-foreground">
                  {filteredProducts.length}
                </span>{" "}
                {t("productCount")}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="shrink-0 text-[13px] font-semibold text-brand-secondary transition-colors hover:text-brand-dark"
                >
                  {t("clearSearch")}
                </button>
              )}
            </div>

            {/* Product cards */}
            {visibleProducts.length > 0 ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    basePath={basePath}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="mt-8 rounded-[24px] border border-border bg-card px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-brand-secondary">
                  <Search className="size-6" aria-hidden="true" />
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {search
                    ? t("productNotFound")
                    : t("noProducts")}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-[14px] leading-7 text-muted-foreground">
                  {search
                    ? t("searchEmpty", { search })
                    : t("categoryEmpty")}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearch("")}
                    className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-95"
                  >
                    {t("showAllProducts")}
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
