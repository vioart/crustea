"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type NewsItem = {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
  category: string;
};

type Topic = {
  label: string;
  value: string;
};

/* ============================================================
   NEWS DATA
============================================================ */

const news: NewsItem[] = [
  {
    title: "Cara Sukses Budidaya Udang Vaname dari Persiapan, Teknis Budidaya Hingga Panen!",
    excerpt:
      "Budidaya tambak udang vaname salah satu bisnis yang sangat menguntungkan, memiliki prospek yang bagus karena tingkat konsumsi terhadap udang vaname terus meningkat",
    date: "2026-09-15",
    image: "/img/berita/artikel1.webp",
    href: "/berita/teknologi-akuakultur-berkelanjutan",
    category: "Teknologi",
  },
  {
    title: "Cara Agar Lingkungan Tambak Udang Tidak Tercemar",
    excerpt:
      "Pemanfaatan teknologi aerasi yang lebih efisien membantu pembudidaya mengelola kebutuhan oksigen sekaligus mengoptimalkan penggunaan energi.",
    date: "2026-09-10",
    image: "/img/berita/artikel2.webp",
    href: "/berita/meningkatkan-efisiensi-tambak-dengan-eco-aerator",
    category: "Energi",
  },
  {
    title: "Bentuk Limbah pada Tambak Udang: Tantangan dan Solusi",
    excerpt:
      "Kualitas air menjadi salah satu faktor penting dalam keberhasilan budidaya. Pemantauan parameter air membantu pembudidaya mengambil keputusan dengan lebih tepat.",
    date: "2026-09-05",
    image: "/img/berita/artikel3.webp",
    href: "/berita/menjaga-kualitas-air-budidaya-udang",
    category: "Akuakultur",
  },
  {
    title: "Fungsi Oksigen pada Tambak Udang: Kunci Kesuksesan Budidaya",
    excerpt:
      "Perkembangan teknologi membuka peluang baru untuk menciptakan proses budidaya yang lebih terukur, efisien, dan berkelanjutan.",
    date: "2026-08-28",
    image: "/img/berita/artikel4.webp",
    href: "/berita/masa-depan-akuakultur-berbasis-teknologi",
    category: "Teknologi",
  },
  {
    title: "Berbagai Metode Mengukur Kualitas Air di Tambak Udang: Dari Manual hingga Teknologi IoT",
    excerpt:
      "Pemanfaatan energi terbarukan menjadi salah satu pendekatan untuk mengurangi ketergantungan terhadap energi konvensional dalam operasional tambak.",
    date: "2026-08-20",
    image: "/img/berita/artikel5.webp",
    href: "/berita/energi-terbarukan-untuk-budidaya-tambak",
    category: "Keberlanjutan",
  },
];

/* ============================================================
   TOPICS
============================================================ */

const topics: Topic[] = [
  {
    label: "Akuakultur",
    value: "Akuakultur",
  },
  {
    label: "Teknologi",
    value: "Teknologi",
  },
  {
    label: "Keberlanjutan",
    value: "Keberlanjutan",
  },
  {
    label: "Energi",
    value: "Energi",
  },
];

/* ============================================================
   HELPERS
============================================================ */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ============================================================
   NEWS SECTION
============================================================ */

