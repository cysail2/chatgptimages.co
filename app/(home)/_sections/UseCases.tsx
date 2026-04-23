import { Megaphone, Palette, Video, ShoppingBag, GraduationCap, Code2 } from "lucide-react";

const cases = [
  {
    icon: Megaphone,
    title: "Marketers & Advertising Teams",
    desc: "Marketing teams use this generator for on-brand ad creatives, social media visuals, email headers, and landing page hero images in minutes — not days. Test multiple visual directions in a single afternoon without booking a photographer or a stock photo license.",
    examples: ["Facebook & Instagram ads", "Email campaign headers", "Landing page visuals"],
  },
  {
    icon: Palette,
    title: "Graphic & UI Designers",
    desc: "Designers use the tool for rapid concept exploration, mood boards, and placeholder visuals during the design phase. Generate reference imagery for client presentations and explore visual directions before committing to a direction.",
    examples: ["Mood boards", "Concept prototyping", "Client pitch decks"],
  },
  {
    icon: Video,
    title: "Content Creators & YouTubers",
    desc: "Creators use it to build standout YouTube thumbnails, podcast covers, blog illustrations, and newsletter visuals. Generate custom imagery that fits your channel&apos;s style — no more recycled stock photos everyone else is also using.",
    examples: ["YouTube thumbnails", "Podcast cover art", "Newsletter hero images"],
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce Store Owners",
    desc: "Independent e-commerce brands rely on the generator for product lifestyle shots, seasonal campaign visuals, and category hero banners. Generate studio-quality product imagery for a fraction of the cost of a traditional photo shoot.",
    examples: ["Product lifestyle shots", "Category banners", "Seasonal promos"],
  },
  {
    icon: GraduationCap,
    title: "Educators & Course Creators",
    desc: "Teachers and online course creators use the tool to generate diagram illustrations, slide visuals, and engaging thumbnails for lessons. Replace generic clipart with custom imagery that fits exactly the concept being taught.",
    examples: ["Lesson illustrations", "Course thumbnails", "Slide deck visuals"],
  },
  {
    icon: Code2,
    title: "Indie Developers & Startups",
    desc: "Founders and solo developers lean on the generator for app store screenshots, marketing site visuals, blog post headers, and investor deck imagery. Ship a polished-looking product without hiring a designer on day one.",
    examples: ["App store assets", "Marketing site hero", "Pitch deck visuals"],
  },
];

export function UseCases() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Audience
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          Who Uses ChatGPT Images 2.0 — and What For
        </h2>
        <p className="text-center text-lg mb-14 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          From solo creators to in-house marketing teams, the tool fits wherever custom visuals
          are needed at speed. Here are six of the most common use cases we see every week.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map(({ icon: Icon, title, desc, examples }) => (
            <div key={title} className="p-7 rounded-2xl flex flex-col"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(124,92,252,0.15)" }}>
                <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="text-base font-bold mb-3">{title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)" }}>{desc}</p>
              <ul className="mt-auto space-y-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                {examples.map((ex) => (
                  <li key={ex} className="flex items-center gap-2 text-xs" style={{ color: "var(--muted2)" }}>
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
