"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Quote, Waves } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  image: string;
};

export default function Testimonial() {
  const t = useTranslations("Home.testimonial");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const testimonials: Testimonial[] = [
    {
      name: t("items.sari.name"),
      role: t("items.sari.role"),
      quote: t("items.sari.quote"),
      image: "/img/testimoni.webp",
    },
    {
      name: t("items.andi.name"),
      role: t("items.andi.role"),
      quote: t("items.andi.quote"),
      image: "/img/testimoni2.webp",
    },
    {
      name: t("items.rudi.name"),
      role: t("items.rudi.role"),
      quote: t("items.rudi.quote"),
      image: "/img/testimoni3.webp",
    },
  ];

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
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:min-h-[560px] lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-[300px] overflow-hidden sm:h-[420px] lg:h-auto lg:min-h-[560px]">
          <img
            key={activeIndex}
            src={activeTestimonial.image}
            alt={t("imageAlt", {
              name: activeTestimonial.name,
            })}
            width={1408}
            height={912}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-10 lg:py-12 xl:px-14 xl:py-14">
          {/* Eyebrow */}
          <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Waves
              className="size-5 shrink-0 text-brand-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t("eyebrow")}
          </p>

          {/* Quote icon */}
          <Quote
            className="mt-6 size-9 shrink-0 text-brand-primary"
            strokeWidth={2}
            aria-hidden="true"
          />

          {/* Quote */}
          <blockquote
            id="testimonial-title"
            key={activeIndex}
            className="mt-5 max-w-xl break-words font-display text-xl font-medium leading-[1.5] text-white sm:text-2xl lg:text-[23px] xl:text-[27px]"
          >
            “{activeTestimonial.quote}”
          </blockquote>

          {/* Author */}
          <div className="mt-6">
            <p className="font-display text-base font-semibold text-white sm:text-lg">
              {activeTestimonial.name}
            </p>

            <p className="mt-1 text-sm leading-6 text-white/60">
              {activeTestimonial.role}
            </p>
          </div>

          {/* Testimonial navigation */}
          <div className="mt-7 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between gap-3">
              {/* Three selectors always stay in one row */}
              <div
                className="grid min-w-0 flex-1 grid-cols-3 gap-1"
                aria-label={t("selectorLabel")}
              >
                {testimonials.map((testimonial, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={testimonial.name}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={t("selectTestimonial", {
                        name: testimonial.name,
                      })}
                      aria-current={isActive ? "true" : undefined}
                      className={[
                        "flex min-w-0 items-center gap-1.5 rounded-full px-1.5 py-1.5 text-left transition-colors duration-300 sm:gap-2 sm:px-2",
                        isActive ? "bg-white/10" : "hover:bg-white/5",
                      ].join(" ")}
                    >
                      {/* Number */}
                      <span
                        className={[
                          "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors sm:size-8 sm:text-[11px]",
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
                          "hidden min-w-0 overflow-hidden text-ellipsis text-xs font-medium sm:block",
                          isActive ? "text-white" : "text-white/40",
                        ].join(" ")}
                      >
                        {testimonial.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation arrows */}
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label={t("previous")}
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white sm:size-9"
                >
                  <ChevronLeft
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label={t("next")}
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white sm:size-9"
                >
                  <ChevronRight
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
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
