import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Cpu,
  Package,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const productCategories = [
  {
    title: "Hardware Teknologi",
    shortTitle: "Hardware",
    description:
      "Teknologi perangkat untuk mendukung kebutuhan operasional dan budidaya akuakultur.",
    icon: Cpu,
    href: "/produk/hardware-teknologi",
    number: "01",
    products: [
      {
        name: "Eco-Aerator",
        description:
          "Teknologi aerasi dengan solar panel dan impeller yang dirancang untuk menghasilkan gelembung lebih kecil dan meningkatkan kadar oksigen.",
        image: "/img/eco-aerator.webp",
        slug: "eco-aerator",
        highlights: ["Solar Panel", "Impeller", "Efisiensi Aerasi"],
      },
      {
        name: "Smart Energy",
        description:
          "Solusi untuk memantau dan mengontrol penggunaan energi aerator secara lebih mudah melalui perangkat seluler.",
        image: "/img/smart-energy.webp",
        slug: "smart-energy",
        highlights: ["Monitor Energi", "Kontrol Jarak Jauh", "Via Smartphone"],
      },
      {
        name: "Aerator Mini",
        description:
          "Perangkat aerasi berukuran ringkas yang dirancang untuk membantu meningkatkan kadar oksigen dan mendukung kebutuhan aerasi pada budidaya akuakultur.",
        image: "/img/aerator-mini.png",
        slug: "aerator-mini",
        highlights: ["Aerasi", "Ukuran Ringkas", "Efisiensi"],
      },
    ],
  },
  {
    title: "Software",
    shortTitle: "Software",
    description:
      "Solusi perangkat lunak untuk membantu digitalisasi, pemantauan, dan pengelolaan aktivitas akuakultur.",
    icon: Code2,
    href: "/produk/software",
    number: "02",
    products: [
      {
        name: "EBII System",
        description:
          "Sistem pemantauan kualitas air untuk membantu memahami kondisi tambak melalui berbagai parameter utama.",
        image: "/img/ebii-system.webp",
        slug: "ebii-system",
        highlights: ["pH", "DO", "Salinitas"],
      },
      {
        name: "Crustea AIO",
        description:
          "Solusi digital terintegrasi untuk membantu memantau, mengelola, dan mengoptimalkan aktivitas budidaya.",
        image: "/img/crustea-aio.webp",
        slug: "crustea-aio",
        highlights: ["Monitoring", "Digitalisasi", "Management"],
      },
    ],
  },
  {
    title: "Produk Olahan",
    shortTitle: "Produk Olahan",
    description:
      "Produk olahan hasil perikanan yang dikembangkan untuk menghadirkan nilai tambah.",
    icon: Package,
    href: "/produk/produk-olahan",
    number: "03",
    products: [
      {
        name: "Krasty",
        description:
          "Produk olahan hasil perikanan yang dikembangkan untuk menghadirkan produk bernilai tambah dengan cita rasa yang khas.",
        image: "/img/krasty.webp",
        slug: "krasty",
        highlights: ["Produk Olahan", "Hasil Perikanan"],
      },
    ],
  },
];

const featuredProduct = productCategories[0].products[0];

