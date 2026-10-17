"use client";

import { useTranslations } from "next-intl";
import { Award, Globe2, Handshake, Sprout, Waves } from "lucide-react";

type TractionItem = {
  number: string;
  label: string;
  description: string;
  icon: typeof Sprout;
};

export default function Traction() {
  const t = useTranslations("Home.traction");

  const tractionItems: TractionItem[] = [
    {
      number: "1.000+",
      label: t("items.farmers.label"),
      description: t("items.farmers.description"),
      icon: Sprout,
    },
    {
      number: "10+",
      label: t("items.regions.label"),
      description: t("items.regions.description"),
      icon: Globe2,
    },
    {
      number: "25+",
      label: t("items.awards.label"),
      description: t("items.awards.description"),
      icon: Award,
    },
    {
      number: "20+",
      label: t("items.partners.label"),
      description: t("items.partners.description"),
      icon: Handshake,
    },
  ];

  return (
    <section
      aria-labelledby="traction-title"
      className="relative overflow-hidden bg-brand-dark text-white"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-brand-secondary/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 90%)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              <Waves
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden="true"
              />
              {t("eyebrow")}
            </p>

            <h2
              id="traction-title"
              className="font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-[42px]"
            >
              {t("titleBefore")}{" "}
              <span className="text-primary">{t("titleHighlight")}</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-[17px]">
              {t("description")}
            </p>
          </header>

          {/* Launch context */}
          <div className="shrink-0 lg:pb-1">
            <p className="max-w-xs border-l-2 border-primary pl-4 text-sm leading-6 text-white/55">
              {t("launchContextBefore")}{" "}
              <span className="font-semibold text-white">
                {t("launchContextHighlight")}
              </span>
            </p>
          </div>
        </div>

        {/* Traction numbers */}
        <div className="mt-14 border-y border-white/10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {tractionItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className={[
                    "group relative px-5 py-8 sm:px-7 sm:py-9",
                    index % 2 !== 0 ? "border-l border-white/10" : "",
                    index >= 2
                      ? "border-t border-white/10 lg:border-t-0"
                      : "",
                    index > 0 ? "lg:border-l lg:border-white/10" : "",
                  ].join(" ")}
                >
                  <div className="mb-7 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-brand-dark">
                    <Icon
                      className="size-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="font-display text-4xl font-semibold leading-none tracking-tight text-white sm:text-5xl">
                    {item.number}
                  </p>

                  <h3 className="mt-3 text-base font-semibold text-white">
                    {item.label}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/45">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* P4G / International funding */}
        <div className="mt-10 flex flex-col gap-5 rounded-[20px] border border-white/10 bg-white/[0.04] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-brand-dark">
              <Handshake
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                {t("funding.label")}
              </p>

              <h3 className="mt-1 font-display text-xl font-semibold text-white">
                Partnership for Green Growth and the Global Goals
              </h3>
            </div>
          </div>

          <span className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            P4G
          </span>
        </div>
      </div>
    </section>
  );
}