
import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/geist-mono";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crustea",
  description: "Company Profile Crustea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily:
            '"Bricolage Grotesque Variable", sans-serif',
        }}
      >
        {children}

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
