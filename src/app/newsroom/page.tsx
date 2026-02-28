"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { postsQuery, type SanityPostListItem } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import PublicPageShell from "@/components/layout/PublicPageShell";

const FALLBACK_CATEGORIES = ["All", "Product", "Policy", "Research"];

function formatDate(dateIso?: string) {
  if (!dateIso) return "";
  try {
    return new Date(dateIso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [posts, setPosts] = useState<SanityPostListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const data = await sanityClient.fetch<SanityPostListItem[]>(postsQuery);
        if (!cancelled) setPosts(data ?? []);
      } catch {
        // Sanity unreachable or misconfigured — show empty state
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    posts.forEach((p) => p.category && set.add(p.category));
    return set.size > 1 ? Array.from(set) : FALLBACK_CATEGORIES;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory, posts]);

  const featured = posts[0];

  return (
    <PublicPageShell>
      <div style={{ background: "#faf8f4", color: "#1c2b23", minHeight: "100vh" }}>

        {/* Hero */}
        <header
          style={{
            background: "#2d4a3e",
            paddingTop: 80,
            paddingBottom: 88,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                fontFamily: "inherit",
              }}
            >
              Newsroom
            </h1>
            <p
              style={{
                marginTop: 12,
                fontSize: 17,
                color: "rgba(255,255,255,.75)",
                fontFamily: "inherit",
              }}
            >
              Stories, updates, and insights from the Procur team.
            </p>

            {/* Category filter chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 24,
              }}
            >
              {categories.map((label) => {
                const isActive = activeCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveCategory(label)}
                    aria-pressed={isActive}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      background: isActive ? "#d4783c" : "rgba(255,255,255,.12)",
                      color: isActive ? "#fff" : "rgba(245,241,234,.8)",
                      border: isActive ? "none" : "1px solid rgba(255,255,255,.15)",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Content overlapping hero */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            marginTop: -40,
          }}
        >

          {/* Loading skeleton */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "#ece9e3",
                    height: 220,
                    borderRadius: 12,
                  }}
                />
              ))}
            </div>
          )}

          {/* Featured post */}
          {!loading && featured && (
            <Link
              href={`/blog/${featured.slug}`}
              style={{
                display: "flex",
                flexDirection: "row",
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 12,
                overflow: "hidden",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* Image side */}
              <div
                style={{
                  position: "relative",
                  width: "45%",
                  flexShrink: 0,
                  height: 280,
                }}
              >
                {featured.mainImage ? (
                  <Image
                    src={urlForImage(featured.mainImage)
                      .width(1200)
                      .height(800)
                      .fit("crop")
                      .url()}
                    alt={featured.imageAlt || featured.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    priority
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#ece9e3" }} />
                )}
              </div>

              {/* Content side */}
              <div
                style={{
                  flex: 1,
                  padding: "32px 36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#2d4a3e",
                  }}
                >
                  {featured.category || "Article"}
                </span>
                <h2
                  style={{
                    marginTop: 8,
                    marginBottom: 0,
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#1c2b23",
                    fontFamily: "inherit",
                    lineHeight: 1.3,
                  }}
                >
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p
                    style={{
                      marginTop: 10,
                      fontSize: 14,
                      color: "rgba(28,43,35,.65)",
                      lineHeight: 1.6,
                    }}
                  >
                    {featured.excerpt}
                  </p>
                )}
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "rgba(28,43,35,.45)",
                  }}
                >
                  {formatDate(featured.publishedAt)}
                </p>
                <span
                  style={{
                    marginTop: 16,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#d4783c",
                    textDecoration: "none",
                  }}
                >
                  Read more
                </span>
              </div>
            </Link>
          )}

          {/* Posts grid */}
          {!loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
                marginTop: 40,
              }}
            >
              {filteredPosts.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    background: "#f5f1ea",
                    border: "1px solid #e8e4dc",
                    borderRadius: 12,
                    padding: "48px 32px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontWeight: 600, color: "#1c2b23", margin: 0 }}>
                    No posts yet
                  </p>
                  <p
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      color: "rgba(28,43,35,.55)",
                    }}
                  >
                    Check back soon for new articles from the team.
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    style={{
                      display: "block",
                      background: "#f5f1ea",
                      border: "1px solid #e8e4dc",
                      borderRadius: 12,
                      overflow: "hidden",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {/* Post image */}
                    <div style={{ position: "relative", height: 176 }}>
                      {post.mainImage ? (
                        <Image
                          src={urlForImage(post.mainImage)
                            .width(800)
                            .height(500)
                            .fit("crop")
                            .url()}
                          alt={post.imageAlt || post.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "#ece9e3",
                          }}
                        />
                      )}
                    </div>

                    {/* Post content */}
                    <div style={{ padding: 16 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "#2d4a3e",
                        }}
                      >
                        {post.category || "Article"}
                      </span>
                      <h3
                        style={{
                          marginTop: 6,
                          marginBottom: 0,
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#1c2b23",
                          fontFamily: "inherit",
                          lineHeight: 1.35,
                        }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p
                          style={{
                            marginTop: 8,
                            fontSize: 13,
                            color: "rgba(28,43,35,.6)",
                            lineHeight: 1.55,
                            overflow: "hidden",
                            maxHeight: "calc(1.55em * 3)",
                          }}
                        >
                          {post.excerpt}
                        </p>
                      )}
                      <p
                        style={{
                          marginTop: 10,
                          fontSize: 11,
                          color: "rgba(28,43,35,.4)",
                        }}
                      >
                        {formatDate(post.publishedAt)}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#d4783c",
                        }}
                      >
                        Read more &rarr;
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 48,
              marginBottom: 80,
            }}
          >
            <button
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: 13,
                color: "#1c2b23",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Previous
            </button>
            <button
              style={{
                background: "#f5f1ea",
                border: "1px solid #e8e4dc",
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: 13,
                color: "#1c2b23",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
