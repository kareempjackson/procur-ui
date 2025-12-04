"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
import { useAppSelector } from "@/store";
import { selectAuthUser } from "@/store/slices/authSlice";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const user = useAppSelector(selectAuthUser);

  const hero = {
    headline: "Strengthening regional food supply, together.",
    subcopy:
      "Procur is building trusted connections between producers and buyers, starting locally and scaling responsibly.",
    supportingText:
      "We’re launching in beta to work closely with early suppliers and buyers to build a more reliable, transparent food system.",
    image: "/images/backgrounds/jacopo-maiarelli--gOUx23DNks-unsplash (1).jpg",
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Top Notice Bar */}
      <div className="bg-[var(--secondary-muted-edge)] text-white text-center py-2 text-sm">
        Procur is in limited beta — partnering closely with regional buyers and
        suppliers.
      </div>

      {/* Keep existing navigation */}
      {user?.accountType === "buyer" ? (
        <BuyerTopNavigation />
      ) : user?.accountType === "seller" ? (
        <SellerTopNavigation />
      ) : (
        <TopNavigation />
      )}

      <main>
        {/* Hero: large image + calm beta story */}
        <section
          className="py-4 sm:py-6 px-4 sm:px-6 relative"
          aria-label="Hero"
        >
          <div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[70vh] rounded-2xl">
            {/* Background image + gradient, safely clipped to rounded container */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <Image
                src={hero.image}
                alt="Regional producers and buyers working together"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/10" />
            </div>

            {/* Foreground content (not clipped on small screens) */}
            <div className="relative z-10 flex h-full items-end md:items-center">
              <div className="max-w-[1280px] mx-auto px-6 sm:px-12 w-full pb-10 sm:pb-14">
                <div className="text-white max-w-3xl space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm font-semibold text-white/90 backdrop-blur-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary-accent2)]" />
                    <span>Early regional beta</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance">
                    {hero.headline}
                  </h1>
                  <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/95 text-pretty font-medium">
                    {hero.subcopy}
                  </p>
                  <p className="mt-4 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                    {hero.supportingText}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-6 py-3 text-sm sm:text-base font-medium hover:bg-[var(--primary-accent3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 focus:ring-offset-[var(--primary-background)] transition"
                    >
                      Apply for Beta Access
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="inline-flex items-center justify-center rounded-full bg-white/5 text-white px-6 py-3 text-sm sm:text-base font-medium border border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-[var(--primary-background)] transition"
                    >
                      Learn How It Works
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip: calm, values-based */}
        <section className="bg-[var(--secondary-soft-highlight)]/15 py-6">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm sm:text-base text-[var(--secondary-muted-edge)] justify-start sm:justify-center">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-muted-edge)]" />
                Beta launch • Limited access
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-muted-edge)]" />
                Region-first approach
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-muted-edge)]" />
                Built with buyers and producers
              </span>
            </div>
          </div>
        </section>

        {/* Problem section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[960px] mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] tracking-tight">
              Food sourcing is harder than it should be
            </h2>
            <p className="mt-4 text-[var(--secondary-muted-edge)] text-base sm:text-lg leading-relaxed">
              Regional buyers and producers are already working hard. But the
              systems around them often aren&apos;t built for trust, context, or
              long-term relationships.
            </p>
            <ul className="mt-6 space-y-3 text-[var(--secondary-black)]/85 text-base sm:text-lg">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                <span>
                  Buyers struggle to find consistent, reliable producers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                <span>
                  Producers lack direct access to serious, committed buyers.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                <span>
                  Trust, quality, and payments remain fragmented and manual.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Solution section */}
        <section className="py-16 sm:py-20 bg-[var(--primary-background)]">
          <div className="max-w-[960px] mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] tracking-tight">
              A simpler way to build trusted supply relationships
            </h2>
            <p className="mt-4 text-[var(--secondary-muted-edge)] text-base sm:text-lg leading-relaxed">
              Procur is not a public marketplace yet. During beta, we focus on
              curated relationships, verified participants, and clear
              procurement workflows instead of empty listings and simulated
              activity.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-white border border-[var(--secondary-soft-highlight)]/40 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-[var(--secondary-black)]">
                  Curated onboarding
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[var(--secondary-muted-edge)] leading-relaxed">
                  We manually review every buyer and supplier, understanding
                  real volumes, constraints, and standards before making
                  introductions.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-[var(--secondary-soft-highlight)]/40 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-[var(--secondary-black)]">
                  Direct connections
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[var(--secondary-muted-edge)] leading-relaxed">
                  We facilitate direct buyer–producer relationships instead of
                  anonymous, transactional matches.
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-[var(--secondary-soft-highlight)]/40 p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-[var(--secondary-black)]">
                  Clear expectations
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[var(--secondary-muted-edge)] leading-relaxed">
                  Quality, pricing, and fulfillment expectations are made
                  explicit so both sides know how to show up and plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="py-16 sm:py-20 bg-white border-t border-[var(--secondary-soft-highlight)]/40"
        >
          <div className="max-w-[960px] mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] tracking-tight">
              How Procur works in beta
            </h2>
            <p className="mt-4 text-[var(--secondary-muted-edge)] text-base sm:text-lg leading-relaxed">
              No search bars, categories, or empty dashboards — just a clear,
              intentional process to get the right people working together.
            </p>
            <ol className="mt-8 space-y-6">
              <li className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--secondary-black)]">
                    Apply
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-[var(--secondary-muted-edge)] leading-relaxed">
                    Buyers and suppliers apply to join the beta, sharing enough
                    context for us to understand their role in the regional food
                    system.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white text-sm font-medium">
                  2
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--secondary-black)]">
                    Verification
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-[var(--secondary-muted-edge)] leading-relaxed">
                    We review profiles, references, and needs to verify
                    participants and understand what &quot;success&quot; looks
                    like on both sides.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white text-sm font-medium">
                  3
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--secondary-black)]">
                    Introduction
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-[var(--secondary-muted-edge)] leading-relaxed">
                    We carefully connect the right buyers and producers and
                    support their early transactions so trust can grow over
                    time.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* For buyers & suppliers */}
        <section className="py-16 sm:py-20 bg-[var(--primary-background)]">
          <div className="max-w-[960px] mx-auto px-6 grid gap-12 sm:grid-cols-2">
            {/* For buyers */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--secondary-black)]">
                For buyers
              </h2>
              <ul className="mt-4 space-y-3 text-sm sm:text-base text-[var(--secondary-black)]/85">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                  <span>
                    Source from trusted regional producers, not faceless
                    listings.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                  <span>
                    Reduce supply uncertainty with curated, context-aware
                    matches.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                  <span>
                    Build long-term, relationship-driven supply instead of
                    one-off deals.
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/signup?role=buyer"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--secondary-black)] text-white px-5 py-3 text-sm sm:text-base font-medium hover:bg-[var(--secondary-muted-edge)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-black)] focus:ring-offset-2 focus:ring-offset-[var(--primary-background)] transition"
                >
                  Apply as a Buyer
                </Link>
              </div>
            </div>

            {/* For suppliers */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--secondary-black)]">
                For suppliers
              </h2>
              <ul className="mt-4 space-y-3 text-sm sm:text-base text-[var(--secondary-black)]/85">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                  <span>
                    Access buyers who are serious about regional sourcing.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                  <span>
                    Reduce middlemen while keeping relationships front and
                    center.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary-accent2)]" />
                  <span>
                    Get paid transparently with clear terms and expectations.
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/signup?role=supplier"
                  className="inline-flex items-center justify-center rounded-full bg-white text-[var(--secondary-black)] px-5 py-3 text-sm sm:text-base font-medium border border-[var(--secondary-soft-highlight)] hover:bg-[var(--primary-background)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-black)] focus:ring-offset-2 focus:ring-offset-[var(--primary-background)] transition"
                >
                  Apply as a Supplier
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Beta callout */}
        <section className="py-16 sm:py-20 bg-white border-t border-[var(--secondary-soft-highlight)]/40">
          <div className="max-w-[960px] mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-light text-[var(--secondary-black)] tracking-tight">
              Why beta?
            </h2>
            <p className="mt-4 text-[var(--secondary-muted-edge)] text-base sm:text-lg leading-relaxed max-w-2xl">
              Procur is intentionally launching small. We&apos;re working with a
              limited group to build the right product — not the loudest one.
              Every new feature ships against real relationships and real
              supply.
            </p>
            <div className="mt-6">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-6 py-3 text-sm sm:text-base font-medium hover:bg-[var(--primary-accent3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:ring-offset-2 focus:ring-offset-white transition"
              >
                Request Access
              </Link>
            </div>
          </div>
        </section>

        {/* Vision section */}
        <section className="py-16 sm:py-20 bg-[var(--primary-background)]">
          <div className="max-w-[960px] mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] tracking-tight">
              Building a resilient regional food system
            </h2>
            <p className="mt-4 text-[var(--secondary-muted-edge)] text-base sm:text-lg leading-relaxed max-w-3xl">
              We believe strong food systems start locally. Procur is laying the
              foundation for infrastructure that scales with trust, not
              shortcuts — aligning incentives between buyers, producers, and the
              communities they feed.
            </p>
          </div>
        </section>
      </main>

      {/* Keep existing footer */}
      <Footer />
    </div>
  );
}
