import { ArrowUpRight, Leaf, Waves } from "lucide-react";

type ImpactMetric = {
  value: string;
  label: string;
  description: string;
};

type SDG = {
  src: string;
  alt: string;
};

const impactMetrics: ImpactMetric[] = [
  {
    value: "200%",
    label: "Udang Lebih Besar & Berkualitas",
    description:
      "Peningkatan ukuran dan kualitas udang melalui solusi budidaya yang diterapkan.",
  },
  {
    value: "80%",
    label: "Penghematan Biaya Operasional",
    description:
      "Efisiensi biaya operasional melalui teknologi dan optimalisasi penggunaan sumber daya.",
  },
  {
    value: "23k",
    label: "tCO₂e Pengurangan Emisi GHG",
    description:
      "Kontribusi terhadap pengurangan emisi gas rumah kaca melalui pendekatan akuakultur berkelanjutan.",
  },
  {
    value: "60%",
    label: "Women Management",
    description:
      "Keterlibatan perempuan dalam pengelolaan dan pemberdayaan dalam ekosistem Crustea.",
  },
];

const sdgs: SDG[] = [
  {
    src: "/img/sdg/SDGs-1.webp",
    alt: "SDGs 1 - Tanpa Kemiskinan",
  },
  {
    src: "/img/sdg/SDGs-2.webp",
    alt: "SDGs 2 - Tanpa Kelaparan",
  },
  {
    src: "/img/sdg/SDGs-7.webp",
    alt: "SDGs 7 - Energi Bersih dan Terjangkau",
  },
  {
    src: "/img/sdg/SDGs-13.webp",
    alt: "SDGs 13 - Penanganan Perubahan Iklim",
  },
  {
    src: "/img/sdg/SDGs-14.webp",
    alt: "SDGs 14 - Ekosistem Lautan",
  },
];

export default function OurImpact() {
  return (
    <section
      aria-labelledby="our-impact-title"
      className="relative overflow-hidden bg-secondary"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-white/60 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* =================================================
            HEADER
        ================================================= */}
        <header className="max-w-3xl">
          {/* Eyebrow */}
          <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            Dampak Kami
          </p>

          {/* Heading */}
          <h2
            id="our-impact-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Menciptakan dampak untuk{" "}
            <span className="text-primary">
              akuakultur yang lebih berkelanjutan.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            Solusi yang kami kembangkan tidak hanya berfokus pada produktivitas,
            tetapi juga pada efisiensi, lingkungan, dan pemberdayaan dalam
            ekosistem akuakultur.
          </p>
        </header>

        {/* =================================================
            SDG
        ================================================= */}
        <div className="mt-12 rounded-[24px] border border-border bg-background/80 p-6 sm:p-7 lg:mt-14 lg:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* SDG Intro */}
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                  <Leaf
                    className="size-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                    Keberlanjutan
                  </p>

                  <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                    Kontribusi terhadap SDGs
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Dampak Crustea selaras dengan beberapa Tujuan Pembangunan
                Berkelanjutan.
              </p>
            </div>

            {/* SDG Images */}
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              {sdgs.map((sdg) => (
                <div
                  key={sdg.src}
                  className="group overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-sm"
                >
                  <img
                    src={sdg.src}
                    alt={sdg.alt}
                    className="size-16 object-cover transition-transform duration-300 group-hover:scale-105 sm:size-[72px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================
            IMPACT METRICS
        ================================================= */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric) => (
            <article
              key={metric.value + metric.label}
              className="group relative overflow-hidden rounded-[20px] border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg hover:shadow-brand-dark/5 sm:p-7"
            >
              {/* Number */}
              <p className="font-display text-4xl font-semibold leading-none tracking-tight text-brand-dark sm:text-5xl">
                {metric.value}
              </p>

              {/* Label */}
              <h3 className="mt-4 max-w-[15rem] font-display text-lg font-semibold leading-tight text-foreground">
                {metric.label}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {metric.description}
              </p>

              {/* Arrow */}
              <ArrowUpRight
                className="absolute right-6 top-6 size-4 text-brand-secondary/0 transition-all duration-300 group-hover:text-brand-secondary sm:right-7 sm:top-7"
                aria-hidden="true"
              />

              {/* Bottom indicator */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* =================================================
            NOTE
        ================================================= */}
        <p className="mt-5 text-xs leading-5 text-muted-foreground/70">
          Angka dampak ditampilkan berdasarkan data dan metrik yang digunakan
          oleh Crustea.
        </p>
      </div>
    </section>
  );
}
