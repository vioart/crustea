"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const POSTS_PER_PAGE = 4;

type ApiEnvelope<T> = {
  data: T[] | T;
};

type ApiCategory = {
  id: number;
  slug?: string;
  name?: string;
  name_idn?: string;
  name_en?: string;
  title?: string;
  title_idn?: string;
  title_en?: string;
  category_name_idn?: string;
  category_name_en?: string;
};

type ApiNews = {
  id: number;
  slug: string;
  title?: string;
  title_idn?: string;
  title_en?: string;
  excerpt?: string;
  excerpt_idn?: string;
  excerpt_en?: string;
  content_idn?: string;
  content_en?: string;
  thumbnail?: string;
  image?: string;
  created_at?: string;
  published_at?: string;
  date?: string;
  category_id?: number;
  news_category_id?: number;
  category?: number | string | ApiCategory | null;
  news_category?: ApiCategory | null;
  category_name_idn?: string;
  category_name_en?: string;
};

type NewsCard = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  categoryId: number | null;
  categoryName: string;
};

type CategoryItem = {
  id: number;
  slug: string;
  label: string;
};

function unwrapData<T>(payload: ApiEnvelope<T> | T[]): T[] {
  const data = Array.isArray(payload)
    ? payload
    : (payload as ApiEnvelope<T>)?.data;

  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

function getCategoryId(news: ApiNews): number | null {
  if (typeof news.category_id === "number") return news.category_id;
  if (typeof news.news_category_id === "number") {
    return news.news_category_id;
  }

  if (typeof news.category === "number") return news.category;

  if (
    news.category &&
    typeof news.category === "object" &&
    typeof news.category.id === "number"
  ) {
    return news.category.id;
  }

  if (news.news_category && typeof news.news_category.id === "number") {
    return news.news_category.id;
  }

  return null;
}

function getCategoryObject(news: ApiNews): ApiCategory | null {
  if (news.category && typeof news.category === "object") {
    return news.category;
  }

  if (news.news_category) {
    return news.news_category;
  }

  return null;
}

function getCategoryName(
  news: ApiNews,
  categoryMap: Map<number, CategoryItem>,
  locale: string,
): string {
  const categoryId = getCategoryId(news);
  const matchedCategory = categoryId ? categoryMap.get(categoryId) : undefined;

  if (matchedCategory) return matchedCategory.label;

  const categoryObject = getCategoryObject(news);

  if (locale === "en") {
    return (
      categoryObject?.name_en ||
      categoryObject?.title_en ||
      categoryObject?.category_name_en ||
      news.category_name_en ||
      categoryObject?.name ||
      categoryObject?.title ||
      (typeof news.category === "string" ? news.category : "") ||
      ""
    );
  }

  return (
    categoryObject?.name_idn ||
    categoryObject?.title_idn ||
    categoryObject?.category_name_idn ||
    news.category_name_idn ||
    categoryObject?.name ||
    categoryObject?.title ||
    (typeof news.category === "string" ? news.category : "") ||
    ""
  );
}

function getImageUrl(image?: string): string {
  if (!image) return "/img/about-us.webp";

  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) {
    if (image.startsWith("/uploads/") && API_BASE_URL) {
      return `${API_BASE_URL.replace(/\/$/, "")}${image}`;
    }

    return image;
  }

  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/\/$/, "")}/${image.replace(/^\/+/, "")}`;
  }

  return `/${image.replace(/^\/+/, "")}`;
}

function formatDate(date: string, locale: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(parsedDate);
}

function normalizeNews(
  item: ApiNews,
  categories: Map<number, CategoryItem>,
  locale: string,
): NewsCard {
  const title =
    locale === "en"
      ? item.title_en || item.title || item.title_idn || ""
      : item.title_idn || item.title || item.title_en || "";

  const content =
    locale === "en"
      ? item.excerpt_en ||
        item.content_en ||
        item.excerpt ||
        item.content_idn ||
        ""
      : item.excerpt_idn ||
        item.content_idn ||
        item.excerpt ||
        item.content_en ||
        "";

  const date = item.published_at || item.created_at || item.date || "";

  return {
    id: item.id,
    slug: item.slug,
    title,
    excerpt: content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    date,
    image: getImageUrl(item.thumbnail || item.image),
    categoryId: getCategoryId(item),
    categoryName: getCategoryName(item, categories, locale),
  };
}

export default function NewsSection() {
  const t = useTranslations("News.section");
  const locale = useLocale();

  const [rawNews, setRawNews] = useState<ApiNews[]>([]);
  const [rawCategories, setRawCategories] = useState<ApiCategory[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNewsAndCategories() {
      if (!API_BASE_URL) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const baseUrl = API_BASE_URL.replace(/\/$/, "");

        const [newsResponse, categoriesResponse] = await Promise.all([
          fetch(`${baseUrl}/api/news`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          }),
          fetch(`${baseUrl}/api/news-categories`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          }),
        ]);

        if (!newsResponse.ok) {
          throw new Error(`Failed to fetch news: ${newsResponse.status}`);
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            `Failed to fetch categories: ${categoriesResponse.status}`,
          );
        }

        const [newsPayload, categoriesPayload] = await Promise.all([
          newsResponse.json(),
          categoriesResponse.json(),
        ]);

        const newsData = unwrapData<ApiNews>(newsPayload);
        const categoriesData = unwrapData<ApiCategory>(categoriesPayload);

        setRawNews(
          newsData.filter(
            (item) =>
              typeof item.id === "number" && typeof item.slug === "string",
          ),
        );

        setRawCategories(
          categoriesData.filter((item) => typeof item.id === "number"),
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Failed to load news and categories:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchNewsAndCategories();

    return () => controller.abort();
  }, []);

  const categories = useMemo<CategoryItem[]>(() => {
    return rawCategories.map((category) => {
      const label =
        locale === "en"
          ? category.name_en ||
            category.title_en ||
            category.category_name_en ||
            category.name ||
            category.title ||
            ""
          : category.name_idn ||
            category.title_idn ||
            category.category_name_idn ||
            category.name ||
            category.title ||
            "";

      return {
        id: category.id,
        slug: category.slug || String(category.id),
        label,
      };
    });
  }, [rawCategories, locale]);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );

  const news = useMemo(
    () => rawNews.map((item) => normalizeNews(item, categoryMap, locale)),
    [rawNews, categoryMap, locale],
  );

  const sortedNews = useMemo(
    () =>
      [...news].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [news],
  );

  const filteredNews = useMemo(() => {
    const keyword = search
      .trim()
      .toLocaleLowerCase(locale === "en" ? "en-US" : "id-ID");

    return sortedNews.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.title.toLocaleLowerCase().includes(keyword) ||
        item.excerpt.toLocaleLowerCase().includes(keyword) ||
        item.categoryName.toLocaleLowerCase().includes(keyword);

      const matchesCategory =
        activeCategory === null || item.categoryId === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [sortedNews, search, activeCategory, locale]);

  const totalPages = Math.ceil(filteredNews.length / POSTS_PER_PAGE);

  const paginationItems = useMemo<(number | "...")[]>(() => {
    if (totalPages === 0) return [];

    const pages = new Set<number>();

    pages.add(1);
    pages.add(totalPages);

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

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const popularPosts = sortedNews.slice(0, 4);

  const categoryCounts = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: news.filter((item) => item.categoryId === category.id).length,
      })),
    [categories, news],
  );

  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleCategory(categoryId: number) {
    setActiveCategory((current) =>
      current === categoryId ? null : categoryId,
    );
    setCurrentPage(1);
  }

  function resetFilters() {
    setSearch("");
    setActiveCategory(null);
    setCurrentPage(1);
  }

  return (
    <section
      aria-labelledby="news-section-title"
      className="relative overflow-hidden bg-background"
    >
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute -left-48 top-20 size-[420px] rounded-full bg-secondary/50 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-48 bottom-20 size-[420px] rounded-full bg-accent/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-12">
          {/* News list */}
          <div>
            {loading ? (
              <div
                role="status"
                className="rounded-[24px] border border-border bg-muted/50 px-6 py-16 text-center"
              >
                <p className="text-sm text-muted-foreground">{t("loading")}</p>
              </div>
            ) : error ? (
              <div
                role="alert"
                className="rounded-[24px] border border-border bg-muted/50 px-6 py-16 text-center"
              >
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {t("errorTitle")}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {t("errorDescription")}
                </p>
              </div>
            ) : paginatedNews.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {paginatedNews.map((item) => (
                  <article
                    key={item.id}
                    className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link
                      href={`/berita/${item.slug}`}
                      className="relative block aspect-[4/3] overflow-hidden bg-muted"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        width={1200}
                        height={900}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />

                      {item.categoryName && (
                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-background/95 px-3 py-1.5 text-[11px] font-semibold text-brand-dark shadow-sm backdrop-blur-sm">
                            {item.categoryName}
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <CalendarDays
                          className="size-4 text-brand-secondary"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <time dateTime={item.date}>
                          {formatDate(item.date, locale)}
                        </time>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                        <Link
                          href={`/berita/${item.slug}`}
                          className="transition-colors group-hover:text-brand-secondary"
                        >
                          {item.title}
                        </Link>
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {item.excerpt}
                      </p>

                      <div className="mt-auto pt-6">
                        <Link
                          href={`/berita/${item.slug}`}
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
            ) : (
              <div className="rounded-[24px] border border-dashed border-border bg-muted/50 px-6 py-16 text-center">
                <Search className="mx-auto size-8 text-brand-secondary" />

                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                  {t("emptyTitle")}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {t("emptyDescription")}
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 text-sm font-semibold text-brand-secondary transition-colors hover:text-brand-dark"
                >
                  {t("resetFilters")}
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <nav
                aria-label={t("paginationLabel")}
                className="mt-10 flex w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2"
              >
                {/* Previous */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label={t("previousPage")}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary disabled:pointer-events-none disabled:opacity-40 sm:size-10"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {/* Page Numbers */}
                {paginationItems.map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      aria-hidden="true"
                      className="flex size-7 shrink-0 items-center justify-center text-sm text-muted-foreground sm:size-10"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      aria-current={currentPage === item ? "page" : undefined}
                      aria-label={`${t("paginationLabel")} ${item}`}
                      className={[
                        "flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors sm:size-10",
                        currentPage === item
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-brand-dark hover:border-primary hover:bg-secondary",
                      ].join(" ")}
                    >
                      {item}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label={t("nextPage")}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary disabled:pointer-events-none disabled:opacity-40 sm:size-10"
                >
                  <ChevronRight className="size-4" />
                </button>
              </nav>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            {/* Search */}
            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {t("searchTitle")}
              </h3>

              <div className="mt-4">
                <label htmlFor="news-search" className="sr-only">
                  {t("searchLabel")}
                </label>

                <div className="relative">
                  <input
                    id="news-search"
                    type="search"
                    value={search}
                    onChange={(event) => handleSearch(event.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="h-12 w-full rounded-xl border border-border bg-muted/40 pl-4 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                  />

                  <Search
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-brand-secondary"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Popular posts */}
            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {t("popularTitle")}
              </h3>

              <div className="mt-5 space-y-4">
                {popularPosts.map((post) => (
                  <article key={post.id} className="group flex gap-3">
                    <Link
                      href={`/berita/${post.slug}`}
                      className="relative size-[76px] shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-md"
                    >
                      <img
                        src={post.image}
                        alt=""
                        width={152}
                        height={152}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0">
                      <h4 className="font-display text-sm font-semibold leading-5 text-foreground">
                        <Link
                          href={`/berita/${post.slug}`}
                          className="transition-colors group-hover:text-brand-secondary"
                        >
                          {post.title}
                        </Link>
                      </h4>

                      <time
                        dateTime={post.date}
                        className="mt-1.5 block text-xs text-muted-foreground"
                      >
                        {formatDate(post.date, locale)}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {t("categoriesTitle")}
              </h3>

              {categories.length > 0 ? (
                <div className="mt-5 overflow-hidden rounded-xl border border-border">
                  {categoryCounts.map((category, index) => {
                    const isActive = activeCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => handleCategory(category.id)}
                        className={[
                          "group flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition-colors",
                          index !== categoryCounts.length - 1
                            ? "border-b border-border"
                            : "",
                          isActive
                            ? "bg-secondary text-brand-dark"
                            : "bg-background text-foreground hover:bg-secondary/60",
                        ].join(" ")}
                      >
                        <span className="flex items-center gap-2.5">
                          <ArrowRight
                            className={[
                              "size-4 transition-transform duration-200",
                              isActive
                                ? "translate-x-1 text-brand-secondary"
                                : "text-muted-foreground group-hover:translate-x-1 group-hover:text-brand-secondary",
                            ].join(" ")}
                            aria-hidden="true"
                          />

                          <span className="font-medium">{category.label}</span>
                        </span>

                        <span
                          className={[
                            "text-xs font-medium",
                            isActive
                              ? "text-brand-secondary"
                              : "text-muted-foreground",
                          ].join(" ")}
                        >
                          ({category.count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {t("noCategories")}
                </p>
              )}

              {activeCategory !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-xs font-semibold text-brand-secondary transition-colors hover:text-brand-dark"
                >
                  {t("clearCategoryFilter")}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
