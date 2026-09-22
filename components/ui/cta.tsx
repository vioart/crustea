import Link from "next/link";
import { ArrowRight, Mail, Waves } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CTASection() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-background"
    >
      {/* =====================================================
          CTA CARD
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8 lg:py-16">
        <div className="relative overflow-hidden rounded-[28px]">
          {/* =================================================
              BACKGROUND IMAGE
          ================================================= */}
          <img
            src="/img/bg-hero.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />

          {/* =================================================
              BASE OVERLAY
          ================================================= */}
          <div
            className="absolute inset-0 bg-black/45"
            aria-hidden="true"
          />

          {/* =================================================
              GRADIENT OVERLAY
          ================================================= */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20"
            aria-hidden="true"
          />

          {/* =================================================
              CONTENT
          ================================================= */}
          <div className="relative px-6 pb-8 pt-5 sm:px-10 sm:pb-10 sm:pt-6 lg:px-14 lg:pb-11 lg:pt-7">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* =================================================
                  TEXT
              ================================================= */}
              <div className="max-w-3xl">
                {/* Eyebrow */}
                <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                  <Waves
                    className="size-5 text-primary"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Mulai Bersama Crustea
                </p>

                {/* Heading */}
                <h2
                  id="cta-title"
                  className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[48px]"
                >
                  Siap meningkatkan{" "}
                  <span className="text-primary">
                    produktivitas tambak?
                  </span>
                </h2>

                {/* Description */}
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  Konsultasikan kebutuhan tambak Anda bersama tim Crustea dan
                  temukan solusi teknologi yang sesuai dengan kondisi budidaya
                  Anda.
                </p>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:w-[240px] lg:flex-col">
                {/* WhatsApp */}
                <Link
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-brand-dark transition-all duration-300 hover:bg-primary/90"
                >
                  <FaWhatsapp
                    className="size-[18px]"
                    aria-hidden="true"
                  />

                  Hub via WhatsApp

                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                {/* Email */}
                <Link
                  href="mailto:hello@crustea.com"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/20"
                >
                  <Mail
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  Kirim Email
                </Link>
              </div>
            </div>

            {/* =====================================================
                BOTTOM LINE
            ===================================================== */}
            <div className="mt-8 border-t border-white/20 pt-4">
              <p className="text-xs leading-5 text-white/55">
                Tim Crustea siap membantu menjawab kebutuhan dan pertanyaan
                terkait produk maupun layanan kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}