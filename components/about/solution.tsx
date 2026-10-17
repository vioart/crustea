"use client";

import { Link } from "@/i18n/navigation";
import {
  ArrowUpRight,
  Gauge,
  Leaf,
  Smartphone,
  Waves,
} from "lucide-react";
import { useTranslations } from "next-intl";

const solutionIcons = [Gauge, Leaf, Smartphone];

const solutionImages = [
  "/img/ebii-system.webp",
  "/img/eco-aerator.webp",
  "/img/smart-energy.webp",
];

const solutionLinks = [
  "/produk/hardware-teknologi",
  "/produk/hardware-teknologi",
  "/produk/hardware-teknologi",
];

export default function Solution() {
  const t = useTranslations("About.solution");

  const solutions = t.raw("items") as {
    number: string;
    name: string;
    category: string;
    description: string;
  }[];

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
            <span className="text-primary">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </header>

        {/* SOLUTION CARDS */}
        <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-3">
          {solutions.map((solution, index) => {
            const Icon = solutionIcons[index];
            const href = solutionLinks[index];

            return (
              <article
                key={solution.number}
                className="group relative overflow-hidden rounded-[24px] border border-border bg-muted transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg hover:shadow-brand-dark/5"
              >
                {/* IMAGE */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={solutionImages[index]}
                    alt={t("imageAlt", {
                      name: solution.name,
                      category: solution.category,
                    })}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* NUMBER */}
                  <span
                    className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-border bg-white/90 text-xs font-bold text-brand-dark shadow-sm backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    {solution.number}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6 sm:p-7">
                  {/* CATEGORY */}
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-secondary">
                    <Icon
                      className="size-4 text-primary"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {solution.category}
                  </div>

                  {/* PRODUCT NAME — CLICKABLE */}
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                    <Link
                      href={href}
                      className="transition-colors duration-300 hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {solution.name}
                    </Link>
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {solution.description}
                  </p>

                  {/* PRODUCT LINK */}
                  <div className="mt-6 border-t border-border pt-5">
                    <Link
                      href={href}
                      className="group/link flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-brand-secondary transition-colors duration-300 hover:text-brand-dark"
                    >
                      <span>{t("linkLabel")}</span>

                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>

                {/* BOTTOM INDICATOR */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </article>
            );
          })}
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