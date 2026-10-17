
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import NewsBreadcrumb from "@/components/news/news-breadcrumb";
import NewsDetail from "@/components/news/news-detail";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

type News = {
  id: number;
  category_id: number;
  slug: string;
  thumbnail: string | null;
  title_idn: string;
  title_en: string;
  content_idn: string;
  content_en: string;
  status: "draft" | "published" | string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type NewsCategory = {
  id: number;
  slug: string;
  name_idn: string;
  name_en: string;
  is_active: boolean;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

async function fetchNewsBySlug(slug: string): Promise<News | null> {
  if (!API_BASE_URL) {
    throw new Error("Environment variable NEXT_PUBLIC_API_URL belum diatur.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/news/slug/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil detail berita. HTTP ${response.status}`,
    );
  }

  const result: ApiResponse<News> = await response.json();

  return result.data ?? null;
}

async function fetchNewsCategories(): Promise<NewsCategory[]> {
  if (!API_BASE_URL) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/news-categories`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const result: ApiResponse<NewsCategory[]> = await response.json();

    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Gagal mengambil kategori berita:", error);
    return [];
  }
}

function getImageUrl(thumbnail: string | null): string {
  if (!thumbnail) {
    return "/img/berita/artikel1.webp";
  }

  if (/^https?:\/\//i.test(thumbnail)) {
    return thumbnail;
  }

  return `${API_BASE_URL}${thumbnail.startsWith("/") ? "" : "/"}${thumbnail}`;
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);

  const news = await fetchNewsBySlug(slug);

  if (!news || news.status !== "published") {
    notFound();
  }

  const categories = await fetchNewsCategories();
  const category = categories.find(
    (item) => item.id === news.category_id,
  );

  const isEnglish = locale.startsWith("en");

  const title = isEnglish
    ? news.title_en || news.title_idn
    : news.title_idn || news.title_en;

  const content = isEnglish
    ? news.content_en || news.content_idn
    : news.content_idn || news.content_en;

  const categoryName = category
    ? isEnglish
      ? category.name_en || category.name_idn
      : category.name_idn || category.name_en
    : "";

  const date = news.published_at || news.created_at;
  const image = getImageUrl(news.thumbnail);

  return (
    <>
      <NewsBreadcrumb title={title} />

      <NewsDetail
        title={title}
        category={categoryName}
        date={date}
        image={image}
        content={content}
      />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
