
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import WhatsAppBubble from "@/components/ui/buble-wa";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
import OurServices from "@/components/ui/our-services";
import FeaturedProducts from "@/components/ui/featured-products";
import HowWeWork from "@/components/ui/how-we-work";
import Traction from "@/components/ui/traction";
import OurImpact from "@/components/ui/our-impact";
import Testimonial from "@/components/ui/testimonial";
import LatestNews from "@/components/ui/latest-news";
import CTASection from "@/components/ui/cta";
import { Button } from "@/components/ui/button";
import { ArrowRight, Waves } from "lucide-react";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main id="top" className="overflow-hidden bg-background text-foreground">
      {/* HERO */}
      <section
        aria-labelledby="hero-title"
        className="relative min-h-screen overflow-hidden"
      >
        <img
          src="/img/bg-hero.webp"
          alt={t("hero.imageAlt")}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0 bg-black/45"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pt-20 lg:px-8">
          <div className="max-w-4xl text-white">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
              <span
                className="h-px w-8 bg-primary"
                aria-hidden="true"
              />
              {t("hero.eyebrow")}
            </p>

            <h1
              id="hero-title"
              className="font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            >
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}
              <br />
              <span className="text-primary">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/produk">
                  {t("hero.exploreProducts")}
                  <ArrowRight />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href="/kontak">
                  {t("hero.contactUs")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ImageAutoSlider />

      {/* ABOUT US / OUR STORY */}
      <section
        aria-labelledby="about-title"
        className="relative overflow-hidden bg-background"
      >
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary/60 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/60 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-[24px]">
                <img
                  src="/img/about-us.jpg"
                  alt={t("about.imageAlt")}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-xl">
              <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                <Waves
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {t("about.eyebrow")}
              </p>

              <h2
                id="about-title"
                className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]"
              >
                {t("about.titleBefore")}{" "}
                <span className="text-primary">
                  {t("about.titleHighlight")}
                </span>{" "}
                {t("about.titleAfter")}
              </h2>

              <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-[17px]">
                {t("about.description")}
              </p>

              <div className="mt-7">
                <Button size="lg" asChild>
                  <Link href="/tentang-kami">
                    {t("about.learnMore")}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OurServices />
      <FeaturedProducts />
      <HowWeWork />
      <Traction />
      <OurImpact />
      <Testimonial />
      <LatestNews />
      <CTASection />
      <WhatsAppBubble />
    </main>
  );
}
