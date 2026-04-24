"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { cn } from "@/library/lib/utils";
import { NavStateProvider } from "./NavStateContext";
import { useNavbarConfig } from "./NavbarConfigContext";

interface ScrollAwareNavProps {
  children: ReactNode;
  className?: string;
  overlay?: boolean;
}
export function ScrollAwareNav({
  children,
  className: propClassName,
  overlay: propOverlay = false,
}: ScrollAwareNavProps) {
  const { config } = useNavbarConfig();
  const [isScrolled, setIsScrolled] = useState(false);

  // Merge prop with context config (context takes priority for dynamic overrides)
  const overlay = config.overlay !== undefined ? config.overlay : propOverlay;
  const className = config.className || propClassName;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "site-nav top-0 left-0 right-0 z-50 transition-all duration-300",
        overlay ? "fixed" : "sticky",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/40 text-foreground"
          : cn(
              "bg-transparent border-b border-transparent",
              overlay && "text-white",
            ),
        className,
      )}
    >
      <NavStateProvider value={{ isScrolled, isOverlay: overlay }}>
        {children}
      </NavStateProvider>
    </nav>
  );
}
