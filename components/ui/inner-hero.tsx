import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type InnerHeroProps = {
  title: string;
  breadcrumb: BreadcrumbItem[];
  backgroundImage?: string;
};

export default function InnerHero({
  title,
  breadcrumb,
  backgroundImage = "/img/bg-hero.webp",
}: InnerHeroProps) {
  return (
    <div className="pt-18">
      <section
        aria-labelledby="inner-hero-title"
        className="relative flex min-h-[360px] items-center overflow-hidden sm:min-h-[400px] lg:min-h-[440px]"
      >
        {/* =====================================================
            BACKGROUND IMAGE
        ===================================================== */}
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* =====================================================
            OVERLAY
        ===================================================== */}
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20"
          aria-hidden="true"
        />

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Page Title */}
            <h1
              id="inner-hero-title"
              className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl"
            >
              {title}
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mt-5 flex justify-center"
            >
              <ol className="flex flex-wrap items-center justify-center gap-1.5 text-sm sm:text-base">
                {breadcrumb.map((item, index) => {
                  const isLast = index === breadcrumb.length - 1;

                  return (
                    <li
                      key={`${item.label}-${index}`}
                      className="flex items-center gap-1.5"
                    >
                      {!isLast && item.href ? (
                        <Link
                          href={item.href}
                          className="text-white/80 transition-colors duration-200 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span
                          className={
                            isLast
                              ? "font-medium text-white"
                              : "text-white/80"
                          }
                          aria-current={isLast ? "page" : undefined}
                        >
                          {item.label}
                        </span>
                      )}

                      {!isLast && (
                        <ChevronRight
                          className="size-4 text-white/60"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}