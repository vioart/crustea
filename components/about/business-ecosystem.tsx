"use client";

import {
  ArrowDown,
  ArrowRight,
  Banknote,
  BarChart3,
  CalendarDays,
  CalendarRange,
  ChartNoAxesCombined,
  CheckCircle2,
  Factory,
  GraduationCap,
  Handshake,
  Leaf,
  Megaphone,
  Package,
  RefreshCw,
  Settings,
  ShoppingBag,
  Store,
  Users,
  Utensils,
  Waves,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";

type RevenueType = "daily" | "monthly" | "quarterly" | "yearly";

type EcosystemItem = {
  title: string;
  icon: typeof Leaf;
  revenue: RevenueType;
};

const revenueStyles = {
  daily: {
    wrapper:
      "border-[#E78A5B]/30 bg-[#E78A5B]/10 hover:border-[#E78A5B]/60 hover:bg-[#E78A5B]/15",
    icon: "bg-[#E78A5B] text-white",
    accent: "bg-[#E78A5B]",
    dot: "bg-[#E78A5B]",
    legend:
      "border-[#E78A5B]/30 bg-[#E78A5B]/10 text-brand-dark hover:border-[#E78A5B]/50",
  },
  monthly: {
    wrapper:
      "border-[#4F9FC4]/30 bg-[#4F9FC4]/10 hover:border-[#4F9FC4]/60 hover:bg-[#4F9FC4]/15",
    icon: "bg-[#4F9FC4] text-white",
    accent: "bg-[#4F9FC4]",
    dot: "bg-[#4F9FC4]",
    legend:
      "border-[#4F9FC4]/30 bg-[#4F9FC4]/10 text-brand-dark hover:border-[#4F9FC4]/50",
  },
  quarterly: {
    wrapper:
      "border-[#7B72B5]/30 bg-[#7B72B5]/10 hover:border-[#7B72B5]/60 hover:bg-[#7B72B5]/15",
    icon: "bg-[#7B72B5] text-white",
    accent: "bg-[#7B72B5]",
    dot: "bg-[#7B72B5]",
    legend:
      "border-[#7B72B5]/30 bg-[#7B72B5]/10 text-brand-dark hover:border-[#7B72B5]/50",
  },
  yearly: {
    wrapper:
      "border-[#C49A3A]/30 bg-[#C49A3A]/10 hover:border-[#C49A3A]/60 hover:bg-[#C49A3A]/15",
    icon: "bg-[#C49A3A] text-white",
    accent: "bg-[#C49A3A]",
    dot: "bg-[#C49A3A]",
    legend:
      "border-[#C49A3A]/30 bg-[#C49A3A]/10 text-brand-dark hover:border-[#C49A3A]/50",
  },
} satisfies Record<
  RevenueType,
  {
    wrapper: string;
    icon: string;
    accent: string;
    dot: string;
    legend: string;
  }
>;

const upstreamItems = [
  { key: "ecoTourism", icon: Leaf, revenue: "monthly" },
  { key: "workshop", icon: GraduationCap, revenue: "monthly" },
] as const;

const externalItems = [
  { key: "csrProjects", icon: Megaphone, revenue: "yearly" },
  { key: "empowerment", icon: Users, revenue: "yearly" },
] as const;

const preCultivationItems = [
  { key: "funding", icon: Banknote, revenue: "quarterly" },
  { key: "revitalization", icon: Wrench, revenue: "quarterly" },
] as const;

const duringCultivationItems = [
  { key: "equipment", icon: Settings, revenue: "daily" },
  { key: "maintenance", icon: RefreshCw, revenue: "monthly" },
] as const;

const postCultivationItems = [
  { key: "marketplace", icon: Store, revenue: "monthly" },
  { key: "trading", icon: ShoppingBag, revenue: "quarterly" },
] as const;

const downstreamItems = [
  { key: "foodService", icon: Utensils, revenue: "daily" },
  { key: "foodProcessing", icon: Factory, revenue: "daily" },
  { key: "preservation", icon: Package, revenue: "daily" },
] as const;

const revenueModels = [
  { type: "daily", icon: CalendarDays },
  { type: "monthly", icon: CalendarRange },
  { type: "quarterly", icon: ChartNoAxesCombined },
  { type: "yearly", icon: BarChart3 },
] as const;

type ItemDefinition = {
  key: string;
  icon: typeof Leaf;
  revenue: RevenueType;
};

function EcosystemCard({
  item,
}: {
  item: {
    title: string;
    icon: typeof Leaf;
    revenue: RevenueType;
  };
}) {
  const t = useTranslations("About.businessEcosystem");
  const Icon = item.icon;
  const style = revenueStyles[item.revenue];

  return (
    <article
      className={`group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border p-3 transition-all duration-300 ${style.wrapper}`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${style.accent}`}
        aria-hidden="true"
      />

      <div
        className={`ml-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${style.icon}`}
      >
        <Icon
          className="size-5"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-display text-sm font-semibold leading-tight text-foreground">
          {item.title}
        </h4>
      </div>

      <span
        className={`size-2 shrink-0 rounded-full ${style.dot}`}
        title={t(`revenue.types.${item.revenue}`)}
        aria-label={t("revenue.indicator", {
          type: t(`revenue.types.${item.revenue}`),
        })}
      />
    </article>
  );
}

function StageColumn({
  title,
  items,
}: {
  title: string;
  items: {
    title: string;
    icon: typeof Leaf;
    revenue: RevenueType;
  }[];
}) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-brand-dark/10 bg-background">
      <div className="bg-brand-dark px-5 py-4 text-center">
        <h3 className="font-display text-lg font-semibold leading-tight text-white">
          {title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {items.map((item) => (
          <EcosystemCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function BusinessEcosystem() {
  const t = useTranslations("About.businessEcosystem");

  const makeItems = (
    definitions: readonly ItemDefinition[],
  ) =>
    definitions.map((item) => ({
      title: t(`items.${item.key}`),
      icon: item.icon,
      revenue: item.revenue,
    }));

  const upstreamSupport = makeItems(upstreamItems);
  const externalSupport = makeItems(externalItems);
  const preCultivation = makeItems(preCultivationItems);
  const duringCultivation = makeItems(duringCultivationItems);
  const postCultivation = makeItems(postCultivationItems);
  const downstream = makeItems(downstreamItems);

  return (
    <section
      aria-labelledby="business-ecosystem-title"
      className="relative overflow-hidden bg-muted"
    >
      {/* DECORATIVE BACKGROUND */}
      <div
        className="pointer-events-none absolute -left-48 -top-48 size-[520px] rounded-full bg-secondary/80 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-56 -right-48 size-[520px] rounded-full bg-accent/70 blur-3xl"
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* HEADER */}
        <header className="max-w-3xl">
          <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t("eyebrow")}
          </p>

          <h2
            id="business-ecosystem-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            {t("titleBefore")}{" "}
            <span className="text-primary">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </header>

        {/* ECOSYSTEM MAP */}
        <div className="mt-12 overflow-hidden rounded-[30px] border border-border bg-background p-5 shadow-sm sm:p-7 lg:p-8">
          {/* TOP ECOSYSTEM */}
          <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-center">
            {/* SUPPORTING ECOSYSTEM */}
            <div className="rounded-[24px] border border-dashed border-brand-secondary/50 bg-muted p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                  <Leaf
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                  {t("supporting.title")}
                </p>
              </div>

              <div className="space-y-3">
                {upstreamSupport.map((item) => (
                  <EcosystemCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            {/* CORE */}
            <div className="relative flex flex-col items-center">
              <div className="relative flex size-24 items-center justify-center rounded-full border-4 border-secondary bg-brand-dark text-white shadow-lg sm:size-28">
                <Waves
                  className="size-10 text-primary sm:size-12"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-brand-dark">
                  <CheckCircle2
                    className="size-4"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <h3 className="mt-4 text-center font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                {t("core.titleLine1")}
                <br />
                {t("core.titleLine2")}
              </h3>

              <ArrowRight
                className="absolute -left-1 top-1/2 hidden size-16 -translate-y-1/2 rotate-180 text-primary lg:block"
                strokeWidth={2.5}
                aria-hidden="true"
              />

              <ArrowRight
                className="absolute -right-1 top-1/2 hidden size-16 -translate-y-1/2 text-primary lg:block"
                strokeWidth={2.5}
                aria-hidden="true"
              />

              <ArrowDown
                className="mt-5 size-6 text-primary lg:hidden"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>

            {/* STRATEGIC SUPPORT */}
            <div className="rounded-[24px] border border-dashed border-brand-secondary/50 bg-muted p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                  <Handshake
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                  {t("strategic.title")}
                </p>
              </div>

              <div className="space-y-3">
                {externalSupport.map((item) => (
                  <EcosystemCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* CORE TO CULTIVATION */}
          <div className="my-7 flex flex-col items-center justify-center">
            <ArrowDown
              className="size-16 text-primary"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </div>

          {/* CULTIVATION FLOW */}
          <div className="relative rounded-[28px] border border-dashed border-brand-secondary/50 bg-muted/40 p-4 sm:p-5 lg:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-brand-secondary/20" />

              <span className="shrink-0 rounded-full border border-brand-secondary/20 bg-background px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
                {t("cultivationFlow")}
              </span>

              <div className="h-px flex-1 bg-brand-secondary/20" />
            </div>

            {/* 3-STAGE FLOW */}
            <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)_40px_minmax(0,1fr)] lg:gap-0">
              <StageColumn
                title={t("stages.pre")}
                items={preCultivation}
              />

              <div className="hidden items-center justify-center lg:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-brand-dark shadow-sm">
                  <ArrowRight
                    className="size-4"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <StageColumn
                title={t("stages.during")}
                items={duringCultivation}
              />

              <div className="hidden items-center justify-center lg:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-brand-dark shadow-sm">
                  <ArrowRight
                    className="size-4"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <StageColumn
                title={t("stages.post")}
                items={postCultivation}
              />
            </div>

            {/* MOBILE FLOW */}
            <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                {t("mobileFlow.from")}
              </span>

              <ArrowRight
                className="size-4 text-primary"
                strokeWidth={2.2}
                aria-hidden="true"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                {t("mobileFlow.to")}
              </span>
            </div>
          </div>

          {/* CULTIVATION TO DOWNSTREAM */}
          <div className="flex flex-col items-center">
            <div className="my-7 flex flex-col items-center justify-center">
              <ArrowDown
                className="size-16 text-primary"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>

            {/* DOWNSTREAM */}
            <div className="w-full">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px flex-1 bg-border" />

                <span className="shrink-0 rounded-full border border-brand-secondary/20 bg-background px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
                  {t("downstream.title")}
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {downstream.map((item) => (
                  <EcosystemCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* REVENUE MODEL */}
          <div className="mt-7 rounded-[22px] border border-border bg-muted/60 px-5 py-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark">
                  {t("revenue.title")}
                </span>
              </div>

              <div className="hidden h-5 w-px bg-brand-secondary/30 sm:block" />

              <div className="flex flex-wrap justify-center gap-2">
                {revenueModels.map((model) => {
                  const Icon = model.icon;
                  const style = revenueStyles[model.type];

                  return (
                    <div
                      key={model.type}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 ${style.legend}`}
                    >
                      <span
                        className={`size-2 shrink-0 rounded-full ${style.dot}`}
                        aria-hidden="true"
                      />

                      <Icon
                        className="size-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />

                      <span className="text-xs font-semibold">
                        {t(`revenue.types.${model.type}`)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}