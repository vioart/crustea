import ProductOverview from "@/components/product/product-overview";
import InnerHero from "@/components/ui/inner-hero";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";
import { useTranslations } from "next-intl";

export default function ProdukPage() {
  const t = useTranslations("Product.page");

  return (
    <>
      <InnerHero
        title={t("title")}
        breadcrumb={[
          {
            label: t("breadcrumb.home"),
            href: "/",
          },
          {
            label: t("breadcrumb.product"),
          },
        ]}
      />

      <ProductOverview />

      <CTASection />

      <WhatsAppBubble />
    </>
  );
}