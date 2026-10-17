
import {
  hasLocale,
  NextIntlClientProvider,
} from "next-intl";
import {
  getMessages,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PublicLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <div className="min-h-screen flex flex-col antialiased selection:bg-blue-500/30">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
