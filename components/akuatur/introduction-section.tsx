
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Leaf, Sprout, Users, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IntroductionItem = {
  image: string;
  icon: LucideIcon;
  title: string;
  description: string;
  imageAlt: string;
};

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
          <span className="mt-1 block text-primary">{highlight}</span>
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

function IntroductionCard({ item }: { item: IntroductionItem }) {
  return (
    <article className="group rounded-[24px] border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg">
      <div className="relative -mx-7 -mt-7 mb-6 aspect-[16/9] overflow-hidden rounded-t-[24px]">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
        {item.title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {item.description}
      </p>
    </article>
  );
}

export default function IntroductionSection() {
  // Namespace mengikuti struktur i18n terbaru: Akuatur.introduction
  const t = useTranslations("Akuatur.introduction");

  const introductionItems: IntroductionItem[] = [
    {
      image: "/img/akuatur/aktivitas-tambak-teknologi.jpg",
      icon: Waves,
      title: t("cards.pond.title"),
      description: t("cards.pond.description"),
      imageAlt: t("cards.pond.imageAlt"),
    },
    {
      image: "/img/akuatur/aktivitas-alam-konservasi.jpg",
      icon: Leaf,
      title: t("cards.conservation.title"),
      description: t("cards.conservation.description"),
      imageAlt: t("cards.conservation.imageAlt"),
    },
    {
      image: "/img/akuatur/aktivitas-komunitas-lokal.jpg",
      icon: Users,
      title: t("cards.community.title"),
      description: t("cards.community.description"),
      imageAlt: t("cards.community.imageAlt"),
    },
  ];

  return (
    <section
      id="tentang"
      className="relative overflow-hidden bg-background"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-secondary/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-8 lg:py-28">
        {/* Section Heading */}
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          highlight={t("headingHighlight")}
          description={t("description")}
          icon={Sprout}
        />

        {/* Introduction Cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {introductionItems.map((item) => (
            <IntroductionCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
