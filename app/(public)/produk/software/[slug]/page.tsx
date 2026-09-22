import ProductDetail, {
  type ProductDetailData,
} from "@/components/product/product-detail-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

const ebiiSystem: ProductDetailData = {
  name: "EBII System",
  category: "Software",
  categoryHref: "/produk/software",

  description:
    "EBII System merupakan sistem pemantauan kualitas air yang membantu pembudidaya memahami kondisi tambak melalui pemantauan parameter utama seperti pH, dissolved oxygen (DO), salinitas, dan suhu. Informasi tersebut membantu pembudidaya memperoleh gambaran kondisi kualitas air sebagai bagian dari proses pengelolaan dan pemantauan aktivitas budidaya.",

  images: [
    "/img/ebii-system.webp",
    "/img/ebii-system2.webp",
    "/img/ebii-system3.webp",
  ],

  highlights: [
    "Monitoring kualitas air",
    "Pemantauan pH",
    "Pemantauan dissolved oxygen",
    "Pemantauan salinitas",
    "Pemantauan suhu",
  ],

  specifications: [
    {
      label: "Kategori",
      value: "Software",
    },
    {
      label: "Jenis Produk",
      value: "Sistem Monitoring Kualitas Air",
    },
    {
      label: "Fungsi Utama",
      value: "Monitoring kondisi kualitas air tambak",
    },
    {
      label: "Parameter Monitoring",
      value: "pH, DO, Salinitas, Suhu",
    },
    {
      label: "Parameter 01",
      value: "pH",
    },
    {
      label: "Parameter 02",
      value: "Dissolved Oxygen (DO)",
    },
    {
      label: "Parameter 03",
      value: "Salinitas",
    },
    {
      label: "Parameter 04",
      value: "Suhu",
    },
    {
      label: "Bidang Penggunaan",
      value: "Akuakultur dan Budidaya Tambak",
    },
    {
      label: "Pengguna",
      value: "Pembudidaya Tambak",
    },
  ],
};

export default function EbiiSystemPage() {
  return (
    <>
      <ProductDetail product={ebiiSystem} />
      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
