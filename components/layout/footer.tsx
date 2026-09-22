import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Waves } from "lucide-react";

const productLinks = [
  {
    label: "Hardware Teknologi",
    href: "/produk/hardware-teknologi",
  },
  {
    label: "Software",
    href: "/produk/software",
  },
  {
    label: "Produk Olahan - Krasty",
    href: "/produk/krasty",
  },
  {
    label: "Trading",
    href: "/produk/trading",
  },
  {
    label: "Aquagrowth",
    href: "/produk/aquagrowth",
  },
  {
    label: "Kalkulator Budidaya",
    href: "/produk/kalkulator-budidaya",
  },
];

const serviceLinks = [
  {
    label: "Konsultasi & Konstruksi",
    href: "/kontak",
  },
  {
    label: "Eco-Aerator",
    href: "/produk/eco-aerator",
  },
  {
    label: "Crustea AIO",
    href: "/produk/crustea-aio",
  },
  {
    label: "Kemitraan & Pasar",
    href: "/produk/kemitraan",
  },
];

const companyLinks = [
  {
    label: "Tentang Kami",
    href: "/tentang-kami",
  },
  {
    label: "Kemitraan",
    href: "/produk/kemitraan",
  },
];

const resourceLinks = [
  {
    label: "Berita",
    href: "/berita",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Syarat & Ketentuan",
    href: "/syarat-ketentuan",
  },
  {
    label: "Kebijakan Privasi",
    href: "/kebijakan-privasi",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white">
      {/* =====================================================
          DECORATIVE TOP
      ===================================================== */}
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

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 sm:pt-20 lg:px-8 lg:pt-24">
        {/* ===================================================
            TOP
        =================================================== */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
          {/* =================================================
              BRAND
          ================================================= */}
          <div className="max-w-md">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Crustea"
            >
              <img
                src="/logo.svg"
                alt="Crustea"
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Description */}
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/60">
              Menghadirkan teknologi dan solusi terintegrasi untuk membantu
              pembudidaya meningkatkan produktivitas, efisiensi, dan
              keberlanjutan bisnis akuakultur.
            </p>

            {/* Contact */}
            <div className="mt-8 space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <p className="text-sm leading-6 text-white/60">
                  Ground Floor Crustea Labs
                  <br />
                  Jl. Sanggung Timur No. 1, Jatingaleh, Semarang,
                  <br />
                  Jatingaleh, Semarang, Jawa Tengah 50254
                </p>
              </div>

              {/* Email */}
              <Link
                href="mailto:info@crustea.id"
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
              >
                <Mail
                  className="size-4 shrink-0 text-primary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                info@crustea.id
              </Link>

              {/* WhatsApp */}
              <Link
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
              >
                <MessageCircle
                  className="size-4 shrink-0 text-primary"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                +62 821-4077-3592
              </Link>
            </div>

            {/* Social Media */}
            <div className="mt-8 flex items-center gap-2.5">
              {/* Facebook */}
              <Link
                href="https://www.facebook.com/crustea.id/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <FaFacebookF className="size-3.5" />
              </Link>

              {/* Instagram */}
              <Link
                href="https://www.instagram.com/crustea.id/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <FaInstagram className="size-4" />
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://www.linkedin.com/company/crusteaindonesia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <FaLinkedinIn className="size-4" />
              </Link>

              {/* Email */}
              <Link
                href="mailto:info@crustea.id"
                aria-label="Email Crustea"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-primary/40 hover:bg-primary hover:text-brand-dark"
              >
                <Mail className="size-4" strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================= */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {/* Products */}
            <FooterColumn title="Produk">
              {productLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* Services */}
            <FooterColumn title="Layanan">
              {serviceLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* Company */}
            <FooterColumn title="Perusahaan">
              {companyLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* Resources */}
            <FooterColumn title="Resources">
              {resourceLinks.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>
        </div>

        {/* =====================================================
            BOTTOM
        ===================================================== */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © 2026 PT Eco Karya Teknologi. Seluruh hak cipta dilindungi.
          </p>

          <div className="flex items-center gap-5 text-xs text-white/40">
            <Link
              href="/kebijakan-privasi"
              className="transition-colors hover:text-white"
            >
              Privasi
            </Link>

            <Link
              href="/syarat-ketentuan"
              className="transition-colors hover:text-white"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER COMPONENTS
   ========================================================= */

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
