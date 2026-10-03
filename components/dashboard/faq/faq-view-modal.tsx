"use client";

import { MessageCircleQuestionMark, X } from "lucide-react";
import { useLanguage } from "@/components/language/language-provider";

type FAQ = {
  id: number;
  category: "product" | "service" | "partnership";
  question_idn: string;
  question_en: string;
  answer_idn: string;
  answer_en: string;
  created_at?: string;
  updated_at?: string;
};

type FaqViewModalProps = {
  open: boolean;
  faq: FAQ | null;
  onClose: () => void;
};

const translations = {
  id: {
    title: "Detail FAQ",
    description: "Detail pertanyaan dan jawaban FAQ.",

    category: "Kategori",
    product: "Produk",
    service: "Layanan",
    partnership: "Kemitraan",

    indonesian: "Bahasa Indonesia",
    english: "English",

    question: "Pertanyaan",
    answer: "Jawaban",

    close: "Tutup",
    closeModal: "Tutup modal",
  },

  en: {
    title: "FAQ Detail",
    description: "Details of the FAQ question and answer.",

    category: "Category",
    product: "Product",
    service: "Service",
    partnership: "Partnership",

    indonesian: "Indonesian",
    english: "English",

    question: "Question",
    answer: "Answer",

    close: "Close",
    closeModal: "Close modal",
  },
};

const categoryLabels = {
  id: {
    product: translations.id.product,
    service: translations.id.service,
    partnership: translations.id.partnership,
  },

  en: {
    product: translations.en.product,
    service: translations.en.service,
    partnership: translations.en.partnership,
  },
};

function getCategoryClass(category: FAQ["category"]) {
  if (category === "product") {
    return "bg-[#3B82F6]";
  }

  if (category === "service") {
    return "bg-[#8B5CF6]";
  }

  return "bg-[#F59E0B]";
}

export default function FaqViewModal({
  open,
  faq,
  onClose,
}: FaqViewModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!open || !faq) {
    return null;
  }

  const categoryLabel = categoryLabels[language][faq.category];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100vh-48px)] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
              <MessageCircleQuestionMark className="size-6" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {t.title}
                </h2>

                <span className="text-xs text-muted-foreground">#{faq.id}</span>
              </div>

              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {t.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t.closeModal}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 overflow-y-auto px-6 py-6">
          {/* Category */}
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">
              {t.category}
            </p>

            <span
              className={`inline-flex rounded-md px-3 py-1.5 text-xs font-medium text-white ${getCategoryClass(
                faq.category,
              )}`}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Indonesian */}
          <section className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="mb-5 flex items-center gap-2">
              <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                ID
              </span>

              <h3 className="text-sm font-bold text-foreground">
                {t.indonesian}
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.question}
                </p>

                <p className="text-sm font-semibold leading-6 text-foreground">
                  {faq.question_idn}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.answer}
                </p>

                <p className="whitespace-pre-line text-sm leading-6 text-foreground">
                  {faq.answer_idn}
                </p>
              </div>
            </div>
          </section>

          {/* English */}
          <section className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="mb-5 flex items-center gap-2">
              <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-brand-dark">
                EN
              </span>

              <h3 className="text-sm font-bold text-foreground">{t.english}</h3>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.question}
                </p>

                <p className="text-sm font-semibold leading-6 text-foreground">
                  {faq.question_en}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.answer}
                </p>

                <p className="whitespace-pre-line text-sm leading-6 text-foreground">
                  {faq.answer_en}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
