"use client";

import { useTranslations } from "next-intl";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck,
  Handshake,
  Landmark,
  Leaf,
  PackageCheck,
  Sprout,
  TrendingUp,
  Wallet,
  Waves,
} from "lucide-react";

const pathwayIcons = [Sprout, TrendingUp];

const benefitIcons = [
  Leaf,
  CircleDollarSign,
  TrendingUp,
];

const stageIcons = [
  ClipboardCheck,
  FileCheck,
  Handshake,
  Wallet,
  Waves,
  PackageCheck,
  CircleDollarSign,
  TrendingUp,
];

export default function AquaGrowthPartnership() {
  const t = useTranslations("AquaGrowth.partnership");

  return (
    <section className="relative overflow-hidden bg-secondary/30">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 size-[400px] rounded-full bg-brand-secondary/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-20 size-[400px] rounded-full bg-lime-400/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-secondary/20 bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-secondary">
            <Handshake className="size-4" aria-hidden="true" />
            {t("eyebrow")}
          </span>

          <h2 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("description")}
          </p>
        </div>

        {/* Partnership pathways */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
          {pathwayIcons.map((Icon, index) => {
            const pathway =
              index === 0 ? "farmer" : "investor";

            return (
              <article
                key={pathway}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-secondary to-lime-400"
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-brand-secondary group-hover:text-white">
                    <Icon
                      className="size-7"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    {t(`pathways.${pathway}.label`)}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {t(`pathways.${pathway}.title`)}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(`pathways.${pathway}.description`)}
                </p>

                {/* Eligibility */}
                <div className="mt-7">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ClipboardCheck
                      className="size-4 text-brand-secondary"
                      aria-hidden="true"
                    />
                    {t("eligibilityTitle")}
                  </h4>

                  <ul className="mt-4 space-y-3">
                    {[0, 1, 2].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-brand-secondary"
                          aria-hidden="true"
                        />
                        <span>
                          {t(
                            `pathways.${pathway}.eligibility.${item}`,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mt-7 border-t border-border pt-6">
                  <h4 className="text-sm font-semibold text-foreground">
                    {t("benefitsTitle")}
                  </h4>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    {benefitIcons.map((BenefitIcon, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3"
                      >
                        <BenefitIcon
                          className="mt-0.5 size-4 shrink-0 text-brand-secondary"
                          aria-hidden="true"
                        />

                        <span className="text-xs leading-5 text-foreground">
                          {t(
                            `pathways.${pathway}.benefits.${benefitIndex}`,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Investment flow heading */}
        <div className="mx-auto mt-20 max-w-3xl text-center sm:mt-24">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
            {t("flow.eyebrow")}
          </span>

          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl lg:text-4xl">
            {t("flow.title")}
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("flow.description")}
          </p>
        </div>

        {/* Eight-stage flow */}
        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stageIcons.map((Icon, index) => (
              <article
                key={index}
                className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-3xl font-bold text-brand-secondary/35 transition-colors group-hover:text-brand-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-brand-secondary">
                    <Icon
                      className="size-5"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <h4 className="mt-5 text-sm font-semibold leading-6 text-foreground">
                  {t(`flow.stages.${index}.title`)}
                </h4>

                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {t(`flow.stages.${index}.description`)}
                </p>

                {index < stageIcons.length - 1 && (
                  <ArrowRight
                    className="absolute -right-[13px] top-1/2 z-10 hidden size-6 -translate-y-1/2 rounded-full border border-border bg-card p-1 text-brand-secondary lg:block"
                    aria-hidden="true"
                  />
                )}
              </article>
            ))}
          </div>

          {/* Flow continuation */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-secondary/20 bg-card px-5 py-5 text-center sm:flex-row sm:gap-4 sm:text-left">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary">
              <ArrowDown className="size-5" aria-hidden="true" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {t("flow.cycleTitle")}
              </h4>

              <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
                {t("flow.cycleDescription")}
              </p>
            </div>

            <div className="sm:ml-auto">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-brand-dark">
                <TrendingUp className="size-4" aria-hidden="true" />
                {t("flow.cycleLabel")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}