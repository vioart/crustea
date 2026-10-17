"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Mail,
  Share2,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

type NewsDetailProps = {
  title: string;
  category: string;
  date: string;
  image: string;
  content: string;
  slug?: string;
  categoryId?: number | string | null;
};

type ApiNews = {
  id?: number | string;
  category_id?: number | string | null;
  slug?: string;
  thumbnail?: string | null;
  title_idn?: string | null;
  title_en?: string | null;
  title?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  status?: string | null;
};

type ApiCategory = {
  id?: number | string;
  name?: string | null;
  name_idn?: string | null;
  name_en?: string | null;
  title?: string | null;
  title_idn?: string | null;
  title_en?: string | null;
  slug?: string | null;
  news_count?: number | null;
  total_news?: number | null;
  count?: number | null;
};

type ApiResponse<T> = {
  data?: T | { data?: T };
  items?: T;
};

type SidebarCategory = {
  id: string;
  label: string;
  count: number | null;
  slug: string;
};

type SidebarNews = {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

function unwrapArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as ApiResponse<T[]>;

  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (
    result.data &&
    typeof result.data === "object" &&
    "data" in result.data &&
    Array.isArray(result.data.data)
  ) {
    return result.data.data;
  }

  if (Array.isArray(result.items)) {
    return result.items;
  }

  return [];
}

/**
 * Mengubah path relatif dari backend menjadi URL absolut.
 * Contoh:
 * /uploads/news/content/image.png
 * menjadi:
 * http://localhost:8080/uploads/news/content/image.png
 */
function getImageUrl(path?: string | null): string {
  if (!path) return "";

  const trimmedPath = path.trim();

  if (
    /^(https?:)?\/\//i.test(trimmedPath) ||
    /^(data|blob):/i.test(trimmedPath)
  ) {
    return trimmedPath.startsWith("//")
      ? `${window.location.protocol}${trimmedPath}`
      : trimmedPath;
  }

  return `${API_BASE}/${trimmedPath.replace(/^\/+/, "")}`;
}

/**
 * Memperbaiki URL gambar yang terdapat di dalam HTML artikel.
 * Gambar artikel tidak lagi mengambil path relatif dari frontend.
 */

