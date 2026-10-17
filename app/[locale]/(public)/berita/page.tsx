import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import NewsSection from "@/components/news/news-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default async function NewsPage() {
  const t = await getTranslations("News.page");

  return (
    <>
      <InnerHero
        title={t("title")}
        breadcrumb={[
          {
            label: t("breadcrumb.home"),
            href: "/",
          },
          {
            label: t("breadcrumb.news"),
          },
        ]}
      />

      <NewsSection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}