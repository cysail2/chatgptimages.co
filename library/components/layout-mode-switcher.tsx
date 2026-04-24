"use client";

import { usePathname } from "next/navigation";

export function LayoutModeSwitcher({
  children,
  siteChrome,
}: {
  children: React.ReactNode;
  siteChrome: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWorkspaceRoute =
    pathname.startsWith("/projects") ||
    pathname.startsWith("/website");

  return isWorkspaceRoute ? <>{children}</> : <>{siteChrome}</>;
}
