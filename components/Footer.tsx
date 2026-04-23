import Link from "next/link";
import { Sparkles } from "lucide-react";
import { site } from "@/lib/site";

const links = {
  Product: [
    { label: "Generator", href: "/gpt-image-2" },
    { label: "Review", href: "/gpt-image-2-review" },
    { label: "Pricing", href: "/pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
  ],
};

export function Footer() {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" title={`${site.name} — AI Image Generator Home`} className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg grad-bg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base" style={{ color: "var(--text)" }}>
                {site.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--muted)" }}>
              {site.description}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="text-sm mt-4 block hover:underline"
              style={{ color: "var(--muted2)" }}
            >
              {site.email}
            </a>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted2)" }}>
                {group}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} title={`ChatGPT Images 2.0 — ${item.label}`} className="text-sm hover:text-white transition-colors"
                      style={{ color: "var(--muted)" }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--muted2)" }}>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--muted2)" }}>
            Not affiliated with OpenAI or ChatGPT.
          </p>
        </div>
      </div>
    </footer>
  );
}
