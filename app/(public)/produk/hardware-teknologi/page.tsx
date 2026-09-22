import ProductSection, {
  type Product,
} from "@/components/product/product-section";
import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

const hardwareProducts: Product[] = [
  {
    name: "Eco-Aerator",
    slug: "eco-aerator",
    description:
      "Teknologi aerasi dengan solar panel dan impeller yang dirancang untuk menghasilkan gelembung lebih kecil dan meningkatkan kadar oksigen.",
    image: "/img/eco-aerator.webp",
    highlights: ["Solar Panel", "Impeller", "Efisiensi Aerasi"],
  },
  {
    name: "Smart Energy",
    slug: "smart-energy",
    description:
      "Solusi untuk memantau dan mengontrol penggunaan energi aerator secara lebih mudah melalui perangkat seluler.",
    image: "/img/smart-energy.webp",
    highlights: ["Monitor Energi", "Kontrol Jarak Jauh", "Via Smartphone"],
  },
  {
    name: "Aerator Mini",
    slug: "aerator-mini",
    description:
      "Perangkat aerasi berukuran ringkas yang dirancang untuk membantu meningkatkan kadar oksigen dan mendukung kebutuhan aerasi pada budidaya akuakultur.",
    image: "/img/aerator-mini.png",
    highlights: ["Aerasi", "Ukuran Ringkas", "Efisiensi"],
  },
];

export default function HardwareTeknologiPage() {
  return (
    <>
      <InnerHero
        title="Hardware Teknologi"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Hardware Teknologi",
          },
        ]}
      />

      <ProductSection
        title="Hardware Teknologi"
        description="Teknologi perangkat untuk mendukung kebutuhan operasional dan budidaya akuakultur."
        products={hardwareProducts}
        basePath="/produk/hardware-teknologi"
      />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}
