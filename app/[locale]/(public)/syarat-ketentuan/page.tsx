
import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import TermsSection from "@/components/terms/terms-section";

export default async function TermsPage() {
  const t = await getTranslations("Terms.page");

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
            label: t("breadcrumb.terms"),
          },
        ]}
      />

      <TermsSection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}
