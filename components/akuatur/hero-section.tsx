
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  GraduationCap,
  Leaf,
  MessageCircle,
  Users,
} from "lucide-react";

const WHATSAPP_NUMBER = "6282283784119";

function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function HeroSection() {
  // Namespace mengikuti struktur i18n terbaru: Akuatur.hero
  const t = useTranslations("Akuatur.hero");

  const whatsappUrl = getWhatsAppUrl(t("whatsappMessage"));

  return (
    <section className="relative isolate min-h-0 overflow-hidden bg-brand-dark text-white sm:min-h-[820px] md:min-h-[760px] lg:min-h-[740px]">

      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/img/akuatur/bg-hero-akuatur.jpg"
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] sm:object-[58%_center] md:object-[55%_center] lg:object-center"
        />
      </div>

      {/* Mobile Background Overlay */}
      <div className="absolute inset-0 -z-10 bg-brand-dark/45 sm:hidden" />

      {/* Mobile Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-dark/95 via-brand-dark/85 via-[55%] to-brand-dark/65 sm:hidden" />

      {/* Tablet Gradient */}
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-brand-dark/85 via-brand-dark/30 to-transparent sm:block md:bg-gradient-to-r md:from-brand-dark/85 md:via-brand-dark/25 md:to-transparent lg:hidden" />

      {/* Tablet Soft Left Overlay */}
      <div className="absolute inset-y-0 left-0 -z-10 hidden w-[52%] bg-gradient-to-r from-brand-dark/35 to-transparent sm:block lg:hidden" />

      {/* Desktop Gradient */}
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-brand-dark/90 via-brand-dark/10 to-transparent lg:block" />

      <div className="absolute inset-y-0 left-0 -z-10 hidden w-[35%] bg-gradient-to-r from-brand-dark/30 to-transparent lg:block" />

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[18%] bg-gradient-to-t from-brand-dark/15 to-transparent" />

      {/* Hero Content */}
      <div className="relative mx-auto flex min-h-0 max-w-7xl items-start px-5 pb-12 pt-[110px] sm:min-h-[820px] sm:px-8 sm:pb-28 sm:pt-20 md:min-h-[760px] md:items-center md:py-20 lg:min-h-[740px] lg:px-8 lg:py-24">

        <div className="w-full max-w-[650px]">

          {/* Heading */}
          <h1 className="font-display text-[34px] font-semibold leading-[1.12] tracking-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.18)] sm:text-5xl md:text-[52px] lg:text-[66px]">
            <span className="block">{t("heading")}</span>
            <span className="block">
              {t("headingPrefix")}{" "}
              <span className="relative inline-block font-bold text-primary [filter:drop-shadow(0_2px_1px_rgba(5,84,106,1))_drop-shadow(0_4px_3px_rgba(5,84,106,0.95))_drop-shadow(0_7px_10px_rgba(5,84,106,0.75))]">
                Akuatur
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 left-1 h-[5px] w-[85%] -rotate-2 rounded-full bg-primary shadow-[0_3px_8px_rgba(5,84,106,0.85)]"
                />
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-[540px] text-sm leading-6 text-white [text-shadow:0_1px_5px_rgba(0,0,0,0.3)] sm:mt-8 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            {t("description")}
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <a
              href="#paket"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-lg sm:w-auto"
            >
              {t("exploreButton")}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-white/60 bg-brand-dark/45 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-brand-dark/60 sm:w-auto"
            >
              <MessageCircle className="size-4" />
              {t("consultationButton")}
            </a>
          </div>

          {/* Mobile Key Benefits */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:hidden">
            <div className="flex items-center gap-3 rounded-lg border border-white/25 bg-[#0B7187]/65 px-4 py-3 shadow-sm backdrop-blur-md">
              <GraduationCap className="size-6 shrink-0 text-primary" />
              <span className="text-sm font-semibold text-white">
                {t("benefits.education")}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/25 bg-[#0B7187]/65 px-4 py-3 shadow-sm backdrop-blur-md">
              <Leaf className="size-6 shrink-0 text-primary" />
              <span className="text-sm font-semibold text-white">
                {t("benefits.community")}
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-white/25 bg-[#0B7187]/65 px-4 py-3 shadow-sm backdrop-blur-md">
              <Users className="size-6 shrink-0 text-primary" />
              <span className="text-sm font-semibold text-white">
                {t("benefits.group")}
              </span>
            </div>
          </div>

          {/* Tablet & Desktop Key Benefits */}
          <div className="mt-12 hidden flex-wrap items-center gap-x-7 gap-y-5 sm:flex md:gap-x-6 lg:gap-x-8">

            <div className="flex items-center gap-3">
              <GraduationCap className="size-8 shrink-0 text-primary" />
              <span className="text-sm font-medium leading-5 text-white/95">
                {t("benefits.educationDesktopLine1")}
                <br />
                {t("benefits.educationDesktopLine2")}
              </span>
            </div>

            <div className="hidden h-9 w-px bg-white/25 md:block" />

            <div className="flex items-center gap-3">
              <Leaf className="size-8 shrink-0 text-primary" />
              <span className="text-sm font-medium leading-5 text-white/95">
                {t("benefits.communityDesktopLine1")}
                <br />
                {t("benefits.communityDesktopLine2")}
              </span>
            </div>

            <div className="hidden h-9 w-px bg-white/25 md:block" />

            <div className="flex items-center gap-3">
              <Users className="size-8 shrink-0 text-primary" />
              <span className="text-sm font-medium leading-5 text-white/95">
                {t("benefits.groupDesktopLine1")}
                <br />
                {t("benefits.groupDesktopLine2")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsappAriaLabel")}
        className="fixed bottom-4 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-[#16864A] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#11763F] sm:bottom-6 sm:right-6 sm:size-14"
      >
        <MessageCircle className="size-6 sm:size-7" />
      </a>
    </section>
  );
}
