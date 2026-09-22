"use client";

import Link from "next/link";
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
};

type HighlightListProps = {
  highlights: string[];
  productName: string;
};

const products: Product[] = [
  {
    number: "01",
    name: "EBII System",
    category: "Water Quality Monitoring",
    description:
      "Sistem pemantauan kualitas air dengan empat parameter utama untuk membantu pembudidaya memahami kondisi tambak.",
    image: "/img/ebii-system.webp",
    icon: Gauge,
    highlights: ["pH", "DO", "Salinitas", "Suhu"],
    href: "/produk/software/ebii-system",
  },
  {
    number: "02",
    name: "Eco-Aerator",
    category: "Renewable Energy",
    description:
      "Teknologi aerasi dengan solar panel dan impeller yang dirancang untuk menghasilkan gelembung lebih kecil dan meningkatkan kadar oksigen.",
    image: "/img/eco-aerator.webp",
    icon: Leaf,
    highlights: ["Solar Panel", "Impeller", "Efisiensi Aerasi"],
    href: "/produk/hardware-teknologi/eco-aerator",
  },
  {
    number: "03",
    name: "Smart Energy",
    category: "Energy Management",
    description:
      "Solusi untuk memantau dan mengontrol penggunaan energi aerator secara lebih mudah melalui perangkat seluler.",
    image: "/img/smart-energy.webp",
    icon: Smartphone,
    highlights: ["Monitor Energi", "Kontrol Jarak Jauh", "Via Smartphone"],
    href: "/produk/hardware-teknologi/smart-energy",
  },
];

/* ============================================================
   HIGHLIGHT LIST
   ============================================================ */

function HighlightList({ highlights, productName }: HighlightListProps) {
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

      // Coba tampilkan semua item terlebih dahulu.
      let totalWidth = 0;

      for (let i = 0; i < itemWidths.length; i++) {
        totalWidth += itemWidths[i];

        if (i > 0) {
          totalWidth += gap;
        }
      }

      // Semua item masih muat.
      if (totalWidth <= containerWidth) {
        setVisibleCount(highlights.length);
        return;
      }

      // Tidak semua item muat.
      // Cari jumlah item terbanyak yang masih muat
      // bersama badge +N.
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

      // Fallback jika bahkan satu item + +N tidak muat.
      setVisibleCount(1);
    };

    // Tunggu font selesai dimuat supaya perhitungan
    // menggunakan ukuran teks yang sebenarnya.
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
      {/* =====================================================
          HIDDEN MEASUREMENT
          Digunakan untuk mengetahui lebar setiap badge.
      ===================================================== */}
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

        {/* Ukuran untuk +1, +2, +3, dst */}
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

      {/* =====================================================
          VISIBLE HIGHLIGHTS
      ===================================================== */}
      <div
        ref={containerRef}
        aria-label={`Fitur ${productName}`}
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
  return (
    <section
      aria-labelledby="featured-products-title"
      className="relative overflow-hidden bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <header>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Heading Content */}
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                <Waves
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Solusi Akuakultur
              </p>

              {/* Heading */}
              <h2
                id="featured-products-title"
                className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
              >
                Teknologi untuk Menjawab{" "}
                <span className="text-primary">Tantangan Budidaya.</span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
                Menghadirkan solusi teknologi yang dirancang untuk membantu
                pembudidaya mengelola kualitas air, meningkatkan efisiensi
                aerasi, dan mengoptimalkan penggunaan energi di tambak.
              </p>
            </div>

            {/* CTA */}
            <div className="shrink-0 lg:pb-1">
              <Button size="lg" variant="outline" asChild className="group">
                <Link href="/produk">
                  Lihat Semua Produk
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {products.map((product) => {
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

                  {/* Number */}
                  <span
                    className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-border bg-white/90 text-xs font-bold text-brand-dark shadow-sm backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    {product.number}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-secondary">
                    <Icon
                      className="size-4 text-primary"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {product.category}
                  </div>

                  {/* Product Name */}
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {product.description}
                  </p>

                  {/* Highlights */}
                  <HighlightList
                    highlights={product.highlights}
                    productName={product.name}
                  />

                  {/* Detail CTA */}
                  <div className="mt-6">
                    <Button asChild className="group/detail w-full">
                      <Link href={product.href}>
                        Lihat Detail
                        <ArrowRight className="transition-transform duration-300 group-hover/detail:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* =====================================================
            KEY ADVANTAGES
        ===================================================== */}
        <div className="mt-12 border-y border-border">
          <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr]">
            {/* Advantage 01 */}
            <div className="flex items-center py-7 text-center lg:py-8 lg:text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                  Potensi Hasil Budidaya
                </p>

                <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                  Udang hingga{" "}
                  <span className="text-primary">200% lebih besar</span>
                  <br className="hidden sm:block" />
                  dan berkualitas lebih tinggi
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
                  Keunggulan
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
                Efisiensi Operasional
              </p>

              <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                <span className="text-primary">60–80%</span> penghematan
                <br className="hidden sm:block" />
                biaya operasional
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
