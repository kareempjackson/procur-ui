"use client";

import React from "react";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import { StarIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

interface DemoSeller {
  id: string;
  business_name: string;
  display_name: string;
  slug: string;
  description: string;
  logo_url: string;
  location: string;
  rating: number;
  total_reviews: number;
  specialties: string[];
  is_verified: boolean;
  is_organic_certified: boolean;
  is_local: boolean;
}

export default function DemoSellersPage() {
  const demoSellers: DemoSeller[] = [
    {
      id: "1",
      business_name: "Green Valley Organic Farm",
      display_name: "Green Valley Organic Farm",
      slug: "green-valley-organic-farm",
      description:
        "Family-owned organic farm specializing in fresh, locally-grown produce with 25+ years of sustainable farming.",
      logo_url:
        "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200&h=200&fit=crop&crop=center",
      location: "Green Valley, CA",
      rating: 4.8,
      total_reviews: 127,
      specialties: ["Organic Vegetables", "Fresh Fruits", "Herbs & Spices"],
      is_verified: true,
      is_organic_certified: true,
      is_local: true,
    },
    {
      id: "2",
      business_name: "Sunrise Citrus Co",
      display_name: "Sunrise Citrus Co",
      slug: "sunrise-citrus-co",
      description:
        "Premium citrus grower specializing in oranges, lemons, and grapefruits. Serving the community for over 30 years.",
      logo_url:
        "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=200&h=200&fit=crop&crop=center",
      location: "Riverside, CA",
      rating: 4.6,
      total_reviews: 89,
      specialties: ["Citrus Fruits", "Seasonal Produce", "Bulk Orders"],
      is_verified: true,
      is_organic_certified: false,
      is_local: true,
    },
    {
      id: "3",
      business_name: "Mountain View Dairy",
      display_name: "Mountain View Dairy",
      slug: "mountain-view-dairy",
      description:
        "Local dairy farm producing fresh milk, cheese, and eggs from grass-fed cows and free-range chickens.",
      logo_url:
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200&h=200&fit=crop&crop=center",
      location: "Petaluma, CA",
      rating: 4.9,
      total_reviews: 156,
      specialties: ["Dairy Products", "Free-Range Eggs", "Artisan Cheese"],
      is_verified: true,
      is_organic_certified: true,
      is_local: true,
    },
    {
      id: "4",
      business_name: "Coastal Berry Farms",
      display_name: "Coastal Berry Farms",
      slug: "coastal-berry-farms",
      description:
        "Specialty berry farm growing the finest strawberries, blueberries, and raspberries along the California coast.",
      logo_url:
        "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop&crop=center",
      location: "Half Moon Bay, CA",
      rating: 4.7,
      total_reviews: 203,
      specialties: ["Berries", "Seasonal Fruits", "Organic Produce"],
      is_verified: true,
      is_organic_certified: true,
      is_local: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-medium text-[var(--secondary-black)] mb-4 text-balance">
            Meet Our Sellers
          </h1>
          <p className="text-xl text-[var(--primary-base)] max-w-3xl leading-relaxed">
            Discover local producers and their stories. Each seller page
            showcases their specialties, certifications, and available products.
          </p>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoSellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/seller/${seller.slug}`}
              className="group block bg-white rounded-3xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={seller.logo_url}
                    alt={`${seller.display_name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {seller.display_name}
                        </h3>
                        {seller.is_verified && (
                          <CheckBadgeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPinIcon className="h-3.5 w-3.5" />
                        <span className="truncate">{seller.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <StarIcon className="h-4 w-4 text-gray-900" />
                      <span className="text-sm font-medium text-gray-900">
                        {seller.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-2">
                {seller.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {seller.is_organic_certified && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    Organic Certified
                  </span>
                )}
                {seller.is_local && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    Local Producer
                  </span>
                )}
              </div>

              {/* Specialties */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {seller.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-block px-2.5 py-1 text-xs text-gray-600 bg-gray-50 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                  {seller.specialties.length > 3 && (
                    <span className="inline-block px-2.5 py-1 text-xs text-gray-500 bg-gray-50 rounded-full">
                      +{seller.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {seller.total_reviews} reviews
                  </span>
                  <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-[var(--primary-accent2)] transition-colors">
                    View profile
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-gray-900 mb-4">
              What makes our seller pages special
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every seller page is designed to showcase their unique story and
              make it easy for customers to discover and connect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Rich Seller Profiles
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Complete business stories, certifications, and contact
                information to build trust
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Beautiful Product Catalogs
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Browse products with detailed descriptions, pricing, and
                real-time availability
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Direct Communication
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Request custom produce and special orders directly from sellers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Social Proof
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Customer reviews and ratings help buyers make confident
                decisions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trust & Verification
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Certifications and verification badges build credibility and
                trust
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mobile Optimized
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Perfect experience across all devices with responsive design
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
