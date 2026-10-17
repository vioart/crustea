"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { ArrowUpRight, Mail, MapPin, Waves } from "lucide-react";

const productLinks = [
  { key: "hardware", href: "/produk/hardware-teknologi" },
  { key: "software", href: "/produk/software" },
  { key: "krasty", href: "/produk/krasty" },
  { key: "trading", href: "/produk/trading" },
  { key: "aquagrowth", href: "/produk/aquagrowth" },
  { key: "calculator", href: "/produk/kalkulator-budidaya" },
] as const;

const serviceLinks = [
  { key: "consultation", href: "/kontak" },
  { key: "ecoAerator", href: "/produk/eco-aerator" },
  { key: "crusteaAio", href: "/produk/crustea-aio" },
  { key: "partnership", href: "/produk/kemitraan" },
] as const;

const companyLinks = [
  { key: "about", href: "/tentang-kami" },
  { key: "partnership", href: "/produk/kemitraan" },
] as const;

const resourceLinks = [
  { key: "news", href: "/berita" },
  { key: "faq", href: "/faq" },
  { key: "terms", href: "/syarat-ketentuan" },
  { key: "privacy", href: "/kebijakan-privasi" },
] as const;

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white">
      {/* DECORATIVE TOP */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />

      {/* MAIN FOOTER */}
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 sm:pt-20 lg:px-8 lg:pt-24">
        {/* TOP */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
          {/* BRAND */}
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Crustea"
            >
              <img
                src="/logo-white.svg"
                alt="Crustea"
                className="h-13 w-auto object-contain"
              />
            </Link>

            {/* DESCRIPTION */}
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/60">
              {t("description")}
            </p>

            {/* CONTACT */}
            <div className="mt-8 space-y-4">
              {/* ADDRESS */}
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <p className="text-sm leading-6 text-white/60">
                  {t("addressLine1")}
                  <br />
                  {t("addressLine2")}
                  <br />
                  {t("addressLine3")}
                </p>
              </div>

              {/* EMAIL */}
              <a
                href="mailto:info@crustea.id"
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
              >
                <Mail
                  className="size-4 shrink-0 text-primary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span>info@crustea.id</span>
              </a>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
              >
                <FaWhatsapp
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>+62 821-4077-3592</span>
              </a>
            </div>

            {/* SOCIAL MEDIA */}
            <div className="mt-8 flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/crustea.id/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <FaFacebookF className="size-3.5" />
              </a>

              <a
                href="https://www.instagram.com/crustea.id/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <FaInstagram className="size-4" />
              </a>

              <a
                href="https://www.linkedin.com/company/crusteaindonesia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <FaLinkedinIn className="size-4" />
              </a>

              <a
                href="mailto:info@crustea.id"
                aria-label="Email Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <Mail
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {/* PRODUCTS */}
            <FooterColumn title={t("columns.products")}>
              {productLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {t(`links.products.${item.key}`)}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* SERVICES */}
            <FooterColumn title={t("columns.services")}>
              {serviceLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {t(`links.services.${item.key}`)}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* COMPANY */}
            <FooterColumn title={t("columns.company")}>
              {companyLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {t(`links.company.${item.key}`)}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* RESOURCES */}
            <FooterColumn title={t("columns.resources")}>
              {resourceLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {t(`links.resources.${item.key}`)}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            {t("copyright")}
          </p>

          <div className="flex items-center gap-5 text-xs text-white/40">
            <Link
              href="/kebijakan-privasi"
              className="transition-colors hover:text-white"
            >
              {t("bottom.privacy")}
            </Link>

            <Link
              href="/syarat-ketentuan"
              className="transition-colors hover:text-white"
            >
              {t("bottom.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* FOOTER COMPONENTS */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm leading-5 text-white/50 transition-colors duration-200 hover:text-primary"
      >
        {children}
      </Link>
    </li>
  );
}