
"use client";

import { useTranslations } from "next-intl";

import ProductSection from "@/components/product/product-section";
import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default function KrastyTradingProductsPage() {
  const t = useTranslations("KrastyTradingProducts");

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

      {/* Produk Krasty */}
      <ProductSection
        title={t("krasty.title")}
        description={t("krasty.description")}
        category="krasty"
        basePath="/produk/krasty-trading"
      />

      {/* Produk Trading */}
      <ProductSection
        title={t("trading.title")}
        description={t("trading.description")}
        category="trading"
        basePath="/produk/krasty-trading"
      />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
