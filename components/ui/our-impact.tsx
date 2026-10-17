"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight, Leaf, Waves } from "lucide-react";

type ImpactMetric = {
  value: string;
  label: string;
  description: string;
};

type SDG = {
  src: string;
  alt: string;
};

export default function OurImpact() {
  const t = useTranslations("Home.ourImpact");

  const impactMetrics: ImpactMetric[] = [
    {
      value: "200%",
      label: t("metrics.shrimp.label"),
      description: t("metrics.shrimp.description"),
    },
    {
      value: "80%",
      label: t("metrics.costs.label"),
      description: t("metrics.costs.description"),
    },
    {
      value: "23k",
      label: t("metrics.emissions.label"),
      description: t("metrics.emissions.description"),
    },
    {
      value: "60%",
      label: t("metrics.women.label"),
      description: t("metrics.women.description"),
    },
  ];

  const sdgs: SDG[] = [
    {
      src: "/img/sdg/SDGs-1.webp",
      alt: t("sdgs.items.noPoverty"),
    },
    {
      src: "/img/sdg/SDGs-2.webp",
      alt: t("sdgs.items.zeroHunger"),
    },
    {
      src: "/img/sdg/SDGs-7.webp",
      alt: t("sdgs.items.cleanEnergy"),
    },
    {
      src: "/img/sdg/SDGs-13.webp",
      alt: t("sdgs.items.climateAction"),
    },
    {
      src: "/img/sdg/SDGs-14.webp",
      alt: t("sdgs.items.lifeBelowWater"),
    },
  ];

  return (
    <section
      aria-labelledby="our-impact-title"
      className="relative overflow-hidden bg-secondary"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-white/60 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* Header */}
        <header className="max-w-3xl">
          <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t("eyebrow")}
          </p>

          <h2
            id="our-impact-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            {t("titleBefore")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </header>

        {/* SDGs */}
        <div className="mt-12 rounded-[24px] border border-border bg-background/80 p-6 sm:p-7 lg:mt-14 lg:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* SDG intro */}
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                  <Leaf
                    className="size-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                    {t("sdgs.eyebrow")}
                  </p>

                  <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                    {t("sdgs.title")}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {t("sdgs.description")}
              </p>
            </div>

            {/* SDG images */}
            <div
              className="flex flex-wrap items-center gap-3 lg:justify-end"
              aria-label={t("sdgs.galleryLabel")}
            >
              {sdgs.map((sdg) => (
                <div
                  key={sdg.src}
                  className="group overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-sm"
                >
                  <img
                    src={sdg.src}
                    alt={sdg.alt}
                    loading="lazy"
                    className="size-16 object-cover transition-transform duration-300 group-hover:scale-105 sm:size-[72px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact metrics */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric) => (
            <article
              key={metric.value + metric.label}
              className="group relative overflow-hidden rounded-[20px] border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg hover:shadow-brand-dark/5 sm:p-7"
            >
              <p className="font-display text-4xl font-semibold leading-none tracking-tight text-brand-dark sm:text-5xl">
                {metric.value}
              </p>

              <h3 className="mt-4 max-w-[15rem] font-display text-lg font-semibold leading-tight text-foreground">
                {metric.label}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {metric.description}
              </p>

              <ArrowUpRight
                className="absolute right-6 top-6 size-4 text-brand-secondary/0 transition-all duration-300 group-hover:text-brand-secondary sm:right-7 sm:top-7"
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* Note */}
        <p className="mt-5 text-xs leading-5 text-muted-foreground/70">
          {t("note")}
        </p>
      </div>
    </section>
  );
}