import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserSyncProvider } from "@/components/UserSyncProvider";
import { seo, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
  keywords: seo.defaultKeywords,
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: [{ url: "/og/home.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: ["/og/home.webp"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.className}>
        <body className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
          <UserSyncProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </UserSyncProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
