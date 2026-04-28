import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "./ImagePlaceholder";
import type { SeoContentPageData } from "./SeoContentPage";
import { site } from "./site-content";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatArticleDate(date?: string) {
  if (!date) return undefined;
  const parsed = new Date(date.includes("T") ? date : `${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function ArticleJsonLd({ page }: { page: SeoContentPageData }) {
  const pageUrl = `${site.url}${page.path}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.headline ?? page.title,
    description: page.intro,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: page.publishedAt ? `${page.publishedAt}T00:00:00Z` : undefined,
    dateModified: page.updatedAt ? `${page.updatedAt}T00:00:00Z` : undefined,
    author: {
      "@type": "Person",
      name: page.author?.name ?? site.name,
      url: page.author?.url ?? site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}${site.logo}`,
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

type ArticleContentPageProps = {
  page: SeoContentPageData;
  title: string;
  summaryTitle: string;
  summary: React.ReactNode;
  level?: string;
  formula?: {
    eyebrow: string;
    code: string;
    bullets: Array<{ label: string; text: string }>;
  };
};

export function ArticleContentPage({
  page,
  title,
  summaryTitle,
  summary,
  level,
  formula,
}: ArticleContentPageProps) {
  const updatedAt = formatArticleDate(page.updatedAt ?? page.publishedAt);
  const tocItems = [
    ...page.sections.map((section) => ({
      id: slugify(section.title),
      label: section.title,
    })),
    ...(page.comparison
      ? [{ id: "comparison-table", label: page.comparison.title }]
      : []),
    ...(page.examples
      ? [{ id: "prompt-examples", label: "Copy-paste prompt examples" }]
      : []),
    { id: "faq", label: "Quick reference FAQ" },
  ];

  return (
    <>
      <ArticleJsonLd page={page} />
      <main className="site-marketing bg-background text-foreground">
        <header className="mx-auto max-w-7xl px-6 pb-16 pt-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground"
          >
            {(page.breadcrumbs ?? [
              { name: "Home", path: "/" },
              { name: page.title, path: page.path },
            ]).map((crumb, index, crumbs) => {
              const isLast = index === crumbs.length - 1;
              return (
                <span key={`${crumb.path}-${index}`} className="flex items-center gap-3">
                  {isLast ? (
                    <span className="text-foreground">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-primary">
                      {crumb.name}
                    </Link>
                  )}
                  {!isLast && <span className="text-muted-foreground/50">/</span>}
                </span>
              );
            })}
          </nav>

          <div className="max-w-5xl">
            <h1 className="text-left text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl">
              {title}
            </h1>
            <p className="mt-8 text-base font-semibold text-muted-foreground md:text-lg">
              Updated: {updatedAt} | Reading time: {page.readingTime}
              {level ? ` | Level: ${level}` : ` | Author: ${page.author?.name ?? site.name}`}
            </p>
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <p className="text-lg leading-relaxed text-foreground md:text-xl">
                <strong>{summaryTitle}:</strong> {summary}
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6">
              <div className="mb-6 text-xs font-extrabold uppercase tracking-[0.28em] text-foreground">
                Table of Contents
              </div>
              <ol className="space-y-5">
                {tocItems.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="grid grid-cols-[32px_1fr] gap-3 text-sm font-semibold leading-snug text-muted-foreground transition-colors hover:text-primary"
                    >
                      <span className="font-extrabold text-primary">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="rounded-3xl border border-border bg-card p-6 md:p-10">
            {formula && (
              <section className="mb-12 rounded-2xl border border-border bg-background/50 p-6">
                <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  {formula.eyebrow}
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  <code className="rounded bg-background px-2 py-1 font-mono text-foreground">
                    {formula.code}
                  </code>
                </p>
                <ul className="mt-5 space-y-3 text-base leading-relaxed text-muted-foreground">
                  {formula.bullets.map((bullet) => (
                    <li key={bullet.label}>
                      <strong className="text-foreground">{bullet.label}:</strong>{" "}
                      {bullet.text}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {page.sections.map((section) => (
              <section
                key={section.title}
                id={slugify(section.title)}
                className="scroll-mt-28 border-t border-border py-12 first:border-t-0 first:pt-0"
              >
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  {section.eyebrow}
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  {section.text}
                </p>
                <div className="mt-8 space-y-5">
                  {section.items.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-border bg-background/50 p-6">
                      <h3 className="text-xl font-extrabold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {page.comparison && (
              <section id="comparison-table" className="scroll-mt-28 border-t border-border py-12">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  Comparison
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                  {page.comparison.title}
                </h2>
                <div className="mt-8 overflow-hidden rounded-2xl border border-border">
                  <div className="grid gap-3 bg-background/70 p-5 font-bold md:grid-cols-3">
                    {page.comparison.headers.map((header) => (
                      <div key={header}>{header}</div>
                    ))}
                  </div>
                  {page.comparison.rows.map((row) => (
                    <div
                      key={row[0]}
                      className="grid gap-3 border-t border-border p-5 md:grid-cols-3"
                    >
                      {row.map((cell, index) => (
                        <p
                          key={`${row[0]}-${index}`}
                          className="text-sm leading-relaxed"
                          style={{
                            color: index === 0 ? "var(--foreground)" : "var(--muted-foreground)",
                          }}
                        >
                          {cell}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {page.examples && (
              <section id="prompt-examples" className="scroll-mt-28 border-t border-border py-12">
                <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  Prompt Library
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                  Copy-paste GPT Image 2 prompt examples
                </h2>
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  {page.examples.map((example) => (
                    <div
                      key={`${example.resourceId}-${example.label}`}
                      className="overflow-hidden rounded-2xl border border-border bg-background/50"
                    >
                      <ImagePlaceholder
                        resourceId={example.resourceId}
                        alt={example.label}
                        aspectRatio="4/3"
                        className="rounded-none"
                      />
                      <div className="p-5">
                        <h3 className="text-lg font-extrabold text-foreground">
                          {example.label}
                        </h3>
                        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-background p-4 font-mono text-sm leading-relaxed text-muted-foreground">
                          {example.prompt}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section id="faq" className="scroll-mt-28 border-t border-border pt-12">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                FAQ
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Quick reference FAQ
              </h2>
              <div className="mt-8 space-y-4">
                {page.faqs.map((item) => (
                  <details
                    key={item.q}
                    className="rounded-2xl border border-border bg-background/50 p-5"
                  >
                    <summary className="cursor-pointer text-lg font-extrabold text-foreground">
                      {item.q}
                    </summary>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-10">
              {page.primaryCta && (
                <Link
                  href={page.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground"
                >
                  {page.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {page.secondaryCta && (
                <Link
                  href={page.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-bold text-muted-foreground hover:text-primary"
                >
                  {page.secondaryCta.label}
                </Link>
              )}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
