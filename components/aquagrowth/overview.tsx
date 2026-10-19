"use client";

import { useTranslations } from "next-intl";
import {
  Sprout,
  TrendingUp,
  Globe2,
  ShieldCheck,
} from "lucide-react";

const objectiveIcons = [
  Sprout,
  TrendingUp,
  Globe2,
  ShieldCheck,
];

export default function AquaGrowthOverview() {
  const t = useTranslations("AquaGrowth.overview");

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 size-[420px] rounded-full bg-lime-300/15 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 size-[420px] rounded-full bg-cyan-800/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-secondary to-brand-dark text-white shadow-sm">
              <Sprout className="size-6" strokeWidth={1.8} />
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary sm:text-sm">
              {t("eyebrow")}
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-sm leading-7 tracking-wide text-muted-foreground sm:text-base sm:leading-8">
            {t("description")}
          </p>
        </div>

        {/* Objectives */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-6">
          {objectiveIcons.map((Icon, index) => (
            <article
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg sm:p-7"
            >
              {/* Number */}
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-brand-secondary group-hover:text-white">
                  <Icon
                    className="size-6"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Objective text */}
              <p className="mt-5 max-w-md text-sm leading-7 text-foreground sm:text-[15px]">
                {t(`objectives.${index}`)}
              </p>

              {/* Decorative accent */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-1 w-0 bg-brand-secondary transition-all duration-300 group-hover:w-full"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}