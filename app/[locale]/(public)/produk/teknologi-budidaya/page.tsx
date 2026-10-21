
"use client";

import { useTranslations } from "next-intl";

import ProductSection from "@/components/product/product-section";
import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default function TeknologiBudidayaPage() {
  const t = useTranslations("TechnologyProducts");

  return (
    <>
      <InnerHero
        title={t("hero.title")}
        breadcrumb={[
          {
            label: t("breadcrumb.home"),
            href: "/",
          },
          {
            label: t("hero.title"),
          },
        ]}
      />

      <ProductSection
        title={t("section.title")}
        description={t("section.description")}
        category="technology"
        basePath="/produk/teknologi-budidaya"
      />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