export default function NewsSection() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 4;

  /* ==========================================================
     SORT NEWS
  ========================================================== */

  const sortedNews = useMemo(() => {
    return [...news].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  /* ==========================================================
     FILTER NEWS
  ========================================================== */

  const filteredNews = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return sortedNews.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.excerpt.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword);

      const matchesTopic = !activeTopic || item.category === activeTopic;

      return matchesSearch && matchesTopic;
    });
  }, [search, activeTopic, sortedNews]);

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalPages = Math.ceil(filteredNews.length / postsPerPage);

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  /* ==========================================================
     POPULAR POSTS
  ========================================================== */

  const popularPosts = sortedNews.slice(0, 4);

  /* ==========================================================
     TOPIC COUNTS
  ========================================================== */

  const topicCounts = topics.map((topic) => ({
    ...topic,
    count: news.filter((item) => item.category === topic.value).length,
  }));

  /* ==========================================================
     SEARCH HANDLER
  ========================================================== */

  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  /* ==========================================================
     TOPIC HANDLER
  ========================================================== */

  function handleTopic(topic: string) {
    setActiveTopic((current) => (current === topic ? null : topic));
    setCurrentPage(1);
  }

  return (
    <section
      aria-labelledby="news-section-title"
      className="relative overflow-hidden bg-background"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute -left-48 top-20 size-[420px] rounded-full bg-secondary/50 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-48 bottom-20 size-[420px] rounded-full bg-accent/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* ===================================================
            MAIN CONTENT + SIDEBAR
        =================================================== */}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-12">
          {/* =================================================
              LEFT - NEWS
          ================================================= */}

          <div>
            {paginatedNews.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {paginatedNews.map((item) => (
                  <article
                    key={item.href}
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
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />

                      {/* Category */}
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-background/95 px-3 py-1.5 text-[11px] font-semibold text-brand-dark shadow-sm backdrop-blur-sm">
                          {item.category}
                        </span>
                      </div>
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

                        <time dateTime={item.date}>
                          {formatDate(item.date)}
                        </time>
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
                          Baca Berita
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
              /* Empty State */
              <div className="rounded-[24px] border border-dashed border-border bg-muted/50 px-6 py-16 text-center">
                <Search className="mx-auto size-8 text-brand-secondary" />

                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                  Berita tidak ditemukan
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Coba gunakan kata kunci lain atau pilih topik yang berbeda.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveTopic(null);
                    setCurrentPage(1);
                  }}
                  className="mt-5 text-sm font-semibold text-brand-secondary transition-colors hover:text-brand-dark"
                >
                  Reset pencarian
                </button>
              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (
              <nav
                aria-label="Pagination berita"
                className="mt-10 flex items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                  className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={[
                      "flex size-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                      currentPage === page
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-brand-dark hover:border-primary hover:bg-secondary",
                    ].join(" ")}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                  className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </nav>
            )}
          </div>

          {/* =================================================
              RIGHT - SIDEBAR
          ================================================= */}

          <aside className="space-y-5 lg:sticky lg:top-28">
            {/* =================================================
      SEARCH
  ================================================= */}

            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Cari Berita
              </h3>

              <div className="mt-4">
                <label htmlFor="news-search" className="sr-only">
                  Cari berita
                </label>

                <div className="relative">
                  <input
                    id="news-search"
                    type="search"
                    value={search}
                    onChange={(event) => handleSearch(event.target.value)}
                    placeholder="Cari berita..."
                    className="h-12 w-full rounded-xl border border-border bg-muted/40 pl-4 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                  />

                  <Search
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-brand-secondary"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                POPULAR POST
            ================================================= */}

            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                  Popular Post
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                {popularPosts.map((post) => (
                  <article key={post.href} className="group flex gap-3">
                    <Link
                      href={post.href}
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
                          href={post.href}
                          className="transition-colors group-hover:text-brand-secondary"
                        >
                          {post.title}
                        </Link>
                      </h4>

                      <time
                        dateTime={post.date}
                        className="mt-1.5 block text-xs text-muted-foreground"
                      >
                        {formatDate(post.date)}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* =================================================
      TOPICS
  ================================================= */}

            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                  Topik
                </h3>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                {topicCounts.map((topic, index) => {
                  const isActive = activeTopic === topic.value;

                  return (
                    <button
                      key={topic.value}
                      type="button"
                      onClick={() => handleTopic(topic.value)}
                      className={[
                        "group flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition-colors",
                        index !== topicCounts.length - 1
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

                        <span className="font-medium">{topic.label}</span>
                      </span>

                      <span
                        className={[
                          "text-xs font-medium",
                          isActive
                            ? "text-brand-secondary"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        ({topic.count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeTopic && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTopic(null);
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-xs font-semibold text-brand-secondary transition-colors hover:text-brand-dark"
                >
                  Hapus filter topik
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
