import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, HelpCircle, Infinity, Shield, Zap } from "lucide-react";
import { PricingCards } from "../_shared/PricingCards";
import { pricing, registerBonus, site } from "../_shared/site-content";

export const metadata: Metadata = {
  title: {
    absolute: "ChatGPT Images 2.0 Pricing — Credit Packs, No Subscription",
  },
  description:
    "ChatGPT Images 2.0 uses simple credit packs starting at $9.90. No subscription, no expiry. See per-image costs, resolution tiers, and what each pack covers.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    images: [{ url: "/og/pricing.webp", width: 1200, height: 630 }],
  },
  twitter: {
    images: ["/og/pricing.webp"],
  },
};

const creditCosts = [
  { label: "1K medium", credits: 6, desc: "Fast drafts, concept exploration, social posts" },
  { label: "1K high", credits: 22, desc: "Sharper detail for blog, thumbnail, email use" },
  { label: "2K medium", credits: 9, desc: "Larger format layouts, presentation decks" },
  { label: "2K high", credits: 33, desc: "Production-grade output for print-ready assets" },
  { label: "4K output", credits: 60, desc: "Billboard, large format, premium commercial use" },
];


const faqs = [
  {
    q: "Do ChatGPT Images credits expire?",
    a: "No. Credits never expire regardless of the pack you purchase. Use them over days, weeks, or months — there is no time pressure and no forced renewal.",
  },
  {
    q: "Is there a subscription for ChatGPT Images 2.0?",
    a: "There is no subscription. You buy a credit pack once and use it at your own pace. When you need more credits, you purchase another pack. There is no automatic renewal, no monthly billing, and no cancellation needed.",
  },
  {
    q: "How many images do I get per credit pack?",
    a: `The number depends on the resolution and quality tier you choose. With the Pro pack (1,300 credits), you can generate roughly 216 images at 1K medium quality (6 credits each), or about 39 images at 1K high quality (22 credits each). Mix and match across a session — credits are flexible.`,
  },
  {
    q: "Can I use the images commercially?",
    a: "Yes. Every image generated with ChatGPT Images 2.0 is yours to use in commercial projects — marketing campaigns, client deliverables, product pages, ad creatives, social content, presentations, and more. There are no watermarks, no attribution requirements, and no licensing fees beyond the credit cost.",
  },
  {
    q: "What happens if I need a refund?",
    a: `Contact support@chatgptimages.co within 7 days of purchase if you are unsatisfied. Refunds generally apply to unused credit balances. See the Refund Policy for full terms.`,
  },
  {
    q: "Is image-to-image included in the same credits?",
    a: "Yes. Image-to-image mode uses the same credit pricing as text-to-image generation. Upload a reference image and add a text prompt — no separate fee.",
  },
  {
    q: "What do the free signup credits cover?",
    a: `New accounts receive ${registerBonus} free credits on registration. That is enough for two 1K medium images or one 1K high image so you can test the output quality before purchasing a pack.`,
  },
  {
    q: "Which pack gives the best value per credit?",
    a: "The Max pack ($99.90 for 5,000 credits at $0.020 per credit) gives the lowest per-credit cost and is our most popular choice for teams and power users. The Pro pack ($29.90 for 1,300 credits at $0.023 per credit) fits creators with regular but moderate usage.",
  },
];

function PricingJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ChatGPT Images 2.0 — AI Image Generator",
    url: site.url,
    description:
      "Credit-based AI image generator. Create realistic photos, product shots, concept art, and social visuals from text prompts. No subscription required.",
    brand: { "@type": "Brand", name: site.name },
    offers: pricing.map((plan) => ({
      "@type": "Offer",
      name: `${plan.name} Credit Pack — ${plan.credits} credits`,
      price: plan.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/pricing`,
      description: `${plan.credits} ChatGPT Images 2.0 credits at $${plan.perCredit.toFixed(3)} per credit. ${plan.description}`,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "216",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

export default function PricingPage() {
  return (
    <>
      <PricingJsonLd />
      <div className="site-marketing">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(124,92,252,0.12) 0%, rgba(10,10,15,0) 40%), radial-gradient(circle at 60% 15%, rgba(56,189,248,0.13), transparent 38%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--accent)" }}
          >
            Pricing
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.04] mb-6">
            Simple credit packs. No subscription required.
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            ChatGPT Images 2.0 runs on a credit model — buy once, use at your own pace.
            Credits never expire and there is no automatic renewal.
          </p>
          <p className="text-sm font-semibold mb-10" style={{ color: "var(--accent)" }}>
            🎁 Every new account receives {registerBonus} free credits on signup
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/sign-up"
              title="Create a free ChatGPT Images 2.0 account"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white grad-bg"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gpt-image-2"
              title="View the ChatGPT Images 2.0 generator"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base transition-colors"
              style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              See the generator
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4" style={{ color: "var(--accent)" }}>
            Credit Packs
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            ChatGPT Images 2.0 credit pack pricing
          </h2>
          <p className="text-center text-lg mb-14 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Three packs sized for different usage levels. All packs include the same features —
            what changes is the credit volume and the per-credit cost.
          </p>

          <PricingCards />

          <p className="text-center text-sm" style={{ color: "var(--muted2)" }}>
            All packs are one-time purchases. No automatic renewal. Credits never expire.
          </p>
        </div>
      </section>

      {/* Credit cost breakdown */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4" style={{ color: "var(--accent)" }}>
            Cost Per Image
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            How many credits does each image cost?
          </h2>
          <p className="text-center text-lg mb-12 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Credit cost scales with resolution and quality tier. Use lower cost settings to
            draft and explore, then move to higher quality for final production assets.
          </p>

          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div
              className="grid grid-cols-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}
            >
              <div style={{ color: "var(--muted2)" }}>Resolution</div>
              <div className="text-center" style={{ color: "var(--muted2)" }}>Credits used</div>
              <div className="text-center" style={{ color: "var(--muted2)" }}>Cost (Pro pack)</div>
              <div style={{ color: "var(--muted2)" }}>Best for</div>
            </div>
            {creditCosts.map(({ label, credits, desc }, i) => (
              <div
                key={label}
                className="grid grid-cols-4 px-6 py-4 items-center"
                style={{ borderBottom: i === creditCosts.length - 1 ? "none" : "1px solid var(--border)" }}
              >
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-center">
                  <span className="text-sm font-bold grad-text">{credits} credits</span>
                </div>
                <div className="text-center text-sm" style={{ color: "var(--muted)" }}>
                  ~${(credits * 0.023).toFixed(2)}
                </div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "var(--muted2)" }}>
            Cost per image calculated using the Pro pack rate ($0.023/credit). Larger packs reduce cost further.
          </p>
        </div>
      </section>

      {/* Why no subscription */}
      <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4" style={{ color: "var(--accent)" }}>
            No Subscription
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            Why ChatGPT Images uses credit packs instead of subscriptions
          </h2>
          <p className="text-center text-lg mb-14 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            Most image tools force a subscription even when usage is irregular. ChatGPT Images 2.0
            uses a credit model because creative work does not happen on a fixed monthly schedule.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <Zap className="w-7 h-7 mb-5" style={{ color: "var(--accent)" }} />
              <h3 className="font-bold text-lg mb-3">Pay for what you actually use</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                A subscription charges you whether you generate one image or five hundred in a month.
                Credits mean you spend in proportion to your actual output — no wasted budget on
                quiet months, no scrambling to justify usage before the billing date.
              </p>
            </article>
            <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <Infinity className="w-7 h-7 mb-5" style={{ color: "var(--cyan)" }} />
              <h3 className="font-bold text-lg mb-3">No expiry, no rush</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Credits stay in your account indefinitely. Campaigns, launches, and creative projects
                move at their own pace. There is no billing cycle pressure to generate images before
                a reset date, and no penalty for a slow month.
              </p>
            </article>
            <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <Shield className="w-7 h-7 mb-5" style={{ color: "var(--accent)" }} />
              <h3 className="font-bold text-lg mb-3">Full features from the first credit</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                There are no tiered feature gates. Every credit pack includes full resolution options,
                image-to-image mode, all aspect ratios, commercial use rights, and private outputs —
                from the Starter pack to the Max pack, the generator behaves the same way.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4" style={{ color: "var(--accent)" }}>
            What's Included
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            Everything included with every ChatGPT Images credit pack
          </h2>
          <p className="text-center text-lg mb-14 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
            No features locked to higher tiers. Every pack includes the full set of generation
            capabilities from day one.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Text-to-image generation",
                text: "Turn any written brief into a finished visual. Describe subject, lighting, style, camera angle, background, and intended use in a single prompt.",
              },
              {
                title: "Image-to-image refinement",
                text: "Upload a reference image, sketch, product photo, or prior output and describe the change you want. Iterate inside a single session without switching tools.",
              },
              {
                title: "1K, 2K, and 4K resolution",
                text: "All resolution tiers are available from the first credit. Use drafts for exploration and switch to higher resolution for final production without changing settings.",
              },
              {
                title: "10+ aspect ratios",
                text: "Square (1:1), widescreen (16:9), vertical (9:16), 4:3, 3:2, 4:5 Instagram portrait, cinematic (21:9), and more. Select per image without session restrictions.",
              },
              {
                title: "Commercial use rights",
                text: "Every generated image is yours for commercial use. Marketing campaigns, client deliverables, product pages, ads, editorial content — all covered with no attribution or licensing fees.",
              },
              {
                title: "Private outputs by default",
                text: "Your prompts and generated images are private. The service does not use your content for training, does not share prompts with third parties, and does not show your outputs publicly.",
              },
            ].map(({ title, text }) => (
              <article key={title} className="flex gap-4 p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Check className="w-5 h-5 shrink-0 mt-1" style={{ color: "var(--accent)" }} />
                <div>
                  <h3 className="font-bold mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4" style={{ color: "var(--accent)" }}>
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
            Frequently asked questions about ChatGPT Images pricing
          </h2>
          <p className="text-center text-lg mb-12 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
            Common questions about credit packs, per-image costs, refunds, and what's included.
          </p>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <article key={q} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                  <div>
                    <h3 className="font-bold mb-3">{q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{a}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
            Ready to start generating with ChatGPT Images 2.0?
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
            Create a free account, collect your {registerBonus} signup credits, and try the generator
            before purchasing a credit pack. No subscription required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/sign-up"
              title="Sign up for ChatGPT Images 2.0 free"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white grad-bg"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gpt-image-2-review"
              title="Read the ChatGPT Images 2.0 review"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base transition-colors"
              style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              Read the review first
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