export default function ProductOverview() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}
      <div
        className="pointer-events-none absolute left-[-240px] top-[520px] size-[520px] rounded-full bg-secondary/40 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-[-260px] top-[1500px] size-[560px] rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      {/* =========================================================
          INTRO
      ========================================================= */}
      <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:pt-18 lg:px-8 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              <Sparkles className="size-3.5" />
              Produk Crustea
            </span>

            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-5xl">
              Temukan solusi untuk kebutuhan{" "}
              <span className="text-primary">akuakultur.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              Dari teknologi perangkat hingga solusi digital dan produk olahan,
              jelajahi berbagai produk yang dikembangkan Crustea untuk mendukung
              ekosistem akuakultur.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Kategori Produk
              </p>

              <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                {productCategories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CATEGORY NAVIGATION
      ========================================================= */}
      <div className="relative mx-auto max-w-7xl px-5 pt-10 lg:px-8 lg:pt-12">
        <div className="overflow-x-auto pb-2">
          <nav
            aria-label="Kategori produk"
            className="flex min-w-max items-center gap-2"
          >
            <a
              href="#produk"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95"
            >
              Semua Produk
            </a>

            {productCategories.map((category) => (
              <a
                key={category.title}
                href={`#${category.shortTitle
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-secondary hover:text-brand-dark"
              >
                {category.shortTitle}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* =========================================================
    FEATURED PRODUCT
========================================================= */}
      <div
        id="produk"
        className="relative mx-auto max-w-7xl scroll-mt-24 px-5 pt-12 lg:px-8 lg:pt-16"
      >
        <div className="group relative overflow-hidden rounded-[32px] bg-brand-dark shadow-[0_24px_70px_-30px_rgba(5,84,106,0.45)] ring-1 ring-black/5">
          {/* =====================================================
        BACKGROUND DECORATION
    ===================================================== */}
          <div
            className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-40 left-[35%] size-[420px] rounded-full bg-brand-secondary/10 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-[-120px] top-[-120px] size-[300px] rounded-full border border-white/5"
            aria-hidden="true"
          />

          {/* =====================================================
        PRODUCT BANNER
    ===================================================== */}
          <div className="relative grid min-h-[460px] lg:min-h-[500px] lg:grid-cols-[0.85fr_1.15fr]">
            {/* ===================================================
          CONTENT
      =================================================== */}
            <div className="relative z-20 flex flex-col justify-center p-7 sm:p-10 lg:p-14 xl:p-16">
              {/* Category / Featured */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-primary px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark shadow-sm">
                  Featured Product
                </span>

                <span className="text-xs font-medium text-white/45">
                  {productCategories[0].title}
                </span>
              </div>

              {/* Product Number */}
              <div className="mt-7 flex items-center gap-3">
                <span className="font-display text-xs font-semibold tracking-[0.2em] text-primary">
                  01
                </span>

                <div className="h-px w-8 bg-white/15" />

                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                  Featured Collection
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                {featuredProduct.name}
              </h3>

              {/* Description */}
              <p className="mt-5 max-w-xl text-[14px] leading-7 text-white/65 sm:text-[15px]">
                {featuredProduct.description}
              </p>

              {/* Highlights */}
              <div className="mt-6 flex flex-wrap gap-2">
                {featuredProduct.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm"
                  >
                    <Check
                      className="size-3.5 text-primary"
                      strokeWidth={2.5}
                    />

                    {highlight}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="group/featured shadow-lg shadow-black/10"
                >
                  <Link href="/produk/hardware-teknologi/eco-aerator">
                    Lihat Produk
                    <ArrowRight className="transition-transform duration-300 group-hover/featured:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* ===================================================
          IMAGE
      =================================================== */}
            <Link
              href="/produk/hardware-teknologi/eco-aerator"
              className="group/image relative min-h-[300px] overflow-hidden bg-[#E8EFF1] sm:min-h-[380px] lg:min-h-full"
            >
              {/* Image */}
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                width={1200}
                height={900}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.025]"
              />

              {/* Left blend */}
              <div
                className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-brand-dark/75 via-brand-dark/25 to-transparent"
                aria-hidden="true"
              />

              {/* Bottom blend */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-dark/20 to-transparent"
                aria-hidden="true"
              />

              {/* Soft white glow */}
              <div
                className="pointer-events-none absolute right-[-10%] top-[-20%] size-[420px] rounded-full bg-white/20 blur-3xl"
                aria-hidden="true"
              />

              {/* Image border / divider */}
              <div
                className="absolute inset-y-8 left-0 hidden w-px bg-white/10 lg:block"
                aria-hidden="true"
              />

              {/* Product Link Button */}
              <div className="absolute bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-white text-brand-dark shadow-xl ring-1 ring-black/5 transition-all duration-300 group-hover/image:translate-x-1 group-hover/image:shadow-2xl">
                <ArrowRight className="size-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          PRODUCT CATEGORIES
      ========================================================= */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="space-y-24 lg:space-y-32">
          {productCategories.map((category, categoryIndex) => {
            const Icon = category.icon;

            const sectionId = category.shortTitle
              .toLowerCase()
              .replaceAll(" ", "-");

            return (
              <section
                key={category.title}
                id={sectionId}
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
                        Koleksi Produk
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
                    Lihat Semua
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Product Grid */}
                <div
                  className={
                    categoryIndex === 1
                      ? "grid gap-5 sm:grid-cols-2"
                      : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  }
                >
                  {category.products.map((product) => {
                    const detailHref = `${category.href}/${product.slug}`;

                    return (
                      <article
                        key={product.slug}
                        className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* Image */}
                        <Link
                          href={detailHref}
                          className="relative block overflow-hidden bg-muted"
                        >
                          <div className="aspect-[4/3] w-full">
                            <img
                              src={product.image}
                              alt={product.name}
                              width={800}
                              height={600}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
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

                          {/* Highlights */}
                          {product.highlights &&
                            product.highlights.length > 0 && (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {product.highlights
                                  .slice(0, 3)
                                  .map((highlight) => (
                                    <span
                                      key={highlight}
                                      className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-brand-dark"
                                    >
                                      {highlight}
                                    </span>
                                  ))}
                              </div>
                            )}

                          {/* Button — KEEP CONSISTENT */}
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
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
