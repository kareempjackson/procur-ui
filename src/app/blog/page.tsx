"use client";
import { useMemo, useState } from "react";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import Link from "next/link";
import Image from "next/image";

const categories = ["All", "Product", "Policy", "Research"];

const featured = {
  title: "Introducing Procur Insights: Market trends in global produce",
  category: "Announcements",
  date: "Sep 28, 2025",
  description:
    "A new resource hub for procurement leaders, covering logistics, compliance, and fresh market data.",
  image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  href: "/blog/procur-insights-market-trends",
};

const posts = [
  {
    title: "Building trust in cross-border produce procurement",
    category: "Policy",
    date: "Sep 26, 2025",
    description:
      "How standardized quality checks and transparent documentation reduce friction between buyers and suppliers.",
    href: "/blog/trust-in-cross-border-procurement",
    image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
  {
    title: "Real-time logistics visibility with Procur Tracking",
    category: "Product",
    date: "Sep 24, 2025",
    description:
      "We’re rolling out shipment telemetry and automated ETAs for time-sensitive goods.",
    href: "/blog/realtime-logistics-visibility",
    image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
  {
    title: "Sustainability metrics that actually matter",
    category: "Research",
    date: "Sep 20, 2025",
    description:
      "From farm inputs to cold chain efficiency — measuring sustainability with outcomes instead of labels.",
    href: "/blog/sustainability-metrics-that-matter",
    image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
  {
    title: "How a national grocer scaled local sourcing",
    category: "Case Study",
    date: "Sep 18, 2025",
    description:
      "A look at how regional partnerships and demand planning reduced waste by 14%.",
    href: "/blog/national-grocer-local-sourcing",
    image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
  {
    title: "Compliance automation for import programs",
    category: "Product",
    date: "Sep 15, 2025",
    description:
      "Automatically validate certifications, country-of-origin, and treatment requirements.",
    href: "/blog/compliance-automation-import-programs",
    image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
  {
    title: "Market outlook: Q4 citrus supply dynamics",
    category: "Societal Impacts",
    date: "Sep 12, 2025",
    description:
      "Weather patterns, freight rates, and demand signals shaping the citrus market.",
    href: "/blog/q4-citrus-supply-dynamics",
    image: "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  },
];

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

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
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <Link
          href={featured.href}
          className="group grid md:grid-cols-12 gap-8 items-stretch bg-white rounded-2xl overflow-hidden border border-gray-200"
        >
          <div className="md:col-span-7 relative h-72 md:h-auto">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {featured.category}
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-[var(--secondary-black)] group-hover:underline">
              {featured.title}
            </h2>
            <p className="mt-3 text-gray-600 text-base">
              {featured.description}
            </p>
            <div className="mt-4 text-sm text-gray-500">{featured.date}</div>
          </div>
        </Link>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-14 mb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-44">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 text-[11px] font-semibold uppercase tracking-wider bg-white/90 text-gray-800 px-2.5 py-1 rounded-full border border-white">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)] group-hover:underline">
                  {post.title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-4 text-sm text-gray-500">{post.date}</div>
              </div>
            </Link>
          ))}
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
