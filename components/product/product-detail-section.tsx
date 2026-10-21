
"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

const WHATSAPP_NUMBER = "6282140773592";

const CATEGORY_CONFIG = {
  technology: {
    href: "/produk/teknologi-budidaya",
    translationKey: "technology",
  },
  krasty: {
    href: "/produk/krasty",
    translationKey: "krasty",
  },
  trading: {
    href: "/produk/trading",
    translationKey: "trading",
  },
} as const;

type ProductCategoryKey = keyof typeof CATEGORY_CONFIG;

type ApiImage = {
  id: number;
  file_url: string;
};

type ApiExcellence = {
  id: number;
  title_idn?: string;
  title_en?: string;
};

type ApiSpecification = {
  id: number;
  name_idn?: string;
  name_en?: string;
  value_idn?: string;
  value_en?: string;
};

type ApiProduct = {
  id: number;
  category: string;
  slug: string;
  name_idn?: string;
  name_en?: string;
  description_idn?: string;
  description_en?: string;
  images?: ApiImage[];
  excellences?: ApiExcellence[];
  specifications?: ApiSpecification[];
};

type ApiProductDetail = {
  product?: ApiProduct;
  images?: ApiImage[];
  excellences?: ApiExcellence[];
  specifications?: ApiSpecification[];
};

type ApiResponse = {
  data?: ApiProductDetail | ApiProduct;
};

type ProductDetailData = {
  name: string;
  categoryKey: ProductCategoryKey;
  categoryHref: string;
  description: string;
  images: string[];
  highlights: string[];
  specifications: {
    label: string;
    value: string;
  }[];
};

type ProductDetailProps = {
  slug: string;
};

/**
 * Normalisasi kategori API.
 *
 * Kategori utama:
 * - technology
 * - krasty
 * - trading
 *
 * Alias kategori lama tetap didukung agar data lama
 * tidak langsung gagal ditampilkan.
 */
function getCategoryKey(
  category: string,
): ProductCategoryKey | null {
  const normalized = category
    .toLowerCase()
    .trim()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");

  const categoryAliases: Record<
    string,
    ProductCategoryKey
  > = {
    technology: "technology",
    teknologi: "technology",
    teknologi_budidaya: "technology",
    technology_cultivation: "technology",
    cultivation_technology: "technology",
    hardware: "technology",

    krasty: "krasty",

    trading: "trading",
    software: "trading",
    processed_product: "trading",
    processed: "trading",
  };

  return categoryAliases[normalized] ?? null;
}

