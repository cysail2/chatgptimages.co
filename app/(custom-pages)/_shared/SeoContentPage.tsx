import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { site } from "./site-content";

type ContentItem = {
  title: string;
  text: string;
};

type ContentSection = {
  eyebrow: string;
  title: string;
  text: string;
  items: ContentItem[];
};

type ExampleItem = {
  resourceId: string;
  label: string;
  prompt: string;
};

type ComparisonTable = {
  title: string;
  headers: [string, string, string];
  rows: [string, string, string][];
};

type FaqItem = {
  q: string;
  a: string;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type AuthorInfo = {
  name: string;
  url?: string;
};

export type SeoContentPageData = {
  keyword: string;
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  heroPoints: string[];
  primaryCta?: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
  sections: ContentSection[];
  examples?: ExampleItem[];
  comparison?: ComparisonTable;
  faqs: FaqItem[];
  schemaType?: "WebPage" | "Article";
  publishedAt?: string;
  updatedAt?: string;
  author?: AuthorInfo;
  breadcrumbs?: BreadcrumbItem[];
  headline?: string;
  examplesFirst?: boolean;
  articleHeader?: boolean;
  readingTime?: string;
};

function ExamplesSection({ page }: { page: SeoContentPageData }) {
  if (!page.examples) return null;

  return (
    <section className="px-6 py-16" style={{ background: "var(--bg2)" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Examples"
          title={`${page.keyword} examples`}
          text="Use these examples as practical starting points for campaign visuals, product work, editorial images, and creative direction."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {page.examples.map((example) => (
            <article
              key={example.resourceId}
              className="overflow-hidden rounded-2xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <ImagePlaceholder
                resourceId={example.resourceId}
                alt={example.label}
                aspectRatio="4/3"
                className="rounded-none"
              />
              <div className="p-5">
                <h3 className="mb-2 font-bold">{example.label}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {example.prompt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function normalizeDateTime(date?: string): string | undefined {
  if (!date) return undefined;
  if (date.includes("T")) return date;
  return `${date}T00:00:00Z`;
}

function SeoJsonLd({ page }: { page: SeoContentPageData }) {
  const pageUrl = `${site.url}${page.path}`;
  const logoUrl = `${site.url}${site.logo}`;
  const headline = page.headline ?? page.title;

  const baseSchemas: Record<string, unknown>[] = [];

  if (page.schemaType === "Article") {
    const author = page.author ?? { name: site.name, url: site.url };
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline,
      description: page.intro,
      image: logoUrl,
      mainEntityOfPage: pageUrl,
      url: pageUrl,
      datePublished: normalizeDateTime(page.publishedAt),
      dateModified: normalizeDateTime(page.updatedAt ?? page.publishedAt),
      author: {
        "@type": "Person",
        name: author.name,
        url: author.url ?? site.url,
      },
      publisher: {
        "@type": "Organization",
        name: site.name,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
      },
    };
    baseSchemas.push(articleSchema);
  } else {
    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url: pageUrl,
      description: page.intro,
      about: page.keyword,
      isPartOf: {
        "@type": "WebSite",
        name: site.name,
        url: site.url,
      },
    };
    baseSchemas.push(webPageSchema);
  }

  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    baseSchemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${site.url}${crumb.path}`,
      })),
    });
  }

  if (page.faqs.length > 0) {
    baseSchemas.push({
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
    });
  }

  return (
    <>
      {baseSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
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
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p
        className="mb-4 text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--accent)" }}
      >
        {eyebrow}
      </p>
      <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
        {title}
      </h2>
      <p
        className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        {text}
      </p>
    </div>
  );
}

function formatArticleDate(date?: string): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(normalizeDateTime(date) ?? date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function ArticleHeader({ page }: { page: SeoContentPageData }) {
  const breadcrumbs =
    page.breadcrumbs && page.breadcrumbs.length > 0
      ? page.breadcrumbs
      : [
          { name: "Home", path: "/" },
          { name: page.title, path: page.path },
        ];
  const updatedAt = formatArticleDate(page.updatedAt ?? page.publishedAt);
  const metaItems = [
    updatedAt ? `Updated: ${updatedAt}` : undefined,
    page.readingTime ? `Reading time: ${page.readingTime}` : undefined,
    `Author: ${page.author?.name ?? site.name}`,
  ].filter(Boolean);

  return (
    <section className="px-6 pb-14 pt-24" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-3 text-sm font-semibold md:text-base"
          style={{ color: "var(--muted)" }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={`${crumb.path}-${index}`} className="flex items-center gap-3">
                {isLast ? (
                  <span style={{ color: "var(--text)" }}>{crumb.name}</span>
                ) : (
                  <Link href={crumb.path} className="transition-colors hover:text-primary">
                    {crumb.name}
                  </Link>
                )}
                {!isLast && <span style={{ color: "var(--muted2)" }}>/</span>}
              </span>
            );
          })}
        </nav>

        <h1 className="max-w-5xl text-left text-4xl font-extrabold tracking-tight leading-tight md:text-6xl lg:text-7xl">
          {page.headline ?? page.title}
        </h1>

        <p
          className="mt-6 text-left text-sm font-semibold md:text-base"
          style={{ color: "var(--muted)" }}
        >
          {metaItems.join(" | ")}
        </p>

        <div
          className="mt-8 max-w-5xl rounded-2xl p-6 text-left"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border2)",
          }}
        >
          <p className="text-lg leading-relaxed md:text-xl" style={{ color: "var(--text)" }}>
            <strong>Bottom line up front:</strong> {page.intro}
          </p>
        </div>
      </div>
    </section>
  );
}

export function SeoContentPage({ page }: { page: SeoContentPageData }) {
  return (
    <>
      <SeoJsonLd page={page} />
      <div className="site-marketing">
        {page.articleHeader ? (
          <ArticleHeader page={page} />
        ) : (
          <section
            className={`relative overflow-hidden px-6 pt-28 text-center ${
              page.examplesFirst ? "pb-12" : "pb-20"
            }`}
            style={{ background: "var(--bg2)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(124,92,252,0.13) 0%, rgba(10,10,15,0) 36%), radial-gradient(circle at 52% 12%, rgba(56,189,248,0.13), transparent 34%)",
              }}
            />
            <div className="relative mx-auto max-w-5xl">
              <p
                className="mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  background: "rgba(124,92,252,0.12)",
                  border: "1px solid rgba(124,92,252,0.28)",
                  color: "var(--accent)",
                }}
              >
                <Sparkles className="h-4 w-4" />
                {page.eyebrow}
              </p>
              <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl lg:leading-tight">
                {page.headline ?? page.title}
              </h1>
              <p
                className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed md:text-xl"
                style={{ color: "var(--muted)" }}
              >
                {page.intro}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {page.heroPoints.map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    <CheckCircle2
                      className="h-4 w-4"
                      style={{ color: "var(--accent)" }}
                    />
                    {point}
                  </span>
                ))}
              </div>
              {(page.primaryCta || page.secondaryCta) && (
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  {page.primaryCta && (
                    <Link
                      href={page.primaryCta.href}
                      className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold text-white grad-bg"
                    >
                      {page.primaryCta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {page.secondaryCta && (
                    <Link
                      href={page.secondaryCta.href}
                      className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base transition-colors"
                      style={{
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                      }}
                    >
                      {page.secondaryCta.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {page.examplesFirst && <ExamplesSection page={page} />}

        {page.sections.map((section, index) => (
          <section
            key={section.title}
            className="px-6 py-24"
            style={{
              background: index % 2 === 0 ? "var(--bg)" : "var(--bg2)",
            }}
          >
            <div className="mx-auto max-w-6xl">
              <SectionHeader
                eyebrow={section.eyebrow}
                title={section.title}
                text={section.text}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <article
                    key={item.title}
                    className="card-hover rounded-2xl p-6"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <ImageIcon
                      className="mb-5 h-7 w-7"
                      style={{ color: "var(--cyan)" }}
                    />
                    <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        {!page.examplesFirst && <ExamplesSection page={page} />}

        {page.comparison && (
          <section className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
              <SectionHeader
                eyebrow="Comparison"
                title={page.comparison.title}
                text="A side by side view helps separate practical workflow differences from branding language."
              />
              <div
                className="overflow-hidden rounded-2xl"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="grid gap-3 p-5 font-bold md:grid-cols-3">
                  {page.comparison.headers.map((header) => (
                    <div key={header}>{header}</div>
                  ))}
                </div>
                {page.comparison.rows.map((row) => (
                  <div
                    key={row[0]}
                    className="grid gap-3 p-5 md:grid-cols-3"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    {row.map((cell, index) => (
                      <p
                        key={`${row[0]}-${index}`}
                        className="text-sm leading-relaxed"
                        style={{
                          color: index === 0 ? "var(--text)" : "var(--muted)",
                        }}
                      >
                        {cell}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-6 py-24" style={{ background: "var(--bg2)" }}>
          <div className="mx-auto max-w-4xl">
            <SectionHeader
              eyebrow="FAQ"
              title={`FAQ about ${page.keyword}`}
              text="Short answers to the practical questions teams ask before using the generator in production."
            />
            <div className="space-y-3">
              {page.faqs.map((item) => (
                <article
                  key={item.q}
                  className="rounded-2xl p-6"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex gap-3">
                    <HelpCircle
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                    <div>
                      <h3 className="mb-3 font-bold">{item.q}</h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--muted)" }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-5 text-3xl font-extrabold tracking-tight md:text-5xl">
              Start creating with GPT Image 2
            </h2>
            <p
              className="mb-8 text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Open the generator, write a focused prompt, and turn the ideas
              from this page into usable AI images for real projects.
            </p>
            <Link
              href="/gpt-image-2"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold text-white grad-bg"
            >
              Try GPT Image 2
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
