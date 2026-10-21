
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Waves, Sprout, Clock3 } from "lucide-react";

import InnerHero from "@/components/ui/inner-hero";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default function AkuaturPage() {
  const t = useTranslations("Akuatur.page");

  return (
    <>
      <InnerHero
        title={t("title")}
        breadcrumb={[
          {
            label: t("breadcrumb.home"),
            href: "/",
          },
          {
            label: t("breadcrumb.akuatur"),
          },
        ]}
      />

      <section className="relative isolate overflow-hidden bg-background">
        {/* Decorative background */}
        <div
          className="pointer-events-none absolute -left-32 top-10 -z-10 size-[360px] rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-32 bottom-0 -z-10 size-[360px] rounded-full bg-brand-secondary/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mx-auto flex size-20 items-center justify-center rounded-[28px] border border-primary/15 bg-primary/10 text-primary shadow-sm sm:size-24">
              <Waves
                className="size-10 sm:size-12"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>

            {/* Development status */}
            <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>

              {t("status")}
            </div>

            {/* Heading */}
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("heading")}

              <span className="mt-2 block text-primary">
                {t("headingHighlight")}
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {t("description")}
            </p>

            {/* Feature hints */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm">
                <Sprout
                  className="size-4 text-primary"
                  aria-hidden="true"
                />

                {t("features.sustainable")}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm">
                <Waves
                  className="size-4 text-primary"
                  aria-hidden="true"
                />

                {t("features.innovation")}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm">
                <Clock3
                  className="size-4 text-primary"
                  aria-hidden="true"
                />

                {t("features.comingSoon")}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {t("contactButton")}

                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Footer note */}
            <p className="mt-5 text-xs text-muted-foreground">
              {t("footerNote")}
            </p>
          </div>
        </div>
      </section>

      <WhatsAppBubble />
    </>
  );
}