function getImageUrl(path?: string): string {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE}/${path.replace(/^\/+/, "")}`;
}

function mapProduct(
  response: ApiResponse,
  locale: string,
): ProductDetailData | null {
  const data = response.data;

  if (!data || typeof data !== "object") {
    return null;
  }

  const isWrappedProduct = "product" in data;

  const product = isWrappedProduct
    ? data.product
    : (data as ApiProduct);

  if (!product) {
    return null;
  }

  const categoryKey = getCategoryKey(
    product.category ?? "",
  );

  if (!categoryKey) {
    console.error(
      "Kategori produk tidak dikenali:",
      product.category,
    );

    return null;
  }

  const categoryConfig = CATEGORY_CONFIG[categoryKey];
  const isEnglish = locale === "en";

  const images =
    (isWrappedProduct ? data.images : undefined) ??
    product.images ??
    [];

  const excellences =
    (isWrappedProduct ? data.excellences : undefined) ??
    product.excellences ??
    [];

  const specifications =
    (isWrappedProduct
      ? data.specifications
      : undefined) ??
    product.specifications ??
    [];

  return {
    name: isEnglish
      ? product.name_en || product.name_idn || ""
      : product.name_idn || product.name_en || "",

    categoryKey,
    categoryHref: categoryConfig.href,

    description: isEnglish
      ? product.description_en ||
        product.description_idn ||
        ""
      : product.description_idn ||
        product.description_en ||
        "",

    images: images
      .map((image) => getImageUrl(image.file_url))
      .filter(Boolean),

    highlights: excellences
      .map((item) =>
        isEnglish
          ? item.title_en || item.title_idn || ""
          : item.title_idn || item.title_en || "",
      )
      .filter(Boolean),

    specifications: specifications
      .map((item) => ({
        label: isEnglish
          ? item.name_en || item.name_idn || ""
          : item.name_idn || item.name_en || "",

        value: isEnglish
          ? item.value_en || item.value_idn || ""
          : item.value_idn || item.value_en || "",
      }))
      .filter((item) => item.label || item.value),
  };
}

export default function ProductDetail({
  slug,
}: ProductDetailProps) {
  const locale = useLocale();
  const t = useTranslations("Product.detail");

  const [product, setProduct] =
    useState<ProductDetailData | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError(false);
      setProduct(null);
      setActiveImage(0);

      try {
        const response = await fetch(
          `${API_BASE}/api/products/slug/${encodeURIComponent(
            slug,
          )}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Gagal mengambil produk: ${response.status}`,
          );
        }

        const result: ApiResponse =
          await response.json();

        const mappedProduct = mapProduct(
          result,
          locale,
        );

        if (!mappedProduct || !mappedProduct.name) {
          throw new Error(
            "Data produk tidak ditemukan atau format respons API tidak sesuai.",
          );
        }

        if (!controller.signal.aborted) {
          setProduct(mappedProduct);
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Gagal mengambil detail produk:",
          err,
        );

        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [slug, locale]);

  const whatsappMessage = encodeURIComponent(
    product
      ? t("whatsappMessage", {
          product: product.name,
        })
      : "",
  );

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center lg:px-8">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-5 text-sm text-muted-foreground">
            {t("loading")}
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center lg:px-8">
          <h1 className="font-display text-3xl font-semibold text-brand-dark">
            {t("notFoundTitle")}
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {t("notFoundDescription")}
          </p>

          <Link
            href="/produk"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-primary/90"
          >
            {t("backToProducts")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const categoryConfig =
    CATEGORY_CONFIG[product.categoryKey];

  // Menggunakan translation key dari JSON terbaru.
  const categoryLabel =
    product.categoryKey === "technology"
      ? t("categories.technology")
      : product.categoryKey === "krasty"
        ? t("categories.krasty")
        : t("categories.trading");

  const images = product.images;

  return (
    <main className="bg-background">
      {/* Breadcrumb */}
      <section className="pt-18">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <nav aria-label={t("breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-brand-secondary"
                >
                  {t("home")}
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-muted-foreground/60" />
              </li>

              <li>
                <Link
                  href={categoryConfig.href}
                  className="text-muted-foreground transition-colors hover:text-brand-secondary"
                >
                  {categoryLabel}
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-muted-foreground/60" />
              </li>

              <li
                className="font-medium text-foreground"
                aria-current="page"
              >
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Hero */}
      <section className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)] lg:gap-14">
            {/* Gallery */}
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="overflow-hidden rounded-[28px] border border-border bg-muted shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {images.length > 0 ? (
                      <img
                        src={images[activeImage]}
                        alt={product.name}
                        fetchPriority="high"
                        className="absolute inset-0 size-full object-cover transition-all duration-500"
                      />
                    ) : (
                      <div className="flex size-full min-h-64 items-center justify-center text-sm text-muted-foreground">
                        {t("noImage")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex w-20 shrink-0 flex-col gap-3 sm:w-24">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setActiveImage(index)
                      }
                      aria-label={t("viewImage", {
                        number: index + 1,
                      })}
                      aria-pressed={
                        activeImage === index
                      }
                      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted transition-all duration-300 ${
                        activeImage === index
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        loading="lazy"
                        className="absolute inset-0 size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="self-start lg:pt-2">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                {categoryLabel}
              </p>

              <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-brand-dark sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-6 h-px w-16 bg-primary" />

              <p className="mt-6 text-[15px] leading-7 text-muted-foreground">
                {product.description}
              </p>

              {/* WhatsApp CTA */}
              <div className="mt-8">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <MessageCircle className="size-5" />
                  {t("consultProduct")}
                </a>
              </div>

              <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
                {t("contactDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {product.highlights.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                {t("advantages")}
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-dark sm:text-4xl">
                {t("advantagesHeading")}
              </h2>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.highlights.map(
                (highlight, index) => (
                  <div
                    key={`${highlight}-${index}`}
                    className="flex items-start gap-4 rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
                      <Check className="size-5" />
                    </span>

                    <p className="pt-2 text-sm font-medium leading-5 text-foreground">
                      {highlight}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      {product.specifications.length > 0 && (
        <section className="bg-muted/40 py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                {t("productInformation")}
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-dark sm:text-4xl">
                {t("specifications")}
              </h2>
            </div>

            <div className="mt-10 overflow-hidden rounded-[24px] border border-border bg-card shadow-sm">
              <div className="divide-y divide-border">
                {product.specifications.map(
                  (spec, index) => (
                    <div
                      key={`${spec.label}-${index}`}
                      className="grid gap-2 px-6 py-5 sm:grid-cols-2"
                    >
                      <p className="text-sm font-medium text-muted-foreground">
                        {spec.label}
                      </p>

                      <p className="text-sm font-semibold text-brand-dark sm:text-right">
                        {spec.value}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
