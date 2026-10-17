"use client";

import {
  Handshake,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Target,
  Waves,
} from "lucide-react";
import { useTranslations } from "next-intl";

const missionIcons = [
  Lightbulb,
  Waves,
  Handshake,
  RotateCcw,
  ShieldCheck,
  Target,
];

export default function Mission() {
  const t = useTranslations("About.mission");

  const missionItems = t.raw("items") as {
    title: string;
    description: string;
  }[];

  return (
    <section
      aria-labelledby="mission-title"
      className="relative overflow-hidden bg-background"
    >
      {/* DECORATIVE BACKGROUND */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-secondary/70 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-accent/60 blur-3xl"
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
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
            id="mission-title"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[52px]"
          >
            {t("titleBefore")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </header>

        {/* MISSION CARDS */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {missionItems.map((item, index) => {
            const Icon = missionIcons[index];

            return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[22px] border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg hover:shadow-brand-dark/5 sm:p-7"
              >
                {/* NUMBER AND ICON */}
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary transition-all duration-300 group-hover:bg-primary group-hover:text-brand-dark">
                    <Icon
                      className="size-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="mt-8">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-[15px]">
                    {item.description}
                  </p>
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

        {/* CLOSING STATEMENT */}
        <div className="mx-auto mt-10 max-w-3xl border-t border-border pt-8 text-center">
          <p className="font-display text-lg font-medium leading-7 text-brand-secondary sm:text-xl">
            {t("closingStatement")}
          </p>
        </div>
      </div>
    </section>
  );
}
