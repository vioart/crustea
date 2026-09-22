import NewsBreadcrumb from "@/components/news/news-breadcrumb";
import NewsDetail from "@/components/news/news-detail";
import CTASection from "@/components/ui/cta";
import WhatsAppBubble from "@/components/ui/buble-wa";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <NewsBreadcrumb title="Teknologi Akuakultur untuk Budidaya Berkelanjutan" />

      <NewsDetail
        title="Teknologi Akuakultur untuk Budidaya Berkelanjutan"
        category="Teknologi"
        date="2026-09-15"
        image="/img/berita/artikel1.webp"
      />

      <CTASection />
      <WhatsAppBubble />
    </>
  );
}