"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CalendarDays, Waves } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
};

type ApiNewsItem = {
  id?: string | number;
  slug?: string;

  title?: string;
  title_idn?: string;
  title_en?: string;

  excerpt?: string;
  description?: string;
  content?: string;
  content_idn?: string;
  content_en?: string;

  date?: string;
  published_at?: string;
  publishedAt?: string;
  created_at?: string;
  createdAt?: string;

  image?: string;
  image_url?: string;
  imageUrl?: string;
  thumbnail?: string;
  thumbnail_url?: string;

  status?: string;
};

type ApiResponse =
  | ApiNewsItem[]
  | {
      data?:
        | ApiNewsItem[]
        | {
            data?: ApiNewsItem[];
            items?: ApiNewsItem[];
          };
      articles?: ApiNewsItem[];
      news?: ApiNewsItem[];
      results?: ApiNewsItem[];
      items?: ApiNewsItem[];
    };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const API_URL = API_BASE_URL ? `${API_BASE_URL}/api/news` : null;

function getApiItems(response: ApiResponse): ApiNewsItem[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && !Array.isArray(response.data)) {
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }

    if (Array.isArray(response.data.items)) {
      return response.data.items;
    }
  }

  if (Array.isArray(response.articles)) {
    return response.articles;
  }

  if (Array.isArray(response.news)) {
    return response.news;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  return [];
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImageUrl(path: string): string {
  const value = path.trim();

  if (!value) {
    return "/img/about-us.webp";
  }

  // URL lengkap dari API.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/") && API_BASE_URL) {
    return `${API_BASE_URL}${value}`;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return "/img/about-us.webp";
}

function normalizeNews(
  item: ApiNewsItem,
  index: number,
  locale: string,
): NewsItem | null {
  const isEnglish = locale === "en";

  const title =
    (isEnglish ? item.title_en : item.title_idn)?.trim() ||
    item.title?.trim() ||
    (isEnglish ? item.title_idn : item.title_en)?.trim();

  const slug = item.slug?.trim();

  if (!title || !slug) {
    return null;
  }

  const date =
    item.published_at ??
    item.publishedAt ??
    item.date ??
    item.created_at ??
    item.createdAt ??
    "";

  const rawExcerpt =
    (isEnglish ? item.content_en : item.content_idn) ||
    item.excerpt ||
    item.description ||
    item.content ||
    "";

  const rawImage =
    item.thumbnail_url ??
    item.thumbnail ??
    item.image_url ??
    item.imageUrl ??
    item.image ??
    "";

  return {
    id: String(item.id ?? slug ?? index),
    title,
    excerpt: stripHtml(rawExcerpt),
    date,
    image: normalizeImageUrl(rawImage),
    href: `/berita/${slug}`,
  };
}

function getTimestamp(date: string): number {
  if (!date) return 0;

  const timestamp = new Date(date).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatDate(date: string, locale: string): string {
  const timestamp = getTimestamp(date);

  if (!timestamp) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(timestamp));
}

export default function LatestNews() {
  const t = useTranslations("Home.latestNews");
  const locale = useLocale();

  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchLatestNews() {
      if (!API_URL) {
        console.error("NEXT_PUBLIC_API_URL belum dikonfigurasi.");
        setNews([]);
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          const errorBody = await response.text();

          throw new Error(
            `Gagal mengambil berita. HTTP ${response.status}. ${errorBody.slice(0, 300)}`,
          );
        }

        const result = (await response.json()) as ApiResponse;
        const apiItems = getApiItems(result);

        const latestNews = apiItems
          .filter((item) => item.status == null || item.status === "published")
          .map((item, index) => normalizeNews(item, index, locale))
          .filter((item): item is NewsItem => item !== null)
          .sort((a, b) => getTimestamp(b.date) - getTimestamp(a.date))
          .slice(0, 3);

        console.info(
          `[LatestNews] Data API: ${apiItems.length}, berita ditampilkan: ${latestNews.length}`,
        );

        setNews(latestNews);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Gagal memuat berita terbaru:", err);
        setNews([]);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchLatestNews();

    return () => controller.abort();
  }, [locale]);

  return (
    <section aria-labelledby="latest-news-title" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* Header */}
        <header>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                <Waves
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {t("eyebrow")}
              </p>

              <h2
                id="latest-news-title"
                className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
              >
                {t("titleBefore")}{" "}
                <span className="text-primary">{t("titleHighlight")}</span>
              </h2>
            </div>

            <Link
              href="/berita"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-secondary"
            >
              {t("viewAll")}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </header>

        {/* News */}
        {loading ? (
          <div
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={t("loading")}
            aria-busy="true"
          >
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[24px] border border-border bg-card"
              >
                <div className="aspect-[4/3] animate-pulse bg-muted" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            className="mt-12 rounded-[24px] border border-border bg-card px-6 py-12 text-center"
            role="status"
          >
            <p className="text-sm text-muted-foreground">{t("error")}</p>
          </div>
        ) : news.length === 0 ? (
          <div
            className="mt-12 rounded-[24px] border border-border bg-card px-6 py-12 text-center"
            role="status"
          >
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <Link
                  href={item.href}
                  className="relative block aspect-[4/3] overflow-hidden bg-muted"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    width={1200}
                    height={900}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/img/about-us.webp";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CalendarDays
                      className="size-4 text-brand-secondary"
                      strokeWidth={2}
                      aria-hidden="true"
                    />

                    {item.date && getTimestamp(item.date) ? (
                      <time dateTime={item.date}>
                        {formatDate(item.date, locale)}
                      </time>
                    ) : (
                      <span>{t("dateUnavailable")}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                    <Link
                      href={item.href}
                      className="transition-colors group-hover:text-brand-secondary"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {item.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto pt-6">
                    <Link
                      href={item.href}
                      className="group/read inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-brand-secondary"
                    >
                      {t("readMore")}
                      <ArrowRight
                        className="size-4 transition-transform duration-300 group-hover/read:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
