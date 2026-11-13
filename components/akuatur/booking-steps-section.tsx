
"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  Mail,
  Navigation,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type BookingStep = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const bookingSteps: {
  number: string;
  icon: LucideIcon;
  key: string;
}[] = [
  {
    number: "01",
    icon: Navigation,
    key: "contact",
  },
  {
    number: "02",
    icon: ClipboardList,
    key: "offer",
  },
  {
    number: "03",
    icon: Check,
    key: "confirmation",
  },
];

function BookingStepCard({ item }: { item: BookingStep }) {
  const Icon = item.icon;

  return (
    <article className="group relative rounded-[24px] border border-white/10 bg-white/[0.045] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white/[0.075] sm:p-8">
      <div className="flex items-center justify-between">
        <span className="font-display text-4xl font-bold tracking-tight text-primary">
          {item.number}
        </span>

        <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>

      <h3 className="mt-8 font-display text-xl font-bold tracking-tight text-white">
        {item.title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-white/60">
        {item.description}
      </p>
    </article>
  );
}

function ContactCard({
  type,
  href,
  value,
  icon: Icon,
}: {
  type: string;
  href: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08] sm:p-6"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          {type}
        </span>

        <span className="mt-1 block break-all text-sm font-semibold text-white transition-colors group-hover:text-primary sm:text-base">
          {value}
        </span>
      </div>

      <ArrowRight className="ml-auto size-4 shrink-0 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-primary" />
    </a>
  );
}

export default function BookingStepsSection() {
  const t = useTranslations("Akuatur.bookingSteps");

  const translatedSteps: BookingStep[] = bookingSteps.map((item) => ({
    number: item.number,
    icon: item.icon,
    title: t(`steps.${item.key}.title`),
    description: t(`steps.${item.key}.description`),
  }));

  return (
    <section
      id="pesan"
      className="relative isolate overflow-hidden bg-brand-dark text-white"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 size-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-48 -left-40 size-[480px] rounded-full bg-brand-secondary/20 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8 lg:py-28">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-2">
            <CalendarDays className="size-4 text-primary" />

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              {t("eyebrow")}
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("heading")}
            <span className="block text-primary">
              {t("headingHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            {t("description")}
          </p>
        </div>

        {/* Booking Steps */}
        <div className="relative mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3 md:gap-6">
          {translatedSteps.map((item) => (
            <BookingStepCard key={item.number} item={item} />
          ))}
        </div>

        {/* Contact Information */}
        <div className="mx-auto mt-12 max-w-6xl border-y border-white/15 py-8 sm:py-9">
          <div className="grid gap-4 md:grid-cols-2">
            <ContactCard
              type={t("contact.phone")}
              href="tel:+6282283784119"
              value="+62 822-8378-4119"
              icon={Phone}
            />

            <ContactCard
              type={t("contact.email")}
              href="mailto:crusteaecotourism@gmail.com?subject=Pemesanan%20Akuatur"
              value="crusteaecotourism@gmail.com"
              icon={Mail}
            />
          </div>
        </div>

        {/* Closing Tagline */}
        <p className="mt-8 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-xs">
          {t("tagline.investment")}
          <span className="mx-2 text-primary">·</span>
          {t("tagline.foodSecurity")}
          <span className="mx-2 text-primary">·</span>
          {t("tagline.nature")}
        </p>
      </div>
    </section>
  );
}
