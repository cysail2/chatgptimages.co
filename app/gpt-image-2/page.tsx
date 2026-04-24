import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Image as ImageIcon,
  Layers,
  Lock,
  Maximize2,
  SlidersHorizontal,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { pricing, registerBonus, site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "ChatGPT Images 2.0 Generator - Text to Image AI Tool",
  },
  description:
    "Use the ChatGPT Images 2.0 generator to create realistic AI photos, product shots, concept art, and social visuals from detailed text prompts.",
  alternates: { canonical: "/gpt-image-2" },
};

const capabilityGroups = [
  {
    icon: ImageIcon,
    title: "Text to image generation",
    text: "Turn a written creative brief into a finished visual. The ChatGPT Images generator understands subject, style, camera angle, lighting, background, aspect ratio, and output format in one prompt.",
  },
  {
    icon: Layers,
    title: "Image to image refinement",
    text: "Start with a rough reference image, product mockup, sketch, or prior generation. Describe the transformation and keep the workflow inside one ChatGPT Images session instead of switching tools.",
  },
  {
    icon: Maximize2,
    title: "1K, 2K, and 4K outputs",
    text: "Choose fast drafts for exploration or high detail output for campaign assets. Higher resolution is useful when a result will be cropped, printed, or reused across multiple placements.",
  },
  {
    icon: Lock,
    title: "Private commercial use",
    text: "Generated images are private by default and can be used in client work, ads, product pages, social posts, presentations, and editorial layouts without visible watermarks.",
  },
];

const examples = [
  {
    id: "real-result-cityscape",
    label: "Futuristic city campaign visual",
    prompt: "A futuristic city at sunset with golden light, glass towers, flying vehicles, cinematic wide shot, photorealistic detail.",
  },
  {
    id: "gallery-product",
    label: "Luxury product photography",
    prompt: "Luxury perfume bottle on white marble, soft studio light, clean commercial product photography, perfect reflection.",
  },
  {
    id: "gallery-anime",
    label: "Anime illustration concept",
    prompt: "Anime style girl in a sunlit forest, soft watercolor tones, detailed background, warm magical atmosphere.",
  },
  {
    id: "gallery-abstract",
    label: "Abstract digital artwork",
    prompt: "Flowing liquid metal in blue, purple, and gold, dark background, macro detail, high contrast generative art.",
  },
] as const;

const steps = [
  {
    title: "Write a focused prompt",
    text: "Start with the subject and purpose, then add camera framing, lighting, style, mood, and output size. The best ChatGPT Images prompts read like a short art direction note.",
  },
  {
    title: "Choose output settings",
    text: "Pick square, portrait, landscape, or widescreen formats depending on where the image will be used. Select lower resolution for drafts and higher resolution for final production assets.",
  },
  {
    title: "Generate, compare, and refine",
    text: "Create a first result, review what worked, then adjust the prompt. Change one variable at a time: lighting, background, lens, subject pose, color palette, or product placement.",
  },
  {
    title: "Export for the channel",
    text: "Use the final image in ads, landing pages, thumbnails, mockups, or client decks. Keep prompt notes with each export so the look can be recreated later.",
  },
];

const specs = [
  ["Input modes", "Text to image, image to image, reference guided editing"],
  ["Common formats", "Square, portrait, landscape, widescreen, social placements"],
  ["Resolution tiers", "1K medium, 1K high, 2K medium, 2K high, 4K output"],
  ["Typical use", "Marketing visuals, product shots, concept art, thumbnails, blog images"],
  ["Rights", "Personal and commercial use, no visible watermark"],
  ["Pricing model", "Credit packs with no monthly subscription"],
];

const promptTips = [
  {
    title: "Put the use case first",
    text: "A prompt for a YouTube thumbnail should not read like a fine art prompt. Say the channel, layout, subject scale, background contrast, and text safe area before adding style notes.",
  },
  {
    title: "Describe the lens and light",
    text: "Words like macro lens, shallow depth of field, softbox lighting, rim light, golden hour, overhead product shot, or dramatic split lighting give the generator clearer visual constraints.",
  },
  {
    title: "Avoid stacking too many styles",
    text: "Combining watercolor, cinematic, cyberpunk, clay render, editorial fashion, and oil painting in one request weakens direction. Pick one primary style and one supporting texture.",
  },
  {
    title: "Use iteration notes",
    text: "When a result is close, keep the useful parts and rewrite only the weak part. For example: keep the same bottle angle, make the background warmer, remove extra props, add softer reflection.",
  },
];

