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

type RevenueType = "daily" | "monthly" | "quarterly" | "yearly";

type EcosystemItem = {
  title: string;
  icon: typeof Leaf;
  revenue: RevenueType;
};

/* =========================================================
   ECOSYSTEM DATA
========================================================= */

const preCultivation: EcosystemItem[] = [
  {
    title: "Funding & Financial Collaboration",
    icon: Banknote,
    revenue: "quarterly",
  },
  {
    title: "Pond Revitalization & Consultation",
    icon: Wrench,
    revenue: "quarterly",
  },
];

const duringCultivation: EcosystemItem[] = [
  {
    title: "Eco & Mini Aerator, Solar Panel, EBII System, Smart Energy",
    icon: Settings,
    revenue: "daily",
  },
  {
    title: "Technology Maintenance & Farming Assistance",
    icon: RefreshCw,
    revenue: "monthly",
  },
];

const postCultivation: EcosystemItem[] = [
  {
    title: "Marketplace",
    icon: Store,
    revenue: "monthly",
  },
  {
    title: "Trading: Local & Global Selling / Shipping",
    icon: ShoppingBag,
    revenue: "quarterly",
  },
];

const upstreamSupport: EcosystemItem[] = [
  {
    title: "Eco-Tourism",
    icon: Leaf,
    revenue: "monthly",
  },
  {
    title: "Workshop & Training",
    icon: GraduationCap,
    revenue: "monthly",
  },
];

const externalSupport: EcosystemItem[] = [
  {
    title: "CSR, Sustainability & Energy Transition Projects",
    icon: Megaphone,
    revenue: "yearly",
  },
  {
    title: "Empowerment Programs",
    icon: Users,
    revenue: "yearly",
  },
];

const downstream: EcosystemItem[] = [
  {
    title: "F&B",
    icon: Utensils,
    revenue: "daily",
  },
  {
    title: "Food Processing",
    icon: Factory,
    revenue: "daily",
  },
  {
    title: "Preservation",
    icon: Package,
    revenue: "daily",
  },
];

/* =========================================================
   REVENUE STYLES
========================================================= */

const revenueStyles = {
  daily: {
    label: "Daily",
    description: "Aktivitas dengan aliran pendapatan harian",

    wrapper:
      "border-[#E78A5B]/30 bg-[#E78A5B]/10 hover:border-[#E78A5B]/60 hover:bg-[#E78A5B]/15",

    icon: "bg-[#E78A5B] text-white",
    accent: "bg-[#E78A5B]",
    dot: "bg-[#E78A5B]",

    legend:
      "border-[#E78A5B]/30 bg-[#E78A5B]/10 text-brand-dark hover:border-[#E78A5B]/50",
  },

  monthly: {
    label: "Monthly",
    description: "Aktivitas dengan aliran pendapatan bulanan",

    wrapper:
      "border-[#4F9FC4]/30 bg-[#4F9FC4]/10 hover:border-[#4F9FC4]/60 hover:bg-[#4F9FC4]/15",

    icon: "bg-[#4F9FC4] text-white",
    accent: "bg-[#4F9FC4]",
    dot: "bg-[#4F9FC4]",

    legend:
      "border-[#4F9FC4]/30 bg-[#4F9FC4]/10 text-brand-dark hover:border-[#4F9FC4]/50",
  },

  quarterly: {
    label: "Quarterly",
    description: "Aktivitas dengan aliran pendapatan per kuartal",

    wrapper:
      "border-[#7B72B5]/30 bg-[#7B72B5]/10 hover:border-[#7B72B5]/60 hover:bg-[#7B72B5]/15",

    icon: "bg-[#7B72B5] text-white",
    accent: "bg-[#7B72B5]",
    dot: "bg-[#7B72B5]",

    legend:
      "border-[#7B72B5]/30 bg-[#7B72B5]/10 text-brand-dark hover:border-[#7B72B5]/50",
  },

  yearly: {
    label: "Yearly",
    description: "Aktivitas dengan aliran pendapatan tahunan",

    wrapper:
      "border-[#C49A3A]/30 bg-[#C49A3A]/10 hover:border-[#C49A3A]/60 hover:bg-[#C49A3A]/15",

    icon: "bg-[#C49A3A] text-white",
    accent: "bg-[#C49A3A]",
    dot: "bg-[#C49A3A]",

    legend:
      "border-[#C49A3A]/30 bg-[#C49A3A]/10 text-brand-dark hover:border-[#C49A3A]/50",
  },
};
/* =========================================================
   REVENUE LEGEND
========================================================= */

const revenueModels = [
  {
    label: "Daily",
    icon: CalendarDays,
    type: "daily" as RevenueType,
  },
  {
    label: "Monthly",
    icon: CalendarRange,
    type: "monthly" as RevenueType,
  },
  {
    label: "Quarterly",
    icon: ChartNoAxesCombined,
    type: "quarterly" as RevenueType,
  },
  {
    label: "Yearly",
    icon: BarChart3,
    type: "yearly" as RevenueType,
  },
];

/* =========================================================
   ECOSYSTEM CARD
========================================================= */

function EcosystemCard({
  item,
}: {
  item: EcosystemItem;
}) {
  const Icon = item.icon;
  const style = revenueStyles[item.revenue];

  return (
    <article
      className={`group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border p-3 transition-all duration-300 ${style.wrapper}`}
    >
      {/* Revenue accent */}
      <div
        className={`absolute inset-y-0 left-0 w-1 ${style.accent}`}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className={`ml-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${style.icon}`}
      >
        <Icon
          className="size-5"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-sm font-semibold leading-tight text-foreground">
          {item.title}
        </h4>
      </div>

      {/* Revenue indicator */}
      <span
        className={`size-2 shrink-0 rounded-full ${style.dot}`}
        title={style.label}
        aria-label={`Revenue ${style.label}`}
      />
    </article>
  );
}

