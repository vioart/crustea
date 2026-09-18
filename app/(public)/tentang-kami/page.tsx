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

export default function AboutUsPage() {
  return (
    <>
      <InnerHero
        title="Tentang Kami"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Tentang Kami",
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