const productionChecks = [
  {
    title: "Define the placement before the prompt",
    text: "A banner, thumbnail, product detail image, and hero background have different visual jobs. Decide where the result will live before generating. For a hero background, leave quiet space for text and buttons. For a product card, keep the subject centered with clean edges. For a thumbnail, push contrast and subject scale so the image remains readable at small sizes. This planning step prevents attractive images that are hard to use in a real layout.",
  },
  {
    title: "Create variations around one controlled direction",
    text: "Once a result has the right subject and composition, do not restart with a completely different prompt. Keep the same core phrase and generate focused variations: warmer lighting, tighter crop, cleaner background, more premium material, softer shadow, less clutter, or stronger color contrast. Teams get better assets when they treat generation like a design review loop instead of a slot machine.",
  },
  {
    title: "Check details before using the final export",
    text: "Review faces, hands, logos, small text, product edges, reflections, and background objects at full size. If an image will be used in advertising or client work, inspect the corners and secondary details as closely as the main subject. The generator can produce strong compositions quickly, but production teams should still approve the final asset with the same care used for stock photography or a retouched shoot.",
  },
  {
    title: "Keep prompts and outputs organized",
    text: "Save the prompt, aspect ratio, resolution, and selected output for every asset that reaches review. This makes a campaign easier to extend later because another designer can reproduce the same visual system. A lightweight naming rule also helps: project, channel, concept, version, and final status. Organization matters once a single landing page grows into ads, emails, social posts, and sales decks.",
  },
  {
    title: "Match quality level to the decision stage",
    text: "Early exploration does not need the most expensive output every time. Use draft quality while comparing concepts, crops, subjects, and art direction. Move to high detail only when the team agrees on the visual route. This keeps credit use predictable and gives reviewers more options before the final production pass.",
  },
  {
    title: "Plan for edits outside the frame",
    text: "Many assets need room for headlines, price badges, callouts, or interface overlays after generation. Ask for cleaner margins, simpler backgrounds, and subject placement that leaves space for layout work. A useful final image is not always the busiest image; it is the one that fits the design system without fighting the surrounding text.",
  },
];