/* =========================================================
   STAGE COLUMN
========================================================= */

function StageColumn({
  title,
  items,
}: {
  title: string;
  items: EcosystemItem[];
}) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-brand-dark/10 bg-background">
      {/* Header */}
      <div className="bg-brand-dark px-5 py-4 text-center">
        <h3 className="font-display text-lg font-semibold leading-tight text-white">
          {title}
        </h3>
      </div>

      {/* Items */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {items.map((item) => (
          <EcosystemCard
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function BusinessEcosystem() {
  return (
    <section
      aria-labelledby="business-ecosystem-title"
      className="relative overflow-hidden bg-muted"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute -left-48 -top-48 size-[520px] rounded-full bg-secondary/80 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-56 -right-48 size-[520px] rounded-full bg-accent/70 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="max-w-3xl">
          <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            Ekosistem Bisnis
          </p>

          <h2
            id="business-ecosystem-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Menghubungkan setiap bagian dari{" "}
            <span className="text-primary">
              ekosistem akuakultur.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            Crustea membangun ekosistem yang menghubungkan pembudidaya,
            teknologi, pembiayaan, pendampingan, pasar, hingga pengolahan hasil
            untuk menciptakan rantai nilai akuakultur yang lebih terintegrasi.
          </p>
        </header>

        {/* =================================================
            ECOSYSTEM MAP
        ================================================= */}

        <div className="mt-12 overflow-hidden rounded-[30px] border border-border bg-background p-5 shadow-sm sm:p-7 lg:p-8">
          {/* =================================================
              TOP ECOSYSTEM
          ================================================= */}

          <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-center">
            {/* =================================================
                LEFT SUPPORTING ECOSYSTEM
            ================================================= */}

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
                  Supporting Ecosystem
                </p>
              </div>

              <div className="space-y-3">
                {upstreamSupport.map((item) => (
                  <EcosystemCard
                    key={item.title}
                    item={item}
                  />
                ))}
              </div>
            </div>

            {/* =================================================
                CORE
            ================================================= */}

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
                Shrimp & Fish
                <br />
                Cultivation
              </h3>

              {/* Desktop side arrows */}
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

              {/* Mobile/down flow */}
              <ArrowDown
                className="mt-5 size-6 text-primary lg:hidden"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>

            {/* =================================================
                RIGHT STRATEGIC SUPPORT
            ================================================= */}

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
                  Strategic Support
                </p>
              </div>

              <div className="space-y-3">
                {externalSupport.map((item) => (
                  <EcosystemCard
                    key={item.title}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              CORE → CULTIVATION FLOW
          ================================================= */}

          <div className="my-7 flex flex-col items-center justify-center">
            <ArrowDown
              className="size-16 text-primary"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </div>

          {/* =================================================
              CULTIVATION FLOW
          ================================================= */}

          <div className="relative rounded-[28px] border border-dashed border-brand-secondary/50 bg-muted/40 p-4 sm:p-5 lg:p-6">
            {/* Flow Label */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-brand-secondary/20" />

              <span className="shrink-0 rounded-full border border-brand-secondary/20 bg-background px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
                Cultivation Flow
              </span>

              <div className="h-px flex-1 bg-brand-secondary/20" />
            </div>

            {/* =================================================
                5-COLUMN FLOW
            ================================================= */}

            <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)_40px_minmax(0,1fr)] lg:gap-0">
              {/* PRE-CULTIVATION */}

              <StageColumn
                title="Pre-Cultivation"
                items={preCultivation}
              />

              {/* ARROW 01 */}

              <div className="hidden items-center justify-center lg:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-brand-dark shadow-sm">
                  <ArrowRight
                    className="size-4"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* DURING CULTIVATION */}

              <StageColumn
                title="During Cultivation"
                items={duringCultivation}
              />

              {/* ARROW 02 */}

              <div className="hidden items-center justify-center lg:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-brand-dark shadow-sm">
                  <ArrowRight
                    className="size-4"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* POST-CULTIVATION */}

              <StageColumn
                title="Post-Cultivation"
                items={postCultivation}
              />
            </div>

            {/* Mobile Flow */}

            <div className="mt-4 flex items-center justify-center gap-2 lg:hidden">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                Alur
              </span>

              <ArrowRight
                className="size-4 text-primary"
                strokeWidth={2.2}
                aria-hidden="true"
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
                Budidaya
              </span>
            </div>
          </div>

          {/* =================================================
              CULTIVATION → DOWNSTREAM
          ================================================= */}

          <div className="flex flex-col items-center">
            <div className="my-7 flex flex-col items-center justify-center">
              <ArrowDown
                className="size-16 text-primary"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </div>

            {/* Downstream */}

            <div className="w-full">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="h-px flex-1 bg-border" />

                <span className="shrink-0 rounded-full border border-brand-secondary/20 bg-background px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
                  Downstream
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {downstream.map((item) => (
                  <EcosystemCard
                    key={item.title}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              REVENUE MODEL
          ================================================= */}

          <div className="mt-7 rounded-[22px] border border-border bg-muted/60 px-5 py-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {/* Revenue Label */}

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark">
                  Revenue
                </span>
              </div>

              <div className="hidden h-5 w-px bg-brand-secondary/30 sm:block" />

              {/* Revenue Legend */}

              <div className="flex flex-wrap justify-center gap-2">
                {revenueModels.map((model) => {
                  const Icon = model.icon;
                  const style = revenueStyles[model.type];

                  return (
                    <div
                      key={model.label}
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
                        {model.label}
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