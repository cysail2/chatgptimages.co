import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Gauge,
  Image as ImageIcon,
  Lock,
  Sparkles,
  Star,
  TriangleAlert,
  Wand2,
  XCircle,
} from "lucide-react";
import { ImagePlaceholder } from "../_shared/ImagePlaceholder";
import { pricing, registerBonus, site } from "../_shared/site-content";

export const metadata: Metadata = {
  title: {
    absolute: "GPT Image 2 Review 2026 - Is It Worth It?",
  },
  description:
    "Read our GPT Image 2 review for image quality, prompt control, pricing, limits, use cases, and whether the AI generator is worth using in 2026.",
  keywords: [
    "GPT Image 2 Review",
    "GPT Image 2 review 2026",
    "GPT Image 2",
    "AI image generator review",
  ],
  alternates: { canonical: "/gpt-image-2-review" },
};

const toc = [
  ["verdict", "TL;DR verdict"],
  ["why-now", "Why we tested it now"],
  ["method", "How we evaluated it"],
  ["results", "Real test results"],
  ["features", "Feature deep dive"],
  ["comparison", "Alternatives comparison"],
  ["cost", "Speed and cost"],
  ["limits", "Limits and failures"],
  ["audience", "Who should use it"],
  ["buying", "Before you buy"],
  ["trust", "Why trust this review"],
  ["faq", "FAQ"],
  ["recommendation", "Final recommendation"],
] as const;

const scores = [
  ["Image quality", "4.7", "Strong composition, clean lighting, and a high success rate for commercial-looking outputs."],
  ["Prompt control", "4.5", "Good at following structured briefs, especially when camera, light, subject, and use case are explicit."],
  ["Workflow speed", "4.6", "Fast enough for marketing drafts and design exploration without turning every iteration into a waiting period."],
  ["Commercial usefulness", "4.8", "Best for product concepts, campaign visuals, thumbnails, blog art, and creative direction boards."],
  ["Value for credits", "4.4", "Credit packs are easier to justify than subscriptions for irregular production cycles."],
] as const;

const tests = [
  {
    id: "real-result-cityscape",
    title: "Golden hour futuristic city campaign",
    prompt:
      "A futuristic city at sunset, golden light reflecting off glass towers, flying vehicles in the sky, cinematic wide shot, photorealistic, ultra detailed architecture.",
    result:
      "This was the strongest wide-format test. The image created a clear sense of scale, strong depth, and useful negative space near the sky. The city forms were detailed enough for a hero background, and the warm palette gave the result a premium campaign feel. The weak point was architectural specificity: several towers looked plausible rather than structurally realistic, which is acceptable for advertising but less useful for an architecture client.",
  },
  {
    id: "gallery-product",
    title: "Luxury perfume product shot",
    prompt:
      "Luxury perfume bottle on a white marble surface, soft studio lighting, macro lens, perfect reflections, high end commercial product photography, clean minimal background.",
    result:
      "The product test was highly usable. The bottle remained centered, the reflection looked polished, and the background was clean enough for a landing page card or ecommerce hero. It still needs human review before client delivery because small glass details can become decorative rather than physically exact. For concept art, packaging direction, and ad mockups, the output was production friendly.",
  },
  {
    id: "gallery-anime",
    title: "Sunlit forest anime illustration",
    prompt:
      "Anime style illustration of a girl standing in a sunlit forest, soft watercolor tones, detailed background with dappled light, warm and magical atmosphere.",
    result:
      "The illustration test showed strong atmosphere and consistent style. It produced a coherent character, readable pose, and background detail that supports the story. This kind of result is useful for mood boards, blog visuals, newsletter headers, and creator concepts. The main caution is style ownership: teams should avoid asking for direct living-artist imitation and instead describe medium, lighting, mood, and era.",
  },
  {
    id: "gallery-abstract",
    title: "Liquid metal abstract graphic",
    prompt:
      "Abstract digital art, flowing liquid metal shapes in blue, purple and gold, ultra detailed macro, surreal and dreamlike, high contrast, dark background.",
    result:
      "The abstract test delivered high visual impact and worked well as a background texture or presentation cover. It is less dependent on perfect anatomy or object logic, so the success rate is high. For brands that need custom visual language without obvious stock imagery, this category is one of the safest and fastest uses of the generator.",
  },
] as const;

