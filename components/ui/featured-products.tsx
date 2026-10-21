"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const MAX_DESCRIPTION_LENGTH = 150;

type ProductImage = {
  file_url?: string;
  image_url?: string;
  image?: string;
  url?: string;
  path?: string;
};

type ApiProduct = {
  id: number | string;
  slug: string;
  category?:
    | string
    | {
        slug?: string;
        name_idn?: string;
        name_en?: string;
      };
  category_slug?: string;
  category_name_idn?: string;
  category_name_en?: string;
  name_idn?: string;
  name_en?: string;
  name?: string;
  description_idn?: string;
  description_en?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  images?: ProductImage[];
  created_at?: string;
  is_active?: boolean;
  status?: string;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

type ApiResponse = {
  data?:
    | ApiProduct[]
    | {
        products?: ApiProduct[];
        data?: ApiProduct[];
      };
  products?: ApiProduct[];
  items?: ApiProduct[];
};

const CATEGORY_ROUTES: Record<string, string> = {
  technology: "/produk/teknologi-budidaya",
  teknologi: "/produk/teknologi-budidaya",
  teknologi_budidaya: "/produk/teknologi-budidaya",
  technology_cultivation: "/produk/teknologi-budidaya",
  hardware: "/produk/teknologi-budidaya",
  krasty: "/produk/krasty-trading",
  trading: "/produk/krasty-trading",
  software: "/produk/krasty-trading",
  processed_product: "/produk/krasty-trading",
};

function unwrapProducts(response: unknown): ApiProduct[] {
  if (Array.isArray(response)) {
    return response as ApiProduct[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as ApiResponse;

  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (result.data && !Array.isArray(result.data)) {
    if (Array.isArray(result.data.products)) {
      return result.data.products;
    }

    if (Array.isArray(result.data.data)) {
      return result.data.data;
    }
  }

  if (Array.isArray(result.products)) {
    return result.products;
  }

  if (Array.isArray(result.items)) {
    return result.items;
  }

  return [];
}

function normalizeCategory(value: string): string {
  return value.toLowerCase().trim().replaceAll("-", "_").replaceAll(" ", "_");
}

function getCategory(product: ApiProduct): string {
  const categoryValue =
    typeof product.category === "string"
      ? product.category
      : product.category?.slug ||
        product.category?.name_idn ||
        product.category?.name_en ||
        product.category_name_idn ||
        product.category_name_en ||
        "";

  const value = normalizeCategory(product.category_slug || categoryValue);

  if (
    value.includes("technology") ||
    value.includes("teknologi") ||
    value.includes("cultivation") ||
    value === "hardware"
  ) {
    return "technology";
  }

  if (value.includes("krasty")) {
    return "krasty";
  }

  if (
    value.includes("trading") ||
    value.includes("software") ||
    value.includes("processed_product") ||
    value.includes("produk_olahan")
  ) {
    return "trading";
  }

  return value;
}

function getImageUrl(path?: string): string {
  if (!path) return "";

  const value = path.trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return `${API_BASE}/${value.replace(/^\/+/, "")}`;
}

function getFirstImage(product: ApiProduct): string {
  const firstImage = product.images?.[0];

  const imagePath =
    firstImage?.file_url ||
    firstImage?.image_url ||
    firstImage?.image ||
    firstImage?.url ||
    firstImage?.path ||
    product.image ||
    product.thumbnail ||
    "";

  return getImageUrl(imagePath);
}

function sortOldestFirst(products: ApiProduct[]): ApiProduct[] {
  return [...products].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : Number.NaN;

    const dateB = b.created_at ? new Date(b.created_at).getTime() : Number.NaN;

    const validA = Number.isFinite(dateA);
    const validB = Number.isFinite(dateB);

    if (validA && validB && dateA !== dateB) {
      return dateA - dateB;
    }

    const idA = Number(a.id);
    const idB = Number(b.id);

    if (Number.isFinite(idA) && Number.isFinite(idB) && idA !== idB) {
      return idA - idB;
    }

    if (validA !== validB) {
      return validA ? -1 : 1;
    }

    return 0;
  });
}

function truncateDescription(description: string): string {
  const normalized = description.trim();

  if (normalized.length <= MAX_DESCRIPTION_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`;
}

function mapProduct(product: ApiProduct, locale: string): Product {
  const category = getCategory(product);
  const basePath = CATEGORY_ROUTES[category] || "/produk";

  const name =
    (locale === "en"
      ? product.name_en || product.name || product.name_idn
      : product.name_idn || product.name || product.name_en) || "";

  const description =
    (locale === "en"
      ? product.description_en || product.description || product.description_idn
      : product.description_idn ||
        product.description ||
        product.description_en) || "";

  return {
    id: String(product.id),
    slug: product.slug,
    name,
    description: truncateDescription(description),
    image: getFirstImage(product),
    href: `${basePath}/${product.slug}`,
  };
}

export default function FeaturedProducts() {
  const t = useTranslations("Home.featuredProducts");
  const locale = useLocale();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchProducts() {
      setLoading(true);
      setError(false);

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
          throw new Error(`Gagal mengambil produk (${response.status}).`);
        }

        const result: unknown = await response.json();
        const allProducts = unwrapProducts(result);

        const availableProducts = allProducts.filter((product) => {
          if (product.is_active === false) return false;

          if (product.status && product.status.toLowerCase() !== "published") {
            return false;
          }

          return Boolean(product.slug);
        });

        const oldestThree = sortOldestFirst(availableProducts)
          .slice(0, 3)
          .map((product) => mapProduct(product, locale));

        if (!active) return;

        setProducts(oldestThree);
      } catch (err) {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }

        console.error("Gagal mengambil featured products:", err);
        setProducts([]);
        setError(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [locale, retryKey]);

  return (
    <section
      aria-labelledby="featured-products-title"
      className="relative overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* HEADER */}
        <header>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                <Waves
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {t("eyebrow")}
              </p>

              <h2
                id="featured-products-title"
                className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
              >
                {t("titleBefore")}{" "}
                <span className="text-primary">{t("titleHighlight")}</span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
                {t("description")}
              </p>
            </div>

            <div className="shrink-0 lg:pb-1">
              <Button size="lg" variant="outline" asChild className="group">
                <Link href="/produk">
                  {t("viewAllProducts")}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* PRODUCT GRID */}
        <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-border bg-muted"
              >
                <div className="aspect-[4/3] animate-pulse bg-muted-foreground/10" />
                <div className="space-y-3 p-6">
                  <div className="h-6 w-2/3 animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted-foreground/10" />
                  <div className="h-10 animate-pulse rounded-lg bg-muted-foreground/10" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Produk belum dapat dimuat. Silakan coba kembali.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => setRetryKey((value) => value + 1)}
              >
                Coba Lagi
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada produk yang tersedia.
              </p>
            </div>
          ) : (
            products.map((product, index) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-muted transition-transform duration-300 hover:-translate-y-1"
              >
                {/* PRODUCT IMAGE */}
                <Link
                  href={product.href}
                  aria-label={`${t("viewDetails")}: ${product.name}`}
                  className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-white"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      width={1200}
                      height={900}
                      loading="lazy"
                      className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      {t("noImage")}
                    </div>
                  )}

                  <span
                    className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-border bg-white/90 text-xs font-bold text-brand-dark shadow-sm backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>

                {/* PRODUCT NAME, DESCRIPTION, AND DETAIL BUTTON */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-6">
                    <Button asChild className="group/detail flex w-full">
                      <Link href={product.href}>
                        {t("viewDetails")}
                        <ArrowRight className="transition-transform duration-300 group-hover/detail:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
