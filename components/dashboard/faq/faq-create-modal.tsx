"use client";

import { FormEvent, useState } from "react";
import {
  ChevronDown,
  Loader2,
  MessageCircleQuestionMark,
  Sparkles,
  X,
} from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

const translations = {
  id: {
    title: "Tambah Pertanyaan FAQ",
    description:
      "Lengkapi informasi FAQ yang akan ditampilkan kepada pengguna.",

    category: "Kategori",
    selectCategory: "Pilih kategori",
    product: "Produk",
    service: "Layanan",
    partnership: "Kemitraan",

    questionIDN: "Pertanyaan (Indonesia)",
    questionEN: "Pertanyaan (English)",
    answerIDN: "Jawaban (Indonesia)",
    answerEN: "Jawaban (English)",

    questionIDNPlaceholder: "Masukkan pertanyaan dalam Bahasa Indonesia...",
    questionENPlaceholder: "Masukkan pertanyaan dalam Bahasa Inggris...",
    answerIDNPlaceholder: "Masukkan jawaban dalam Bahasa Indonesia...",
    answerENPlaceholder: "Masukkan jawaban dalam Bahasa Inggris...",
    translationFailed: "Gagal menerjemahkan.",

    translate: "Terjemahkan",
    translating: "Menerjemahkan...",

    close: "Tutup modal",
    cancel: "Batal",
    save: "Simpan FAQ",
    saving: "Menyimpan...",

    authError: "Token autentikasi tidak ditemukan.",
    translationResultError: "Hasil terjemahan tidak ditemukan.",
    translationError: "Gagal menerjemahkan. Silakan coba lagi.",
    createError: "Gagal menambahkan FAQ.",
  },

  en: {
    title: "Add FAQ Question",
    description:
      "Complete the FAQ information that will be displayed to users.",

    category: "Category",
    selectCategory: "Select category",
    product: "Product",
    service: "Service",
    partnership: "Partnership",

    questionIDN: "Question (Indonesian)",
    questionEN: "Question (English)",
    answerIDN: "Answer (Indonesian)",
    answerEN: "Answer (English)",

    questionIDNPlaceholder: "Enter the question in Indonesian...",
    questionENPlaceholder: "Enter the question in English...",
    answerIDNPlaceholder: "Enter the answer in Indonesian...",
    answerENPlaceholder: "Enter the answer in English...",
    translationFailed: "Translation failed.",

    translate: "Translate",
    translating: "Translating...",

    close: "Close modal",
    cancel: "Cancel",
    save: "Save FAQ",
    saving: "Saving...",

    authError: "Authentication token not found.",
    translationResultError: "Translation result not found.",
    translationError: "Failed to translate. Please try again.",
    createError: "Failed to add FAQ.",
  },
};

type FaqCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function FaqCreateModal({
  open,
  onClose,
  onSuccess,
  onError,
}: FaqCreateModalProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [category, setCategory] = useState("");
  const [questionIDN, setQuestionIDN] = useState("");
  const [questionEN, setQuestionEN] = useState("");
  const [answerIDN, setAnswerIDN] = useState("");
  const [answerEN, setAnswerEN] = useState("");

  const [translating, setTranslating] = useState<"question" | "answer" | null>(
    null,
  );

  const [translateError, setTranslateError] = useState("");
  const [saving, setSaving] = useState(false);

  const categoryOptions = [
    {
      value: "",
      label: t.selectCategory,
    },
    {
      value: "product",
      label: t.product,
    },
    {
      value: "service",
      label: t.service,
    },
    {
      value: "partnership",
      label: t.partnership,
    },
  ];

  if (!open) {
    return null;
  }

  const translateText = async (text: string, type: "question" | "answer") => {
    if (!text.trim()) {
      return;
    }

    try {
      setTranslating(type);
      setTranslateError("");

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          q: text,
          source: "id",
          target: "en",
        }),
      });

      if (!response.ok) {
        throw new Error(t.translationFailed);
      }

      const data = (await response.json()) as {
        translatedText?: string;
      };

      if (!data.translatedText) {
        throw new Error(t.translationResultError);
      }

      if (type === "question") {
        setQuestionEN(data.translatedText);
      } else {
        setAnswerEN(data.translatedText);
      }
    } catch (error) {
      console.error("Translation error:", error);

      setTranslateError(t.translationError);
    } finally {
      setTranslating(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !category ||
      !questionIDN.trim() ||
      !questionEN.trim() ||
      !answerIDN.trim() ||
      !answerEN.trim()
    ) {
      return;
    }

    try {
      setSaving(true);

      const token = getAuthToken();

      if (!token) {
        throw new Error(t.authError);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/faqs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            question_idn: questionIDN.trim(),
            question_en: questionEN.trim(),
            answer_idn: answerIDN.trim(),
            answer_en: answerEN.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t.createError);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Create FAQ error:", error);

      onError(error instanceof Error ? error.message : t.createError);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setCategory("");
    setQuestionIDN("");
    setQuestionEN("");
    setAnswerIDN("");
    setAnswerEN("");
    setTranslating(null);
    setTranslateError("");

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[620px] overflow-hidden rounded-2xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand-dark">
                <MessageCircleQuestionMark className="size-6" strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {t.title}
                </h2>

                <p className="mt-1 max-w-[460px] text-sm leading-5 text-muted-foreground">
                  {t.description}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="ml-4 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t.close}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-280px)] space-y-5 overflow-y-auto px-6 py-6">
            {/* Category */}
            <div>
              <label
                htmlFor="faq-category"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                {t.category} <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  id="faq-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none transition-colors focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                >
                  {categoryOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.value === ""}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Question IDN */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="faq-question-idn"
                  className="block text-sm font-semibold text-foreground"
                >
                  {t.questionIDN} <span className="text-red-500">*</span>
                </label>

                <button
                  type="button"
                  onClick={() => translateText(questionIDN, "question")}
                  disabled={!questionIDN.trim() || translating !== null}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-accent px-2.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {translating === "question" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}

                  {translating === "question" ? t.translating : t.translate}
                </button>
              </div>

              <input
                id="faq-question-idn"
                type="text"
                value={questionIDN}
                onChange={(event) => setQuestionIDN(event.target.value)}
                placeholder={t.questionIDNPlaceholder}
                required
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>

            {/* Question EN */}
            <div>
              <label
                htmlFor="faq-question-en"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                {t.questionEN} <span className="text-red-500">*</span>
              </label>

              <input
                id="faq-question-en"
                type="text"
                value={questionEN}
                onChange={(event) => setQuestionEN(event.target.value)}
                placeholder={t.questionENPlaceholder}
                required
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>

            {/* Answer IDN */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="faq-answer-idn"
                  className="block text-sm font-semibold text-foreground"
                >
                  {t.answerIDN} <span className="text-red-500">*</span>
                </label>

                <button
                  type="button"
                  onClick={() => translateText(answerIDN, "answer")}
                  disabled={!answerIDN.trim() || translating !== null}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-accent px-2.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {translating === "answer" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}

                  {translating === "answer" ? t.translating : t.translate}
                </button>
              </div>

              <textarea
                id="faq-answer-idn"
                value={answerIDN}
                onChange={(event) => setAnswerIDN(event.target.value)}
                placeholder={t.answerIDNPlaceholder}
                rows={4}
                required
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>

            {/* Answer EN */}
            <div>
              <label
                htmlFor="faq-answer-en"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                {t.answerEN} <span className="text-red-500">*</span>
              </label>

              <textarea
                id="faq-answer-en"
                value={answerEN}
                onChange={(event) => setAnswerEN(event.target.value)}
                placeholder={t.answerENPlaceholder}
                rows={4}
                required
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>

            {/* Translation Error */}
            {translateError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {translateError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="h-10 rounded-lg border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.save
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
