import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-blue-500/30">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}