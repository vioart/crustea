import { getTranslations } from "next-intl/server";

import ContactMap from "@/components/ui/contact-map";
import ContactSection from "@/components/ui/contact-section";
import InnerHero from "@/components/ui/inner-hero";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default async function ContactPage() {
  const t = await getTranslations("Contact.page");

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
            label: t("breadcrumb.contact"),
          },
        ]}
      />

      <ContactSection />
      <ContactMap />
      <WhatsAppBubble />
    </>
  );
}