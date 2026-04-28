import Link from "next/link";
import type { FriendLink } from "@/library/services/server-api";
import {
  getFrontendNavigationConfig,
  getFrontendSiteConfig,
  getFrontendAssetBaseUrl,
} from "@/library/services/frontend-data.server";
import { LogoServer } from "./Logo.server";
import type { FooterNavItem } from "@/types/siteConfig";

interface FooterProps {
  friendlyLinks?: FriendLink[];
}

export async function Footer({ friendlyLinks = [] }: FooterProps) {
  const [siteConfig, navConfig, assetBaseUrl] = await Promise.all([
    getFrontendSiteConfig(),
    getFrontendNavigationConfig(),
    getFrontendAssetBaseUrl(),
  ]);

  const logoPath = siteConfig?.site?.logo;
  const logoSrc =
    assetBaseUrl && logoPath
      ? `${assetBaseUrl}/${logoPath.replace(/^\/+/, "")}`
      : logoPath;

  const filterNavItems = (items: FooterNavItem[]) => {
    if (siteConfig?.features?.enableUserModule) return items;
    return items.filter(
      (item) =>
        ![
          "/library",
          "/profile",
          "/login",
          "/register",
          "/signin",
          "/signup",
        ].includes(item.href) &&
        !item.href.startsWith("/profile/") &&
        !item.href.startsWith("/library/")
    );
  };

  const compareItems = navConfig?.footerNav?.compare ?? [];
  const hasCompare = compareItems.length > 0;
  const gridColsClass = hasCompare ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <footer className={`py-12 border-t bg-background border-border`}>
      <div className="container mx-auto px-6">
        <div className={`grid grid-cols-1 ${gridColsClass} gap-8`}>
          {/* Logo & Copyright */}
          <div className="md:col-span-1">
            <LogoServer
              variant="icon-text"
              logoSrc={logoSrc}
              logoAlt={siteConfig?.site?.logoAlt}
              siteName={siteConfig?.site?.name}
              logoWidth={siteConfig?.site?.logoWidth}
              logoHeight={siteConfig?.site?.logoHeight}
              className="mb-4"
              iconClassName="h-8 w-auto"
              textClassName="text-lg"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig?.site?.name || ""}. All
              rights reserved.
            </p>
            {siteConfig?.contact?.email && (
              <div className="mt-4">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center text-sm transition-colors duration-200 text-primary hover:text-primary/80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {siteConfig.contact.email}
                </a>
              </div>
            )}
          </div>

          {/* Compare (optional) */}
          {hasCompare && (
            <div className="md:col-span-1">
              <div className="font-semibold text-lg mb-4 text-foreground">
                Compare
              </div>
              <ul className="space-y-2">
                {filterNavItems(compareItems).map(
                  (item: FooterNavItem, index: number) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        title={item.title || item.label}
                        rel={item.follow === false ? "nofollow" : undefined}
                        className="transition-colors duration-200 text-sm text-muted-foreground hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Resources */}
          <div className="md:col-span-1">
            <div className="font-semibold text-lg mb-4 text-foreground">
              Resources
            </div>
            <ul className="space-y-2">
              {navConfig &&
                filterNavItems(navConfig.footerNav.resources).map(
                  (item: FooterNavItem, index: number) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        title={item.title || item.label}
                        rel={item.follow === false ? "nofollow" : undefined}
                        className="transition-colors duration-200 text-sm text-muted-foreground hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <div className="font-semibold text-lg mb-4 text-foreground">
              Product Policy
            </div>
            <ul className="space-y-2">
              {navConfig &&
                filterNavItems(navConfig.footerNav.legal).map(
                  (item: FooterNavItem, index: number) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        title={item.title || undefined}
                        rel={item.follow === false ? "nofollow" : undefined}
                        className="transition-colors duration-200 text-sm text-muted-foreground hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
