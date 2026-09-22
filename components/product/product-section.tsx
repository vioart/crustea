"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export type Product = {
  name: string;
  description: string;
  image?: string;
  slug: string;
  highlights?: string[];
};

type ProductSectionProps = {
  title: string;
  description: string;
  products: Product[];
  basePath: string;
};

const ITEMS_PER_PAGE = 6;

function ProductCard({
  product,
  basePath,
}: {
  product: Product;
  basePath: string;
}) {
  const detailHref = `${basePath}/${product.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <Link
        href={detailHref}
        className="relative block overflow-hidden bg-muted"
      >
        <div className="aspect-[4/3] w-full">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
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

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
          {product.name}
        </h2>

        <p className="mt-3 line-clamp-3 text-[14px] leading-[22px] text-muted-foreground">
          {product.description}
        </p>

        {/* Highlights */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {product.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-brand-dark"
              >
                {highlight}
              </span>
            ))}

            {product.highlights.length > 3 && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                +{product.highlights.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Button */}
        <div className="mt-auto pt-6">
          <Button asChild className="group/detail w-full">
            <Link href={detailHref}>
              Lihat Detail
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
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination produk"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Halaman sebelumnya"
        className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:border-primary hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const active = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Halaman ${page}`}
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

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Halaman berikutnya"
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
  products,
  basePath,
}: ProductSectionProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.highlights?.some((item) =>
          item.toLowerCase().includes(keyword),
        )
      );
    });
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
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

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -left-48 top-20 size-[420px] rounded-full bg-secondary/40 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-48 top-[45%] size-[420px] rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Produk Crustea
            </span>

            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>

            <p className="mt-4 text-[14px] leading-7 text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Search */}
          <div className="w-full lg:max-w-sm">
            <label htmlFor="product-search" className="sr-only">
              Cari produk
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
                placeholder="Cari produk..."
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-[14px] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Result info */}
        <div className="mt-8 flex items-center justify-between border-b border-border pb-4">
          <p className="text-[14px] text-muted-foreground">
            Menampilkan{" "}
            <span className="font-semibold text-foreground">
              {filteredProducts.length}
            </span>{" "}
            produk
          </p>

          {search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="text-[13px] font-semibold text-brand-secondary transition-colors hover:text-brand-dark"
            >
              Hapus pencarian
            </button>
          )}
        </div>

        {/* Product Grid */}
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
          <div className="mt-8 rounded-[24px] border border-border bg-card px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-brand-secondary">
              <Search className="size-6" aria-hidden="true" />
            </div>

            <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
              Produk tidak ditemukan
            </h3>

            <p className="mx-auto mt-2 max-w-md text-[14px] leading-7 text-muted-foreground">
              Tidak ada produk yang sesuai dengan pencarian{" "}
              <span className="font-medium text-foreground">
                &quot;{search}&quot;
              </span>
              .
            </p>

            <button
              type="button"
              onClick={() => handleSearch("")}
              className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-95"
            >
              Lihat Semua Produk
            </button>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}