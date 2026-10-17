import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";

import Story from "@/components/about/story";
import Challenges from "@/components/about/challenges";
import Solution from "@/components/about/solution";
import Vision from "@/components/about/vision";
import Mission from "@/components/about/mission";
import Values from "@/components/about/values";
import BusinessModel from "@/components/about/business-model";
import BusinessEcosystem from "@/components/about/business-ecosystem";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default async function AboutUsPage() {
  const t = await getTranslations("About.page");

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
            label: t("breadcrumb.about"),
          },
        ]}
      />

      <Story />
      <Challenges />
      <Solution />
      <Vision />
      <Mission />
      <Values />
      <BusinessModel />
      <BusinessEcosystem />
      <CTASection />
      <WhatsAppBubble />
    </>
  );
}