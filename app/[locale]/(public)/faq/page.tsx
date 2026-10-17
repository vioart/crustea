import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import FAQSection from "@/components/faq/faq-section";

export default async function FAQPage() {
  const t = await getTranslations("FAQ.page");

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
            label: t("breadcrumb.faq"),
          },
        ]}
      />

      <FAQSection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}
