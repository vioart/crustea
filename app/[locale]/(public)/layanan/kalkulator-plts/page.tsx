import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import PLTSCalculator from "@/components/plts-calculator/plts-calculator";

export default async function KalkulatorPLTSPage() {
  const t = await getTranslations("PLTSCalculator.page");

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

      <PLTSCalculator />
      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
