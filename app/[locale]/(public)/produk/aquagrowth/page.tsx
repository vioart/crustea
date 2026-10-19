import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

import AquaGrowthOverview from "@/components/aquagrowth/overview";
import AquaGrowthPartnership from "@/components/aquagrowth/partnership";
import AquaGrowthInvestment from "@/components/aquagrowth/investment";

export default async function AquaGrowthPage() {
  const t = await getTranslations("AquaGrowth.page");

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
            label: t("breadcrumb.aquagrowth"),
          },
        ]}
      />

      <AquaGrowthOverview />
      <AquaGrowthPartnership />
      <AquaGrowthInvestment />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}