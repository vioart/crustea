
"use client";

import {
  AlertCircle,
  Copyright,
  FileText,
  Globe2,
  Info,
  Link2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

const sections = [
  { number: "01", key: "websiteUsage", icon: FileText },
  { number: "02", key: "websiteInformation", icon: Info },
  { number: "03", key: "intellectualProperty", icon: Copyright },
  { number: "04", key: "permittedUse", icon: ShieldCheck },
  { number: "05", key: "thirdPartyLinks", icon: Link2 },
  { number: "06", key: "websiteAvailability", icon: Globe2 },
  { number: "07", key: "disclaimer", icon: AlertCircle },
  { number: "08", key: "changes", icon: RefreshCw },
  { number: "09", key: "contact", icon: Mail },
] as const;

export default function TermsSection() {
  const t = useTranslations("Terms.content");

  return (
    <>
      {/* INTRO */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute -left-40 top-20 size-[360px] rounded-full bg-secondary/50 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-40 bottom-0 size-[360px] rounded-full bg-accent/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              {t("intro.eyebrow")}
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {t("intro.heading")}
            </h2>

            <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
              {t("intro.description")}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              <RefreshCw
                className="size-4 text-brand-secondary"
                aria-hidden="true"
              />
              {t("intro.lastUpdated")}
            </div>
          </div>
        </div>
      </section>

      {/* TERMS CONTENT */}
      <section className="relative border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
            {/* TABLE OF CONTENTS */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 h-fit">
                <div className="rounded-[24px] border border-border bg-background p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                    {t("tableOfContents")}
                  </p>

                  <nav
                    className="mt-4 space-y-1"
                    aria-label={t("tableOfContents")}
                  >
                    {sections.map((section) => (
                      <a
                        key={section.number}
                        href={`#terms-${section.number}`}
                        className="flex items-start gap-3 rounded-lg px-3 py-2 text-sm leading-5 text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-dark"
                      >
                        <span className="shrink-0 font-semibold text-brand-secondary">
                          {section.number}
                        </span>

                        <span>{t(`sections.${section.key}.title`)}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>

            {/* TERMS ARTICLES */}
            <div className="min-w-0 space-y-5">
              {sections.map((section) => {
                const Icon = section.icon;
                const base = `sections.${section.key}`;

                return (
                  <article
                    key={section.number}
                    id={`terms-${section.number}`}
                    className="scroll-mt-28 rounded-[24px] border border-border bg-background p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary">
                        <Icon
                          className="size-5"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold tracking-[0.14em] text-brand-secondary">
                            {section.number}
                          </span>

                          <span
                            className="h-px w-6 bg-border"
                            aria-hidden="true"
                          />
                        </div>

                        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                          {t(`${base}.title`)}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4 pl-0 text-[14px] leading-7 text-muted-foreground sm:pl-[60px]">
                      {section.key === "websiteUsage" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                        </>
                      )}

                      {section.key === "websiteInformation" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "intellectualProperty" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "permittedUse" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.listIntro`)}</p>
                          <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
                            {Array.from({ length: 5 }, (_, index) => (
                              <li key={index}>
                                {t(`${base}.items.${index}`)}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {section.key === "thirdPartyLinks" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "websiteAvailability" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                        </>
                      )}

                      {section.key === "disclaimer" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                        </>
                      )}

                      {section.key === "changes" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "contact" && (
                        <>
                          <p>{t(`${base}.description`)}</p>

                          <div className="rounded-2xl border border-border bg-muted/40 p-5">
                            <p className="font-semibold text-foreground">
                              PT Eco Karya Teknologi
                            </p>

                            <div className="mt-3 space-y-2 text-[14px] leading-6">
                              <p>
                                Ground Floor Crustea Labs,
                                <br />
                                Jl. Sanggung Timur No. 1,
                                <br />
                                Jatingaleh, Semarang,
                                <br />
                                Jawa Tengah 50254
                              </p>

                              <p>
                                {t(`${base}.emailLabel`)}{" "}
                                <a
                                  href="mailto:info@crustea.id"
                                  className="font-medium text-brand-secondary transition-colors hover:text-brand-dark"
                                >
                                  info@crustea.id
                                </a>
                              </p>

                              <p>
                                {t(`${base}.whatsappLabel`)}{" "}
                                <a
                                  href="https://wa.me/6282140773592"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-brand-secondary transition-colors hover:text-brand-dark"
                                >
                                  +62 821-4077-3592
                                </a>
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
