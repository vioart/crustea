"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Package,
  Handshake,
  Settings2,
  Waves,
} from "lucide-react";

type FAQCategory = "Semua" | "Produk" | "Layanan" | "Kemitraan";

type FAQItem = {
  question: string;
  answer: string;
  category: Exclude<FAQCategory, "Semua">;
};

const categories: {
  label: FAQCategory;
  icon: typeof HelpCircle;
}[] = [
  {
    label: "Semua",
    icon: HelpCircle,
  },
  {
    label: "Produk",
    icon: Package,
  },
  {
    label: "Layanan",
    icon: Settings2,
  },
  {
    label: "Kemitraan",
    icon: Handshake,
  },
];

const faqs: FAQItem[] = [
  {
    category: "Produk",
    question: "Apa saja produk yang ditawarkan Crustea?",
    answer:
      "Crustea memiliki beberapa kategori produk yang mencakup Hardware Teknologi, Software, dan Produk Olahan. Anda dapat melihat produk berdasarkan kategorinya melalui halaman Produk.",
  },
  {
    category: "Produk",
    question: "Apa itu Eco-Aerator?",
    answer:
      "Eco-Aerator merupakan teknologi aerasi yang dirancang untuk membantu kebutuhan aerasi pada budidaya tambak. Produk ini menggunakan sistem solar panel dan impeller sebagai bagian dari teknologi aerasi.",
  },
  {
    category: "Produk",
    question: "Apa fungsi EBII System?",
    answer:
      "EBII System merupakan sistem pemantauan kualitas air yang membantu pembudidaya memantau beberapa parameter utama seperti pH, dissolved oxygen (DO), salinitas, dan suhu.",
  },
  {
    category: "Produk",
    question: "Apakah Crustea menyediakan solusi software?",
    answer:
      "Ya. Crustea menyediakan solusi software untuk membantu proses digitalisasi, monitoring, dan pengelolaan aktivitas akuakultur.",
  },
  {
    category: "Layanan",
    question: "Apakah Crustea menyediakan konsultasi untuk kebutuhan tambak?",
    answer:
      "Ya. Anda dapat menghubungi tim Crustea untuk mendiskusikan kebutuhan terkait produk, teknologi, maupun solusi yang sesuai dengan kondisi budidaya Anda.",
  },
  {
    category: "Layanan",
    question: "Bagaimana cara mendapatkan informasi mengenai produk Crustea?",
    answer:
      "Anda dapat melihat detail masing-masing produk melalui halaman Produk. Jika membutuhkan informasi lebih lanjut, Anda juga dapat menghubungi tim Crustea melalui WhatsApp atau email.",
  },
  {
    category: "Kemitraan",
    question: "Apakah Crustea membuka peluang kemitraan?",
    answer:
      "Crustea menyediakan informasi dan peluang kemitraan yang dapat didiskusikan bersama tim. Silakan hubungi Crustea untuk menyampaikan kebutuhan dan bentuk kolaborasi yang ingin Anda kembangkan.",
  },
  {
    category: "Kemitraan",
    question: "Bagaimana cara mengajukan kerja sama dengan Crustea?",
    answer:
      "Anda dapat menghubungi tim Crustea melalui halaman Kontak atau WhatsApp untuk menyampaikan profil, kebutuhan, serta bentuk kerja sama yang ingin didiskusikan.",
  },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] =
    useState<FAQCategory>("Semua");

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs =
    activeCategory === "Semua"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-background"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute -left-48 top-24 size-[420px] rounded-full bg-secondary/50 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-48 bottom-20 size-[420px] rounded-full bg-accent/40 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              <Waves
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden="true"
              />
              Pusat Bantuan
            </p>

            <h2
              id="faq-title"
              className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]"
            >
              Pertanyaan yang{" "}
              <span className="text-primary">sering ditanyakan.</span>
            </h2>
          </div>

          <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground lg:justify-self-end">
            Temukan jawaban atas berbagai pertanyaan mengenai produk, layanan,
            dan peluang kemitraan Crustea. Jika belum menemukan informasi yang
            Anda butuhkan, tim kami siap membantu.
          </p>
        </div>

        {/* =================================================
            CATEGORY FILTER
        ================================================= */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.label;

            return (
              <button
                key={category.label}
                type="button"
                onClick={() => {
                  setActiveCategory(category.label);
                  setOpenIndex(0);
                }}
                className={[
                  "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-brand-dark text-white shadow-sm"
                    : "bg-secondary text-brand-dark hover:bg-accent",
                ].join(" ")}
              >
                <Icon className="size-4" strokeWidth={1.8} />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            FAQ LIST
        ================================================= */}
        <div className="mx-auto mt-8 max-w-4xl">
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  key={faq.question}
                  className={[
                    "overflow-hidden rounded-[20px] border bg-white transition-all duration-300",
                    isOpen
                      ? "border-brand-secondary/30 shadow-md"
                      : "border-border shadow-sm hover:border-brand-secondary/20 hover:shadow-md",
                  ].join(" ")}
                >
                  {/* Question */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    {/* Number */}
                    <span
                      className={[
                        "flex size-9 shrink-0 items-center justify-center rounded-xl font-display text-xs font-bold transition-colors duration-300",
                        isOpen
                          ? "bg-brand-dark text-primary"
                          : "bg-secondary text-brand-secondary",
                      ].join(" ")}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Question */}
                    <span className="flex-1 font-display text-base font-semibold leading-6 text-foreground sm:text-[17px]">
                      {faq.question}
                    </span>

                    {/* Chevron */}
                    <span
                      className={[
                        "flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isOpen
                          ? "bg-primary text-brand-dark"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      <ChevronDown
                        className={[
                          "size-4 transition-transform duration-300",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </span>
                  </button>

                  {/* Answer */}
                  <div
                    className={[
                      "grid transition-all duration-300",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    ].join(" ")}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="px-5 pb-5 pl-[68px] sm:px-6 sm:pb-6 sm:pl-[77px]">
                        <div className="border-l-2 border-primary/60 pl-4">
                          <p className="text-[14px] leading-7 text-muted-foreground">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* =================================================
            CONTACT CARD
        ================================================= */}
        <div className="mt-12 overflow-hidden rounded-[24px] bg-brand-dark">
          <div className="relative">
            <div
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-brand-secondary/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-brand-dark">
                  <MessageCircle
                    className="size-5"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <p className="font-display text-lg font-semibold text-white">
                    Masih punya pertanyaan?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Hubungi tim Crustea dan diskusikan kebutuhan Anda bersama
                    kami.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}