function resolveContentImageUrls(html: string): string {
  if (!html) return "";

  return html.replace(/<img\b[^>]*>/gi, (imgTag) => {
    let result = imgTag;

    // Ubah URL gambar relatif menjadi URL backend.
    result = result.replace(
      /(\bsrc\s*=\s*)(["'])(.*?)\2/i,
      (attribute, prefix: string, quote: string, source: string) => {
        const src = source.trim();

        if (
          !src ||
          /^(https?:)?\/\//i.test(src) ||
          /^(data|blob):/i.test(src)
        ) {
          return attribute;
        }

        const absoluteUrl = `${API_BASE}/${src.replace(/^\/+/, "")}`;

        return `${prefix}${quote}${absoluteUrl}${quote}`;
      },
    );

    // Baca konfigurasi style gambar dari dashboard.
    const containerStyleMatch = result.match(
      /\bcontainerstyle\s*=\s*(["'])(.*?)\1/i,
    );

    const containerStyle = containerStyleMatch?.[2] ?? "";

    // Ambil alignment dari margin atau text-align.
    let alignment = "";

    if (/margin\s*:\s*[^;]*\bauto\b/i.test(containerStyle)) {
      alignment = "center";
    } else {
      const textAlign = containerStyle.match(
        /text-align\s*:\s*(left|center|right)/i,
      );

      if (textAlign) {
        alignment = textAlign[1].toLowerCase();
      }
    }

    // Jika dashboard menyimpan pengaturan posisi, terapkan sebagai style.
    if (alignment) {
      const styleMatch = result.match(/\bstyle\s*=\s*(["'])(.*?)\1/i);
      const existingStyle = styleMatch?.[2] ?? "";

      const cleanedStyle = existingStyle
        .replace(/(?:^|;)\s*text-align\s*:[^;]*/gi, "")
        .replace(/(?:^|;)\s*margin-left\s*:[^;]*/gi, "")
        .replace(/(?:^|;)\s*margin-right\s*:[^;]*/gi, "")
        .trim()
        .replace(/^;+|;+$/g, "");

      const alignmentStyle =
        alignment === "center"
          ? "display: block; margin-left: auto; margin-right: auto;"
          : alignment === "right"
            ? "display: block; margin-left: auto; margin-right: 0;"
            : "display: block; margin-left: 0; margin-right: auto;";

      const nextStyle = [cleanedStyle, alignmentStyle]
        .filter(Boolean)
        .join(" ");

      if (styleMatch) {
        result = result.replace(
          /\bstyle\s*=\s*(["'])(.*?)\1/i,
          `style="${nextStyle}"`,
        );
      } else {
        result = result.replace(/<img\b/i, `<img style="${nextStyle}"`);
      }
    }

    return result;
  });
}

function formatDate(date?: string | null, locale = "id"): string {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategoryName(category: ApiCategory, locale: string): string {
  if (locale === "en") {
    return (
      category.name_en ||
      category.title_en ||
      category.name ||
      category.title ||
      category.name_idn ||
      category.title_idn ||
      ""
    );
  }

  return (
    category.name_idn ||
    category.title_idn ||
    category.name ||
    category.title ||
    category.name_en ||
    category.title_en ||
    ""
  );
}

function getNewsTitle(news: ApiNews, locale: string): string {
  if (locale === "en") {
    return news.title_en || news.title || news.title_idn || "";
  }

  return news.title_idn || news.title || news.title_en || "";
}

function getCategoryCount(category: ApiCategory): number | null {
  const value = category.news_count ?? category.total_news ?? category.count;

  return typeof value === "number" ? value : null;
}

export default function NewsDetail({
  title,
  category,
  date,
  image,
  content,
  slug,
  categoryId,
}: NewsDetailProps) {
  const locale = useLocale();

  const [popularPosts, setPopularPosts] = useState<SidebarNews[]>([]);
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // URL gambar thumbnail artikel utama.
  const featuredImage = getImageUrl(image);

  // URL gambar di dalam konten artikel diarahkan ke backend.
  const articleContent = resolveContentImageUrls(content || "");

  // Berita terbaru dari API.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchLatestNews() {
      try {
        const response = await fetch(`${API_BASE}/api/news`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Gagal mengambil berita: ${response.status}`);
        }

        const result: unknown = await response.json();
        const newsList = unwrapArray<ApiNews>(result);

        const latestNews = newsList
          .filter((news) => {
            if (news.status) {
              return news.status.toLowerCase() === "published";
            }

            return true;
          })
          .filter((news) => Boolean(news.slug))
          .filter((news) => news.slug !== slug)
          .sort((a, b) => {
            const dateA = new Date(
              a.published_at || a.created_at || 0,
            ).getTime();

            const dateB = new Date(
              b.published_at || b.created_at || 0,
            ).getTime();

            return dateB - dateA;
          })
          .slice(0, 3)
          .map((news) => ({
            id: String(news.id ?? news.slug),
            slug: news.slug || "",
            title: getNewsTitle(news, locale),
            date: formatDate(news.published_at || news.created_at, locale),
            image: getImageUrl(news.thumbnail),
          }))
          .filter((news) => Boolean(news.title));

        if (!controller.signal.aborted) {
          setPopularPosts(latestNews);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Gagal memuat berita terbaru:", error);

        if (!controller.signal.aborted) {
          setPopularPosts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPopular(false);
        }
      }
    }

    fetchLatestNews();

    return () => controller.abort();
  }, [locale, slug]);

  // Kategori dari API.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE}/api/news-categories`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Gagal mengambil kategori: ${response.status}`);
        }

        const result: unknown = await response.json();
        const categoryList = unwrapArray<ApiCategory>(result);

        const mappedCategories = categoryList
          .map((item) => ({
            id: String(item.id ?? ""),
            label: getCategoryName(item, locale),
            count: getCategoryCount(item),
            slug: item.slug || "",
          }))
          .filter((item) => item.id && item.label);

        if (!controller.signal.aborted) {
          setCategories(mappedCategories);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Gagal memuat kategori:", error);

        if (!controller.signal.aborted) {
          setCategories([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCategories(false);
        }
      }
    }

    fetchCategories();

    return () => controller.abort();
  }, [locale]);

  // URL untuk share diambil saat pengguna mengklik tombol.
  function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareByEmail() {
    const url = window.location.href;

    window.location.href =
      `mailto:info@crustea.id?subject=${encodeURIComponent(title)}` +
      `&body=${encodeURIComponent(url)}`;
  }

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative Background */}
      <div
        className="pointer-events-none absolute -left-48 top-20 size-[420px] rounded-full bg-secondary/40 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-48 top-[40%] size-[420px] rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-4 sm:pb-16 sm:pt-5 lg:px-8 lg:pb-20 lg:pt-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-12">
          {/* ARTICLE */}
          <article className="min-w-0">
            {/* Featured Image */}
            <div className="overflow-hidden rounded-[24px] border border-border bg-muted shadow-sm">
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={title}
                  width={1200}
                  height={800}
                  fetchPriority="high"
                  className="aspect-[16/9] h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-muted text-sm text-muted-foreground">
                  {locale === "en"
                    ? "Image unavailable"
                    : "Gambar berita tidak tersedia"}
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {category && (
                <span className="rounded-full bg-secondary px-3 py-1.5 font-semibold text-brand-dark">
                  {category}
                </span>
              )}

              {date && (
                <span className="flex items-center gap-2">
                  <CalendarDays
                    className="size-4 text-brand-secondary"
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  <time dateTime={date}>{formatDate(date, locale)}</time>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[46px]">
              {title}
            </h1>

            {/* Article Content */}
            <div
              className="
    article-content mt-6 max-w-none
    text-[14px] leading-6 text-muted-foreground

    [&_p]:mb-4 [&_p]:mt-0

    [&_h1]:mb-3 [&_h1]:mt-7
    [&_h1]:font-display [&_h1]:text-3xl
    [&_h1]:font-semibold [&_h1]:leading-tight
    [&_h1]:tracking-tight [&_h1]:text-foreground

    [&_h2]:mb-3 [&_h2]:mt-7
    [&_h2]:font-display [&_h2]:text-2xl
    [&_h2]:font-semibold [&_h2]:leading-tight
    [&_h2]:tracking-tight [&_h2]:text-foreground

    [&_h3]:mb-2 [&_h3]:mt-5
    [&_h3]:font-display [&_h3]:text-xl
    [&_h3]:font-semibold [&_h3]:leading-snug
    [&_h3]:text-foreground

    [&_a]:font-medium [&_a]:text-brand-secondary
    [&_a]:underline [&_a]:underline-offset-4
    [&_a:hover]:text-brand-dark

    [&_strong]:font-semibold [&_strong]:text-foreground
    [&_b]:font-semibold [&_b]:text-foreground

    [&_ul]:mb-4 [&_ul]:mt-2 [&_ul]:list-disc
    [&_ul]:space-y-1 [&_ul]:pl-6

    [&_ol]:mb-4 [&_ol]:mt-2 [&_ol]:list-decimal
    [&_ol]:space-y-1 [&_ol]:pl-6

    [&_li]:pl-1 [&_li]:leading-6

    [&_blockquote]:my-5 [&_blockquote]:border-l-4
    [&_blockquote]:border-primary [&_blockquote]:pl-4
    [&_blockquote]:italic

    [&_img]:my-5 [&_img]:block
    [&_img]:h-auto [&_img]:max-w-full
    [&_img]:rounded-[20px] [&_img]:border
    [&_img]:border-border [&_img]:shadow-sm

    [&_figure]:my-5

    [&_figcaption]:mt-2 [&_figcaption]:text-center
    [&_figcaption]:text-xs [&_figcaption]:leading-5
    [&_figcaption]:text-muted-foreground

    [&_table]:my-5 [&_table]:w-full
    [&_table]:border-collapse

    [&_th]:border [&_th]:border-border
    [&_th]:bg-muted [&_th]:p-3
    [&_th]:text-left [&_th]:font-semibold
    [&_th]:text-foreground

    [&_td]:border [&_td]:border-border [&_td]:p-3

    [&_hr]:my-5 [&_hr]:border-border
  "
              dangerouslySetInnerHTML={{
                __html: articleContent,
              }}
            />

            {/* Share */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <div className="flex items-center gap-2.5">
                <Share2
                  className="size-4 text-brand-secondary"
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span className="text-sm font-semibold text-foreground">
                  {locale === "en" ? "Share" : "Bagikan"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={shareOnFacebook}
                  aria-label="Bagikan ke Facebook"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary"
                >
                  <FaFacebookF className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={shareOnLinkedIn}
                  aria-label="Bagikan ke LinkedIn"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary"
                >
                  <FaLinkedinIn className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={shareByEmail}
                  aria-label="Bagikan melalui email"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary"
                >
                  <Mail className="size-4" />
                </button>
              </div>
            </div>

            {/* Previous / Next */}
            <nav
              aria-label="Navigasi berita"
              className="mt-7 grid items-stretch gap-3 sm:grid-cols-2"
            >
              <Link
                href="/berita"
                className="group flex h-full flex-col rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <ArrowLeft
                    className="size-4 shrink-0 transition-transform group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  {locale === "en" ? "Back to News" : "Kembali ke Berita"}
                </div>

                <p className="mt-3 min-h-10 font-display text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-brand-secondary">
                  {locale === "en"
                    ? "Explore other articles"
                    : "Jelajahi berita lainnya"}
                </p>
              </Link>

              <Link
                href="/berita"
                className="group flex h-full flex-col rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {locale === "en" ? "More News" : "Berita Lainnya"}
                  <ArrowRight
                    className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-3 min-h-10 text-right font-display text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-brand-secondary">
                  {locale === "en"
                    ? "Read the latest updates"
                    : "Baca informasi terbaru"}
                </p>
              </Link>
            </nav>
          </article>

          {/* SIDEBAR */}
          <aside className="self-start space-y-5">
            {/* Latest News from API */}
            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {locale === "en" ? "Latest News" : "Berita Terbaru"}
              </h3>

              <div className="mt-5 space-y-4">
                {loadingPopular ? (
                  <p className="text-sm text-muted-foreground">
                    {locale === "en" ? "Loading news..." : "Memuat berita..."}
                  </p>
                ) : popularPosts.length > 0 ? (
                  popularPosts.map((post) => (
                    <article key={post.id} className="group flex gap-3">
                      <Link
                        href={`/berita/${post.slug}`}
                        className="relative size-[76px] shrink-0 overflow-hidden rounded-xl border border-black/10 bg-muted shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md"
                      >
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            width={152}
                            height={152}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </Link>

                      <div className="min-w-0">
                        <h4 className="font-display text-[14px] font-semibold leading-5 text-foreground">
                          <Link
                            href={`/berita/${post.slug}`}
                            className="transition-colors group-hover:text-brand-secondary"
                          >
                            {post.title}
                          </Link>
                        </h4>

                        {post.date && (
                          <time className="mt-1.5 block text-xs text-muted-foreground">
                            {post.date}
                          </time>
                        )}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {locale === "en"
                      ? "No news available."
                      : "Belum ada berita tersedia."}
                  </p>
                )}
              </div>
            </div>

            {/* Categories from API */}
            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                {locale === "en" ? "Categories" : "Kategori"}
              </h3>

              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                {loadingCategories ? (
                  <p className="px-4 py-3.5 text-sm text-muted-foreground">
                    {locale === "en"
                      ? "Loading categories..."
                      : "Memuat kategori..."}
                  </p>
                ) : categories.length > 0 ? (
                  categories.map((item, index) => (
                    <Link
                      key={item.id}
                      href={`/berita?category=${encodeURIComponent(item.id)}`}
                      className={`group flex items-center justify-between gap-3 px-4 py-3.5 text-[14px] transition-colors hover:bg-secondary ${
                        index !== categories.length - 1
                          ? "border-b border-border"
                          : ""
                      } ${
                        categoryId != null && String(categoryId) === item.id
                          ? "bg-secondary"
                          : ""
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <ArrowRight
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand-secondary"
                          aria-hidden="true"
                        />

                        <span className="truncate font-medium text-foreground">
                          {item.label}
                        </span>
                      </span>

                      {item.count !== null && (
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                          ({item.count})
                        </span>
                      )}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-3.5 text-sm text-muted-foreground">
                    {locale === "en"
                      ? "No categories available."
                      : "Belum ada kategori tersedia."}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
