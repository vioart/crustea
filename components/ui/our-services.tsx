import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Handshake,
  Leaf,
  LineChart,
  Store,
  Waves,
} from "lucide-react";

type Service = {
  number: string;
  title: string;
  description: string;
  icon: typeof Waves;
};

const services: Service[] = [
  {
    number: "01",
    title: "Proyek Bagi Hasil & Pengembangan Tambak",
    description:
      "Menjalankan proyek budidaya dengan skema bagi hasil, mulai dari pembangunan tambak hingga dukungan teknologi dan akses pasar untuk menciptakan sistem yang efisien dan berkelanjutan.",
    icon: Handshake,
  },
  {
    number: "02",
    title: "Konsultasi & Dukungan Operasional",
    description:
      "Memberikan panduan dalam budidaya udang dan ikan, mulai dari perencanaan hingga implementasi, termasuk dukungan teknologi di lokasi maupun jarak jauh dengan fokus pada kualitas air, efisiensi energi, dan pencegahan penyakit.",
    icon: Waves,
  },
  {
    number: "03",
    title: "Manajemen & Optimalisasi Energi",
    description:
      "Menyediakan sistem untuk memantau, mengelola, dan mengoptimalkan penggunaan energi melalui perangkat efisien, otomatisasi, dan energi terbarukan untuk membantu mengurangi biaya listrik tanpa mengurangi produktivitas.",
    icon: ChartNoAxesCombined,
  },
  {
    number: "04",
    title: "Keberlanjutan & Pemberdayaan",
    description:
      "Mendukung perdagangan akuakultur yang efisien serta menciptakan produk olahan bernilai tambah dari udang dan ikan melalui pemberdayaan perempuan, inklusi ekonomi, dan pengurangan limbah.",
    icon: Leaf,
  },
  {
    number: "05",
    title: "Akses ke Mitra Pendanaan",
    description:
      "Menghadirkan solusi finansial yang disesuaikan untuk mendukung proyek akuakultur, termasuk akses terhadap sumber daya untuk pengembangan skala usaha dan optimalisasi operasional.",
    icon: LineChart,
  },
  {
    number: "06",
    title: "Akses ke Pasar",
    description:
      "Mendukung penjualan produk udang, ikan, dan produk berbasis limbah berkualitas tinggi ke pasar lokal maupun pasar ekspor global.",
    icon: Store,
  },
];

export default function OurServices() {
  return (
    <section
      aria-labelledby="our-services-title"
      className="relative overflow-hidden  bg-background"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-secondary/60 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/50 blur-3xl"
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
            Layanan Kami
          </p>

          {/* Heading */}
          <h2
            id="our-services-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Solusi terintegrasi untuk{" "}
            <span className="text-primary">
              kebutuhan akuakultur Anda.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            Dari pengembangan tambak hingga akses pendanaan dan pasar, Crustea
            menghadirkan berbagai layanan untuk mendukung produktivitas,
            efisiensi, dan keberlanjutan bisnis akuakultur.
          </p>
        </header>

        {/* =================================================
            SERVICES GRID
        ================================================= */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="group relative overflow-hidden rounded-[20px] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/40 hover:shadow-lg hover:shadow-brand-dark/5 sm:p-7"
              >
                {/* =================================================
                    TOP
                ================================================= */}
                <div className="flex items-start justify-between gap-4">
                  {/* Number */}
                  <span className="font-mono text-xs font-semibold tracking-[0.14em] text-brand-secondary">
                    {service.number}
                  </span>

                  {/* Icon */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
                    <Icon
                      className="size-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}
                <div className="mt-8">
                  <h3 className="max-w-[18rem] font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                {/* =================================================
                    HOVER INDICATOR
                ================================================= */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}