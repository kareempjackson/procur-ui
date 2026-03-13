import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import {
  postBySlugQuery,
  postSlugsQuery,
  type SanityPost,
  type SanityPostSlug,
} from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import PublicPageShell from "@/components/layout/PublicPageShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://procur.io";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// ── Pre-render all published slugs at build time ────────────────
export async function generateStaticParams() {
  try {
    const posts = await sanityClient.fetch<SanityPostSlug[]>(postSlugsQuery);
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ── Per-post SEO metadata ───────────────────────────────────────
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch<SanityPost>(postBySlugQuery, { slug });

  const title = post?.seoTitle || post?.title || slug.replace(/-/g, " ");
  const description = post?.seoDescription || post?.excerpt || "";
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  // Prefer explicit ogImage, fall back to mainImage
  const imageAsset = post?.ogImage || post?.mainImage;
  const ogImageUrl = imageAsset
    ? urlForImage(imageAsset).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: post?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      publishedTime: post?.publishedAt,
      authors: post?.author?.name ? [post.author.name] : undefined,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

function formatDate(dateIso?: string) {
  if (!dateIso) return "";
  try {
    return new Date(dateIso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ margin: "0 0 1.75em", fontSize: 18, lineHeight: 1.78, color: "rgba(28,43,35,.8)", fontFamily: "inherit" }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 style={{ margin: "2.5em 0 0.65em", fontSize: 30, fontWeight: 700, color: "#1c2b23", letterSpacing: "-0.025em", lineHeight: 1.2, fontFamily: "inherit" }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ margin: "2em 0 0.5em", fontSize: 22, fontWeight: 700, color: "#1c2b23", letterSpacing: "-0.015em", lineHeight: 1.3, fontFamily: "inherit" }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ margin: "1.8em 0 0.4em", fontSize: 18, fontWeight: 700, color: "#1c2b23", fontFamily: "inherit" }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{
        margin: "2.2em 0",
        padding: "2px 0 2px 24px",
        borderLeft: "2px solid #c26838",
        fontStyle: "italic",
        fontSize: 20,
        lineHeight: 1.65,
        color: "rgba(28,43,35,.65)",
      }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ margin: "0 0 1.75em", paddingLeft: 24, listStyleType: "disc" }}>{children}</ul>
    ),
    number: ({ children }) => (
      <ol style={{ margin: "0 0 1.75em", paddingLeft: 24 }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ marginBottom: "0.45em", fontSize: 18, lineHeight: 1.7, color: "rgba(28,43,35,.8)" }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ marginBottom: "0.45em", fontSize: 18, lineHeight: 1.7, color: "rgba(28,43,35,.8)" }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#1c2b23" }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
    code: ({ children }) => (
      <code style={{ fontFamily: "ui-monospace,monospace", fontSize: "0.875em", background: "#ede9e2", padding: "2px 6px", borderRadius: 4, color: "#2d4a3e" }}>
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer"
        style={{ color: "#c26838", textDecoration: "underline", textDecorationColor: "rgba(194,104,56,.35)", textUnderlineOffset: 3 }}>
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure style={{ margin: "2.5em -40px" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }}>
            <Image
              src={urlForImage(value).width(1400).height(787).fit("crop").url()}
              alt={value.alt || ""}
              fill
              style={{ objectFit: "cover" }}
              sizes="800px"
            />
          </div>
          {value.caption && (
            <figcaption style={{ marginTop: 12, fontSize: 13, color: "rgba(28,43,35,.4)", textAlign: "center" }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await sanityClient.fetch<SanityPost>(postBySlugQuery, { slug });

  const imageAsset = post?.ogImage || post?.mainImage;
  const ogImageUrl = imageAsset
    ? urlForImage(imageAsset).width(1200).height(630).fit("crop").url()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.seoTitle || post?.title,
    description: post?.seoDescription || post?.excerpt,
    image: ogImageUrl,
    datePublished: post?.publishedAt,
    dateModified: post?.publishedAt,
    url: `${SITE_URL}/blog/${slug}`,
    author: post?.author?.name
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: "Procur" },
    publisher: {
      "@type": "Organization",
      name: "Procur",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logos/procur-logo.svg` },
    },
  };

  return (
    <PublicPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ background: "#faf8f4", minHeight: "100vh" }}>

        {/* ── Article header ── */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 40px 0" }}>

          {/* Back */}
          <div style={{ marginBottom: 40 }}>
            <Link href="/blog" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 500, color: "rgba(28,43,35,.45)",
              textDecoration: "none",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Blog
            </Link>
          </div>

          {/* Category */}
          {post?.category && (
            <div style={{ marginBottom: 18 }}>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.1em",
                color: "#c26838",
              }}>
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 style={{
            margin: 0,
            fontSize: "clamp(32px, 4.5vw, 48px)",
            fontWeight: 700,
            color: "#1c2b23",
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            fontFamily: "inherit",
          }}>
            {post?.title || slug.replace(/-/g, " ")}
          </h1>

          {/* Excerpt */}
          {post?.excerpt && (
            <p style={{
              marginTop: 24, fontSize: 20, lineHeight: 1.6,
              color: "rgba(28,43,35,.55)", fontStyle: "italic",
            }}>
              {post.excerpt}
            </p>
          )}

          {/* Author + date */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            marginTop: 32, paddingTop: 32,
            borderTop: "1px solid #e8e4dc",
          }}>
            {post?.author?.image && (
              <div style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <Image
                  src={urlForImage(post.author.image).width(76).height(76).fit("crop").url()}
                  alt={post.author.name || ""}
                  fill style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <div>
              {post?.author?.name && (
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1c2b23" }}>
                  {post.author.name}
                </p>
              )}
              {post?.publishedAt && (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(28,43,35,.4)" }}>
                  {formatDate(post.publishedAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Hero image ── */}
        {post?.mainImage && (
          <div style={{ maxWidth: 1100, margin: "48px auto 0", padding: "0 40px" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/8", borderRadius: 16, overflow: "hidden", background: "#e8e4dc" }}>
              <Image
                src={urlForImage(post.mainImage).width(2000).height(1000).fit("crop").url()}
                alt={post.imageAlt || post?.title || ""}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1100px) 100vw, 1100px"
                priority
              />
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 40px 120px" }}>
          {post?.body ? (
            <PortableText value={post.body} components={ptComponents} />
          ) : (
            <p style={{ color: "rgba(28,43,35,.4)", fontStyle: "italic", fontSize: 17 }}>
              This post has no content yet.
            </p>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 80, paddingTop: 32,
            borderTop: "1px solid #e8e4dc",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <Link href="/blog" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 600, color: "#2d4a3e", textDecoration: "none",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to blog
            </Link>
          </div>
        </div>

      </div>
    </PublicPageShell>
  );
}
