
import { getTranslations } from "next-intl/server";
import {
  ClipboardList,
  ClipboardCheck,
  FileSearch,
  Award,
  ShieldCheck,
  Leaf,
  HeartPulse,
  ArrowDown,
  CheckCircle2,
  Clock3,
  Waves,
  Target,
} from "lucide-react";

const milestones = [
  {
    key: "documentation",
    icon: ClipboardList,
    status: "progress",
    period: "Q4 2026",
  },
  {
    key: "internalAudit",
    icon: ClipboardCheck,
    status: "progress",
    period: "Q4 2026",
  },
  {
    key: "certificationAudit",
    icon: FileSearch,
    status: "planned",
    period: "2027",
  },
  {
    key: "certificate",
    icon: Award,
    status: "planned",
    period: "2027",
  },
] as const;

const standards = [
  {
    key: "quality",
    code: "ISO 9001:2015",
    icon: ShieldCheck,
  },
  {
    key: "environment",
    code: "ISO 14001:2015",
    icon: Leaf,
  },
  {
    key: "safety",
    code: "ISO 45001:2018",
    icon: HeartPulse,
  },
] as const;

export default async function Roadmap() {
  const t = await getTranslations("Roadmap.content");

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#abc937]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-20 h-80 w-80 rounded-full bg-[#658c64]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* INTRODUCTION — revisi heading saja */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t("eyebrow")}
          </p>

          <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]">
            {t("headingBefore")}{" "}
            <span className="text-primary">
              {t("headingHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("description")}
          </p>
        </div>

        {/* CURRENT STATUS */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
            <Clock3 className="h-4 w-4" />
            {t("status.progress")}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            {t("status.planned")}
          </span>
        </div>

        {/* TIMELINE — desain sebelumnya dipertahankan */}
        <div className="relative mx-auto max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute bottom-12 left-6 top-12 w-px bg-gradient-to-b from-[#abc937] via-[#658c64]/60 to-slate-200 md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-8 md:space-y-10">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isInProgress = milestone.status === "progress";
              const isLeft = index % 2 === 0;

              return (
                <article
                  key={milestone.key}
                  className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-4 md:grid-cols-[1fr_5rem_1fr] md:gap-0"
                >
                  {/* TIMELINE NODE */}
                  <div className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white shadow-md ${
                        isInProgress
                          ? "bg-[#abc937] text-[#05546a]"
                          : "bg-[#e8eee7] text-[#658c64]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* MILESTONE CARD */}
                  <div
                    className={`col-start-2 row-start-1 min-w-0 rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7 ${
                      isInProgress
                        ? "border-[#abc937]/50 bg-[#fbfdf5]"
                        : "border-slate-200 bg-white"
                    } ${
                      isLeft
                        ? "md:col-start-1 md:row-start-1"
                        : "md:col-start-3 md:row-start-1"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#658c64]">
                        {t("step", { number: index + 1 })}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isInProgress
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t(`status.${milestone.status}`)}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-[#05546a]">
                      {t(`milestones.${milestone.key}.title`)}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {t(`milestones.${milestone.key}.description`)}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-4 text-sm font-semibold text-[#05546a]">
                      <Clock3 className="h-4 w-4 text-[#658c64]" />
                      {t("target")}: <span>{milestone.period}</span>
                    </div>
                  </div>

                  {/* DESKTOP CONNECTOR */}
                  <div
                    aria-hidden="true"
                    className={`hidden items-center md:flex ${
                      isLeft
                        ? "col-start-3 row-start-1 justify-start"
                        : "col-start-1 row-start-1 justify-end"
                    }`}
                  >
                    <div className="h-px w-8 bg-[#658c64]/40" />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="relative z-10 mt-10 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-[#658c64]/20 bg-white px-5 py-3 text-sm font-medium text-[#658c64] shadow-sm">
              <ArrowDown className="h-4 w-4" />
              {t("timelineEnd")}
            </div>
          </div>
        </div>

        {/* ISO STANDARDS — desain sebelumnya dipertahankan */}
        <div className="mt-24 md:mt-32">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#658c64]">
              {t("standards.eyebrow")}
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#05546a] sm:text-4xl">
              {t("standards.heading")}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              {t("standards.description")}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {standards.map((standard) => {
              const Icon = standard.icon;

              return (
                <article
                  key={standard.key}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#658c64]/50 hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#658c64]/10 text-[#658c64] transition-colors group-hover:bg-[#abc937]/30">
                    <Icon className="h-7 w-7" />
                  </div>

                  <p className="mt-6 text-sm font-bold tracking-wide text-[#658c64]">
                    {standard.code}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-[#05546a]">
                    {t(`standards.items.${standard.key}.title`)}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {t(`standards.items.${standard.key}.description`)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
        
        {/* COMMITMENT */}
        <div className="mt-24 border-t border-border pt-12 md:mt-28 md:pt-16">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                <Target
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {t("commitment.eyebrow")}
              </p>

              <h2 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl">
                {t("commitment.headingBefore")}{" "}
                <span className="text-primary">
                  {t("commitment.headingHighlight")}
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
                {t("commitment.description")}
              </p>
            </div>

            <div className="border-l-2 border-primary pl-5">
              <p className="text-sm text-muted-foreground">{t("asOf")}</p>
              <p className="mt-1 font-display text-lg font-semibold text-foreground">
                {t("reportingPeriod")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
