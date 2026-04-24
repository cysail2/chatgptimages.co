"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { site, nav } from "@/lib/site";
import { buildAuthRoute } from "@/lib/auth-routing";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const signInHref = buildAuthRoute({ mode: "sign-in", redirectUrl: pathname });
  const signUpHref = buildAuthRoute({ mode: "sign-up", redirectUrl: pathname });

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 md:px-12"
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <Link href="/" title={`${site.name} — AI Image Generator Home`} className="flex items-center gap-2 mr-10 shrink-0">
        <div className="w-7 h-7 rounded-lg grad-bg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-base" style={{ color: "var(--text)" }}>
          {site.name}
        </span>
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8 flex-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={`ChatGPT Images 2.0 ${item.label}`}
            className={cn("text-sm transition-colors", pathname === item.href ? "font-medium" : "hover:text-white")}
            style={{ color: pathname === item.href ? "var(--text)" : "var(--muted)" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Auth */}
      <div className="ml-auto flex items-center gap-3">
        {isSignedIn ? (
          <>
            <Link href="/gpt-image-2" title="Open ChatGPT Images 2.0 Generator" className="text-sm font-semibold px-4 py-2 rounded-lg grad-bg text-white">
              Generate
            </Link>
            <UserButton />
          </>
        ) : (
          <>
            <Link
              href={signInHref}
              title="Sign in to ChatGPT Images 2.0"
              className="text-sm px-4 py-2 rounded-lg transition-colors hover:text-white"
              style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              Sign In
            </Link>
            <Link
              href={signUpHref}
              title="Create a free ChatGPT Images 2.0 account"
              className="text-sm font-semibold px-4 py-2 rounded-lg grad-bg text-white"
            >
              Try Free
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
