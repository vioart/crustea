
import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import CultivationCalculator from "@/components/cultivation-calculator/cultivation-calculator";

export default async function KalkulatorBudidayaPage() {
  const t = await getTranslations("CultivationCalculator.page");

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
            label: t("breadcrumb.calculator"),
          },
        ]}
      />

      <CultivationCalculator />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
