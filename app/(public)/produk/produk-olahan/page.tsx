import ProductSection, {
  type Product,
} from "@/components/product/product-section";
import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

const processedProducts: Product[] = [
  {
    name: "Krasty",
    slug: "krasty",
    description:
      "Produk olahan hasil perikanan yang dikembangkan untuk menghadirkan produk bernilai tambah dengan cita rasa yang khas.",
    image: "/img/krasty.webp",
    highlights: [
      "Produk Olahan",
      "Hasil Perikanan",
      "Produk Bernilai Tambah",
    ],
  },
];

export default function ProdukOlahanPage() {
  return (
    <>
      <InnerHero
        title="Produk Olahan"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Produk Olahan",
          },
        ]}
      />

      <ProductSection
        title="Produk Olahan"
        description="Produk olahan hasil perikanan yang dikembangkan untuk menghadirkan nilai tambah dari hasil akuakultur."
        products={processedProducts}
        basePath="/produk/produk-olahan"
      />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}