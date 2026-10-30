import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import TeamSection from "@/components/team/team-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default async function TeamPage() {
  const t = await getTranslations("Team.page");

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
            label: t("breadcrumb.team"),
          },
        ]}
      />

      <TeamSection />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}