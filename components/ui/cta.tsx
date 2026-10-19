"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, Waves } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CTASection() {
  const t = useTranslations("Home.cta");

  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-background"
    >
      {/* CTA CARD */}
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8 lg:py-16">
        <div className="relative overflow-hidden rounded-[28px]">
          {/* BACKGROUND IMAGE */}
          <img
            src="/img/cta.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />

          {/* BASE OVERLAY */}
          <div className="absolute inset-0 bg-black/45" aria-hidden="true" />

          {/* GRADIENT OVERLAY */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20"
            aria-hidden="true"
          />

          {/* CONTENT */}
          <div className="relative px-6 pb-8 pt-5 sm:px-10 sm:pb-10 sm:pt-6 lg:px-14 lg:pb-11 lg:pt-7">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* TEXT */}
              <div className="max-w-3xl">
                <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                  <Waves
                    className="size-5 text-primary"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {t("eyebrow")}
                </p>

                <h2
                  id="cta-title"
                  className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[48px]"
                >
                  {t("titleBefore")}{" "}
                  <span className="text-primary">{t("titleHighlight")}</span>
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  {t("description")}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-[260px] lg:flex-col">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/6282140773592"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-semibold text-brand-dark transition-all duration-300 hover:bg-primary/90 sm:px-5"
                >
                  <FaWhatsapp
                    className="size-[18px] shrink-0"
                    aria-hidden="true"
                  />

                  <span className="min-w-0">{t("whatsapp")}</span>

                  <ArrowRight
                    className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>

                {/* Email */}
                <a
                  href="mailto:hello@crustea.com"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20"
                >
                  <Mail
                    className="size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  <span>{t("email")}</span>
                </a>
              </div>
            </div>

            {/* BOTTOM LINE */}
            <div className="mt-8 border-t border-white/20 pt-4">
              <p className="text-xs leading-5 text-white/55">{t("footer")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