const faqs = [
  {
    q: "Is ChatGPT Images 2.0 a text to image generator?",
    a: "Yes. The generator turns text prompts into AI images, including realistic photography, product images, concept art, anime style work, abstract graphics, and social media visuals.",
  },
  {
    q: "Can I upload a reference image?",
    a: "Yes. Image to image mode lets you upload a rough reference, sketch, product photo, or existing design and describe how ChatGPT Images should transform it.",
  },
  {
    q: "What should I write in a good prompt?",
    a: "A strong prompt includes the subject, style, lighting, composition, camera view, background, mood, and intended use. Short prompts work, but structured prompts give more reliable results.",
  },
  {
    q: "Can I use generated images commercially?",
    a: "Yes. Images made with ChatGPT Images can be used for marketing, client work, product pages, thumbnails, ads, presentations, and other commercial projects.",
  },
  {
    q: "How many free generations do I get?",
    a: `New accounts receive ${registerBonus} free credits. That is enough to test the workflow before buying a credit pack for regular production use.`,
  },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ChatGPT Images 2.0 Generator",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: `${site.url}/gpt-image-2`,
    description:
      "A web based AI image generator for creating realistic photos, product shots, concept art, and social visuals from text prompts.",
    offers: pricing.map((plan) => ({
      "@type": "Offer",
      name: `${plan.name} credit pack`,
      price: plan.price,
      priceCurrency: "USD",
      description: `${plan.credits} credits for ChatGPT Images generation.`,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      ratingCount: "216",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">{title}</h2>
      <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <>
      <JsonLd />
      <section className="relative overflow-hidden px-6 pt-24 pb-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(124,92,252,0.13) 0%, rgba(10,10,15,0) 34%), radial-gradient(circle at 80% 18%, rgba(56,189,248,0.16), transparent 34%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[0.92fr_1.08fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-7"
              style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.28)", color: "var(--accent)" }}>
              <Sparkles className="w-4 h-4" />
              ChatGPT Images 2.0 Generator
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.04] mb-6">
              Generate AI images from prompts with production control
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
              The ChatGPT Images 2.0 generator helps marketers, designers, creators, and founders create realistic
              AI photos, product shots, concept art, thumbnails, and campaign visuals from a clear text prompt.
              Start with free credits, refine your result, and export images without a watermark.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                title="Start using the ChatGPT Images 2.0 Generator"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white grad-bg"
              >
                Start generating free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                title="View ChatGPT Images 2.0 pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
              >
                View credit packs
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden glow-purple" style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}>
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Wand2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
                Generator workspace
              </div>
              <span className="text-xs px-2 py-1 rounded-md" style={{ color: "var(--muted)", background: "rgba(255,255,255,0.04)" }}>
                12 free credits
              </span>
            </div>
            <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-4 p-4">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted2)" }}>
                  Prompt
                </p>
                <div className="min-h-[160px] rounded-lg p-4 text-sm leading-relaxed" style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                  Luxury smartwatch product shot on a dark reflective surface, water droplets, dramatic spotlight,
                  macro lens, premium advertising campaign, ultra sharp detail.
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {["Square", "2K high", "WebP", "Private"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" style={{ color: "var(--cyan)" }} />
                      <span style={{ color: "var(--muted)" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-white grad-bg">
                  <Zap className="w-4 h-4" />
                  Generate preview
                </button>
              </div>
              <div className="space-y-3">
                <ImagePlaceholder
                  resourceId="real-result-product"
                  alt="Generated luxury watch product image"
                  aspectRatio="1/1"
                  className="w-full"
                />
                <div className="grid grid-cols-3 gap-3">
                  <ImagePlaceholder resourceId="gallery-product" alt="Generated perfume product image" aspectRatio="1/1" />
                  <ImagePlaceholder resourceId="gallery-abstract" alt="Generated abstract AI artwork" aspectRatio="1/1" />
                  <ImagePlaceholder resourceId="gallery-scifi" alt="Generated sci-fi city image" aspectRatio="1/1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Capabilities"
            title="What the ChatGPT Images generator can create"
            text="A good image generator page should show more than a blank text box. This page explains the practical controls behind ChatGPT Images 2.0 and the production cases it is built for."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {capabilityGroups.map(({ icon: Icon, title, text }) => (
              <article key={title} className="p-6 rounded-2xl card-hover" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Icon className="w-7 h-7 mb-5" style={{ color: "var(--accent)" }} />
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Examples"
            title="See generator outputs across real creative briefs"
            text="The same ChatGPT Images workflow can produce polished visuals for ads, product launches, editorial layouts, concept boards, social channels, and presentation decks."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examples.map(({ id, label, prompt }) => (
              <article key={id} className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <ImagePlaceholder resourceId={id} alt={label} aspectRatio="4/3" className="rounded-none" />
                <div className="p-5">
                  <h3 className="font-bold mb-2">{label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{prompt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Workflow"
            title="How to use ChatGPT Images 2.0 for production work"
            text="The generator is most useful when it becomes a repeatable creative workflow. Treat each prompt as a brief, each output as a draft, and each revision as a controlled iteration."
          />
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <article key={step.title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mb-5 grad-bg">
                  {index + 1}
                </div>
                <h3 className="font-bold mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Specs
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
              Technical specs for the image generator
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
              ChatGPT Images 2.0 is designed for quick drafting and high quality final exports. Use lower cost
              generations to explore direction, then move to higher detail settings once the creative concept is locked.
            </p>
            <Link href="/pricing" title="Compare ChatGPT Images 2.0 credit pricing" className="inline-flex items-center gap-2 font-semibold" style={{ color: "var(--accent)" }}>
              Compare credit costs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
            {specs.map(([label, value]) => (
              <div key={label} className="grid md:grid-cols-[180px_1fr] gap-3 p-5" style={{ borderBottom: "1px solid var(--border)" }}>
                <h3 className="text-sm font-bold">{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Prompting"
            title="Prompting guide for better ChatGPT Images results"
            text="Better prompts are not longer by default. They are more specific about the visual job, the intended output channel, and the constraints that matter for the final asset."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {promptTips.map((tip) => (
              <article key={tip.title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <SlidersHorizontal className="w-6 h-6 mb-4" style={{ color: "var(--cyan)" }} />
                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{tip.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Production QA"
            title="Production checklist before you generate"
            text="The strongest results come from a clear brief and a review loop. Use this checklist before spending credits on final assets for paid campaigns, client work, or launch pages. It helps teams separate visual exploration from final approval, control cost, and keep every usable image tied to a repeatable production decision. It also gives reviewers shared language for feedback before final approval."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {productionChecks.map((check) => (
              <article key={check.title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="text-xl font-bold mb-3">{check.title}</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{check.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
              Pricing
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
              Start with free credits, then buy only what you need
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              New users get {registerBonus} credits for testing ChatGPT Images. After that, credit packs work better
              than a forced subscription for occasional design tasks, campaign sprints, and client projects with uneven demand.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {pricing.map((plan) => (
              <article key={plan.id} className="p-5 rounded-2xl" style={{ background: plan.popular ? "linear-gradient(180deg, rgba(124,92,252,0.22), var(--surface))" : "var(--surface)", border: plan.popular ? "1px solid rgba(167,139,250,0.5)" : "1px solid var(--border)" }}>
                <h3 className="font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-extrabold mb-1">${plan.price}</p>
                <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>{plan.credits} credits</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{plan.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently asked questions about the generator"
            text="These answers cover the common decisions teams make before adding ChatGPT Images to a visual production workflow."
          />
          <div className="space-y-3">
            {faqs.map((item) => (
              <article key={item.q} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h3 className="text-lg font-bold mb-3">{item.q}</h3>
                <p className="leading-relaxed" style={{ color: "var(--muted)" }}>{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
            Ready to create with ChatGPT Images 2.0?
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
            Open the generator, write a focused prompt, and create your first set of AI images for a campaign,
            product concept, article, thumbnail, or design presentation.
          </p>
          <Link
            href="/sign-up"
            title="Create a free ChatGPT Images account"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white grad-bg"
          >
            Create images free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
