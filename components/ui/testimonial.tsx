"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Waves,
} from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Ibu Sari Handayani",
    role: "Pengelola tambak, Lampung",
    quote:
      "Sejak menggunakan Eco-Aerator, biaya listrik turun drastis dan kadar oksigen tetap stabil. Tim Crustea tidak hanya memasang alat—mereka terus mendampingi kami.",
    image: "/img/testimoni.webp",
  },
  {
    name: "Bapak Andi Pratama",
    role: "Pembudidaya udang, Jawa Tengah",
    quote:
      "Teknologi yang diberikan Crustea membantu kami lebih mudah memahami kondisi tambak dan mengambil keputusan selama proses budidaya.",
    image: "/img/testimoni2.webp",
  },
  {
    name: "Bapak Rudi Santoso",
    role: "Pengelola tambak, Jawa Timur",
    quote:
      "Yang paling kami rasakan bukan hanya dari teknologinya, tetapi juga pendampingan dari tim Crustea selama proses budidaya berlangsung.",
    image: "/img/testimoni3.webp",
  },
];

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const activeTestimonial = testimonials[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <section
      aria-labelledby="testimonial-title"
      className="relative overflow-hidden bg-brand-dark text-white"
    >
      <div className="mx-auto grid max-w-7xl lg:h-[560px] lg:grid-cols-2">
        {/* =====================================================
            IMAGE
        ===================================================== */}
        <div className="relative h-[360px] overflow-hidden sm:h-[440px] lg:h-full">
          <img
            key={activeIndex}
            src={activeTestimonial.image}
            alt={`Testimoni dari ${activeTestimonial.name}`}
            width={1408}
            height={912}
            loading="lazy"
            className="h-full w-full object-cover"
          />

          {/* Image overlay */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          {/* Eyebrow */}
          <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 text-brand-primary"
              strokeWidth={2}
              aria-hidden="true"
            />

            Cerita Petambak
          </p>

          {/* Quote Icon */}
          <Quote
            className="mt-6 size-9 text-brand-primary"
            strokeWidth={2}
            aria-hidden="true"
          />

          {/* Quote */}
          <blockquote
            id="testimonial-title"
            key={activeIndex}
            className="mt-5 max-w-xl font-display text-xl font-medium leading-[1.5] text-white sm:text-2xl lg:text-[27px]"
          >
            “{activeTestimonial.quote}”
          </blockquote>

          {/* Author */}
          <div className="mt-6">
            <p className="font-display text-base font-semibold text-white sm:text-lg">
              {activeTestimonial.name}
            </p>

            <p className="mt-1 text-sm text-white/60">
              {activeTestimonial.role}
            </p>
          </div>

          {/* =================================================
              TESTIMONIAL NAVIGATION
          ================================================= */}
          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between gap-4">
              {/* Testimonial Selector */}
              <div className="flex min-w-0 items-center gap-1.5">
                {testimonials.map((testimonial, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={testimonial.name}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Lihat testimoni ${testimonial.name}`}
                      aria-current={isActive ? "true" : undefined}
                      className={[
                        "group flex items-center gap-2 rounded-full px-2 py-1.5 text-left transition-all duration-300",
                        isActive
                          ? "bg-white/10"
                          : "hover:bg-white/5",
                      ].join(" ")}
                    >
                      {/* Number */}
                      <span
                        className={[
                          "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                          isActive
                            ? "bg-brand-primary text-brand-dark"
                            : "border border-white/15 text-white/50",
                        ].join(" ")}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Name */}
                      <span
                        className={[
                          "hidden text-xs font-medium sm:block",
                          isActive
                            ? "text-white"
                            : "text-white/40",
                        ].join(" ")}
                      >
                        {testimonial.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Arrows */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Testimoni sebelumnya"
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Testimoni berikutnya"
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}