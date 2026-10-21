import ProductDetail from "@/components/product/product-detail-section";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

type TechnologyCultivationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TechnologyCultivationDetailPage({
  params,
}: TechnologyCultivationDetailPageProps) {
  const { slug } = await params;

  return (
    <>
      <ProductDetail slug={slug} />
      <CTASection />
      <WhatsAppBubble />
    </>
  );
}