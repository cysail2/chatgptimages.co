import { Check, X } from "lucide-react";

const rows = [
  { feature: "Max resolution", values: ["4K native", "2K upscaled", "1K only"] },
  { feature: "Aspect ratios",  values: ["10+ built-in", "3–4 presets",  "Square only"] },
  { feature: "Image-to-image", values: [true, true, false] },
  { feature: "Commercial use", values: [true, true, "Paid tier only"] },
  { feature: "Generation time (1K)", values: ["< 10s", "15–30s", "30s+"] },
  { feature: "Watermark-free", values: [true, "Paid tier only", false] },
  { feature: "Subscription required", values: [false, true, true] },
  { feature: "Credit expiration", values: ["Never", "12 months", "Monthly reset"] },
  { feature: "Free credits on signup", values: ["12 credits", "None", "None"] },
];

const columns = ["ChatGPT Image 2.0", "Typical Pro Tool", "Free Tier Tools"];

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) {
    return <Check className="w-5 h-5 mx-auto" style={{ color: highlight ? "var(--accent)" : "var(--muted)" }} />;
  }
  if (value === false) {
    return <X className="w-5 h-5 mx-auto" style={{ color: "var(--muted2)" }} />;
  }
  return (
    <span className="text-sm" style={{ color: highlight ? "var(--text)" : "var(--muted)", fontWeight: highlight ? 600 : 400 }}>
      {value}
    </span>
  );
}

export function Comparison() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Comparison
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          How ChatGPT Image 2.0 Compares to Alternatives
        </h2>
        <p className="text-center text-lg mb-12 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          A head-to-head comparison between this generator and the two common alternatives —
          subscription-based pro tools and free-tier generators.
        </p>

        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="grid grid-cols-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
            <div style={{ color: "var(--muted2)" }}>Feature</div>
            {columns.map((col, i) => (
              <div key={col} className={`text-center ${i === 0 ? "grad-text font-bold text-sm normal-case tracking-normal" : ""}`}
                style={{ color: i === 0 ? undefined : "var(--muted2)" }}>
                {col}
              </div>
            ))}
          </div>
          {rows.map(({ feature, values }, ri) => (
            <div key={feature} className="grid grid-cols-4 px-6 py-4 items-center"
              style={{ borderBottom: ri === rows.length - 1 ? "none" : "1px solid var(--border)" }}>
              <div className="text-sm font-medium">{feature}</div>
              {values.map((v, i) => (
                <div key={i} className="text-center">
                  <Cell value={v} highlight={i === 0} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-8 max-w-2xl mx-auto" style={{ color: "var(--muted2)" }}>
          Only one option ships native 4K, skips the subscription model,
          and includes commercial rights for every user — with no credit expiration.
        </p>
      </div>
    </section>
  );
}
