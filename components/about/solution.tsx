"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const PRODUCTS_LIMIT = 3;
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
  category?: string | { slug?: string } | null;
  category_slug?: string;
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

type SolutionProduct = {
  id: string;
  number: string;
  name: string;
  description: string;
  image: string;
  href: string;
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

function getCategorySlug(product: ApiProduct): string {
  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.slug || "";

  return (product.category_slug || category)
    .toLowerCase()
    .trim()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
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

function getProductImage(product: ApiProduct): string {
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

function truncateDescription(description: string): string {
  const normalized = description.trim();

  if (normalized.length <= MAX_DESCRIPTION_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`;
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

function mapProduct(
  product: ApiProduct,
  index: number,
  locale: string,
): SolutionProduct {
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
    number: String(index + 1).padStart(2, "0"),
    name,
    description: truncateDescription(description),
    image: getProductImage(product),
    href: `/produk/teknologi-budidaya/${product.slug}`,
  };
}

export default function Solution() {
  const t = useTranslations("About.solution");
  const locale = useLocale();

  const [products, setProducts] = useState<SolutionProduct[]>([]);
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

        const payload: unknown = await response.json();
        const allProducts = unwrapProducts(payload);

        const technologyProducts = allProducts.filter((product) => {
          if (product.is_active === false) {
            return false;
          }

          if (product.status && product.status.toLowerCase() !== "published") {
            return false;
          }

          return (
            getCategorySlug(product) === "technology" &&
            Boolean(product.slug) &&
            Boolean(product.name_idn || product.name_en || product.name)
          );
        });

        const oldestProducts = sortOldestFirst(technologyProducts)
          .slice(0, PRODUCTS_LIMIT)
          .map((product, index) => mapProduct(product, index, locale));

        if (!active) return;

        setProducts(oldestProducts);
      } catch (err) {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }

        console.error("Gagal mengambil produk kategori technology:", err);

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
      aria-labelledby="solution-title"
      className="relative overflow-hidden bg-background"
    >
      {/* DECORATIVE BACKGROUND */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-secondary/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-accent/50 blur-3xl"
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* HEADER */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t("eyebrow")}
          </p>

          <h2
            id="solution-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            {t("titleBefore")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </header>

        {/* TECHNOLOGY PRODUCT CARDS */}
        <div className="mt-12 grid items-stretch gap-5 lg:mt-14 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: PRODUCTS_LIMIT }, (_, index) => (
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
                {t("errorDescription")}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => setRetryKey((value) => value + 1)}
              >
                {t("retryLabel")}
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t("emptyDescription")}
              </p>
            </div>
          ) : (
            products.map((product) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-muted transition-transform duration-300 hover:-translate-y-1"
              >
                {/* PRODUCT IMAGE */}
                <Link
                  href={product.href}
                  aria-label={`${t("linkLabel")}: ${product.name}`}
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
                    {product.number}
                  </span>
                </Link>

                {/* PRODUCT CONTENT */}
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
                        {t("linkLabel")}
                        <ArrowRight className="transition-transform duration-300 group-hover/detail:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* KEY ADVANTAGES */}
        <div className="mt-12 border-y border-border">
          <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr]">
            {/* ADVANTAGE 01 */}
            <div className="flex items-center py-7 text-center lg:py-8 lg:text-left">
              <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                  {t("advantages.productionLabel")}
                </p>

                <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                  <span className="text-primary">
                    {t("advantages.productionValue")}
                  </span>{" "}
                  <br className="sm:hidden" />
                  {t("advantages.productionDescription")}
                </p>
              </div>
            </div>

            {/* CENTER */}
            <div className="hidden items-center border-x border-border px-8 lg:flex">
              <div className="flex items-center gap-3">
                <ArrowUpRight
                  className="size-4 rotate-[-135deg] text-brand-secondary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">
                  {t("advantages.centerLabel")}
                </span>

                <ArrowUpRight
                  className="size-4 rotate-45 text-brand-secondary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* ADVANTAGE 02 */}
            <div className="border-t border-border py-7 text-center lg:border-t-0 lg:py-8 lg:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                {t("advantages.efficiencyLabel")}
              </p>

              <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                <span className="text-primary">
                  {t("advantages.efficiencyValue")}
                </span>{" "}
                <br className="sm:hidden" />
                {t("advantages.efficiencyDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
