import { getTranslations } from "next-intl/server";

import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import PrivacyPolicySection from "@/components/privacy/privacy-policy-section";

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("PrivacyPolicy.page");

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
            label: t("breadcrumb.privacy"),
          },
        ]}
      />

      <PrivacyPolicySection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}
