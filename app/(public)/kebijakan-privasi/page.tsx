import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import PrivacyPolicySection from "@/components/privacy/privacy-policy-section";

export default function PrivacyPolicyPage() {
  return (
    <>
      <InnerHero
        title="Kebijakan Privasi"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Kebijakan Privasi",
          },
        ]}
      />

      <PrivacyPolicySection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}