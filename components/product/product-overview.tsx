"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Code2, Cpu, Package, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

type ApiProductImage = {
  id?: number | string;
  product_id?: number | string;
  file_url?: string;
  image?: string;
  image_url?: string;
  url?: string;
  path?: string;
  is_primary?: boolean;
  sort_order?: number;
};

type ApiProduct = {
  id: number | string;
  category_id?: number | string;
  category?:
    | string
    | {
        id?: number | string;
        slug?: string;
        name_idn?: string;
        name_en?: string;
      };
  category_slug?: string;
  category_name_idn?: string;
  category_name_en?: string;
  slug: string;
  name_idn?: string;
  name_en?: string;
  name?: string;
  description_idn?: string;
  description_en?: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  images?: ApiProductImage[];
  status?: string;
  is_active?: boolean;
  created_at?: string;
};

type ApiResponse<T> = {
  data?: T | { products?: T; data?: T };
  products?: T;
  items?: T;
};

type Product = {
  id: string;
  slug: string;
  categoryKey: string;
  categoryId?: string;
  name: string;
  description: string;
  image: string;
  createdAt?: string;
};

const categoryConfig = [
  {
    key: "hardware",
    titleKey: "categories.hardware.title",
    shortTitleKey: "categories.hardware.shortTitle",
    descriptionKey: "categories.hardware.description",
    href: "/produk/hardware-teknologi",
    number: "01",
    icon: Cpu,
  },
  {
    key: "software",
    titleKey: "categories.software.title",
    shortTitleKey: "categories.software.shortTitle",
    descriptionKey: "categories.software.description",
    href: "/produk/software",
    number: "02",
    icon: Code2,
  },
  {
    key: "processed_product",
    titleKey: "categories.processedProduct.title",
    shortTitleKey: "categories.processedProduct.shortTitle",
    descriptionKey: "categories.processedProduct.description",
    href: "/produk/produk-olahan",
    number: "03",
    icon: Package,
  },
] as const;

