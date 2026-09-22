import ProductSection, {
  type Product,
} from "@/components/product/product-section";
import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

const softwareProducts: Product[] = [
  {
    name: "EBII System",
    slug: "ebii-system",
    description:
      "EBII System merupakan sistem pemantauan kualitas air yang membantu pembudidaya memahami kondisi tambak melalui pemantauan parameter utama seperti pH, dissolved oxygen (DO), salinitas, dan suhu.",
    image: "/img/ebii-system.webp",
    highlights: ["pH", "DO", "Salinitas", "Suhu"],
  },
  {
    name: "Crustea AIO",
    slug: "crustea-aio",
    description:
      "Solusi digital terintegrasi untuk membantu pembudidaya dalam memantau, mengelola, dan mengoptimalkan aktivitas budidaya akuakultur.",
    image: "/img/crustea-aio.webp",
    highlights: ["Monitoring", "Digitalisasi", "Management"],
  },
];

export default function SoftwarePage() {
  return (
    <>
      <InnerHero
        title="Software"
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Software",
          },
        ]}
      />

      <ProductSection
        title="Software"
        description="Solusi perangkat lunak untuk membantu digitalisasi, pemantauan, dan pengelolaan aktivitas akuakultur."
        products={softwareProducts}
        basePath="/produk/software"
      />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}