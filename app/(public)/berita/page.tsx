import InnerHero from "@/components/ui/inner-hero";
import NewsSection from "@/components/news/news-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default function NewsPage() {
  return (
    <>
      <InnerHero
        title="Berita"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Berita",
          },
        ]}
      />

      <NewsSection />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}