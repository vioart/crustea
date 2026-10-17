"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ComponentType } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Send,
  Waves,
} from "lucide-react";
import type { IconType } from "react-icons";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type ContactIcon =
  | ComponentType<{
      className?: string;
      "aria-hidden"?: boolean | "true" | "false";
    }>
  | IconType;

type ContactItem = {
  key: string;
  description: string;
  href?: string;
  icon: ContactIcon;
};

type SubjectOption = {
  value: string;
  label: string;
};

export default function ContactSection() {
  const t = useTranslations("Contact.section");

  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subject, setSubject] = useState("");

  const subjectRef = useRef<HTMLDivElement>(null);

  const contactItems: ContactItem[] = [
    {
      key: "office",
      description:
        "Ground Floor Crustea Labs, Jl. Sanggung Timur No. 1, Jatingaleh, Semarang, Jawa Tengah 50254",
      icon: MapPin,
    },
    {
      key: "whatsapp",
      description: "+62 821-4077-3592",
      href: "https://wa.me/6282140773592",
      icon: FaWhatsapp,
    },
    {
      key: "email",
      description: "info@crustea.id",
      href: "mailto:info@crustea.id",
      icon: Mail,
    },
    {
      key: "hours",
      description: t("contactItems.hours.description"),
      icon: Clock3,
    },
  ];

  const subjectOptions: SubjectOption[] = [
    { value: "produk", label: t("subjects.product") },
    { value: "layanan", label: t("subjects.service") },
    { value: "kemitraan", label: t("subjects.partnership") },
    { value: "konsultasi", label: t("subjects.consultation") },
    { value: "lainnya", label: t("subjects.other") },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        subjectRef.current &&
        !subjectRef.current.contains(event.target as Node)
      ) {
        setSubjectOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedSubject = subjectOptions.find(
    (option) => option.value === subject,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!subject) {
      setSubjectOpen(true);
      return;
    }

    const whatsappMessage = t("whatsappMessage", {
      name,
      email,
      phone: phone || "-",
      subject: selectedSubject?.label ?? subject,
      message,
    });

    const whatsappUrl = `https://wa.me/6282140773592?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      aria-labelledby="contact-section-title"
      className="relative overflow-hidden bg-background"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-secondary/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-accent/50 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          {/* Contact information */}
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
              id="contact-section-title"
              className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
            >
              {t("headingBefore")}{" "}
              <span className="text-primary">
                {t("headingHighlight")}
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-[17px]">
              {t("description")}
            </p>

            <div className="mt-10 space-y-6">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="group flex items-start gap-4"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                        {t(`contactItems.${item.key}.title`)}
                      </p>

                      <div className="mt-1.5 space-y-0.5">
                        {item.href ? (
                          <Link
                            href={item.href}
                            target={
                              item.href.startsWith("https://")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("https://")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="block text-sm leading-6 text-foreground transition-colors hover:text-brand-secondary"
                          >
                            {item.description}
                          </Link>
                        ) : (
                          <p className="text-sm leading-6 text-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-[24px] border border-border bg-muted p-6 sm:p-8 lg:p-9">
            <div>
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                <Send
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t("form.title")}
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                {t("form.description")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name and email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    {t("form.name")}
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t("form.namePlaceholder")}
                    autoComplete="name"
                    required
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    {t("form.email")}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("form.emailPlaceholder")}
                    autoComplete="email"
                    required
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t("form.phone")}
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t("form.phonePlaceholder")}
                  autoComplete="tel"
                  className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Subject dropdown */}
              <div ref={subjectRef} className="relative">
                <label
                  id="subject-label"
                  htmlFor="subject-button"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t("form.subject")}
                </label>

                <button
                  id="subject-button"
                  type="button"
                  aria-labelledby="subject-label"
                  aria-haspopup="listbox"
                  aria-expanded={subjectOpen}
                  onClick={() => setSubjectOpen((open) => !open)}
                  className={[
                    "flex h-12 w-full items-center justify-between rounded-lg border bg-background px-4 text-left text-sm outline-none transition-all",
                    subjectOpen
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border",
                  ].join(" ")}
                >
                  <span
                    className={
                      selectedSubject
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {selectedSubject?.label ?? t("form.subjectPlaceholder")}
                  </span>

                  <ChevronDown
                    className={[
                      "size-4 text-brand-secondary transition-transform duration-200",
                      subjectOpen ? "rotate-180" : "",
                    ].join(" ")}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>

                {subjectOpen && (
                  <div
                    role="listbox"
                    aria-labelledby="subject-label"
                    className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-xl shadow-brand-dark/10"
                  >
                    {subjectOptions.map((option) => {
                      const isSelected = subject === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSubject(option.value);
                            setSubjectOpen(false);
                          }}
                          className={[
                            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150",
                            isSelected
                              ? "bg-secondary font-medium text-brand-dark"
                              : "text-foreground hover:bg-muted",
                          ].join(" ")}
                        >
                          <span>{option.label}</span>

                          {isSelected && (
                            <Check
                              className="size-4 text-brand-secondary"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <input type="hidden" name="subject" value={subject} />

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t("form.message")}
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t("form.messagePlaceholder")}
                  required
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="group w-full"
              >
                {t("form.submit")}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}