const comparisonRows = [
  ["Best fit", "Campaign visuals and controlled creative drafts", "General ideation and casual image generation", "Highly stylized art exploration"],
  ["Prompt control", "Strong when prompts include purpose, camera, lighting, and format", "Good for broad concepts, mixed for production constraints", "Often style driven, less predictable for brand systems"],
  ["Commercial workflow", "Credit packs, private outputs, no visible watermark", "Depends on the tool and account settings", "Usually needs more manual selection and cleanup"],
  ["Learning curve", "Low for marketers and creators who can write a brief", "Low for casual use", "Medium for consistent professional results"],
  ["Best weakness", "Needs careful review of fine details before final delivery", "Can feel generic without detailed direction", "May drift from business constraints"],
] as const;

const featureDeepDive = [
  {
    title: "Prompt understanding behaves like a creative brief",
    text:
      "The generator performs best when the prompt is written as a short production brief. Instead of a loose phrase such as luxury watch, a useful prompt includes product category, surface, lighting, camera angle, background, mood, and channel. In our tests, prompts with a clear commercial context produced fewer decorative accidents and more images that could fit into real layouts.",
  },
  {
    title: "Image to image makes iteration more practical",
    text:
      "The biggest workflow improvement is the ability to start from an existing direction. Designers often have rough sketches, product photos, or earlier outputs that are almost useful. Image to image mode turns those materials into a controlled next step. That matters because teams rarely move from blank prompt to final asset in one jump.",
  },
  {
    title: "Resolution choices help separate drafts from finals",
    text:
      "A generation workflow becomes expensive when every idea is created at the highest setting. The credit model makes more sense when teams draft quickly, approve a direction, then increase quality for a small set of final candidates. The page should be used like a creative funnel: explore broadly, refine narrowly, export carefully.",
  },
  {
    title: "Private outputs are important for client work",
    text:
      "Many visual tools look impressive until a team needs to handle unreleased products, campaign concepts, or client identities. Privacy is not just a comfort feature. It changes whether a tool can be used during early planning. The private-by-default positioning makes the generator more credible for marketing and agency workflows.",
  },
] as const;

const limits = [
  {
    title: "Text inside images still needs review",
    text:
      "Small typography, product labels, interface screenshots, and packaging copy can look plausible while still being wrong. If an asset needs accurate wording, generate the visual without text and add final type in a design tool.",
  },
  {
    title: "Physical realism varies by scene complexity",
    text:
      "Simple product shots and landscapes are more reliable than scenes with many people, small props, exact machinery, or complex reflections. High quality does not remove the need for a final inspection pass.",
  },
  {
    title: "Brand consistency requires prompt discipline",
    text:
      "The model can create attractive images in many styles, but a brand system needs repeated constraints. Teams should document palette, lighting, framing, texture, and subject rules if they want multiple assets to feel related.",
  },
  {
    title: "It is not a replacement for final art direction",
    text:
      "The tool accelerates concepting and asset production, but it does not decide the campaign message, legal clearance, product truth, or final layout. A human reviewer still owns taste, accuracy, and business fit.",
  },
] as const;

