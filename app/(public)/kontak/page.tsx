import ContactMap from "@/components/ui/contact-map";
import ContactSection from "@/components/ui/contact-section";
import InnerHero from "@/components/ui/inner-hero";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default function ContactPage() {
  return (
    <>
      <InnerHero
        title="Kontak"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Kontak",
          },
        ]}
      />

      <ContactSection />
      <ContactMap />
      <WhatsAppBubble />
    </>
  );
}