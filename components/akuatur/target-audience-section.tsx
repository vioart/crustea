
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import {
  GraduationCap,
  Mountain,
  Sprout,
  Users,
} from "lucide-react";

type TargetAudience = {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  key: string;
};

const audiences: TargetAudience[] = [
  {
    key: "students",
    icon: GraduationCap,
    title: "",
    description: "",
    image: "/img/akuatur/akuatur-pelajar.jpg",
  },
  {
    key: "families",
    icon: Users,
    title: "",
    description: "",
    image: "/img/akuatur/akuatur-keluarga.jpg",
  },
  {
    key: "corporate",
    icon: Mountain,
    title: "",
    description: "",
    image: "/img/akuatur/akuatur-company.jpg",
  },
  {
    key: "farmers",
    icon: Sprout,
    title: "",
    description: "",
    image: "/img/akuatur/akuatur-investor.jpg",
  },
];

function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
        <Icon
          className="size-5 text-primary"
          strokeWidth={2}
          aria-hidden="true"
        />
        {eyebrow}
      </p>

      <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]">
        {title}
        {highlight && (
          <span className="mt-1 block text-primary">
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
          {description}
        </p>
      )}
    </div>
  );
}

function AudienceCard({
  item,
}: {
  item: TargetAudience;
}) {
  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg">
      <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden rounded-t-[24px]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
        {item.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
        {item.description}
      </p>
    </article>
  );
}

export default function TargetAudienceSection() {
  // Namespace mengikuti struktur i18n terbaru: Akuatur.targetAudience
  const t = useTranslations("Akuatur.targetAudience");

  const translatedAudiences = audiences.map((item) => ({
    ...item,
    title: t(`cards.${item.key}.title`),
    description: t(`cards.${item.key}.description`),
  }));

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8">
        {/* SECTION HEADING */}
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          highlight={t("headingHighlight")}
          description={t("description")}
          icon={Users}
        />

        {/* TARGET AUDIENCE CARDS */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {translatedAudiences.map((item) => (
            <AudienceCard key={item.key} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
