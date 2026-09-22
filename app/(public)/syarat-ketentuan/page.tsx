import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import TermsSection from "@/components/terms/terms-section";

export default function TermsPage() {
  return (
    <>
      <InnerHero
        title="Syarat & Ketentuan"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Syarat & Ketentuan",
          },
        ]}
      />

      <TermsSection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}