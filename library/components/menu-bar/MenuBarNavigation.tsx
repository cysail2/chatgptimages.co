"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/library/lib/utils";
import { NavigationConfig, SiteConfig } from "@/types/siteConfig";
import { Logo } from "../Logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/library/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { NavItem } from "@/types/siteConfig";

interface MenuBarNavigationProps {
    siteConfig: SiteConfig;
    navConfig: NavigationConfig | null;
    className?: string;
}

/**
 * MenuBarNavigation - Website logo and navigation menus
 * 
 * This component renders the site logo and main navigation links in a macOS menu bar style.
 * It handles:
 * - Site logo/branding
 * - Filtering visible navigation items
 * - Sorting by order
 * - Active state highlighting
 * - Badge display for special items
 */
import { useNavState } from "./NavStateContext";

export function MenuBarNavigation({
    siteConfig,
    navConfig,
    className,
}: MenuBarNavigationProps) {
    const pathname = usePathname();
    const { isOverlay, isScrolled } = useNavState();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Check if we need to force dark mode styles (light text)
    const isDarkLocked = isOverlay && !isScrolled;

    // Get visible navigation items sorted by order
    const visibleNavItems = navConfig?.mainNav
        ?.filter((item) => {
            // If user module is disabled, hide library and profile
            if (!siteConfig.features?.enableUserModule) {
                if (item.href === "/library" || item.href === "/profile" || item.href === "/account") {
                    return false;
                }
            }
            return item.visible;
        })
        .sort((a, b) => a.order - b.order) || [];

    if (!mounted) {
        return (
            <div className={cn("flex items-center gap-1", className)}>
                <div className="flex h-8 items-center flex-shrink-0 mr-4">
                    <Logo
                        variant="icon-text"
                        logoSrc={siteConfig?.site?.logo}
                        logoAlt={siteConfig?.site?.logoAlt}
                        siteName={siteConfig?.site?.name}
                        logoWidth={siteConfig?.site?.logoWidth}
                        logoHeight={siteConfig?.site?.logoHeight}
                        className="h-8"
                        iconClassName="h-8"
                        textClassName={cn("whitespace-nowrap hidden md:inline leading-none", isDarkLocked && "text-white")}
                    />
                </div>
                <div className="hidden md:flex items-center gap-1">
                    {visibleNavItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={item.title || item.label}
                            rel={item.follow === false ? "nofollow" : undefined}
                            className={cn(
                                "nav-link-item inline-flex h-8 items-center px-4 rounded-md transition-colors leading-none",
                                item.badge && "relative",
                                isDarkLocked ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-primary"
                            )}
                        >
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="pointer-events-none absolute -right-1 -top-1 inline-flex items-center rounded-md bg-gradient-to-r from-rose-600 to-amber-500 px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wide text-white shadow-sm ring-1 ring-black/10">
                                    {item.badge.text}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {/* Logo */}
            <div className="flex h-8 items-center flex-shrink-0 mr-4">
                <Logo
                    variant="icon-text"
                    logoSrc={siteConfig?.site?.logo}
                    logoAlt={siteConfig?.site?.logoAlt}
                    siteName={siteConfig?.site?.name}
                    logoWidth={siteConfig?.site?.logoWidth}
                    logoHeight={siteConfig?.site?.logoHeight}
                    className="h-8"
                    iconClassName="h-8"
                    textClassName={cn("whitespace-nowrap hidden md:inline leading-none", isDarkLocked && "text-white")}
                />
            </div>

            {/* Navigation Links (Desktop only) */}
            <div className="hidden md:flex items-center gap-1">
                {visibleNavItems.map((item) => {
                    const rawMatchPath = item.matchPath || item.href || "/";
                    const effectiveMatchPath =
                        rawMatchPath === "/" && item.href && item.href !== "/"
                            ? item.href
                            : rawMatchPath;
                    const isActive =
                        item.matchExact || effectiveMatchPath === "/"
                            ? pathname === effectiveMatchPath
                            : pathname.startsWith(effectiveMatchPath);

                    if (item.children && item.children.length > 0) {
                        return (
                            <NavMenuItemWithDropdown
                                key={item.id}
                                item={item}
                                isActive={isActive}
                                isDarkLocked={isDarkLocked}
                            />
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={item.title || item.label}
                            rel={item.follow === false ? "nofollow" : undefined}
                            className={cn(
                                "nav-link-item inline-flex h-8 items-center px-4 rounded-md transition-colors leading-none",
                                item.badge && "relative",
                                isActive
                                    ? "text-primary font-medium"
                                    : cn(
                                        "hover:text-primary",
                                        isDarkLocked ? "text-white/90 hover:text-white" : "text-foreground/80"
                                    )
                            )}
                        >
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="pointer-events-none absolute -right-1 -top-1 inline-flex items-center rounded-md bg-gradient-to-r from-rose-600 to-amber-500 px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wide text-white shadow-sm ring-1 ring-black/10">
                                    {item.badge.text}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function NavMenuSubItem({ item }: { item: NavItem }) {
    if (item.children && item.children.length > 0) {
        return (
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <span>{item.label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    {item.children.map((child) => (
                        <NavMenuSubItem key={child.id} item={child} />
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
        );
    }

    return (
        <DropdownMenuItem asChild>
            <Link href={item.href} className="w-full cursor-pointer">
                {item.label}
            </Link>
        </DropdownMenuItem>
    );
}

function NavMenuItemWithDropdown({
    item,
    isActive,
    isDarkLocked,
}: {
    item: NavItem;
    isActive: boolean;
    isDarkLocked: boolean;
}) {
    const [open, setOpen] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setOpen(true);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 200);
    };

    // Close on path change
    const pathname = usePathname();
    const prevPathRef = React.useRef(pathname);
    if (prevPathRef.current !== pathname) {
        prevPathRef.current = pathname;
        if (open) setOpen(false);
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
            <DropdownMenuTrigger
                className={cn(
                    "inline-flex h-8 items-center gap-1 px-4 rounded-md transition-colors outline-none leading-none",
                    isActive
                        ? "text-primary font-medium"
                        : cn(
                            "hover:text-primary",
                            isDarkLocked ? "text-white/90 hover:text-white" : "text-foreground/80"
                        )
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => {
                    // Prevent navigation if href is #
                    if (item.href === "#" || !item.href) {
                        e.preventDefault();
                    }
                }}
            >
                <span>{item.label}</span>
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", open && "rotate-180")} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {item.children?.map((child) => (
                    <NavMenuSubItem key={child.id} item={child} />
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
