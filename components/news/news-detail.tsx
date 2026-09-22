"use client";

import Link from "next/link";
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
};

const popularPosts = [
  {
    title: "Teknologi Akuakultur untuk Budidaya Berkelanjutan",
    date: "15 September 2026",
    image: "/img/berita/artikel1.webp",
    href: "/berita/teknologi-akuakultur-berkelanjutan",
  },
  {
    title: "Meningkatkan Efisiensi Tambak dengan Eco-Aerator",
    date: "10 September 2026",
    image: "/img/berita/artikel2.webp",
    href: "/berita/meningkatkan-efisiensi-tambak-dengan-eco-aerator",
  },
  {
    title: "Menjaga Kualitas Air untuk Budidaya Udang",
    date: "5 September 2026",
    image: "/img/berita/artikel3.webp",
    href: "/berita/menjaga-kualitas-air-budidaya-udang",
  },
];

const topics = [
  {
    label: "Akuakultur",
    count: 1,
  },
  {
    label: "Teknologi",
    count: 3,
  },
  {
    label: "Keberlanjutan",
    count: 2,
  },
  {
    label: "Energi",
    count: 2,
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsDetail({
  title,
  category,
  date,
  image,
}: NewsDetailProps) {
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

      <div className="relative mx-auto max-w-7xl px-5 pt-4 pb-12 sm:pt-5 sm:pb-16 lg:px-8 lg:pt-6 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start lg:gap-12">
          {/* =================================================
              ARTICLE
          ================================================= */}

          <article className="min-w-0">
            {/* Featured Image */}
            <div className="overflow-hidden rounded-[24px] border border-border bg-muted shadow-sm">
              <img
                src={image}
                alt={title}
                width={1200}
                height={800}
                className="aspect-[16/9] h-full w-full object-cover"
              />
            </div>

            {/* Meta */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1.5 font-semibold text-brand-dark">
                {category}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays
                  className="size-4 text-brand-secondary"
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <time dateTime={date}>{formatDate(date)}</time>
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[46px]">
              {title}
            </h1>

            {/* =================================================
                ARTICLE CONTENT
            ================================================= */}

            <div className="mt-8 max-w-none">
              {/* Intro */}
              <p className="text-[14px] leading-7 text-muted-foreground">
                Tambak adalah istilah dalam budidaya perairan. Tambak
                didefinisikan sebagai sebuah area dengan luas tertentu dan
                berisikan air sebagai media untuk budidaya perairan. Umumnya
                tambak berlokasi di daerah pantai atau pesisir. Tambak juga
                didefinisikan sebagai kolam buatan yang berlokasi di daerah
                pasang surut dan difungsikan sebagai habitat buatan untuk hewan
                air payau. Sebagian besar air yang ada di dalam tambak berasal
                dari air tawar yang telah disiapkan, kemudian bercampur dengan
                air laut sehingga menjadi air payau.
              </p>

              {/* Apa Itu Tambak Udang */}
              <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Apa Itu Tambak Udang?
              </h2>

              <p className="mt-5 text-[14px] leading-7 text-muted-foreground">
                Tambak udang sendiri memiliki arti suatu area atau lahan yang
                dirancang khusus untuk budidaya udang. Tambak udang dapat
                ditemukan di berbagai daerah pesisir atau rawa-rawa yang
                memenuhi persyaratan untuk budidaya. Di Indonesia, udang menjadi
                komoditas perikanan yang sering dibudidayakan karena tingginya
                permintaan pasar.
              </p>

              <p className="mt-6 text-[14px] leading-7 text-muted-foreground">
                Saat ini, Indonesia menempati peringkat keempat eksportir udang
                terbesar di dunia, dibawah India, Ekuador dan Vietnam. Pada
                tahun 2022 data ekspor udang Indonesia mencapai US$2,16 miliar
                dengan volume 241.200 ton. Tingginya permintaan pasar menjadikan
                budidaya udang memiliki perspektif ekonomi yang cerah.
              </p>

              {/* Supporting Image */}
              <div className="my-10 overflow-hidden rounded-[20px] border border-border bg-muted shadow-sm">
                <img
                  src="/img/berita/artikel5.webp"
                  alt="Aktivitas budidaya dan akuakultur"
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>

              {/* Budidaya Udang Berkelanjutan */}
              <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Budidaya Udang yang Berkelanjutan
              </h2>

              <p className="mt-5 text-[14px] leading-7 text-muted-foreground">
                Namun, tujuan budidaya udang tidak hanya berfokus pada hasil
                produksi saja. Perlu memperhatikan aspek-aspek ekologi dan
                keseimbangan ekosistem untuk memproduksi udang secara efisien
                dan berkelanjutan.
              </p>

              <p className="mt-6 text-[14px] leading-7 text-muted-foreground">
                Proses budidaya udang juga perlu melibatkan pemilihan lokasi
                yang sesuai, pengelolaan kualitas air, pemberian pakan,
                pemantauan kesehatan udang dan pemanenan secara terencana.
              </p>

              <p className="mt-6 text-[14px] leading-7 text-muted-foreground">
                Setelah mengetahui istilah tambak udang dan potensi komoditas
                udang di pasar global, tahukah kamu? Bahwa tingginya suatu
                produksi hasil budidaya tidak selamanya diikuti oleh keuntungan
                yang tinggi.
              </p>

              <p className="mt-6 text-[14px] leading-7 text-muted-foreground">
                Target produksi udang masih dihadapkan pada berbagai tantangan,
                salah satunya adalah lingkungan dan tingginya biaya operasional.
                Namun, tidak perlu khawatir karena Crustea siap membantu dengan
                berbagai solusi!
              </p>

              {/* Crustea Solution */}
              <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Crustea sebagai Solusi Teknologi Akuakultur
              </h2>

              <p className="mt-5 text-[14px] leading-7 text-muted-foreground">
                Crustea adalah perusahaan pengadaan teknologi yang berfokus di
                bidang akuakultur. Kami berkontribusi menciptakan teknologi
                berbasis IoT ramah lingkungan yang sesuai dengan kebutuhan
                petambak di Indonesia untuk memaksimalkan produksi hasil tambak
                serta meningkatkan produktivitas dan efisiensi dalam proses
                menambak.
              </p>

              <p className="mt-6 text-[14px] leading-7 text-muted-foreground">
                Crustea juga memiliki alat Eco Aerator berbasis panel surya,
                dengan menggunakan energi matahari menjadi listrik sehingga
                dapat menekan tingginya biaya operasional.
              </p>

              {/* Closing */}
              <p className="mt-6 text-[14px] leading-7 text-muted-foreground">
                Tertarik untuk mempelajari lebih lanjut tentang bisnis tambak
                udang? Ikuti terus informasi menarik lainnya di IG Crustea dan
                bisa menghubungi langsung melalui WhatsApp:
              </p>

              <a
                href="https://wa.me/6282140773592"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-[14px] font-semibold text-brand-secondary transition-colors hover:text-brand-dark"
              >
                +62-821-4077-3592
              </a>
            </div>

            {/* =================================================
                SHARE
            ================================================= */}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
              <div className="flex items-center gap-2.5">
                <Share2
                  className="size-4 text-brand-secondary"
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span className="text-sm font-semibold text-foreground">
                  Bagikan
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Bagikan ke Facebook"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary"
                >
                  <FaFacebookF className="size-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="Bagikan ke LinkedIn"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary"
                >
                  <FaLinkedinIn className="size-4" />
                </a>

                {/* Email */}
                <a
                  href="mailto:info@crustea.id"
                  aria-label="Bagikan melalui email"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-brand-dark transition-colors hover:border-primary hover:bg-secondary"
                >
                  <Mail className="size-4" />
                </a>
              </div>
            </div>

            {/* =================================================
                PREVIOUS / NEXT
            ================================================= */}

            <nav
              aria-label="Navigasi berita"
              className="mt-8 grid items-stretch gap-3 sm:grid-cols-2"
            >
              {/* Previous */}
              <Link
                href="#"
                className="group flex h-full flex-col rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <ArrowLeft
                    className="size-4 shrink-0 transition-transform group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  Berita Sebelumnya
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 font-display text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-brand-secondary">
                  Meningkatkan Efisiensi Tambak dengan Eco-Aerator
                </p>
              </Link>

              {/* Next */}
              <Link
                href="#"
                className="group flex h-full flex-col rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Berita Berikutnya
                  <ArrowRight
                    className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-right font-display text-sm font-semibold leading-5 text-foreground transition-colors group-hover:text-brand-secondary">
                  Menjaga Kualitas Air untuk Budidaya Udang
                </p>
              </Link>
            </nav>
          </article>

          {/* =================================================
              SIDEBAR
          ================================================= */}
          <aside className="self-start space-y-5">
            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Cari Berita
              </h3>

              <div className="relative mt-4">
                <input
                  type="search"
                  placeholder="Cari berita..."
                  className="h-12 w-full rounded-xl border border-border bg-muted/40 pl-4 pr-12 text-[14px] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                />

                <SearchIcon />
              </div>
            </div>

            {/* =================================================
                POPULAR POST
            ================================================= */}

            <div className="rounded-[24px] border border-border bg-card p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Popular Post
              </h3>

              <div className="mt-5 space-y-4">
                {popularPosts.map((post) => (
                  <article key={post.href} className="group flex gap-3">
                    <Link
                      href={post.href}
                      className="relative size-[76px] shrink-0 overflow-hidden rounded-xl border border-black/10 bg-muted shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md"
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
                      <h4 className="font-display text-[14px] font-semibold leading-5 text-foreground">
                        <Link
                          href={post.href}
                          className="transition-colors group-hover:text-brand-secondary"
                        >
                          {post.title}
                        </Link>
                      </h4>

                      <time className="mt-1.5 block text-xs text-muted-foreground">
                        {post.date}
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
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                Topik
              </h3>

              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                {topics.map((topic, index) => (
                  <Link
                    key={topic.label}
                    href={`/berita?topic=${topic.label}`}
                    className={`group flex items-center justify-between px-4 py-3.5 text-[14px] transition-colors hover:bg-secondary ${
                      index !== topics.length - 1
                        ? "border-b border-border"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <ArrowRight
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand-secondary"
                        aria-hidden="true"
                      />

                      <span className="font-medium text-foreground">
                        {topic.label}
                      </span>
                    </span>

                    <span className="text-xs font-medium text-muted-foreground">
                      ({topic.count})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* =================================================
   SEARCH ICON
================================================= */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-brand-secondary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
