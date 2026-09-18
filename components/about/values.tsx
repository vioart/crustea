import {
  Brain,
  Handshake,
  HeartHandshake,
  Lightbulb,
  RefreshCw,
  Scale,
  Users,
} from "lucide-react";

type ValueItem = {
  title: string;
  icon: typeof Lightbulb;
};

const values: ValueItem[] = [
  {
    title: "Creative & Innovative",
    icon: Lightbulb,
  },
  {
    title: "Respect",
    icon: Handshake,
  },
  {
    title: "Humility",
    icon: HeartHandshake,
  },
  {
    title: "Skillful",
    icon: Brain,
  },
  {
    title: "Teamwork",
    icon: Users,
  },
  {
    title: "Ethics & Integrity",
    icon: Scale,
  },
  {
    title: "Adaptive",
    icon: RefreshCw,
  },
];

export default function Values() {
  return (
    <section
      aria-labelledby="values-title"
      className="relative overflow-hidden bg-brand-dark text-white"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute -left-40 -top-40 size-[420px] rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -right-40 size-[480px] rounded-full bg-brand-secondary/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Large Decorative Text */}
      <div
        className="pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 select-none font-display text-[180px] font-bold leading-none tracking-tighter text-white/[0.025] lg:block"
        aria-hidden="true"
      >
        VALUES
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            <Lightbulb
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            Nilai-Nilai Crustea
          </p>

          <h2
            id="values-title"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[52px]"
          >
            Values of <span className="text-primary">Crustea</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60 sm:text-[17px]">
            Prinsip yang menjadi dasar cara kami berpikir, bekerja, dan
            bertumbuh bersama.
          </p>
        </header>

        {/* =================================================
            VALUES
        ================================================= */}

        <div className="mx-auto mt-14 max-w-5xl">
          {/* =================================================
              ROW 01 — 4 ITEMS
          ================================================= */}

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-12">
            {values.slice(0, 4).map((value) => {
              const Icon = value.icon;

              return (
                <ValueItem
                  key={value.title}
                  title={value.title}
                  icon={Icon}
                />
              );
            })}
          </div>

          {/* =================================================
              ROW 02 — 3 CENTERED ITEMS
          ================================================= */}

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12">
            {values.slice(4).map((value) => {
              const Icon = value.icon;

              return (
                <ValueItem
                  key={value.title}
                  title={value.title}
                  icon={Icon}
                />
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

/* =========================================================
   VALUE ITEM
========================================================= */

function ValueItem({
  title,
  icon: Icon,
}: {
  title: string;
  icon: typeof Lightbulb;
}) {
  return (
    <article className="group flex flex-col items-center text-center">
      {/* Icon */}
      <div className="relative flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-primary transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-brand-dark sm:size-[88px]">
        {/* Inner Ring */}
        <div
          className="pointer-events-none absolute inset-1.5 rounded-full border border-white/[0.08]"
          aria-hidden="true"
        />

        <Icon
          className="relative size-8 transition-transform duration-300 group-hover:scale-105 sm:size-9"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3 className="mt-4 max-w-[150px] font-display text-sm font-semibold leading-tight text-white sm:text-base">
        {title}
      </h3>
    </article>
  );
}