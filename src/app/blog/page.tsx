"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { postsQuery, type SanityPostListItem } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import PublicPageShell from "@/components/layout/PublicPageShell";

const FALLBACK_CATEGORIES = ["All", "Product", "Policy", "Research", "Farmer Spotlights"];

function formatDate(dateIso?: string) {
  if (!dateIso) return "";
  try {
    return new Date(dateIso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return ""; }
}

const CAT_COLOR: Record<string, string> = {
  "Farmer Spotlights": "#c26838",
  "Product": "#2d4a3e",
  "Policy": "#407178",
  "Research": "#6b5ea8",
};
function catColor(c?: string) { return c ? (CAT_COLOR[c] ?? "#c26838") : "#c26838"; }

/* ── Skeleton ── */
function Skel({ w = "100%", h = 20, r = 6 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div className="blog-skel" style={{
      width: w, height: h, borderRadius: r,
      background: "#e4e0d8", flexShrink: 0,
    }} />
  );
}

export default function BlogIndexPage() {
  const [active, setActive] = useState("All");
  const [posts, setPosts] = useState<SanityPostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    sanityClient.fetch<SanityPostListItem[]>(postsQuery)
      .then(d => { if (!cancelled) setPosts(d ?? []); })
      .catch(() => { if (!cancelled) setPosts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const s = new Set(["All"]);
    posts.forEach(p => p.category && s.add(p.category));
    return s.size > 1 ? Array.from(s) : FALLBACK_CATEGORIES;
  }, [posts]);

  const filtered = useMemo(() =>
    active === "All" ? posts : posts.filter(p => p.category === active),
    [active, posts]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <PublicPageShell>
      <div style={{ background: "#faf8f4", minHeight: "100vh", fontFamily: "inherit" }}>

        {/* ── Header ── */}
        <div>
          <div className="blog-outer" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 48px 0" }}>
            <h1 style={{
              margin: 0, fontFamily: "inherit",
              fontSize: "clamp(42px, 5.5vw, 68px)",
              fontWeight: 700, letterSpacing: "-0.035em",
              lineHeight: 1, color: "#1c2b23",
            }}>
              Blog
            </h1>
            <p style={{ margin: "14px 0 0", fontSize: 16, color: "rgba(28,43,35,.48)", lineHeight: 1.5 }}>
              Stories, updates, and insights from the Procur team.
            </p>

            {/* Filter chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
              {categories.map(label => {
                const on = active === label;
                return (
                  <button key={label} onClick={() => setActive(label)}
                    aria-pressed={on} className="blog-tab"
                    style={{
                      padding: "7px 20px", borderRadius: 999,
                      fontSize: 13, fontWeight: on ? 600 : 400,
                      background: on ? "#1c2b23" : "transparent",
                      color: on ? "#faf8f4" : "rgba(28,43,35,.5)",
                      border: on ? "1.5px solid #1c2b23" : "1.5px solid #d5d0c5",
                      marginBottom: 24,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="blog-outer" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 140px" }}>

          {/* Loading */}
          {loading && (
            <div style={{ paddingTop: 72 }}>
              <div style={{ display: "flex", gap: 60, paddingBottom: 0 }}>
                <Skel w="54%" h={400} r={14} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, paddingTop: 16 }}>
                  <Skel w="30%" h={10} />
                  <Skel h={38} r={8} />
                  <Skel w="82%" h={38} r={8} />
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Skel h={14} /><Skel w="90%" h={14} /><Skel w="70%" h={14} />
                  </div>
                </div>
              </div>
              <div className="blog-grid-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "56px 28px", marginTop: 64 }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <Skel h={210} r={10} />
                    <Skel w="32%" h={10} />
                    <Skel h={20} /><Skel w="72%" h={20} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div style={{ paddingTop: 120, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1c2b23" }}>No posts yet</p>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: "rgba(28,43,35,.42)" }}>
                Check back soon for new articles.
              </p>
            </div>
          )}

          {/* ── Featured ── */}
          {!loading && featured && (
            <Link href={`/blog/${featured.slug}`} className="blog-feat"
              style={{ display: "block", marginTop: 56, paddingBottom: 64 }}
            >
              <div className="blog-feat-row" style={{ display: "flex", gap: 64, alignItems: "center" }}>

                <div className="blog-feat-img-wrap" style={{ width: "54%", height: 420, flexShrink: 0 }}>
                  <div className="blog-feat-img" style={{ width: "100%", height: "100%" }}>
                    <div className="blog-feat-img-inner">
                      {featured.mainImage
                        ? <Image src={urlForImage(featured.mainImage).width(1400).height(900).fit("crop").url()}
                            alt={featured.imageAlt || featured.title} fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width:860px) 100vw, 54vw" priority />
                        : null}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {featured.category && (
                    <span style={{
                      display: "inline-block", marginBottom: 20,
                      padding: "4px 12px", borderRadius: 999,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      background: `${catColor(featured.category)}18`,
                      color: catColor(featured.category),
                    }}>
                      {featured.category}
                    </span>
                  )}
                  <h2 className="blog-feat-title" style={{
                    margin: 0, fontFamily: "inherit",
                    fontSize: "clamp(24px, 2.6vw, 36px)",
                    fontWeight: 700, color: "#1c2b23",
                    lineHeight: 1.2, letterSpacing: "-0.025em",
                  }}>
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p style={{
                      margin: "16px 0 0", fontSize: 15, lineHeight: 1.72,
                      color: "rgba(28,43,35,.54)",
                      display: "-webkit-box",
                      WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {featured.excerpt}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 28 }}>
                    <span style={{ fontSize: 13, color: "rgba(28,43,35,.38)" }}>
                      {formatDate(featured.publishedAt)}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#c26838", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      Read article
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ── Grid ── */}
          {!loading && rest.length > 0 && (
            <div className="blog-grid-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "52px 32px", marginTop: 56 }}>
              {rest.map(post => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="blog-card">
                  <div className="blog-card-img" style={{ height: 220, marginBottom: 20 }}>
                    <div className="blog-card-img-inner">
                      {post.mainImage
                        ? <Image src={urlForImage(post.mainImage).width(800).height(530).fit("crop").url()}
                            alt={post.imageAlt || post.title} fill style={{ objectFit: "cover" }}
                            sizes="(max-width:560px) 100vw, (max-width:860px) 50vw, 33vw" />
                        : null}
                    </div>
                  </div>
                  {post.category && (
                    <span style={{
                      display: "inline-block", marginBottom: 10,
                      padding: "3px 10px", borderRadius: 999,
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      background: `${catColor(post.category)}18`,
                      color: catColor(post.category),
                    }}>
                      {post.category}
                    </span>
                  )}
                  <h3 className="blog-card-title" style={{
                    margin: 0, fontFamily: "inherit",
                    fontSize: 17, fontWeight: 700,
                    color: "#1c2b23", lineHeight: 1.35,
                    letterSpacing: "-0.015em",
                  }}>
                    {post.title}
                  </h3>
                  <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(28,43,35,.38)" }}>
                    {formatDate(post.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </PublicPageShell>
  );
}
