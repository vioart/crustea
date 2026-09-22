import ProductDetail, {
  type ProductDetailData,
} from "@/components/product/product-detail-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

const krasty: ProductDetailData = {
  name: "Krasty",
  category: "Produk Olahan",
  categoryHref: "/produk/produk-olahan",

  description:
    "Krasty merupakan produk olahan hasil perikanan yang dikembangkan untuk menghadirkan produk bernilai tambah dengan cita rasa yang khas.",

  images: ["/img/krasty.webp"],

  highlights: [
    "Produk olahan hasil perikanan",
    "Produk bernilai tambah",
    "Cita rasa khas",
  ],

  specifications: [
    {
      label: "Kategori",
      value: "Produk Olahan",
    },
    {
      label: "Jenis Produk",
      value: "Produk Olahan Hasil Perikanan",
    },
    {
      label: "Fokus Produk",
      value: "Produk bernilai tambah",
    },
    {
      label: "Bidang",
      value: "Perikanan dan Akuakultur",
    },
  ],
};

export default function KrastyPage() {
  return (
    <>
      <ProductDetail product={krasty} />
      <CTASection />

      <WhatsAppBubble />
    </>
  );
}
