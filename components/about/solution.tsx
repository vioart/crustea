import Link from "next/link";
import {
  ArrowUpRight,
  Gauge,
  Leaf,
  Smartphone,
  Waves,
} from "lucide-react";

type Solution = {
  number: string;
  name: string;
  category: string;
  description: string;
  image: string;
  icon: typeof Gauge;
  features: string[];
  href: string;
};

const solutions: Solution[] = [
  {
    number: "01",
    name: "EBII System",
    category: "Water Quality Monitoring",
    description:
      "Sistem pemantauan kualitas air dengan empat parameter utama untuk membantu memahami kondisi tambak.",
    image: "/img/ebii-system.webp",
    icon: Gauge,
    features: ["pH", "DO", "Salinity", "Temperature"],
    href: "/produk/hardware-teknologi",
  },
  {
    number: "02",
    name: "Eco-Aerator",
    category: "Renewable Energy",
    description:
      "Teknologi aerasi dengan solar panel dan impeller yang dirancang untuk menghasilkan gelembung lebih kecil dan kadar oksigen lebih tinggi.",
    image: "/img/eco-aerator.webp",
    icon: Leaf,
    features: ["Solar Panel", "Impeller", "Higher Oxygen"],
    href: "/produk/hardware-teknologi",
  },
  {
    number: "03",
    name: "Smart Energy",
    category: "Energy Management",
    description:
      "Solusi untuk memantau dan mengontrol penggunaan energi pada aerator dengan mudah melalui smartphone.",
    image: "/img/smart-energy.webp",
    icon: Smartphone,
    features: ["Monitor Energy", "Control", "Smartphone"],
    href: "/produk/hardware-teknologi",
  },
];

export default function Solution() {
  return (
    <section
      aria-labelledby="solution-title"
      className="relative overflow-hidden bg-background"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-secondary/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-accent/50 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* =================================================
            HEADER
        ================================================= */}
        <header className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            Solusi Crustea
          </p>

          {/* Heading */}
          <h2
            id="solution-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Dari tantangan menuju{" "}
            <span className="text-primary">solusi teknologi.</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            Crustea menghadirkan teknologi untuk membantu pembudidaya dalam
            memantau kualitas air, meningkatkan efisiensi aerasi, dan
            mengoptimalkan penggunaan energi di tambak.
          </p>
        </header>

        {/* =================================================
            SOLUTIONS
        ================================================= */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:mt-14">
          {solutions.map((solution) => {
            const Icon = solution.icon;

            return (
              <article
                key={solution.number}
                className="group relative overflow-hidden rounded-[24px] border border-border bg-muted transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg hover:shadow-brand-dark/5"
              >
                {/* =================================================
                    IMAGE
                ================================================= */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={solution.image}
                    alt={`${solution.name} - ${solution.category}`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* Number */}
                  <span
                    className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-border bg-white/90 text-xs font-bold text-brand-dark shadow-sm backdrop-blur-sm"
                    aria-hidden="true"
                  >
                    {solution.number}
                  </span>
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}
                <div className="p-6 sm:p-7">
                  {/* Category */}
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-secondary">
                    <Icon
                      className="size-4 text-primary"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {solution.category}
                  </div>

                  {/* Name */}
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {solution.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {solution.description}
                  </p>

                  {/* Features */}
                  <ul
                    aria-label={`Fitur ${solution.name}`}
                    className="mt-5 flex flex-wrap gap-2"
                  >
                    {solution.features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Product Link */}
<div className="mt-6 border-t border-border pt-5">
  <Link
    href={solution.href}
    className="group/link flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-brand-secondary transition-colors duration-300 hover:text-brand-dark"
  >
    <span>Lihat Teknologi</span>

    <ArrowUpRight
      className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  </Link>
</div>
                </div>

                {/* Bottom indicator */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>

        {/* =================================================
            KEY ADVANTAGES
        ================================================= */}
        <div className="mt-12 border-y border-border">
          <div className="grid items-stretch lg:grid-cols-[1fr_auto_1fr]">
            {/* =================================================
                ADVANTAGE 01
            ================================================= */}
            <div className="flex items-center py-7 text-center lg:py-8 lg:text-left">
              <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                  Potensi Hasil Budidaya
                </p>

                <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                  <span className="text-primary">200%</span>{" "}
                  <br className="sm:hidden" />
                  bigger & higher quality shrimp
                </p>
              </div>
            </div>

            {/* =================================================
                CENTER
            ================================================= */}
            <div className="hidden items-center border-x border-border px-8 lg:flex">
              <div className="flex items-center gap-3">
                <ArrowUpRight
                  className="size-4 rotate-[-135deg] text-brand-secondary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-brand-secondary">
                  Keunggulan
                </span>

                <ArrowUpRight
                  className="size-4 rotate-45 text-brand-secondary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* =================================================
                ADVANTAGE 02
            ================================================= */}
            <div className="border-t border-border py-7 text-center lg:border-t-0 lg:py-8 lg:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                Efisiensi Operasional
              </p>

              <p className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                <span className="text-primary">60–80%</span>{" "}
                <br className="sm:hidden" />
                operational cost savings
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}