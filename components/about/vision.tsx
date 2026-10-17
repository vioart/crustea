"use client";

import { CheckCircle2, Eye, Waves } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Vision() {
  const t = useTranslations("About.vision");

  const visionPoints = t.raw("points") as string[];

  return (
    <section
      aria-labelledby="vision-title"
      className="relative overflow-hidden bg-secondary"
    >
      {/* DECORATIVE BACKGROUND */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 size-[420px] rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -right-40 size-[420px] rounded-full bg-white/70 blur-3xl"
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[28px] border border-border bg-background shadow-sm">
          <div className="grid lg:grid-cols-[1fr_0.95fr]">
            {/* LEFT — VISION CONTENT */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-14">
              {/* Eyebrow */}
              <p className="mb-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                <Waves
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {t("eyebrow")}
              </p>

              {/* Title */}
              <h2
                id="vision-title"
                className="font-display text-4xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-[52px]"
              >
                {t("titleBefore")}{" "}
                <span className="text-primary">{t("titleHighlight")}</span>
              </h2>

              {/* Vision Statement */}
              <p className="mt-7 max-w-xl font-display text-xl font-medium leading-[1.35] tracking-tight text-foreground sm:text-2xl">
                {t("statementBefore")}{" "}
                <span className="text-brand-secondary">
                  {t("statementHighlight")}
                </span>
              </p>

              {/* Vision Points */}
              <ul className="mt-8 space-y-4">
                {visionPoints.map((point, index) => (
                  <li
                    key={`${index}-${point}`}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-brand-secondary"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span className="text-sm leading-6 text-muted-foreground sm:text-base">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT — IMAGE */}
            <div className="relative min-h-[320px] lg:min-h-[520px]">
              <img
                src="/img/visi.webp"
                alt={t("imageAlt")}
                width={1200}
                height={900}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Green Overlay */}
              <div
                className="absolute inset-0 bg-primary/45 mix-blend-multiply"
                aria-hidden="true"
              />

              {/* Dark Gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"
                aria-hidden="true"
              />

              {/* Image Content */}
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center sm:p-12">
                <div className="max-w-md">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm">
                    <Eye
                      className="size-6"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl">
                    {t("imageTitleLine1")}
                    <br />
                    {t("imageTitleLine2")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
