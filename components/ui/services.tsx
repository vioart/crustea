import {
  Check,
  ClipboardCheck,
  Handshake,
  Settings2,
  Sprout,
  Waves,
} from "lucide-react";

type Service = {
  number: string;
  phase: string;
  title: string;
  items: string[];
  icon: typeof ClipboardCheck;
};

const services: Service[] = [
  {
    number: "01",
    phase: "Persiapan",
    title: "Konsultasi & Konstruksi",
    items: [
      "Survei lokasi & kualitas air",
      "Desain dan konstruksi kolam",
      "Perhitungan kebutuhan aerasi & energi",
    ],
    icon: ClipboardCheck,
  },
  {
    number: "02",
    phase: "Instalasi",
    title: "Eco-Aerator",
    items: [
      "Panel surya + baterai",
      "Pemasangan oleh teknisi",
      "Pelatihan operator tambak",
    ],
    icon: Settings2,
  },
  {
    number: "03",
    phase: "Budidaya",
    title: "Crustea AIO",
    items: [
      "Monitoring DO, suhu & energi",
      "Aerator otomatis",
      "Peringatan dini gangguan",
    ],
    icon: Sprout,
  },
  {
    number: "04",
    phase: "Pasca Panen",
    title: "Kemitraan & Pasar",
    items: [
      "Kemitraan bagi hasil",
      "Akses pasar hasil panen",
      "Pengolahan limbah",
    ],
    icon: Handshake,
  },
];

export default function Services() {
  return (
    <section
      aria-labelledby="services-title"
      className="relative overflow-hidden border-y border-border bg-secondary"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/60 blur-3xl"
        aria-hidden="true"
      />

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <header>
          {/* Eyebrow */}
          <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            Cara Kami Bekerja
          </p>

          {/* Heading */}
          <h2
            id="services-title"
            className="max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Dari persiapan hingga pasar,{" "}
            <span className="text-primary">
              kami mendampingi setiap tahap.
            </span>
          </h2>
        </header>

        {/* =====================================================
            SERVICES TIMELINE
        ===================================================== */}
        <div className="service-line relative mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="group relative flex h-full min-h-[280px] flex-col rounded-[24px] border border-border bg-background p-6 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* =================================================
                    STEP NUMBER
                ================================================= */}
                <span
                  className="absolute -top-6 left-4 flex size-12 items-center justify-center rounded-full bg-brand-dark font-display text-base font-bold text-primary ring-8 ring-secondary"
                  aria-hidden="true"
                >
                  {service.number}
                </span>

                {/* =================================================
                    SERVICE ICON
                ================================================= */}
                <div
                  className="absolute right-6 top-11 flex size-9 items-center justify-center rounded-lg bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-accent group-hover:text-primary"
                  aria-hidden="true"
                >
                  <Icon
                    className="size-[18px]"
                    strokeWidth={1.8}
                  />
                </div>

                {/* =================================================
                    PHASE
                ================================================= */}
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                  {service.phase}
                </p>

                {/* =================================================
                    SERVICE TITLE
                ================================================= */}
                <h3 className="mt-2 max-w-[85%] font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                  {service.title}
                </h3>

                {/* =================================================
                    SERVICE FEATURES
                ================================================= */}
                <ul
                  aria-label={`Layanan ${service.title}`}
                  className="mt-6 space-y-3.5"
                >
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-5 text-secondary-foreground"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-brand-secondary"
                        strokeWidth={2}
                        aria-hidden="true"
                      />

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}