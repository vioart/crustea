"use client";

import { useTranslations } from "next-intl";
import {
  ChartNoAxesCombined,
  Handshake,
  Leaf,
  LineChart,
  Store,
  Waves,
} from "lucide-react";

type Service = {
  number: string;
  title: string;
  description: string;
  icon: typeof Waves;
};

export default function OurServices() {
  const t = useTranslations("Home.ourServices");

  const services: Service[] = [
    {
      number: "01",
      title: t("items.profitSharing.title"),
      description: t("items.profitSharing.description"),
      icon: Handshake,
    },
    {
      number: "02",
      title: t("items.operationalSupport.title"),
      description: t("items.operationalSupport.description"),
      icon: Waves,
    },
    {
      number: "03",
      title: t("items.energyManagement.title"),
      description: t("items.energyManagement.description"),
      icon: ChartNoAxesCombined,
    },
    {
      number: "04",
      title: t("items.sustainability.title"),
      description: t("items.sustainability.description"),
      icon: Leaf,
    },
    {
      number: "05",
      title: t("items.fundingPartners.title"),
      description: t("items.fundingPartners.description"),
      icon: LineChart,
    },
    {
      number: "06",
      title: t("items.marketAccess.title"),
      description: t("items.marketAccess.description"),
      icon: Store,
    },
  ];

  return (
    <section
      aria-labelledby="our-services-title"
      className="relative overflow-hidden bg-background"
    >
      {/* DECORATIVE BACKGROUND */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-secondary/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/50 blur-3xl"
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* HEADER */}
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
            id="our-services-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            {t("titleBefore")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </header>

        {/* SERVICES GRID */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="group relative overflow-hidden rounded-[20px] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg hover:shadow-brand-dark/5 sm:p-7"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-secondary">
                    {service.number}
                  </span>

                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
                    <Icon
                      className="size-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="mt-8">
                  <h3 className="max-w-[18rem] font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                {/* HOVER INDICATOR */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
