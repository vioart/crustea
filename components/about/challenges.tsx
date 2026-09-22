import {
  CircleDollarSign,
  Droplets,
  TrendingDown,
  Waves,
} from "lucide-react";

type Challenge = {
  value: string;
  title: string;
  description: string;
  icon: typeof Droplets;
};

const challenges: Challenge[] = [
  {
    value: "90%",
    title: "Pembudidaya Menghadapi Keterbatasan Produktivitas",
    description:
      "Sebagian besar pembudidaya dalam survei menghadapi berbagai kondisi yang membatasi produktivitas akuakultur.",
    icon: TrendingDown,
  },
  {
    value: "70%",
    title: "Kematian Udang & Ikan",
    description:
      "Kematian udang dan ikan dikaitkan dengan kondisi dissolved oxygen yang tidak terkontrol.",
    icon: Droplets,
  },
  {
    value: "Rp100 Juta",
    title: "Biaya Bahan Bakar Tinggi",
    description:
      "Tingginya biaya bahan bakar menjadi salah satu tantangan dalam operasional tambak.",
    icon: CircleDollarSign,
  },
];

export default function Challenges() {
  return (
    <section
      aria-labelledby="challenges-title"
      className="relative overflow-hidden bg-secondary"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 size-[420px] rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -right-40 size-[420px] rounded-full bg-white/60 blur-3xl"
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
            Tantangan Pembudidaya
          </p>

          {/* Heading */}
          <h2
            id="challenges-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Berbagai tantangan masih membatasi{" "}
            <span className="text-primary">
              produktivitas akuakultur.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            Pembudidaya menghadapi berbagai tantangan dalam menjaga
            produktivitas tambak, mulai dari pengelolaan kualitas air hingga
            tingginya biaya operasional.
          </p>
        </header>

        {/* =================================================
            CHALLENGES CONTENT
        ================================================= */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-6">
          {/* =================================================
              LEFT — CHALLENGE CARDS
          ================================================= */}
          <div className="flex flex-col gap-4">
            {challenges.map((challenge) => {
              const Icon = challenge.icon;

              return (
                <article
                  key={challenge.title}
                  className="group flex flex-1 gap-4 rounded-[20px] border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-secondary/40 hover:shadow-md hover:shadow-brand-dark/5 sm:p-6"
                >
                  {/* Icon */}
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
                    <Icon
                      className="size-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="font-display text-2xl font-semibold leading-none tracking-tight text-brand-dark sm:text-3xl">
                        {challenge.value}
                      </p>

                      <h3 className="font-display text-base font-semibold leading-tight text-foreground sm:text-lg">
                        {challenge.title}
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {challenge.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* =================================================
              RIGHT — IMAGE
          ================================================= */}
          <div className="relative min-h-[320px] lg:min-h-0">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[28px] border border-border bg-background lg:min-h-full">
              <img
                src="/img/tantangan.jpg"
                alt="Pembudidaya tambak dalam aktivitas budidaya"
                width={1200}
                height={900}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Image Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-brand-dark/10 to-transparent"
                aria-hidden="true"
              />

              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="max-w-sm text-sm font-medium leading-6 text-white/90">
                  Tantangan operasional dan kualitas air menjadi bagian penting
                  yang perlu diperhatikan dalam menjaga produktivitas tambak.
                </p>
              </div>
            </div>

            {/* Decorative Accent */}
            <div
              className="pointer-events-none absolute -bottom-5 -right-5 size-24 rounded-full bg-primary/50 blur-3xl"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* =================================================
            SOURCE NOTE
        ================================================= */}
        <p className="mt-5 text-xs leading-5 text-muted-foreground/70">
          * Berdasarkan survei yang dilakukan pada tahun 2021–2022.
        </p>
      </div>
    </section>
  );
}