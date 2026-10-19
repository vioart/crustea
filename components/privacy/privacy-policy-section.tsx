"use client";

import {
  Cookie,
  Database,
  FileText,
  Globe2,
  LockKeyhole,
  Mail,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

const sectionKeys = [
  { number: "01", key: "introduction", icon: FileText },
  { number: "02", key: "collectedInformation", icon: Database },
  { number: "03", key: "dataUsage", icon: Settings2 },
  { number: "04", key: "cookies", icon: Cookie },
  { number: "05", key: "thirdParties", icon: Users },
  { number: "06", key: "storageSecurity", icon: LockKeyhole },
  { number: "07", key: "userRights", icon: ShieldCheck },
  { number: "08", key: "externalLinks", icon: Globe2 },
  { number: "09", key: "policyChanges", icon: RefreshCw },
  { number: "10", key: "contact", icon: Mail },
] as const;

export default function PrivacyPolicySection() {
  const t = useTranslations("PrivacyPolicy.content");

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

            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {t("intro.heading")}
            </h1>

            <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
              {t("intro.description")}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldCheck
                className="size-4 text-brand-secondary"
                aria-hidden="true"
              />
              {t("intro.lastUpdated")}
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY CONTENT */}
      <section className="relative border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
            {/* SIDEBAR */}
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
                    {sectionKeys.map((section) => (
                      <a
                        key={section.number}
                        href={`#privacy-${section.number}`}
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

            {/* SECTIONS */}
            <div className="min-w-0 space-y-5">
              {sectionKeys.map((section) => {
                const Icon = section.icon;
                const base = `sections.${section.key}`;

                return (
                  <article
                    key={section.number}
                    id={`privacy-${section.number}`}
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

                    <div className="privacy-content mt-6 space-y-4 pl-0 text-[14px] leading-7 text-muted-foreground sm:pl-[60px]">
                      {section.key === "introduction" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                        </>
                      )}

                      {section.key === "collectedInformation" && (
                        <>
                          <p>{t(`${base}.description`)}</p>
                          <h4 className="font-semibold text-foreground">
                            {t(`${base}.directTitle`)}
                          </h4>
                          <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
                            {Array.from({ length: 6 }, (_, i) => (
                              <li key={i}>{t(`${base}.directItems.${i}`)}</li>
                            ))}
                          </ul>
                          <h4 className="font-semibold text-foreground">
                            {t(`${base}.automaticTitle`)}
                          </h4>
                          <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
                            {Array.from({ length: 6 }, (_, i) => (
                              <li key={i}>
                                {t(`${base}.automaticItems.${i}`)}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {section.key === "dataUsage" && (
                        <>
                          <p>{t(`${base}.description`)}</p>
                          <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
                            {Array.from({ length: 7 }, (_, i) => (
                              <li key={i}>{t(`${base}.items.${i}`)}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {section.key === "cookies" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "thirdParties" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "storageSecurity" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "userRights" && (
                        <>
                          <p>{t(`${base}.description`)}</p>
                          <ul className="list-disc space-y-2 pl-5 marker:text-brand-secondary">
                            {Array.from({ length: 5 }, (_, i) => (
                              <li key={i}>{t(`${base}.items.${i}`)}</li>
                            ))}
                          </ul>
                          <p>{t(`${base}.closing`)}</p>
                        </>
                      )}

                      {section.key === "externalLinks" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                          <p>{t(`${base}.paragraph3`)}</p>
                        </>
                      )}

                      {section.key === "policyChanges" && (
                        <>
                          <p>{t(`${base}.paragraph1`)}</p>
                          <p>{t(`${base}.paragraph2`)}</p>
                        </>
                      )}

                      {section.key === "contact" && (
                        <>
                          <p>{t(`${base}.description`)}</p>

                          <div className="mt-5 rounded-2xl border border-border bg-secondary/50 p-5">
                            <p className="font-semibold text-foreground">
                              PT Eco Karya Teknologi
                            </p>

                            <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                              <p>
                                Ground Floor Crustea Labs
                                <br />
                                Jl. Sanggung Timur No. 1
                                <br />
                                Jatingaleh, Semarang
                                <br />
                                Jawa Tengah 50254
                              </p>

                              <p>
                                Email:{" "}
                                <a
                                  href="mailto:info@crustea.id"
                                  className="font-medium text-brand-dark transition-colors hover:text-brand-secondary"
                                >
                                  info@crustea.id
                                </a>
                              </p>

                              <p>
                                WhatsApp:{" "}
                                <a
                                  href="https://wa.me/6282140773592"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-brand-dark transition-colors hover:text-brand-secondary"
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
