import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import FAQSection from "@/components/faq/faq-section";

export default function FAQPage() {
  return (
    <>
      <InnerHero
        title="FAQ"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "FAQ",
          },
        ]}
      />

      <FAQSection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}