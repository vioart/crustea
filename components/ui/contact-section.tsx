"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentType } from "react";
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

import { Button } from "@/components/ui/button";

/* ============================================================
   TYPES
============================================================ */

type ContactIcon = typeof MapPin | IconType;

type ContactItem = {
  title: string;
  descriptions: string[];
  hrefs?: string[];
  icon: ContactIcon;
};

type SubjectOption = {
  value: string;
  label: string;
};

/* ============================================================
   CONTACT DATA
============================================================ */

const contactItems: ContactItem[] = [
  {
    title: "Kantor Kami",
    descriptions: [
      "Ground Floor Crustea Labs, Jl. Sanggung Timur No. 1, Jatingaleh, Semarang, Jawa Tengah 50254",
    ],
    icon: MapPin,
  },
  {
    title: "WhatsApp",
    descriptions: ["+62 821-4077-3592"],
    hrefs: ["https://wa.me/6282140773592"],
    icon: FaWhatsapp,
  },
  {
    title: "Email",
    descriptions: ["info@crustea.id"],
    hrefs: ["mailto:info@crustea.id"],
    icon: Mail,
  },
  {
    title: "Jam Operasional",
    descriptions: ["Senin–Jumat, 09.00–17.00 WIB"],
    icon: Clock3,
  },
];

/* ============================================================
   SUBJECT OPTIONS
============================================================ */

const subjectOptions: SubjectOption[] = [
  {
    value: "produk",
    label: "Informasi Produk",
  },
  {
    value: "layanan",
    label: "Layanan Crustea",
  },
  {
    value: "kemitraan",
    label: "Kemitraan",
  },
  {
    value: "konsultasi",
    label: "Konsultasi",
  },
  {
    value: "lainnya",
    label: "Lainnya",
  },
];

/* ============================================================
   CONTACT SECTION
============================================================ */

export default function ContactSection() {
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subject, setSubject] = useState("");

  const subjectRef = useRef<HTMLDivElement>(null);

  /* ==========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================== */

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

  /* ==========================================================
     SELECT SUBJECT
  ========================================================== */

  const selectedSubject = subjectOptions.find(
    (option) => option.value === subject,
  );

  /* ==========================================================
     SUBMIT FORM → WHATSAPP
  ========================================================== */

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    const whatsappMessage = `Halo Tim Crustea,

Saya ingin menghubungi Crustea.

Nama: ${name}
Email: ${email}
WhatsApp: ${phone || "-"}

Topik: ${selectedSubject?.label ?? subject}

Pesan:
${message}

Terima kasih.`;

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
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-secondary/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-accent/50 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">

          {/* =================================================
              LEFT - CONTACT INFORMATION
          ================================================= */}

          <div>
            {/* Eyebrow */}
            <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              <Waves
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden="true"
              />
              Hubungi Kami
            </p>

            {/* Heading */}
            <h2
              id="contact-section-title"
              className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
            >
              Mari berdiskusi tentang{" "}
              <span className="text-primary">
                kebutuhan akuakultur Anda.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-[17px]">
              Tim Crustea siap membantu menjawab pertanyaan Anda mengenai
              produk, layanan, maupun kebutuhan teknologi untuk mendukung
              operasional tambak.
            </p>

            {/* Contact Items */}
            <div className="mt-10 space-y-6">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4"
                  >
                    {/* Icon */}
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
                      <Icon
                        className="size-5"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                        {item.title}
                      </p>

                      <div className="mt-1.5 space-y-0.5">
                        {item.descriptions.map((description, index) => {
                          const href = item.hrefs?.[index];

                          if (href) {
                            return (
                              <Link
                                key={description}
                                href={href}
                                target={
                                  href.startsWith("https://")
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  href.startsWith("https://")
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="block text-sm leading-6 text-foreground transition-colors hover:text-brand-secondary"
                              >
                                {description}
                              </Link>
                            );
                          }

                          return (
                            <p
                              key={description}
                              className="text-sm leading-6 text-foreground"
                            >
                              {description}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              RIGHT - CONTACT FORM
          ================================================= */}

          <div className="rounded-[24px] border border-border bg-muted p-6 sm:p-8 lg:p-9">
            {/* Form Header */}
            <div>
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                <Send
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Kirim Pesan
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                Isi formulir berikut dan tim kami akan menghubungi Anda untuk
                membahas kebutuhan Anda.
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Name + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Nama
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama lengkap"
                    required
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
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
                  Nomor WhatsApp
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* =================================================
                  CUSTOM SUBJECT DROPDOWN
              ================================================= */}

              <div ref={subjectRef} className="relative">
                <label
                  htmlFor="subject-button"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Topik
                </label>

                {/* Dropdown Button */}
                <button
                  id="subject-button"
                  type="button"
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
                    {selectedSubject?.label ?? "Pilih topik"}
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

                {/* Dropdown Menu */}
                {subjectOpen && (
                  <div
                    role="listbox"
                    aria-label="Pilih topik"
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

              {/* Hidden value for form semantics */}
              <input
                type="hidden"
                name="subject"
                value={subject}
              />

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Pesan
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Ceritakan kebutuhan atau pertanyaan Anda..."
                  required
                  className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="group w-full"
              >
                Kirim Pesan
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}