"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Waves } from "lucide-react";

type SliderImage = {
  src: string;
  alt: string;
  title: string;
  category: string;
};

export function ImageAutoSlider({ className }: { className?: string }) {
  const t = useTranslations("Home.imageSlider");
  const locale = useLocale();

  const images: SliderImage[] = [
    {
      src: "/img/produk3.png",
      alt: t("items.technology.alt"),
      title: t("items.technology.title"),
      category: t("items.technology.category"),
    },
    {
      src: "/img/slider/implementasi-lapangan.jpg",
      alt: t("items.implementation.alt"),
      title: t("items.implementation.title"),
      category: t("items.implementation.category"),
    },
    {
      src: "/img/slider/mendampingi.jpg",
      alt: t("items.farmers.alt"),
      title: t("items.farmers.title"),
      category: t("items.farmers.category"),
    },
    {
      src: "/img/slider/tim-crustea.webp",
      alt: t("items.collaboration.alt"),
      title: t("items.collaboration.title"),
      category: t("items.collaboration.category"),
    },
    {
      src: "/img/slider/pencapaian.webp",
      alt: t("items.innovation.alt"),
      title: t("items.innovation.title"),
      category: t("items.innovation.category"),
    },
    {
      src: "/img/awards3.png",
      alt: t("items.impact.alt"),
      title: t("items.impact.title"),
      category: t("items.impact.category"),
    },
  ];

  const repeatedImages = [...images, ...images];

  return (
    <section
      aria-labelledby="story-slider-title"
      className={cn(
        "relative overflow-hidden bg-muted py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      {/* SECTION HEADER */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
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
            id="story-slider-title"
            className="max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            {locale === "en" ? (
              <>
                {t("titleBefore")}
                <br />
                <span className="text-primary">{t("titleHighlight")}</span>
              </>
            ) : (
              <>
                {t("titleBefore")}{" "}
                <span className="text-primary">{t("titleHighlight")}</span>
              </>
            )}
          </h2>
        </div>
      </div>

      {/* AUTO SLIDER */}
      <div
        className="relative mt-10 overflow-hidden"
        aria-label={t("galleryLabel")}
      >
        {/* Left Fade */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-muted to-transparent sm:w-24"
          aria-hidden="true"
        />

        {/* Right Fade */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-muted to-transparent sm:w-24"
          aria-hidden="true"
        />

        {/* Track */}
        <div className="story-slider-track flex w-max gap-5 py-2 sm:gap-6">
          {repeatedImages.map((image, index) => {
            const isDuplicate = index >= images.length;

            return (
              <figure
                key={`${image.src}-${index}`}
                aria-hidden={isDuplicate}
                className="group relative aspect-[16/10] w-[78vw] max-w-[380px] shrink-0 overflow-hidden rounded-[22px] bg-background sm:w-[42vw] lg:w-[28vw]"
              >
                <img
                  src={image.src}
                  alt={isDuplicate ? "" : image.alt}
                  loading="lazy"
                  width={1200}
                  height={750}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                  aria-hidden="true"
                />

                {/* Caption */}
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="mb-2 inline-flex rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                    {image.category}
                  </span>

                  <p className="font-display text-md font-semibold leading-tight text-white sm:text-xl">
                    {image.title}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
