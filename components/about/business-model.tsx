import {
  ArrowRight,
  BarChart3,
  Building2,
  Handshake,
  Leaf,
  LineChart,
  RefreshCw,
  Settings,
  ShoppingBag,
  Users,
  Waves,
} from "lucide-react";

type ProductModel = {
  title: string;
  description: string;
  icon: typeof ShoppingBag;
};

type ServiceModel = {
  title: string;
  description?: string;
};

const productModels: ProductModel[] = [
  {
    title: "Direct Selling",
    description: "Penjualan teknologi secara langsung kepada pelanggan.",
    icon: ShoppingBag,
  },
  {
    title: "Leasing",
    description: "Skema penggunaan teknologi melalui model sewa.",
    icon: RefreshCw,
  },
  {
    title: "PaaS / SaaS",
    description: "Layanan teknologi berbasis platform dan software.",
    icon: Settings,
  },
];

const serviceModels: ServiceModel[] = [
  {
    title: "Shrimp Trading & Processing Products",
  },
  {
    title: "Projects",
    description: "Aquaculture, Empowerment, Sustainability",
  },
  {
    title: "Consulting & Technical Assistance",
  },
  {
    title: "Technology Maintenance & Repair",
  },
];

const businessMetrics = [
  {
    value: "200",
    unit: "ppm",
    label: "Production Capacity",
    description: "Per month",
  },
  {
    value: "$40M",
    unit: "",
    label: "Revenue Projected",
    description: "in 2030",
  },
  {
    value: "35%",
    unit: "Up to",
    label: "Gross Margin",
    description: "",
  },
];

const impactMetrics = [
  {
    value: "200%",
    label: "Bigger & Higher Quality Shrimp",
  },
  {
    value: "80%",
    label: "Operational Cost Saving",
  },
  {
    value: "23k",
    label: "tCO₂e GHG Reduction",
  },
  {
    value: "60%",
    label: "Women Management",
  },
];

const sdgs = [
  {
    src: "/img/sdg/SDGs-1.webp",
    alt: "SDG 1 - Tanpa Kemiskinan",
  },
  {
    src: "/img/sdg/SDGs-2.webp",
    alt: "SDG 2 - Tanpa Kelaparan",
  },
  {
    src: "/img/sdg/SDGs-7.webp",
    alt: "SDG 7 - Energi Bersih dan Terjangkau",
  },
  {
    src: "/img/sdg/SDGs-14.webp",
    alt: "SDG 14 - Ekosistem Lautan",
  },
  {
    src: "/img/sdg/SDGs-13.webp",
    alt: "SDG 13 - Penanganan Perubahan Iklim",
  },
];

export default function BusinessModel() {
  return (
    <section
      aria-labelledby="business-model-title"
      className="relative overflow-hidden bg-background"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-secondary/70 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-accent/60 blur-3xl"
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
          <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            Model Bisnis
          </p>

          <h2
            id="business-model-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Membangun nilai melalui{" "}
            <span className="text-primary">
              teknologi dan layanan akuakultur.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            Crustea mengembangkan model bisnis yang menghubungkan pembudidaya,
            sektor publik dan swasta, teknologi, layanan, serta akses pasar
            dalam satu ekosistem akuakultur.
          </p>
        </header>

        {/* =================================================
            BUSINESS FLOW
        ================================================= */}

        <div className="mt-12 overflow-hidden rounded-[28px] border border-border bg-muted">
          <div className="grid lg:grid-cols-[0.8fr_1.15fr_1fr]">
            {/* =================================================
                CUSTOMERS
            ================================================= */}

            <div className="relative border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                  <Users
                    className="size-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                    Customers
                  </p>

                  <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                    B2B
                  </h3>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    Pond Farmers
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    Public / Private Sectors
                  </p>
                </div>
              </div>

              {/* Flow Arrow */}
              <div className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-brand-dark lg:flex">
                <ArrowRight
                  className="size-3.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                  <Building2
                    className="size-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                    Products
                  </p>

                  <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                    Technology
                  </h3>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {productModels.map((product) => {
                  const Icon = product.icon;

                  return (
                    <article
                      key={product.title}
                      className="group rounded-[18px] border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-brand-secondary transition-colors duration-300 group-hover:bg-primary group-hover:text-brand-dark">
                        <Icon
                          className="size-4"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>

                      <h4 className="mt-4 font-display text-sm font-semibold leading-tight text-foreground">
                        {product.title}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {product.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                SERVICES
            ================================================= */}

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-brand-secondary">
                  <Handshake
                    className="size-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-secondary">
                    Services
                  </p>

                  <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                    Other Revenue
                  </h3>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {serviceModels.map((service, index) => (
                  <div
                    key={service.title}
                    className="flex items-start gap-3"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[9px] font-semibold text-brand-secondary">
                      {index + 1}
                    </span>

                    <div>
                      <p className="text-sm font-medium leading-5 text-foreground">
                        {service.title}
                      </p>

                      {service.description && (
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            BUSINESS PERFORMANCE
        ================================================= */}

        <div className="mt-12">
          <div className="flex items-center gap-3">
            <BarChart3
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
              Business Performance
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {businessMetrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[22px] border border-border bg-background p-6 sm:p-7"
              >
                <div className="flex items-end gap-2">
                  {metric.unit === "Up to" && (
                    <span className="pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-secondary">
                      {metric.unit}
                    </span>
                  )}

                  <p className="font-display text-4xl font-semibold leading-none tracking-tight text-brand-dark sm:text-5xl">
                    {metric.value}
                  </p>

                  {metric.unit && metric.unit !== "Up to" && (
                    <span className="pb-1 font-display text-lg font-semibold text-brand-secondary">
                      {metric.unit}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {metric.label}
                </h3>

                {metric.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* =================================================
            IMPACT
        ================================================= */}

        <div className="mt-12 overflow-hidden rounded-[28px] bg-secondary p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Impact Header */}
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-background text-brand-secondary">
                  <Leaf
                    className="size-5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
                    Sustainability
                  </p>

                  <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
                    Our Impact
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Dampak yang dihasilkan melalui penerapan teknologi dan
                pengembangan ekosistem akuakultur Crustea.
              </p>
            </div>

            {/* SDG */}
            <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
              {sdgs.map((sdg) => (
                <div
                  key={sdg.src}
                  className="overflow-hidden rounded-lg border border-border bg-background"
                >
                  <img
                    src={sdg.src}
                    alt={sdg.alt}
                    className="size-14 object-cover sm:size-16"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[16px] border border-border bg-background px-4 py-5 text-center"
              >
                <p className="font-display text-3xl font-semibold leading-none tracking-tight text-brand-dark">
                  {metric.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {metric.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}