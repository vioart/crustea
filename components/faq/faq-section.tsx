"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Package,
  Handshake,
  Settings2,
  Waves,
} from "lucide-react";

type FAQCategory = "all" | "product" | "service" | "partnership";

type FAQItem = {
  id: number;
  category: Exclude<FAQCategory, "all">;
  question_idn: string;
  question_en: string;
  answer_idn: string;
  answer_en: string;
};

type FAQApiResponse = {
  data: FAQItem[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const categoryIcons = {
  all: HelpCircle,
  product: Package,
  service: Settings2,
  partnership: Handshake,
};

const categoryKeys: FAQCategory[] = [
  "all",
  "product",
  "service",
  "partnership",
];

export default function FAQSection() {
  const t = useTranslations("FAQ.section");
  const locale = useLocale();

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<FAQCategory>("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFAQs() {
      if (!API_BASE_URL) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/faqs`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch FAQs: ${response.status}`);
        }

        const result: FAQApiResponse = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid FAQ API response");
        }

        const validFAQs = result.data.filter(
          (faq) =>
            typeof faq.id === "number" &&
            typeof faq.category === "string" &&
            typeof faq.question_idn === "string" &&
            typeof faq.question_en === "string" &&
            typeof faq.answer_idn === "string" &&
            typeof faq.answer_en === "string",
        );

        setFaqs(validFAQs);
        setOpenId(validFAQs[0]?.id ?? null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Error fetching FAQs:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchFAQs();

    return () => {
      controller.abort();
    };
  }, []);

  const categories = categoryKeys.map((key) => ({
    key,
    label: t(`categories.${key}`),
    icon: categoryIcons[key],
  }));

  const filteredFAQs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  function getQuestion(faq: FAQItem) {
    return locale === "id" ? faq.question_idn : faq.question_en;
  }

  function getAnswer(faq: FAQItem) {
    return locale === "id" ? faq.answer_idn : faq.answer_en;
  }

  return (
    <section
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-background"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -left-48 top-24 size-[420px] rounded-full bg-secondary/50 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-48 bottom-20 size-[420px] rounded-full bg-accent/40 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              <Waves
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden="true"
              />
              {t("eyebrow")}
            </p>

            <h2
              id="faq-title"
              className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]"
            >
              {t("headingBefore")}{" "}
              <span className="text-primary">
                {t("headingHighlight")}
              </span>
            </h2>
          </div>

          <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground lg:justify-self-end">
            {t("description")}
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.key;

            return (
              <button
                key={category.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActiveCategory(category.key);
                  setOpenId(null);
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

        {/* FAQ list */}
        <div className="mx-auto mt-8 max-w-4xl">
          {loading ? (
            <div
              role="status"
              className="rounded-2xl border border-border bg-muted px-6 py-12 text-center"
            >
              <p className="text-sm text-muted-foreground">
                {t("loading")}
              </p>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-border bg-muted px-6 py-12 text-center"
            >
              <p className="font-medium text-foreground">
                {t("errorTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("errorDescription")}
              </p>
            </div>
          ) : filteredFAQs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted px-6 py-12 text-center">
              <p className="font-medium text-foreground">
                {t("emptyTitle")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("emptyDescription")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => {
                const isOpen = openId === faq.id;

                return (
                  <article
                    key={faq.id}
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
                        setOpenId(isOpen ? null : faq.id)
                      }
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                    >
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

                      <span className="flex-1 font-display text-base font-semibold leading-6 text-foreground sm:text-[17px]">
                        {getQuestion(faq)}
                      </span>

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
                              {getAnswer(faq)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact card */}
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
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="font-display text-lg font-semibold text-white">
                    {t("contact.title")}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/60">
                    {t("contact.description")}
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90"
              >
                {t("contact.button")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}