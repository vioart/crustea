
import ProductDetail from "@/components/product/product-detail-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

type KrastyTradingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function KrastyTradingDetailPage({
  params,
}: KrastyTradingDetailPageProps) {
  const { slug } = await params;

  return (
    <>
      <ProductDetail slug={slug} />
      <CTASection />
      <WhatsAppBubble />
    </>
  );
}
