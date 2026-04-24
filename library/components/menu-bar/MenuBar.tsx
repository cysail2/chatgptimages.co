import React from "react";
import {
    getFrontendSiteConfig,
    getFrontendNavigationConfig,
    getFrontendAssetBaseUrl,
} from "@/library/services/frontend-data.server";
import { ScrollAwareNav } from "./ScrollAwareNav";
import { MenuBarNavigation } from "./MenuBarNavigation";
import { MenuBarExtras } from "./MenuBarExtras";
import { MobileBottomNav } from "./MobileBottomNav";

/**
 * MenuBar - Main navigation component (Server Component)
 * 
 * Architecture:
 * ```
 * MenuBar (Server Component - main entry point)
 * ├── ScrollAwareNav (Client - scroll-based styling)
 * │   ├── MenuBarNavigation (Client - logo + webapp menus/nav)
 * │   └── MenuBarControls (Client - control items + trial toast)
 * └── MobileBottomNav (Client - iOS-style bottom navigation)
 * ```
 * 
 * Usage in layout.tsx:
 * ```tsx
 * import { MenuBar } from "@/library/components/menu-bar";
 * 
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <MenuBar />
 *       {children}
 *     </>
 *   );
 * }
 * ```
 */
interface MenuBarProps {
    className?: string;
    overlay?: boolean;
}

export async function MenuBar({ className, overlay }: MenuBarProps = {}) {
    // Fetch configuration data on the server
    const [siteConfig, navConfig, assetBaseUrl] = await Promise.all([
        getFrontendSiteConfig(),
        getFrontendNavigationConfig(),
        getFrontendAssetBaseUrl(),
    ]);

    // Process logo path with asset base URL
    const logoPath = siteConfig?.site?.logo;
    const logo =
        assetBaseUrl && logoPath ? `${assetBaseUrl}/${logoPath.replace(/^\/+/, '')}` : logoPath;

    const processedSiteConfig = {
        ...siteConfig,
        site: {
            ...siteConfig?.site,
            name: siteConfig?.site?.name || "",
            logo,
            logoAlt: siteConfig?.site?.logoAlt,
            logoWidth: siteConfig?.site?.logoWidth,
            logoHeight: siteConfig?.site?.logoHeight,
        },
        features: siteConfig?.features,
    } as any;

    return (
        <>
            {/* Desktop: macOS-style Menu Bar */}
            <ScrollAwareNav className={className} overlay={overlay}>
                <div className="max-w-[1400px] mx-auto pl-4 pr-2 sm:px-6 lg:px-8 flex items-center justify-between h-[54px]">
                        {/* Left: Logo + Navigation */}
                        <MenuBarNavigation
                            siteConfig={processedSiteConfig}
                            navConfig={navConfig}
                        />

                        {/* Right: Extra Items */}
                        <MenuBarExtras siteConfig={processedSiteConfig} />
                </div>
            </ScrollAwareNav>

            {/* Mobile: iOS-style Bottom Navigation */}
            <MobileBottomNav navConfig={navConfig} />
        </>
    );
}
