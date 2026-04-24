import { getFrontendSiteConfig } from "@/library/services/frontend-data.server";
import type { Metadata } from "next";
import PromotionClient from "./PromotionClient";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getFrontendSiteConfig();
  const { name: siteName, url: siteUrl } = siteConfig?.site || {};

  return {
    title: `${siteName} for Free By Referral`,
    description: `Share your referral link and earn credits when friends join ${siteName}.`,
    alternates: { canonical: `${siteUrl}/free/referral` },
    openGraph: {
      title: `${siteName} for Free By Referral`,
      description: `Invite friends and earn credits on ${siteName}.`,
      url: `${siteUrl}/free/referral`,
      siteName: siteName,
      images: [
        {
          url: `${siteUrl}/og-img.png`,
          width: 1200,
          height: 630,
          alt: `${siteName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} for Free By Referral`,
      description: `Invite friends and earn credits on ${siteName}.`,
      images: [`${siteUrl}/og-img.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PromotionPage() {
  return (
    <>
      <PromotionClient />
    </>
  );
}
