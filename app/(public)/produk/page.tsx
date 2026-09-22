import ProductOverview from "@/components/product/product-overview";
import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default function ProdukPage() {
  return (
    <>
      <InnerHero
        title="Produk"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Produk",
          },
        ]}
      />

      <ProductOverview />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}