function unwrapProducts(response: unknown): ApiProduct[] {
  if (Array.isArray(response)) {
    return response as ApiProduct[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as ApiResponse<ApiProduct[]>;

  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (
    result.data &&
    typeof result.data === "object" &&
    "products" in result.data &&
    Array.isArray(result.data.products)
  ) {
    return result.data.products;
  }

  if (
    result.data &&
    typeof result.data === "object" &&
    "data" in result.data &&
    Array.isArray(result.data.data)
  ) {
    return result.data.data;
  }

  if (Array.isArray(result.products)) {
    return result.products;
  }

  if (Array.isArray(result.items)) {
    return result.items;
  }

  return [];
}

function getImageUrl(path?: string | null): string {
  if (!path) return "";

  const value = path.trim();

  if (/^(https?:)?\/\//i.test(value)) {
    return value.startsWith("//")
      ? `${API_BASE.startsWith("https://") ? "https:" : "http:"}${value}`
      : value;
  }

  return `${API_BASE}/${value.replace(/^\/+/, "")}`;
}

function getCategoryKey(product: ApiProduct): string {
  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.slug ||
        product.category?.name_idn ||
        product.category?.name_en ||
        "";

  const value = (product.category_slug || category || "")
    .toLowerCase()
    .trim()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");

  if (value.includes("hardware") || value.includes("perangkat_keras")) {
    return "hardware";
  }

  if (value.includes("software") || value.includes("perangkat_lunak")) {
    return "software";
  }

  if (
    value.includes("processed_product") ||
    value.includes("produk_olahan") ||
    value.includes("processed")
  ) {
    return "processed_product";
  }

  return "";
}

function getProductImage(product: ApiProduct): string {
  const primaryImage = product.images?.find((item) => item.is_primary);
  const firstImage = primaryImage || product.images?.[0];

  return getImageUrl(
    firstImage?.file_url ||
      firstImage?.image_url ||
      firstImage?.image ||
      firstImage?.url ||
      firstImage?.path ||
      product.image ||
      product.thumbnail,
  );
}

function mapProduct(product: ApiProduct, locale: string): Product {
  return {
    id: String(product.id),
    slug: product.slug,
    categoryKey: getCategoryKey(product),
    categoryId:
      product.category_id != null
        ? String(product.category_id)
        : typeof product.category === "object" && product.category?.id != null
          ? String(product.category.id)
          : undefined,
    name:
      locale === "en"
        ? product.name_en || product.name || product.name_idn || ""
        : product.name_idn || product.name || product.name_en || "",
    description:
      locale === "en"
        ? product.description_en ||
          product.description ||
          product.description_idn ||
          ""
        : product.description_idn ||
          product.description ||
          product.description_en ||
          "",
    image: getProductImage(product),
    createdAt: product.created_at,
  };
}

export default function ProductOverview() {
  const t = useTranslations("Product.overview");
  const locale = useLocale();

  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
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
          throw new Error(`Gagal mengambil produk: ${response.status}`);
        }

        const result: unknown = await response.json();
        const products = unwrapProducts(result);

        if (!controller.signal.aborted) {
          setApiProducts(products);
          setError(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Gagal mengambil produk Crustea:", err);

        if (!controller.signal.aborted) {
          setError(true);
          setApiProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  const products = useMemo(
    () =>
      apiProducts
        .filter((product) => {
          if (product.is_active === false) return false;

          if (product.status) {
            return product.status.toLowerCase() === "published";
          }

          return true;
        })
        .map((product) => mapProduct(product, locale))
        .filter((product) => product.slug && product.name),
    [apiProducts, locale],
  );

  const productCategories = useMemo(
    () =>
      categoryConfig.map((config) => ({
        ...config,
        title: t(config.titleKey),
        shortTitle: t(config.shortTitleKey),
        description: t(config.descriptionKey),
        products: products.filter(
          (product) => product.categoryKey === config.key,
        ),
      })),
    [products, t],
  );

  const featuredProduct = productCategories
    .flatMap((category) =>
      category.products.map((product) => ({
        ...product,
        categoryHref: category.href,
        categoryTitle: category.title,
      })),
    )
    .find((product) => product.categoryKey === "hardware");

  return (
    <section className="relative overflow-hidden bg-background">
      {/* BACKGROUND DECORATION */}
      <div
        className="pointer-events-none absolute left-[-240px] top-[520px] size-[520px] rounded-full bg-secondary/40 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[-260px] top-[1500px] size-[560px] rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      {/* INTRO */}
      <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:pt-18 lg:px-8 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              <Sparkles className="size-3.5" />
              {t("eyebrow")}
            </span>

            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-5xl">
              {t("heading")}{" "}
              <span className="text-primary">{t("headingHighlight")}</span>
            </h2>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t("categoryCount")}
              </p>

              <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                {
                  productCategories.filter(
                    (category) => category.products.length > 0,
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <div className="relative mx-auto max-w-7xl px-5 pt-10 lg:px-8 lg:pt-12">
        <div className="overflow-x-auto pb-2">
          <nav
            aria-label={t("categoryNavigation")}
            className="flex min-w-max items-center gap-2"
          >
            <a
              href="#produk"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95"
            >
              {t("allProducts")}
            </a>

            {productCategories.map((category) => (
              <a
                key={category.key}
                href={`#${category.key.replaceAll("_", "-")}`}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-secondary hover:text-brand-dark"
              >
                {category.shortTitle}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* FEATURED PRODUCT */}
      <div
        id="produk"
        className="relative mx-auto max-w-7xl scroll-mt-24 px-5 pt-12 lg:px-8 lg:pt-16"
      >
        {featuredProduct && (
          <div className="group relative overflow-hidden rounded-[32px] bg-brand-dark shadow-[0_24px_70px_-30px_rgba(5,84,106,0.45)] ring-1 ring-black/5">
            <div
              className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-40 left-[35%] size-[420px] rounded-full bg-brand-secondary/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative isolate min-h-[360px] overflow-hidden rounded-[24px] border border-[#DCE7E8] bg-[#F5F8F7] shadow-[0_16px_45px_-28px_rgba(0,65,75,0.24)] sm:min-h-[420px] lg:min-h-[460px] xl:min-h-[480px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-[center_58%] bg-no-repeat"
                style={{
                  backgroundImage: "url('/img/banner-product.png')",
                }}
              />

              <div className="relative z-10 flex min-h-[360px] items-center px-6 py-10 sm:min-h-[420px] sm:px-10 sm:py-12 lg:min-h-[460px] lg:px-12 xl:min-h-[480px] xl:px-16">
                <div className="max-w-[520px]">
                  <div className="mb-5">
                    <span className="text-xs font-medium tracking-wide text-[#08556B] sm:text-sm">
                      {featuredProduct.categoryTitle}
                    </span>

                    <div className="mt-2 h-[2px] w-16 bg-primary" />
                  </div>

                  <h3 className="max-w-lg font-display text-4xl font-semibold leading-[1.06] tracking-tight text-[#08556B] sm:text-5xl xl:text-[3.5rem]">
                    {featuredProduct.name}
                  </h3>

                  <p
                    className="mt-5 max-w-md text-sm leading-6 text-[#08556B] sm:text-[15px] sm:leading-7"
                    style={{
                      textShadow: "0 1px 3px rgba(255, 255, 255, 0.85)",
                    }}
                  >
                    {featuredProduct.description.split(/(?<=[.!?])\s+/)[0]}
                  </p>

                  <div className="mt-7">
                    <Button
                      asChild
                      size="lg"
                      className="group/featured h-12 rounded-lg bg-primary px-6 font-semibold text-brand-dark shadow-none transition-colors duration-300 hover:bg-primary/90"
                    >
                      <Link
                        href={`${featuredProduct.categoryHref}/${featuredProduct.slug}`}
                      >
                        {t("viewProduct")}
                        <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/featured:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !featuredProduct && (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t("noFeaturedProduct")}
          </div>
        )}
      </div>

      {/* PRODUCT CATEGORIES */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {t("loading")}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("loadError")}</p>

            <Button className="mt-4" onClick={() => window.location.reload()}>
              {t("retry")}
            </Button>
          </div>
        ) : (
          <div className="space-y-24 lg:space-y-32">
            {productCategories.map((category) => {
              const Icon = category.icon;

              return (
                <section
                  key={category.key}
                  id={category.key.replaceAll("_", "-")}
                  className="scroll-mt-24"
                >
                  {/* Category Heading */}
                  <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="max-w-3xl">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm font-semibold text-primary">
                          {category.number}
                        </span>

                        <div className="h-px w-8 bg-border" />

                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
                          {t("collection")}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-dark">
                          <Icon className="size-5" strokeWidth={1.8} />
                        </div>

                        <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                          {category.title}
                        </h3>
                      </div>

                      <p className="mt-4 max-w-2xl text-[14px] leading-7 text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    <Link
                      href={category.href}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-secondary"
                    >
                      {t("viewAll")}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* Product Grid */}
                  {category.products.length > 0 ? (
                    <div
                      className={
                        category.key === "software"
                          ? "grid gap-5 sm:grid-cols-2"
                          : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                      }
                    >
                      {category.products.map((product) => {
                        const detailHref = `${category.href}/${product.slug}`;

                        return (
                          <article
                            key={product.id}
                            className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                          >
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
                                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                    {t("noImage")}
                                  </div>
                                )}
                              </div>
                            </Link>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-5 sm:p-6">
                              <h4 className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                                {product.name}
                              </h4>

                              <p className="mt-3 line-clamp-3 text-[14px] leading-[22px] text-muted-foreground">
                                {product.description}
                              </p>

                              {/* Detail Button */}
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
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                      {t("emptyCategory")}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
