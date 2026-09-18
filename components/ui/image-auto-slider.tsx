import { cn } from "@/lib/utils";
import { Waves } from "lucide-react";

type SliderImage = {
  src: string;
  alt: string;
  title: string;
  category: string;
};

const images: SliderImage[] = [
  {
    src: "/img/bg-hero.webp",
    alt: "Teknologi akuakultur Crustea",
    title: "Inovasi Teknologi Akuakultur",
    category: "Teknologi",
  },
  {
    src: "/img/bg-hero.webp",
    alt: "Implementasi teknologi Crustea di lapangan",
    title: "Implementasi di Lapangan",
    category: "Implementasi",
  },
  {
    src: "/img/bg-hero.webp",
    alt: "Tim Crustea mendampingi pembudidaya tambak",
    title: "Mendampingi Pembudidaya",
    category: "Lapangan",
  },
  {
    src: "/img/bg-hero.webp",
    alt: "Tim Crustea mengembangkan teknologi akuakultur",
    title: "Kolaborasi dan Pengembangan",
    category: "Tim Crustea",
  },
  {
    src: "/img/bg-hero.webp",
    alt: "Crustea menerima penghargaan atas inovasi teknologi",
    title: "Apresiasi atas Inovasi",
    category: "Pencapaian",
  },
  {
    src: "/img/bg-hero.webp",
    alt: "Pencapaian Crustea dalam pengembangan teknologi",
    title: "Mendorong Dampak yang Lebih Luas",
    category: "Pencapaian",
  },
];

export function ImageAutoSlider({
  className,
}: {
  className?: string;
}) {
  const repeatedImages = [...images, ...images];

  return (
    <section
      aria-labelledby="story-slider-title"
      className={cn(
        "relative overflow-hidden bg-muted py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      {/* =====================================================
          SECTION HEADER
      ===================================================== */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            Teknologi & Perjalanan Kami
          </p>

          {/* Heading */}
          <h2
            id="story-slider-title"
            className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[42px]"
          >
            Dari Inovasi{" "}
            <span className="text-primary">
              hingga Dampak di Lapangan.
            </span>
          </h2>
        </div>
      </div>

      {/* =====================================================
          AUTO SLIDER
      ===================================================== */}
      <div
        className="relative mt-10 overflow-hidden"
        aria-label="Galeri perjalanan dan pencapaian Crustea"
      >
        {/* Left Fade */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-muted to-transparent sm:w-24"
          aria-hidden="true"
        />

        {/* Right Fade */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-muted to-transparent sm:w-24"
          aria-hidden="true"
        />

        {/* Track */}
        <div className="story-slider-track flex w-max gap-5 py-2 sm:gap-6">
          {repeatedImages.map((image, index) => {
            const isDuplicate = index >= images.length;

            return (
              <figure
                key={`${image.src}-${index}`}
                aria-hidden={isDuplicate}
                className="group relative aspect-[16/10] w-[78vw] max-w-[380px] shrink-0 overflow-hidden rounded-[22px] bg-background sm:w-[42vw] lg:w-[28vw]"
              >
                {/* Image */}
                <img
                  src={image.src}
                  alt={isDuplicate ? "" : image.alt}
                  loading="lazy"
                  width={1200}
                  height={750}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                  aria-hidden="true"
                />

                {/* Caption */}
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  {/* Category */}
                  <span className="mb-2 inline-flex rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                    {image.category}
                  </span>

                  {/* Title */}
                  <p className="font-display text-md font-semibold leading-tight text-white sm:text-xl">
                    {image.title}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}