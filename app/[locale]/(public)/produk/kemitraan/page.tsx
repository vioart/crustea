"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

type Partner = {
  id: number;
  name?: string;
  logo: string;
};

type PartnershipProject = {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  imageAlt: string;
  partners: Partner[];
};

type ApiRecord = Record<string, unknown>;

function isApiRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(
  /\/+$/,
  "",
);

const PROJECTS_PER_PAGE = 6;

function assetUrl(path?: string | null): string {
  if (!path) return "";

  // URL absolut tidak perlu diubah.
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Hilangkan slash di awal agar path konsisten.
  const normalizedPath = path.replace(/^\/+/, "");

  // Logo mitra disimpan di storage/partners.
  // API mengembalikan path relatif: partners/namafile.png
  const uploadPath = normalizedPath.startsWith("uploads/")
    ? normalizedPath
    : `uploads/${normalizedPath}`;

  return `${API_BASE_URL}/${uploadPath}`;
}

function pickText(...values: unknown[]): string {
  const value = values.find(
    (item) => typeof item === "string" && item.trim().length > 0,
  );
  return typeof value === "string" ? value : "";
}

function normalizeProject(value: unknown, index: number, locale: string): PartnershipProject {
  const isEnglish = locale === "en";
  const item: ApiRecord = isApiRecord(value) ? value : {};

  const rawPartners =
    getArray(item.partners).length > 0
      ? getArray(item.partners)
      : getArray(item.partner);

  return {
    id: Number(item.id ?? index + 1),

    name: pickText(
      ...(isEnglish
        ? [item.name_en, item.title_en, item.name, item.title, item.name_id, item.title_id]
        : [item.name_id, item.name_idn, item.title_id, item.name, item.title, item.name_en, item.title_en]),
      isEnglish ? "Partnership Project" : "Proyek Kemitraan",
    ),

    description: pickText(
      ...(isEnglish
        ? [item.description_en, item.short_description_en, item.description, item.short_description, item.description_id, item.short_description_id]
        : [item.description_id, item.description_idn, item.short_description_id, item.description, item.short_description, item.description_en, item.short_description_en]),
    ),

    fullDescription: pickText(
      ...(isEnglish
        ? [item.full_description_en, item.long_description_en, item.full_description, item.long_description, item.description_en, item.description]
        : [item.full_description_id, item.long_description_id, item.full_description, item.long_description, item.description_id, item.description_idn, item.description]),
    ),

    image: assetUrl(
      pickText(
        item.image,
        item.image_url,
        item.thumbnail,
        item.thumbnail_url,
        item.cover_image,
      ),
    ),

    imageAlt: pickText(
      isEnglish ? item.image_alt_en : item.image_alt_id,
      item.image_alt,
      item.imageAlt,
      isEnglish ? item.name_en : item.name_id,
      item.name,
      isEnglish ? "Partnership project image" : "Gambar proyek kemitraan",
    ),

    partners: rawPartners
      .filter(isApiRecord)
      .map((partner, partnerIndex) => ({
        id: Number(partner.id ?? partner.partner_id ?? partnerIndex + 1),
        name: pickText(...(isEnglish ? [partner.name_en, partner.name, partner.name_id] : [partner.name_id, partner.name, partner.name_en])) ,
        logo: assetUrl(
          pickText(
            partner.logo,
            partner.logo_url,
            partner.logo_path,
            partner.image,
          ),
        ),
      }))
      .filter((partner) => Boolean(partner.logo)),
  };
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PartnershipPage() {
  const locale = useLocale();
  const t = useTranslations("Partnership");
  const [projects, setProjects] = useState<PartnershipProject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedProject, setSelectedProject] =
    useState<PartnershipProject | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          `${API_BASE_URL}/api/partnership-projects`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            t("projects.errorDescription"),
          );
        }

        const result: unknown = await response.json();

        let records: unknown[] = [];

        if (Array.isArray(result)) {
          records = result;
        } else if (isApiRecord(result)) {
          if (Array.isArray(result.data)) {
            records = result.data;
          } else if (
            isApiRecord(result.data) &&
            Array.isArray(result.data.items)
          ) {
            records = result.data.items;
          } else if (Array.isArray(result.projects)) {
            records = result.projects;
          }
        }

        setProjects(
          records.map((record, index) =>
            normalizeProject(record, index, locale),
          ),
        );
        setCurrentPage(1);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Failed to load partnership projects:", error);
        setLoadError(t("projects.errorDescription"));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProjects();
    return () => controller.abort();
  }, [locale, t]);

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  const paginationItems = useMemo<(number | "...")[]>(() => {
    if (totalPages <= 1) return [];

    const pages = new Set<number>([1, totalPages]);
    for (
      let page = Math.max(1, currentPage - 1);
      page <= Math.min(totalPages, currentPage + 1);
      page++
    ) {
      pages.add(page);
    }

    const sortedPages = [...pages].sort((a, b) => a - b);
    const items: (number | "...")[] = [];

    sortedPages.forEach((page, index) => {
      if (index > 0) {
        const previousPage = sortedPages[index - 1];
        if (page - previousPage === 2) {
          items.push(previousPage + 1);
        } else if (page - previousPage > 2) {
          items.push("...");
        }
      }
      items.push(page);
    });

    return items;
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <main className="min-h-screen bg-white text-[#123D45]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F1F5ED]">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#ABC937]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pt-28 pb-24 sm:px-10 sm:pt-28 sm:pb-28 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:pt-24 lg:pb-32">
          <div>
            <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#05546A] sm:text-4xl lg:text-5xl">
              {t("hero.title")} {" "}
              <span className="text-[#658C64]">{t("hero.highlight")}</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              {t("hero.description")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#05546A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#073F4E]"
              >
                {t("hero.exploreButton")}
                <ArrowIcon />
              </a>

              <Link
                href="/kontak"
                className="inline-flex items-center gap-2.5 rounded-full border border-[#05546A]/20 bg-white px-5 py-3 text-sm font-semibold text-[#05546A] transition hover:border-[#05546A] hover:bg-[#F1F5ED]"
              >
                {t("hero.contactButton")}
              </Link>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-[2.5rem] border-l-2 border-t-2 border-[#ABC937]" />

            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#DCE8DC] shadow-lg">
              <div
                role="img"
                aria-label={t("hero.imageAlt")}
                className="aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1400&q=90')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#073F4E]/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D7E8A0]">
                  {t("hero.visionLabel")}
                </p>

                <h2 className="mt-2 max-w-md text-xl font-semibold leading-snug text-white sm:text-2xl">
                  {t("hero.visionTitle")}
                </h2>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-3 hidden rounded-xl border border-[#658C64]/15 bg-white p-4 shadow-md sm:block">
              <p className="text-sm font-semibold text-[#05546A]">
                {t("hero.floatingTitle")}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {t("hero.floatingDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNERSHIP */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#658C64]">
              {t("whyPartnership.eyebrow")}
            </p>

            <h2 className="mt-3 max-w-lg text-2xl font-bold leading-tight text-[#05546A] sm:text-3xl">
              {t("whyPartnership.title")}
            </h2>
          </div>

          <div>
            <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              {t("whyPartnership.description")}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-[#F8FAF6] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E5EDDA] text-sm font-bold text-[#05546A]">
                  01
                </div>

                <h3 className="mt-4 text-base font-bold text-[#05546A]">
                  {t("whyPartnership.benefits.expertise.title")}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("whyPartnership.benefits.expertise.description")}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#F8FAF6] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E5EDDA] text-sm font-bold text-[#05546A]">
                  02
                </div>

                <h3 className="mt-4 text-base font-bold text-[#05546A]">
                  {t("whyPartnership.benefits.innovation.title")}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t("whyPartnership.benefits.innovation.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="scroll-mt-24 bg-[#F7F9F5] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          {/* SECTION HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#658C64]">
                {t("projects.eyebrow")}
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-tight text-[#05546A] sm:text-3xl">
                {t("projects.title")}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {t("projects.description")}
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {t("projects.projectCount", { count: projects.length })}
            </span>
          </div>

          {/* PROJECT CARDS */}
          <div className="mt-9 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-7">
            {paginatedProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedProject(project)}
                aria-label={t("projects.detailAriaLabel", { name: project.name })}
                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#658C64]/35 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#658C64] focus-visible:ring-offset-2"
              >
                {/* PROJECT IMAGE — TALLER */}
                <div className="relative h-64 w-full shrink-0 overflow-hidden bg-[#DCE8DC] sm:h-72 lg:h-[300px]">
                  <div
                    role="img"
                    aria-label={project.imageAlt}
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${project.image}')`,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#073F4E]/25 via-transparent to-transparent" />
                </div>

                {/* PROJECT CONTENT */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-lg font-bold leading-snug text-[#05546A] transition-colors group-hover:text-[#658C64] sm:text-xl">
                    {project.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>

                  {/* LOGO MITRA LANGSUNG SETELAH DESKRIPSI */}
                  {project.partners.length > 0 && (
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                      {project.partners.map((partner) => (
                        <div
                          key={partner.id}
                          className="flex h-9 w-[76px] items-center justify-center"
                          title={partner.name || undefined}
                        >
                          <img
                            src={partner.logo}
                            alt={
                              partner.name
                                ? t("projects.partnerLogoNamedAlt", { name: partner.name })
                                : t("projects.partnerLogoAlt")
                            }
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIEW DETAIL */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-medium text-slate-500">
                      {t("projects.detailButton")}
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F5ED] text-[#05546A] transition group-hover:bg-[#05546A] group-hover:text-white">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* PAGINATION */}
          {!loading && !loadError && totalPages > 1 && (
            <nav
              aria-label={t("projects.paginationLabel")}
              className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
                aria-label={t("projects.previousPage")}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#DCE8DC] bg-white text-[#05546A] transition-colors hover:border-[#658C64] hover:bg-[#F1F5ED] disabled:pointer-events-none disabled:opacity-40 sm:size-10"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4">
                  <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center text-sm text-slate-500 sm:size-10"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    aria-label={t("projects.pageNumber", { page: item })}
                    aria-current={currentPage === item ? "page" : undefined}
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors sm:size-10 ${
                      currentPage === item
                        ? "border-[#05546A] bg-[#05546A] text-white"
                        : "border-[#DCE8DC] bg-white text-[#05546A] hover:border-[#658C64] hover:bg-[#F1F5ED]"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                aria-label={t("projects.nextPage")}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#DCE8DC] bg-white text-[#05546A] transition-colors hover:border-[#658C64] hover:bg-[#F1F5ED] disabled:pointer-events-none disabled:opacity-40 sm:size-10"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4">
                  <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </nav>
          )}

          {loading && (
            <p className="mt-8 text-center text-sm text-slate-500">
              {t("projects.loading")}
            </p>
          )}

          {!loading && loadError && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700">
              <p className="font-semibold">{t("projects.errorTitle")}</p>
              <p className="mt-1">{loadError}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-3 font-semibold underline underline-offset-4">{t("projects.retryButton")}</button>
            </div>
          )}

          {!loading && !loadError && projects.length === 0 && (
            <div className="mt-8 text-center">
              <p className="font-semibold text-[#05546A]">{t("projects.emptyTitle")}</p>
              <p className="mt-2 text-sm text-slate-500">{t("projects.emptyDescription")}</p>
            </div>
          )}
        </div>
      </section>

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#062F38]/70 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* MODAL IMAGE */}
            <div className="relative h-52 shrink-0 overflow-hidden bg-[#DCE8DC] sm:h-64">
              <div
                role="img"
                aria-label={selectedProject.imageAlt || t("modal.imageAlt")}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${selectedProject.image}')`,
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#073F4E]/50 via-transparent to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label={t("modal.closeAriaLabel")}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#05546A] shadow-md transition hover:bg-white"
              >
                <CloseIcon />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="overflow-y-auto p-5 sm:p-7 lg:p-8">
              <h2
                id="project-modal-title"
                className="text-xl font-bold leading-snug text-[#05546A] sm:text-2xl"
              >
                {selectedProject.name}
              </h2>

              <div className="mt-4 space-y-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#658C64]">{t("modal.eyebrow")}</p>
                <p className="text-sm font-medium leading-6 text-slate-700">
                  {selectedProject.description}
                </p>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {selectedProject.fullDescription}
                </p>
              </div>

              {/* LOGO MITRA */}
              {selectedProject.partners.length > 0 && (
                <div className="mt-7 border-t border-slate-100 pt-5">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                    {selectedProject.partners.map((partner) => (
                      <div
                        key={partner.id}
                        className="flex h-10 w-[88px] items-center justify-center"
                        title={partner.name || undefined}
                      >
                        <img
                          src={partner.logo}
                          alt={
                            partner.name
                              ? t("projects.partnerLogoNamedAlt", { name: partner.name })
                              : t("projects.partnerLogoAlt")
                          }
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full bg-[#05546A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#073F4E]"
                >
                  {t("modal.closeDetailButton")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#05546A] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-32 right-32 h-72 w-72 rounded-full bg-[#ABC937]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D7E8A0]">
                {t("cta.eyebrow")}
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
                {t("cta.title")}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                {t("cta.description")}
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#ABC937] px-6 py-3.5 text-sm font-bold text-[#123D45] transition hover:bg-[#BEDB55]"
              >
                {t("cta.button")}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
