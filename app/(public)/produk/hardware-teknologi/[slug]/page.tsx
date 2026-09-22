import ProductDetail, {
  type ProductDetailData,
} from "@/components/product/product-detail-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

const ecoAerator: ProductDetailData = {
  name: "Eco-Aerator",
  category: "Hardware Teknologi",
  categoryHref: "/produk/hardware-teknologi",

  description:
    "Eco-Aerator merupakan teknologi aerasi yang dirancang untuk membantu meningkatkan kadar oksigen dalam air tambak dengan memanfaatkan sistem solar panel dan impeller. Teknologi ini menghasilkan gelembung yang lebih kecil untuk mendukung proses aerasi sekaligus membantu meningkatkan efisiensi operasional budidaya.",

  images: [
    "/img/eco-aerator.webp",
    "/img/eco-aerator2.jpg",
  ],

  highlights: [
    "Teknologi aerasi tambak",
    "Menggunakan solar panel",
    "Menggunakan impeller",
    "Gelembung aerasi lebih kecil",
    "Mendukung efisiensi operasional",
  ],

  specifications: [
    {
      label: "Kategori",
      value: "Hardware Teknologi",
    },
    {
      label: "Jenis Produk",
      value: "Paddle Wheel Aerator",
    },
    {
      label: "Fungsi Utama",
      value: "Aerasi dan peningkatan kadar oksigen dalam air",
    },
    {
      label: "Sumber Energi",
      value: "Solar Panel",
    },
    {
      label: "Sistem Aerasi",
      value: "Impeller",
    },
    {
      label: "Teknologi Aerasi",
      value: "Gelembung aerasi berukuran lebih kecil",
    },
    {
      label: "Fokus Penggunaan",
      value: "Budidaya Tambak",
    },
    {
      label: "Bidang Penggunaan",
      value: "Akuakultur",
    },
    {
      label: "Fokus Utama",
      value: "Efisiensi dan aerasi tambak",
    },
  ],
};

export default function EcoAeratorPage() {
  return (
    <>
      <ProductDetail product={ecoAerator} />
      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
