import Link from "next/link";
import { ArrowRight, CalendarDays, Waves } from "lucide-react";

type NewsItem = {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
};

const news: NewsItem[] = [
  {
    title: "Teknologi Akuakultur untuk Budidaya Berkelanjutan",
    excerpt:
      "Bagaimana teknologi dapat membantu pembudidaya meningkatkan produktivitas, efisiensi, dan keberlanjutan dalam pengelolaan tambak.",
    date: "2026-09-15",
    image: "/img/about-us.webp",
    href: "/news/teknologi-akuakultur-berkelanjutan",
  },
  {
    title: "Meningkatkan Efisiensi Tambak dengan Eco-Aerator",
    excerpt:
      "Pemanfaatan teknologi aerasi yang lebih efisien membantu pembudidaya mengelola kebutuhan oksigen sekaligus mengoptimalkan penggunaan energi.",
    date: "2026-09-10",
    image: "/img/about-us.webp",
    href: "/news/meningkatkan-efisiensi-tambak-dengan-eco-aerator",
  },
  {
    title: "Menjaga Kualitas Air untuk Budidaya Udang",
    excerpt:
      "Kualitas air menjadi salah satu faktor penting dalam keberhasilan budidaya. Pemantauan parameter air membantu pembudidaya mengambil keputusan dengan lebih tepat.",
    date: "2026-09-05",
    image: "/img/about-us.webp",
    href: "/news/menjaga-kualitas-air-budidaya-udang",
  },
  {
    title: "Masa Depan Akuakultur Berbasis Teknologi",
    excerpt:
      "Perkembangan teknologi membuka peluang baru untuk menciptakan proses budidaya yang lebih terukur, efisien, dan berkelanjutan.",
    date: "2026-08-28",
    image: "/img/about-us.webp",
    href: "/news/masa-depan-akuakultur-berbasis-teknologi",
  },
  {
    title: "Energi Terbarukan untuk Budidaya Tambak",
    excerpt:
      "Pemanfaatan energi terbarukan menjadi salah satu pendekatan untuk mengurangi ketergantungan terhadap energi konvensional dalam operasional tambak.",
    date: "2026-08-20",
    image: "/img/about-us.webp",
    href: "/news/energi-terbarukan-untuk-budidaya-tambak",
  },
];

export default function LatestNews() {
  // Ambil 3 berita dengan tanggal paling baru
  const latestNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section aria-labelledby="latest-news-title" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Heading */}
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                <Waves
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                News & Insight
              </p>

              {/* Title */}
              <h2
                id="latest-news-title"
                className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
              >
                Berita terbaru seputar{" "}
                <span className="text-primary">Crustea.</span>
              </h2>
            </div>

            {/* View All */}
            <Link
              href="/news"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-dark transition-colors hover:text-brand-secondary"
            >
              Lihat Semua Berita
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </header>

        {/* =====================================================
            NEWS
        ===================================================== */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((item) => (
            <article
              key={item.href}
              className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* =================================================
                  IMAGE
              ================================================= */}
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
              </Link>

              {/* =================================================
                  CONTENT
              ================================================= */}
              <div className="flex flex-1 flex-col p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CalendarDays
                    className="size-4 text-brand-secondary"
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  <time dateTime={item.date}>
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
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
      </div>
    </section>
  );
}
