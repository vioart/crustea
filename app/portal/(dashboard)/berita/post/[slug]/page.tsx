"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  LoaderCircle,
  CalendarDays,
  Tag,
  FileText,
} from "lucide-react";

import { getAuthToken } from "@/lib/auth";
import { useLanguage } from "@/components/language/language-provider";

type News = {
  id: number;
  category_id: number;
  author_id?: number | null;
  slug: string;
  thumbnail?: string | null;
  title_idn: string;
  title_en: string;
  content_idn: string;
  content_en: string;
  status: "draft" | "published";
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type Category = {
  id: number;
  slug: string;
  name_idn: string;
  name_en: string;
  is_active: boolean;
};

const translations = {
  id: {
    pageTitle: "Detail Berita",
    dashboard: "Dashboard",
    news: "Berita",
    detail: "Detail Berita",

    back: "Kembali",
    edit: "Edit Berita",

    information: "Informasi Berita",
    category: "Kategori",
    status: "Status",
    draft: "Draft",
    published: "Published",

    titleIDN: "Judul Bahasa Indonesia",
    titleEN: "Judul Bahasa Inggris",

    contentIDN: "Konten Bahasa Indonesia",
    contentEN: "Konten Bahasa Inggris",

    thumbnail: "Thumbnail",

    publishedAt: "Dipublikasikan",
    createdAt: "Dibuat",
    updatedAt: "Diperbarui",

    loading: "Memuat berita...",
    notFound: "Berita tidak ditemukan.",
    authError: "Token autentikasi tidak ditemukan.",
    fetchError: "Gagal mengambil data berita.",
    categoryError: "Gagal mengambil kategori berita.",

    noContent: "Konten belum tersedia.",
    noThumbnail: "Tidak ada thumbnail.",
  },

  en: {
    pageTitle: "News Detail",
    dashboard: "Dashboard",
    news: "News",
    detail: "News Detail",

    back: "Back",
    edit: "Edit News",

    information: "News Information",
    category: "Category",
    status: "Status",
    draft: "Draft",
    published: "Published",

    titleIDN: "Indonesian Title",
    titleEN: "English Title",

    contentIDN: "Indonesian Content",
    contentEN: "English Content",

    thumbnail: "Thumbnail",

    publishedAt: "Published",
    createdAt: "Created",
    updatedAt: "Updated",

    loading: "Loading news...",
    notFound: "News not found.",
    authError: "Authentication token not found.",
    fetchError: "Failed to fetch news.",
    categoryError: "Failed to fetch news categories.",

    noContent: "Content is not available.",
    noThumbnail: "No thumbnail.",
  },
};

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();

  const newsSlug = params.slug as string;

  const { language } = useLanguage();
  const t = translations[language];

  const [news, setNews] = useState<News | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * ------------------------------------------------------------
   * NORMALIZE IMAGE URL
   * ------------------------------------------------------------
   */
  const normalizeContentImageUrls = (html: string) => {
    if (!html) {
      return html;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    const images = document.querySelectorAll("img");

    images.forEach((image) => {
      const src = image.getAttribute("src");

      // ============================================================
      // IMAGE URL
      // ============================================================

      if (
        src &&
        apiUrl &&
        !src.startsWith("http://") &&
        !src.startsWith("https://") &&
        !src.startsWith("data:")
      ) {
        if (src.startsWith("/uploads/")) {
          image.setAttribute("src", `${apiUrl}${src}`);
        }
      }

      // ============================================================
      // IMAGE ALIGNMENT
      // ============================================================

      const containerStyle = image.getAttribute("containerstyle") || "";

      const wrapperStyle = image.getAttribute("wrapperstyle") || "";

      const styleText = `${containerStyle} ${wrapperStyle}`
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      // ------------------------------------------------------------
      // CENTER
      // ------------------------------------------------------------

      if (
        styleText.includes("margin: 0px auto") ||
        styleText.includes("margin: 0 auto") ||
        styleText.includes("margin:0px auto") ||
        styleText.includes("margin:0 auto") ||
        (styleText.includes("margin-left: auto") &&
          styleText.includes("margin-right: auto"))
      ) {
        image.style.display = "block";
        image.style.marginLeft = "auto";
        image.style.marginRight = "auto";
      }

      // ------------------------------------------------------------
      // RIGHT
      // ------------------------------------------------------------
      else if (styleText.includes("margin-left: auto")) {
        image.style.display = "block";
        image.style.marginLeft = "auto";
        image.style.marginRight = "0";
      }

      // ------------------------------------------------------------
      // LEFT
      // ------------------------------------------------------------
      else {
        image.style.display = "block";
        image.style.marginLeft = "0";
        image.style.marginRight = "0";
      }

      // ============================================================
      // IMAGE SIZE
      // ============================================================

      const width = image.getAttribute("width");

      if (width) {
        image.style.width = `${width}px`;
        image.style.maxWidth = "100%";
        image.style.height = "auto";
      }

      // ============================================================
      // REMOVE TIPTAP INTERNAL ATTRIBUTES
      // ============================================================

      image.removeAttribute("containerstyle");
      image.removeAttribute("wrapperstyle");
    });

    return document.body.innerHTML;
  };

  /**
   * ------------------------------------------------------------
   * FORMAT DATE
   * ------------------------------------------------------------
   */
  const formatDate = (date?: string | null) => {
    if (!date) {
      return "-";
    }

    try {
      return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date));
    } catch {
      return date;
    }
  };

  /**
   * ------------------------------------------------------------
   * FETCH NEWS
   * ------------------------------------------------------------
   */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          throw new Error(t.authError);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news/${newsSlug}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const raw = await response.text();

        console.log("GET DETAIL NEWS STATUS:", response.status);
        console.log("GET DETAIL NEWS URL:", response.url);
        console.log("GET DETAIL NEWS RAW:", raw);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${raw || t.fetchError}`);
        }

        const data = JSON.parse(raw);

        const newsData = data.data as News;

        setNews(newsData);

        /**
         * --------------------------------------------------------
         * FETCH CATEGORY
         * --------------------------------------------------------
         *
         * News API memberikan category_id.
         * Jadi kita ambil kategori berdasarkan ID tersebut.
         */
        try {
          const categoryResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/news-categories`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();

            const foundCategory = (categoryData.data ?? []).find(
              (item: Category) => item.id === newsData.category_id,
            );

            setCategory(foundCategory ?? null);
          }
        } catch (categoryError) {
          console.error("Get category error:", categoryError);
        }
      } catch (error) {
        console.error("Get news detail error:", error);

        setError(error instanceof Error ? error.message : t.fetchError);
      } finally {
        setLoading(false);
      }
    };

    if (newsSlug) {
      fetchNews();
    }
  }, [newsSlug, t.authError, t.fetchError]);

  /**
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="size-8 animate-spin text-brand-primary" />

            <p className="text-sm font-medium text-muted-foreground">
              {t.loading}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * ------------------------------------------------------------
   * ERROR / NOT FOUND
   * ------------------------------------------------------------
   */
  if (error || !news) {
    return (
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="border-b border-border bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {t.pageTitle}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{t.dashboard}</span>

                  <span>/</span>

                  <span>{t.news}</span>

                  <span>/</span>

                  <span className="text-foreground">{t.detail}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/portal/berita/post")}
                className="
                  inline-flex h-10 items-center gap-2
                  rounded-lg border border-border
                  bg-white px-4
                  text-sm font-semibold
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <ArrowLeft className="size-4" />

                {t.back}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50">
              <FileText className="size-7 text-red-500" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-foreground">
              {t.notFound}
            </h2>

            {error && (
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                {error}
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  /**
   * ------------------------------------------------------------
   * IMAGE URL
   * ------------------------------------------------------------
   */
  const thumbnailUrl = news.thumbnail
    ? news.thumbnail.startsWith("http")
      ? news.thumbnail
      : `${process.env.NEXT_PUBLIC_API_URL}${news.thumbnail}`
    : null;

  /**
   * ------------------------------------------------------------
   * CONTENT
   * ------------------------------------------------------------
   */
  const contentIDN = normalizeContentImageUrls(news.content_idn ?? "");

  const contentEN = normalizeContentImageUrls(news.content_en ?? "");

  /**
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */
  return (
    <div className="min-h-screen bg-muted/30">
      {/* ====================================================== */}
      {/* HEADER                                                 */}
      {/* ====================================================== */}

      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {t.pageTitle}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{t.dashboard}</span>

                <span>/</span>

                <span>{t.news}</span>

                <span>/</span>

                <span className="text-foreground">{t.detail}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3">
              {/* BACK */}
              <button
                type="button"
                onClick={() => router.push("/portal/berita/post")}
                className="
                  inline-flex h-10 items-center gap-2
                  rounded-lg border border-border
                  bg-white px-4
                  text-sm font-semibold
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <ArrowLeft className="size-4" />

                {t.back}
              </button>

              {/* EDIT */}
              <button
                type="button"
                onClick={() =>
                  router.push(`/portal/berita/post/${news.slug}/edit`)
                }
                className="
                  inline-flex h-10 items-center gap-2
                  rounded-lg
                  bg-brand-primary
                  px-4
                  text-sm font-semibold
                  text-white
                  transition-colors
                  hover:brightness-95
                "
              >
                <Edit3 className="size-4" />

                {t.edit}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* MAIN                                                    */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* ================================================== */}
          {/* NEWS META                                          */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* CATEGORY */}
                {category && (
                  <div
                    className="
                      inline-flex items-center gap-2
                      rounded-full
                      bg-[#EEF6EA]
                      px-3 py-1.5
                      text-xs font-semibold
                      text-[#4E944F]
                    "
                  >
                    <Tag className="size-3.5" />

                    {language === "id" ? category.name_idn : category.name_en}
                  </div>
                )}

                {/* STATUS */}
                <div
                  className={`
                    inline-flex items-center
                    rounded-full
                    px-3 py-1.5
                    text-xs font-semibold
                    ${
                      news.status === "published"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }
                  `}
                >
                  {news.status === "published" ? t.published : t.draft}
                </div>
              </div>

              {/* TITLE */}
              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                {language === "id" ? news.title_idn : news.title_en}
              </h2>

              {/* SLUG */}
              <p className="mt-3 break-all text-sm text-muted-foreground">
                /{news.slug}
              </p>

              {/* DATES */}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5">
                {news.published_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 text-[#658C64]" />

                    <span>
                      {t.publishedAt}:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(news.published_at)}
                      </span>
                    </span>
                  </div>
                )}

                {news.created_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 text-[#658C64]" />

                    <span>
                      {t.createdAt}:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(news.created_at)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ================================================== */}
          {/* THUMBNAIL                                          */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-base font-bold text-foreground">
                {t.thumbnail}
              </h2>
            </div>

            <div className="p-6">
              {thumbnailUrl ? (
                <div className="mx-auto max-w-[1000px] overflow-hidden rounded-2xl border border-border bg-muted">
                  <img
                    src={thumbnailUrl}
                    alt={language === "id" ? news.title_idn : news.title_en}
                    className="block h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {t.noThumbnail}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ================================================== */}
          {/* CONTENT IDN                                         */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-base font-bold text-foreground">
                {t.contentIDN}
              </h2>
            </div>

            <div className="px-6 py-8 sm:px-10">
              {contentIDN ? (
                <article
                  className="
                    news-content
                    max-w-none
                    text-[16px]
                    leading-8
                    text-foreground

                    [&_h1]:mb-5
                    [&_h1]:mt-8
                    [&_h1]:text-3xl
                    [&_h1]:font-bold
                    [&_h1]:leading-tight

                    [&_h2]:mb-4
                    [&_h2]:mt-8
                    [&_h2]:text-2xl
                    [&_h2]:font-bold
                    [&_h2]:leading-tight

                    [&_h3]:mb-3
                    [&_h3]:mt-6
                    [&_h3]:text-xl
                    [&_h3]:font-bold

                    [&_p]:mb-5

                    [&_ul]:mb-5
                    [&_ul]:ml-6
                    [&_ul]:list-disc

                    [&_ol]:mb-5
                    [&_ol]:ml-6
                    [&_ol]:list-decimal

                    [&_li]:mb-2

                    [&_blockquote]:my-6
                    [&_blockquote]:border-l-4
                    [&_blockquote]:border-brand-primary
                    [&_blockquote]:bg-[#F8FAF7]
                    [&_blockquote]:px-5
                    [&_blockquote]:py-3
                    [&_blockquote]:italic

                    [&_a]:font-medium
                    [&_a]:text-brand-primary
                    [&_a]:underline
                    [&_a]:underline-offset-2

                    [&_strong]:font-bold

                    [&_img]:my-6
                    [&_img]:h-auto
                    [&_img]:max-w-full
                    [&_img]:rounded-xl
                    [&_img]:block

                    [&_figure]:my-6

                    [&_hr]:my-8
                    [&_hr]:border-border
                  "
                  dangerouslySetInnerHTML={{
                    __html: contentIDN,
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{t.noContent}</p>
              )}
            </div>
          </section>

          {/* ================================================== */}
          {/* CONTENT EN                                         */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-base font-bold text-foreground">
                {t.contentEN}
              </h2>
            </div>

            <div className="px-6 py-8 sm:px-10">
              {contentEN ? (
                <article
                  className="
                    news-content
                    max-w-none
                    text-[16px]
                    leading-8
                    text-foreground

                    [&_h1]:mb-5
                    [&_h1]:mt-8
                    [&_h1]:text-3xl
                    [&_h1]:font-bold
                    [&_h1]:leading-tight

                    [&_h2]:mb-4
                    [&_h2]:mt-8
                    [&_h2]:text-2xl
                    [&_h2]:font-bold
                    [&_h2]:leading-tight

                    [&_h3]:mb-3
                    [&_h3]:mt-6
                    [&_h3]:text-xl
                    [&_h3]:font-bold

                    [&_p]:mb-5

                    [&_ul]:mb-5
                    [&_ul]:ml-6
                    [&_ul]:list-disc

                    [&_ol]:mb-5
                    [&_ol]:ml-6
                    [&_ol]:list-decimal

                    [&_li]:mb-2

                    [&_blockquote]:my-6
                    [&_blockquote]:border-l-4
                    [&_blockquote]:border-brand-primary
                    [&_blockquote]:bg-[#F8FAF7]
                    [&_blockquote]:px-5
                    [&_blockquote]:py-3
                    [&_blockquote]:italic

                    [&_a]:font-medium
                    [&_a]:text-brand-primary
                    [&_a]:underline
                    [&_a]:underline-offset-2

                    [&_strong]:font-bold

                    [&_img]:my-6
                    [&_img]:h-auto
                    [&_img]:max-w-full
                    [&_img]:rounded-xl

                    [&_figure]:my-6

                    [&_hr]:my-8
                    [&_hr]:border-border
                  "
                  dangerouslySetInnerHTML={{
                    __html: contentEN,
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{t.noContent}</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
