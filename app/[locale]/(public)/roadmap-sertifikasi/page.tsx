
import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import Roadmap from "@/components/certification-roadmap/roadmap";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default async function CertificationRoadmapPage() {
  const t = await getTranslations("Roadmap.page");

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
            label: t("breadcrumb.roadmap"),
          },
        ]}
      />

      <Roadmap />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
