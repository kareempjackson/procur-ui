"use client";
import { useEffect, useMemo, useState } from "react";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { postsQuery, type SanityPostListItem } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";

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
        if (!cancelled) setPosts(data);
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
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      {/* Hero */}
      <header className="border-b border-gray-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500 font-medium">
                Blog
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[var(--secondary-black)]">
                Insights from the Procur team
              </h1>
              <p className="mt-4 max-w-2xl text-gray-600 text-lg">
                Stories on procurement, supply chains, logistics,
                sustainability, and the future of fresh.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((label) => {
                const isActive = activeCategory === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveCategory(label)}
                    className={`${
                      isActive
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } px-4 py-2 rounded-full border border-gray-200 text-sm transition-colors`}
                    aria-pressed={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Featured */}
      {featured ? (
        <section className="max-w-7xl mx-auto px-6 mt-10">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-12 gap-8 items-stretch bg-white rounded-2xl overflow-hidden border border-gray-200"
          >
            <div className="md:col-span-7 relative h-72 md:h-auto">
              {featured.mainImage ? (
                <Image
                  src={urlForImage(featured.mainImage)
                    .width(1600)
                    .height(900)
                    .fit("crop")
                    .url()}
                  alt={featured.imageAlt || featured.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
            <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {featured.category || "Article"}
              </div>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-[var(--secondary-black)] group-hover:underline">
                {featured.title}
              </h2>
              {featured.excerpt ? (
                <p className="mt-3 text-gray-600 text-base">
                  {featured.excerpt}
                </p>
              ) : null}
              <div className="mt-4 text-sm text-gray-500">
                {formatDate(featured.publishedAt)}
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-14 mb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                <p className="text-gray-900 font-medium">No posts yet</p>
                <p className="mt-1 text-gray-500 text-sm">
                  Check back soon for new articles from the team.
                </p>
              </div>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-44">
                  {post.mainImage ? (
                    <Image
                      src={urlForImage(post.mainImage)
                        .width(800)
                        .height(500)
                        .fit("crop")
                        .url()}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <span className="absolute left-3 top-3 text-[11px] font-semibold uppercase tracking-wider bg-white/90 text-gray-800 px-2.5 py-1 rounded-full border border-white">
                    {post.category || "Article"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[var(--secondary-black)] group-hover:underline">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <div className="mt-4 text-sm text-gray-500">
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
