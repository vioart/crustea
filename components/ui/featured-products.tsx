"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Gauge, Leaf, Smartphone, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";

type Product = {
  number: string;
  name: string;
  category: string;
  description: string;
  image: string;
  icon: typeof Gauge;
  highlights: string[];
  href: string;
  translationKey: string;
};

type HighlightListProps = {
  highlights: string[];
  productName: string;
  label: string;
};

const products: Omit<Product, "category" | "description" | "highlights">[] = [
  {
    number: "01",
    name: "EBII System",
    image: "/img/produk/ebii.png",
    icon: Gauge,
    href: "/produk/software/ebii-system",
    translationKey: "ebiiSystem",
  },
  {
    number: "02",
    name: "Eco-Aerator",
    image: "/img/produk/eco-aerator.png",
    icon: Leaf,
    href: "/produk/hardware-teknologi/eco-aerator",
    translationKey: "ecoAerator",
  },
  {
    number: "03",
    name: "Smart Energy",
    image: "/img/produk/smart-energy.png",
    icon: Smartphone,
    href: "/produk/hardware-teknologi/smart-energy",
    translationKey: "smartEnergy",
  },
];

/* ============================================================
   HIGHLIGHT LIST
   ============================================================ */

function HighlightList({ highlights, productName, label }: HighlightListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [visibleCount, setVisibleCount] = useState(highlights.length);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const calculateVisibleItems = () => {
      const containerWidth = container.clientWidth;

      if (!containerWidth) return;

      const gap = 8;

      const itemWidths = highlights.map(
        (_, index) => measureRefs.current[index]?.offsetWidth ?? 0,
      );

      const moreWidths = highlights.map(
        (_, index) => moreMeasureRefs.current[index]?.offsetWidth ?? 0,
      );

      let totalWidth = 0;

      for (let i = 0; i < itemWidths.length; i++) {
        totalWidth += itemWidths[i];

        if (i > 0) {
          totalWidth += gap;
        }
      }

      if (totalWidth <= containerWidth) {
        setVisibleCount(highlights.length);
        return;
      }

      for (let count = highlights.length - 1; count >= 1; count--) {
        let width = 0;

        for (let i = 0; i < count; i++) {
          width += itemWidths[i];

          if (i > 0) {
            width += gap;
          }
        }

        const remaining = highlights.length - count;
        const moreWidth = moreWidths[remaining - 1] ?? 0;

        width += gap + moreWidth;

        if (width <= containerWidth) {
          setVisibleCount(count);
          return;
        }
      }

      setVisibleCount(1);
    };

    const runCalculation = () => {
      requestAnimationFrame(calculateVisibleItems);
    };

    runCalculation();

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleItems();
    });

    resizeObserver.observe(container);

    if (document.fonts?.ready) {
      document.fonts.ready.then(calculateVisibleItems);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [highlights]);

  const remaining = highlights.length - visibleCount;

  return (
    <>
      {/* HIDDEN MEASUREMENT */}
      <div
        className="pointer-events-none absolute -z-10 h-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        {highlights.map((highlight, index) => (
          <span
            key={`measure-${highlight}`}
            ref={(element) => {
              measureRefs.current[index] = element;
            }}
            className="inline-flex whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium"
          >
            {highlight}
          </span>
        ))}

        {highlights.map((_, index) => {
          const remainingCount = index + 1;

          return (
            <span
              key={`more-measure-${remainingCount}`}
              ref={(element) => {
                moreMeasureRefs.current[index] = element;
              }}
              className="inline-flex whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium"
            >
              +{remainingCount}
            </span>
          );
        })}
      </div>

      {/* VISIBLE HIGHLIGHTS */}
      <div
        ref={containerRef}
        aria-label={`${label} ${productName}`}
        className="mt-5 flex min-w-0 w-full items-center gap-2 overflow-hidden"
      >
        {highlights.slice(0, visibleCount).map((highlight) => (
          <span
            key={highlight}
            className="shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-secondary-foreground"
          >
            {highlight}
          </span>
        ))}

        {remaining > 0 && (
          <span className="shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            +{remaining}
          </span>
        )}
      </div>
    </>
  );
}

/* ============================================================
   FEATURED PRODUCTS
   ============================================================ */

export default function FeaturedProducts() {
  const t = useTranslations("Home.featuredProducts");

  const translatedProducts: Product[] = products.map((product) => ({
    ...product,
    category: t(`items.${product.translationKey}.category`),
    description: t(`items.${product.translationKey}.description`),
    highlights: t.raw(`items.${product.translationKey}.highlights`) as string[],
  }));

  return (
    <section
      aria-labelledby="featured-products-title"
      className="relative overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* SECTION HEADER */}
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

            {/* CTA */}
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

        {/* PRODUCTS */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {translatedProducts.map((product) => {
            const Icon = product.icon;

            return (
              <article
                key={product.name}
                className="group relative overflow-hidden rounded-[24px] border border-border bg-muted transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={product.image}
                    alt={`${product.name} - ${product.category}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  <span
                    className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-border bg-white/90 text-xs font-bold text-brand-dark shadow-sm backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    {product.number}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-secondary">
                    <Icon
                      className="size-4 text-primary"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {product.category}
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {product.description}
                  </p>

                  <HighlightList
                    highlights={product.highlights}
                    productName={product.name}
                    label={t("featuresLabel")}
                  />

                  {/* Detail CTA */}
                  <div className="mt-6">
                    <Button asChild className="group/detail w-full">
                      <Link href={product.href}>
                        {t("viewDetails")}
                        <ArrowRight className="transition-transform duration-300 group-hover/detail:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* KEY ADVANTAGES */}
        <div className="mt-12 border-y border-border">
          <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr]">
            {/* Advantage 01 */}
            <div className="flex items-center py-7 text-center lg:py-8 lg:text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                  {t("advantages.production.label")}
                </p>

                <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                  {t("advantages.production.line1")}{" "}
                  <span className="text-primary">
                    {t("advantages.production.highlight")}
                  </span>
                  <br className="hidden sm:block" />
                  {t("advantages.production.line2")}
                </p>
              </div>
            </div>

            {/* Center Label */}
            <div className="hidden items-center border-x border-border px-8 lg:flex">
              <div className="flex items-center gap-3">
                <ArrowRight
                  className="size-4 -rotate-180 text-brand-secondary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">
                  {t("advantages.centerLabel")}
                </span>

                <ArrowRight
                  className="size-4 text-brand-secondary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Advantage 02 */}
            <div className="border-t border-border py-7 text-center lg:border-t-0 lg:py-8 lg:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                {t("advantages.efficiency.label")}
              </p>

              <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                <span className="text-primary">
                  {t("advantages.efficiency.highlight")}
                </span>{" "}
                {t("advantages.efficiency.line1")}
                <br className="hidden sm:block" />
                {t("advantages.efficiency.line2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
