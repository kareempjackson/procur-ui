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
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  QueueListIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function LogisticsPage() {
  const user = useAppSelector(selectAuthUser);

  const features = [
    {
      title: "Route Planning",
      description:
        "Optimize pickup and drop-off routes across islands, reduce fuel, and meet delivery windows.",
      icon: MapPinIcon,
    },
    {
      title: "Dispatch & Tracking",
      description:
        "Assign drivers, live-track vehicles, and share ETAs with buyers and facilities.",
      icon: TruckIcon,
    },
    {
      title: "Time Windows",
      description:
        "Respect harvest-ready times, QA holds, and facility receiving schedules.",
      icon: ClockIcon,
    },
    {
      title: "Digital Manifests",
      description:
        "Paperless proof of pickup and delivery with item-level reconciliation.",
      icon: QueueListIcon,
    },
    {
      title: "Cold Chain & QA",
      description:
        "Monitor temperature events and quality check statuses during transit.",
      icon: ShieldCheckIcon,
    },
  ];

  const outcomes = [
    { label: "Route distance saved", value: "-18%" },
    { label: "On-time delivery", value: "+22%" },
    { label: "Fuel cost per kg", value: "-14%" },
    { label: "Damage/spoilage", value: "-27%" },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Notice */}
      <div className="bg-[var(--secondary-muted-edge)] text-white text-center py-2 text-sm">
        Logistics tools available to approved partners
      </div>

      {/* Navigation */}
      {user?.accountType === "buyer" ? (
        <BuyerTopNavigation />
      ) : user?.accountType === "seller" ? (
        <SellerTopNavigation />
      ) : (
        <TopNavigation />
      )}

      <main>
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
              alt="Logistics and distribution"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight leading-[1.1]">
              Logistics & Fulfillment
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl leading-relaxed">
              Plan routes, dispatch drivers, and track deliveries—built for
              perishable supply chains.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="#get-started"
                className="inline-flex items-center bg-[var(--primary-accent2)] text-white px-8 py-4 rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* Story section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-6 tracking-tight">
                Built for fresh, time-sensitive deliveries
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light leading-relaxed mb-6">
                Procur syncs harvest readiness, QA checks, and buyer receiving
                windows into a single schedule. Drivers get clear manifests and
                turn-by-turn routing that respects product constraints.
              </p>
              <ul className="space-y-3 text-[color:var(--secondary-black)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary-accent2)]"></span>{" "}
                  Multi-stop routing with island-aware constraints
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary-accent2)]"></span>{" "}
                  Live status: picked up, in transit, delivered
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary-accent2)]"></span>{" "}
                  Exceptions: delays, spoilage risk, access issues
                </li>
              </ul>
            </div>
            <div>
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                  alt="Vehicle routing preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-accent2)]/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section id="features" className="py-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight">
                Logistics that fits the Caribbean
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                From farm roads to inter-island routes—one platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6 flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--primary-accent2)]/10 text-[var(--primary-accent2)] flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-[color:var(--secondary-black)] font-medium mb-1">
                        {f.title}
                      </h3>
                      <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-20 bg-[var(--primary-background)]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-6 tracking-tight">
                  Deliver more with less
                </h2>
                <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-10 leading-relaxed">
                  Teams use Procur to shorten delivery windows, cut costs, and
                  keep perishables in condition.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {outcomes.map((o) => (
                    <div
                      key={o.label}
                      className="text-center rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6"
                    >
                      <div className="text-3xl md:text-4xl font-light text-[var(--primary-accent2)] mb-1">
                        {o.value}
                      </div>
                      <div className="text-sm text-[var(--secondary-black)] font-medium">
                        {o.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                  alt="Delivery success"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="get-started" className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight">
              Streamline your deliveries
            </h2>
            <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-8 max-w-2xl mx-auto">
              We help fleets, co-ops, and ministries coordinate fresh food
              logistics end-to-end.
            </p>
            <Link
              href="/contact?topic=logistics"
              className="inline-flex items-center bg-[var(--primary-accent2)] text-white px-8 py-4 rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2"
            >
              Talk to our team
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