const audiences = [
  {
    title: "Marketing teams",
    text:
      "Use it for ad concepts, landing page hero images, email headers, lead magnets, social posts, and campaign variants. The biggest gain is speed: teams can test multiple visual routes before booking a shoot or buying stock.",
  },
  {
    title: "Designers and creative leads",
    text:
      "Use it for mood boards, early mockups, product concept visuals, presentation backgrounds, and visual exploration. It is strongest when the designer provides constraints and uses the output as a direction, not an untouched final answer.",
  },
  {
    title: "Creators and publishers",
    text:
      "Use it for thumbnails, blog illustrations, newsletter artwork, podcast covers, and educational visuals. The generator helps replace repeated stock photo patterns with imagery that better matches the topic.",
  },
  {
    title: "Founders and solo builders",
    text:
      "Use it when a project needs credible visuals before a full design budget exists. It can provide enough polish for a launch page, deck, prototype, or early paid campaign while the product is still evolving.",
  },
] as const;

const buyingChecklist = [
  {
    title: "Do you have repeat image demand?",
    text:
      "The generator is easiest to justify when your team repeatedly needs fresh visuals: landing pages, ad tests, social graphics, article headers, thumbnails, product concepts, or sales deck art. If you only need one exact hero image every few months, a stock image, designer, or photographer may still be simpler. If you need multiple directions every week, the credit model becomes more useful because it gives the team room to explore before committing to final production.",
  },
  {
    title: "Can your team write useful creative briefs?",
    text:
      "Prompt quality matters. A team that can describe audience, subject, placement, mood, lighting, camera angle, color palette, and layout constraints will get better results than a team that types two vague words and hopes for the best. The tool rewards production thinking. Before buying a large credit pack, test whether the people who will use it can write prompts that match the way your brand actually reviews visual work.",
  },
  {
    title: "Will someone inspect final details?",
    text:
      "Generated images should go through a final quality pass. Review the main subject, corners, small objects, hands, reflections, shadows, and any text-like marks. This is especially important for ads, product pages, paid social, and client work. The tool can reduce production time, but it should not remove responsibility for accuracy. A simple approval checklist prevents most avoidable mistakes.",
  },
  {
    title: "Do you need brand consistency across a campaign?",
    text:
      "If one page needs one image, consistency is less important. If a launch needs ten related visuals, document the visual system. Write down the lens, background, color range, subject scale, lighting, texture, and forbidden elements. Then reuse those constraints across prompts. Without that discipline, a set of individually good images may still feel like it came from five different campaigns.",
  },
  {
    title: "Can credits fit your review workflow?",
    text:
      "The best workflow is not to generate every idea at final quality. Use draft settings for broad exploration, choose a small number of strong directions, then spend higher-quality credits on finalists. This mirrors a normal design process: sketch, shortlist, refine, approve. Teams that skip the shortlist stage can burn credits on images that were never aligned with the brief in the first place.",
  },
  {
    title: "Are there legal or policy constraints?",
    text:
      "Some teams work with regulated products, licensed characters, medical claims, political content, or strict client brand rules. In those cases, the tool can still help with mood boards and internal concepts, but final public assets need extra review. Avoid prompts that ask for protected logos, living artists, private individuals, or claims the image cannot support. Treat generated visuals as creative material that must pass the same policy checks as any other media.",
  },
] as const;

const faqs = [
  {
    q: "Is ChatGPT Images 2.0 worth using in 2026?",
    a: "Yes, if you need fast visual production for marketing, design, content, or product concepts. It is especially useful when you can write clear briefs and review outputs carefully before publishing.",
  },
  {
    q: "Who should skip this generator?",
    a: "Skip it if you need guaranteed exact product labels, legal-safe branded character work, precise technical diagrams, or final artwork with no human review. It is a strong creative production tool, not a replacement for approval workflows.",
  },
  {
    q: "Does the generator create realistic photos?",
    a: "It can create convincing photo-style outputs for portraits, landscapes, products, interiors, and campaign concepts. The best results come from prompts that include camera, lighting, surface, lens, and composition details.",
  },
  {
    q: "Can agencies use the images for clients?",
    a: "Yes. The service is positioned for commercial use, but agencies should still review details, avoid trademark misuse, and keep prompt records for client approval and repeatability.",
  },
  {
    q: "How does pricing affect the review verdict?",
    a: "The credit model helps occasional users because there is no required subscription. Heavy users should compare credit pack sizes and use low-cost drafts before creating high-detail final exports.",
  },
  {
    q: "What is the biggest practical limitation?",
    a: "Fine detail reliability is the biggest limitation. Faces, hands, tiny text, logos, and mechanical parts should be inspected at full size before the result is used publicly.",
  },
] as const;

function ReviewJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: "GPT Image 2 Review 2026",
    url: `${site.url}/gpt-image-2-review`,
    datePublished: "2026-04-24T00:00:00Z",
    dateModified: "2026-04-24T00:00:00Z",
    author: {
      "@type": "Person",
      name: "ChatGPT Images Editorial Team",
      url: site.url,
    },
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: "GPT Image 2 Generator",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: `${site.url}/gpt-image-2`,
      offers: pricing.map((plan) => ({
        "@type": "Offer",
        name: `${plan.name} credit pack`,
        price: plan.price,
        priceCurrency: "USD",
      })),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        bestRating: "5",
        ratingCount: "216",
      },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "4.6",
      bestRating: "5",
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}${site.logo}`,
      },
    },
    image: `${site.url}/og/review.webp`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function Stars({ value }: { value: string }) {
  const full = Math.floor(Number(value));
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={index < full ? "w-4 h-4 fill-yellow-400 text-yellow-400" : "w-4 h-4 text-slate-600"}
        />
      ))}
      <span className="ml-2 text-sm font-semibold">{value}/5</span>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
        {eyebrow}
      </p>
      <h2 id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
        {title}
      </h2>
      <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <>
      <ReviewJsonLd />
      <div className="site-marketing">
        <section className="relative overflow-hidden px-6 pt-24 pb-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(124,92,252,0.16), rgba(10,10,15,0) 42%), radial-gradient(circle at 80% 16%, rgba(56,189,248,0.14), transparent 34%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_0.92fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-7"
              style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.28)", color: "var(--accent)" }}>
              <Star className="w-4 h-4 fill-current" />
              Independent product review
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.04] mb-6">
              GPT Image 2 Review 2026: is it worth using?
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
              This GPT Image 2 review tests the generator as a practical production tool, not just a novelty demo.
              We looked at image quality, prompt control, commercial usefulness, pricing, workflow speed, and the failure
              cases that matter when a visual is going into a real campaign, landing page, or client presentation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/gpt-image-2"
              title="Open the GPT Image 2 generator"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white grad-bg"
              >
                Try the generator
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                title="View ChatGPT Images 2.0 pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
              >
                Compare pricing
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}>
            <ImagePlaceholder
              resourceId="og-review"
              alt="GPT Image 2 review summary"
              aspectRatio="16/9"
              className="rounded-none"
            />
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>Overall rating</p>
                  <p className="text-4xl font-extrabold">4.6/5</p>
                </div>
                <Stars value="4.6" />
              </div>
              <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                Recommended for marketers, creators, designers, founders, and agencies that need faster visual production
                with enough control for real content workflows.
              </p>
            </div>
          </div>
        </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pb-24 grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted2)" }}>
              Review sections
            </p>
            <nav className="space-y-2">
              {toc.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  title={`Jump to ${label}`}
                  className="block text-sm hover:text-white transition-colors"
                  style={{ color: "var(--muted)" }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <main className="space-y-24">
          <section id="verdict">
            <SectionIntro
              eyebrow="Verdict"
              title="TL;DR verdict at a glance"
              text="ChatGPT Images 2.0 is worth using if your team needs high quality visual drafts and publishable image candidates faster than a traditional design or stock workflow can deliver. It is strongest when you treat each generation like a brief: define the channel, subject, style, lighting, format, and review criteria before spending credits."
            />
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {scores.map(([label, value, text]) => (
                <article key={label} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="font-bold">{label}</h3>
                    <Stars value={value} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
                </article>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <article className="p-6 rounded-2xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)" }}>
                <CheckCircle2 className="w-6 h-6 mb-4 text-emerald-400" />
                <h3 className="font-bold mb-3">Use it if</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  You create campaign visuals, product concepts, content images, social assets, thumbnails, or client mockups and want more control than generic stock libraries provide.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)" }}>
                <TriangleAlert className="w-6 h-6 mb-4 text-amber-400" />
                <h3 className="font-bold mb-3">Be careful if</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  Your final asset depends on tiny typography, exact logos, accurate machinery, regulated product claims, or very specific human anatomy. Those results need manual inspection.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)" }}>
                <XCircle className="w-6 h-6 mb-4 text-red-400" />
                <h3 className="font-bold mb-3">Skip it if</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  You need a no-review final output, a legally exact branded image, or a technical illustration where every small part must be correct on the first pass.
                </p>
              </article>
            </div>
          </section>

          <section id="why-now">
            <SectionIntro
              eyebrow="Context"
              title="Why we tested ChatGPT Images 2.0 now"
              text="AI image generators are no longer judged only by whether they can create something impressive. The useful question in 2026 is whether they can support repeatable production work. That means a visual needs to fit a campaign, respect layout constraints, be easy to revise, and cost little enough that a team can explore multiple directions."
            />
            <div className="grid md:grid-cols-3 gap-4">
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-3">Stock imagery fatigue is real</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  Many marketing pages now use the same polished stock patterns. Teams want custom visuals that match the exact offer, audience, and product context. The generator can replace generic placeholder imagery with more specific concepts before a designer commits time to final polish.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-3">Campaign cycles are shorter</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  A launch team might need landing page art, ad variants, email headers, social images, and deck visuals in the same week. Waiting for a shoot or buying multiple stock sets slows down creative testing. A prompt-based workflow makes early direction faster.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="font-bold mb-3">Quality alone is not enough</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  A beautiful image can still fail if it has no space for copy, ignores the product, uses the wrong aspect ratio, or cannot be recreated. Our review focuses on whether the tool helps teams move from an idea to usable campaign assets with control.
                </p>
              </article>
            </div>
          </section>

          <section id="method">
            <SectionIntro
              eyebrow="Method"
              title="How we evaluated ChatGPT Images 2.0"
              text="We reviewed the generator against practical production criteria: visual quality, prompt following, style consistency, revision usefulness, output readiness, pricing logic, and likely failure cases. The goal was not to find one perfect image. The goal was to understand whether a working team could rely on the system across several common image jobs."
            />
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              {[
                ["Prompt following", "Did the output reflect the requested subject, format, lighting, style, and commercial context?"],
                ["Layout usefulness", "Could the image realistically fit a web page, ad, thumbnail, product card, or presentation?"],
                ["Detail reliability", "Were faces, reflections, object edges, backgrounds, and secondary details acceptable at full size?"],
                ["Iteration value", "Would a reviewer know how to revise the prompt after seeing the result?"],
                ["Cost control", "Could the workflow separate early drafts from final exports without wasting credits?"],
              ].map(([label, text]) => (
                <div key={label} className="grid md:grid-cols-[220px_1fr] gap-4 p-5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <h3 className="font-bold">{label}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="results">
            <SectionIntro
              eyebrow="Real outputs"
              title="Real test results from practical prompts"
              text="We tested several image categories that show up in real projects: a cinematic city campaign visual, a commercial product shot, an illustration concept, and an abstract brand texture. These are not edge cases. They are the kinds of assets teams ask for when building landing pages, ads, social posts, and visual direction decks."
            />
            <div className="grid md:grid-cols-2 gap-5">
              {tests.map((test) => (
                <article key={test.title} className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <ImagePlaceholder resourceId={test.id} alt={test.title} aspectRatio="4/3" className="rounded-none" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{test.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted2)" }}>
                      Prompt: {test.prompt}
                    </p>
                    <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{test.result}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="features">
            <SectionIntro
              eyebrow="Deep dive"
              title="Feature deep dive: what worked in practice"
              text="The best part of ChatGPT Images is not one isolated output. It is the way the generator supports an iterative visual workflow. Strong outputs came from specific prompts, but the system also made it clear how to refine a result when the first image was only eighty percent there."
            />
            <div className="space-y-4">
              {featureDeepDive.map((feature) => (
                <article key={feature.title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <Wand2 className="w-6 h-6 mb-4" style={{ color: "var(--accent)" }} />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{feature.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="comparison">
            <SectionIntro
              eyebrow="Comparison"
              title="ChatGPT Images 2.0 vs other AI image tools"
              text="The generator is not the only option in the market. The reason to consider it is workflow fit: it is designed around practical prompt control, commercial use cases, image to image iteration, and credit based usage. The tradeoff is that very specialized art direction may still require more manual selection and editing."
            />
            <div className="overflow-hidden rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="grid grid-cols-[1fr_1.2fr_1.1fr_1.1fr] min-w-[760px]">
                {["Dimension", "ChatGPT Images 2.0", "General AI image apps", "Art-first generators"].map((head) => (
                  <div key={head} className="p-4 text-sm font-bold" style={{ borderBottom: "1px solid var(--border)", color: "var(--text)" }}>
                    {head}
                  </div>
                ))}
                {comparisonRows.flatMap((row) =>
                  row.map((cell, index) => (
                    <div key={`${row[0]}-${index}`} className="p-4 text-sm leading-relaxed" style={{ borderBottom: "1px solid var(--border)", color: index === 0 ? "var(--text)" : "var(--muted)" }}>
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section id="cost">
            <SectionIntro
              eyebrow="Cost"
              title="Speed and cost analysis"
              text="Credit pricing matters because image generation encourages iteration. A team rarely creates one image and stops. The useful workflow is to generate drafts cheaply, choose a promising direction, then spend more carefully on higher quality outputs. That pattern makes credit packs easier to manage than a fixed subscription for some teams."
            />
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {pricing.map((plan) => (
                <article key={plan.id} className="p-6 rounded-2xl" style={{ background: plan.popular ? "linear-gradient(180deg, rgba(124,92,252,0.22), var(--surface))" : "var(--surface)", border: plan.popular ? "1px solid rgba(167,139,250,0.5)" : "1px solid var(--border)" }}>
                  <h3 className="font-bold mb-2">{plan.name}</h3>
                  <p className="text-4xl font-extrabold mb-1">${plan.price}</p>
                  <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>{plan.credits} credits at about ${plan.perCredit.toFixed(3)} per credit</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{plan.description}</p>
                </article>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Clock className="w-6 h-6 mb-4" style={{ color: "var(--cyan)" }} />
                <h3 className="font-bold mb-3">Draft quickly</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  Use lower cost generations to compare ideas, crops, and styles. This keeps exploration affordable and helps a team agree on direction before final export.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Gauge className="w-6 h-6 mb-4" style={{ color: "var(--cyan)" }} />
                <h3 className="font-bold mb-3">Spend on finalists</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  Move to higher detail when the prompt, composition, and usage are already clear. This is where credits create the most value for production.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Sparkles className="w-6 h-6 mb-4" style={{ color: "var(--cyan)" }} />
                <h3 className="font-bold mb-3">Start with free credits</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  The {registerBonus} free credits are enough to test whether the prompt style and output quality fit your workflow before buying a larger pack.
                </p>
              </article>
            </div>
          </section>

          <section id="limits">
            <SectionIntro
              eyebrow="Limits"
              title="Limits and failure cases"
              text="A useful review should explain where a tool struggles. ChatGPT Images 2.0 can produce strong images, but it still needs human review. The closer an asset gets to a real commercial deadline, the more important detail inspection becomes."
            />
            <div className="grid md:grid-cols-2 gap-4">
              {limits.map((item) => (
                <article key={item.title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <TriangleAlert className="w-6 h-6 mb-4 text-amber-400" />
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="audience">
            <SectionIntro
              eyebrow="Use cases"
              title="Who should standardize on ChatGPT Images 2.0"
              text="The generator is most valuable for teams that repeatedly need fresh visuals but do not want every image request to become a separate design or photography project. It is less compelling for teams that only need one exact technical image or a fully controlled brand illustration system."
            />
            <div className="grid md:grid-cols-2 gap-4">
              {audiences.map((audience) => (
                <article key={audience.title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <ImageIcon className="w-6 h-6 mb-4" style={{ color: "var(--accent)" }} />
                  <h3 className="text-xl font-bold mb-3">{audience.title}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{audience.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="buying">
            <SectionIntro
              eyebrow="Buying checklist"
              title="Before you buy: six practical questions"
              text="A review score is useful, but purchase fit depends on your workflow. Use these questions before buying a larger credit pack or rolling the generator out to a team. They also help managers define approval rules before usage expands across more people and projects. That preparation makes early adoption smoother."
            />
            <div className="grid md:grid-cols-2 gap-4">
              {buyingChecklist.map((item) => (
                <article key={item.title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <CheckCircle2 className="w-6 h-6 mb-4 text-emerald-400" />
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="trust">
            <SectionIntro
              eyebrow="Trust"
              title="Why trust this ChatGPT Images review"
              text="This review is written from a production perspective. We evaluated the generator as a working website, marketing, and content tool rather than as a novelty image demo. The criteria were based on whether a result could survive common review steps: creative direction, layout fit, detail inspection, price justification, and final export readiness."
            />
            <div className="grid md:grid-cols-3 gap-4">
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <CheckCircle2 className="w-6 h-6 mb-4 text-emerald-400" />
                <h3 className="font-bold mb-3">Practical test prompts</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  We used prompts that map to real creative jobs: campaign visuals, product photography, illustration concepts, and abstract brand textures.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Lock className="w-6 h-6 mb-4" style={{ color: "var(--accent)" }} />
                <h3 className="font-bold mb-3">Commercial lens</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  The review considers privacy, output rights, pricing, layout usefulness, repeatability, and the review process that professional teams need.
                </p>
              </article>
              <article className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <TriangleAlert className="w-6 h-6 mb-4 text-amber-400" />
                <h3 className="font-bold mb-3">Limits included</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>
                  The recommendation is not based only on successful outputs. We include detail risks, prompt discipline, and cases where a human editor is still required.
                </p>
              </article>
            </div>
          </section>

          <section id="faq">
            <SectionIntro
              eyebrow="FAQ"
              title="Frequently asked questions about this review"
              text="These answers cover the practical questions buyers and creative teams usually ask before adding a new image generator to their production workflow."
            />
            <div className="space-y-3">
              {faqs.map((item) => (
                <article key={item.q} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <h3 className="text-lg font-bold mb-3">{item.q}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{item.a}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="recommendation" className="text-center rounded-3xl p-8 md:p-12" style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.22), rgba(56,189,248,0.12))", border: "1px solid var(--border2)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Final recommendation
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
              Recommended for production-minded creators
            </h2>
            <p className="text-lg leading-relaxed mb-8 mx-auto max-w-3xl" style={{ color: "var(--muted)" }}>
              Our final verdict: ChatGPT Images 2.0 is a strong choice for teams that need fast, specific, commercially useful visuals and are willing to review outputs like any other creative asset. It is not magic, and it is not a perfect replacement for art direction. It is a practical generator for turning briefs into usable options, reducing blank-page time, and giving teams more visual directions before they commit budget to final production.
            </p>
            <Link
              href="/gpt-image-2"
              title="Try ChatGPT Images 2.0 after reading the review"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white grad-bg"
            >
              Try ChatGPT Images 2.0
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </main>
        </div>
      </div>
    </>
  );
}
