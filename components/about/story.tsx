"use client";

import { useTranslations } from "next-intl";
import { Waves } from "lucide-react";

export default function Story() {
  const t = useTranslations("About.story");

  return (
    <section
      aria-labelledby="about-story-title"
      className="relative overflow-hidden bg-background"
    >
      {/* DECORATIVE BACKGROUND */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-secondary/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/60 blur-3xl"
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* IMAGE */}
          <div className="relative">
            <div className="overflow-hidden rounded-[24px]">
              <img
                src="/img/about-us.jpg"
                alt={t("imageAlt")}
                width={1200}
                height={900}
                loading="eager"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-w-xl">
            {/* Eyebrow */}
            <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              <Waves
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden="true"
              />
              {t("eyebrow")}
            </p>

            {/* Heading */}
            <h2
              id="about-story-title"
              className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]"
            >
              {t("titleBefore")}{" "}
              <span className="text-primary">
                {t("titleHighlight")}
              </span>{" "}
              {t("titleAfter")}
            </h2>

            {/* Description */}
            <div className="mt-6 space-y-4 text-base leading-7 text-muted-foreground sm:text-[17px]">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}