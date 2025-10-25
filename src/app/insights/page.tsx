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
  ChartBarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BanknotesIcon,
  BellAlertIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function InsightsPage() {
  const user = useAppSelector(selectAuthUser);

  const pillars = [
    {
      title: "Food Security",
      description:
        "Track supply, demand, and price movements to stabilize markets and reduce volatility.",
      icon: ShieldCheckIcon,
    },
    {
      title: "Regional Coordination",
      description:
        "See cross-island flows, surpluses, and shortages to coordinate procurement and distribution.",
      icon: GlobeAltIcon,
    },
    {
      title: "Budget Impact",
      description:
        "Quantify program outcomes with transparent spend, savings, and local producer participation.",
      icon: BanknotesIcon,
    },
  ];

  const features = [
    {
      title: "Real-time Dashboards",
      description:
        "Up-to-date metrics on production, inventory, fulfillment, and logistics with drill-down by parish and product.",
      icon: ChartBarIcon,
    },
    {
      title: "Early-Warning Alerts",
      description:
        "Threshold-based notifications for supply shortages, price spikes, weather events, and QA flags.",
      icon: BellAlertIcon,
    },
    {
      title: "Geospatial View",
      description:
        "Map farms, utilization, and routes to plan interventions and emergency distribution.",
      icon: MapPinIcon,
    },
    {
      title: "Program Reporting",
      description:
        "Automate compliance and outcome reporting for grants, school-feeding, and relief programs.",
      icon: ClipboardDocumentListIcon,
    },
  ];

  const outcomes = [
    { label: "Food waste reduction", value: "-23%" },
    { label: "Local supplier participation", value: "+38%" },
    { label: "Procurement cycle time", value: "-31%" },
    { label: "On-time deliveries", value: "+19%" },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Top Notice Bar */}
      <div className="bg-[var(--secondary-muted-edge)] text-white text-center py-2 text-sm">
        Insights beta: Ministry access available on request
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
        {/* Editorial Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
              alt="Regional agriculture insights"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight leading-[1.1]">
              Government Insights
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl leading-relaxed">
              Operational visibility for food security, fair markets, and
              resilient supply chains.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="#request-access"
                className="inline-flex items-center bg-[var(--primary-accent2)] text-white px-8 py-4 rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent1)] focus:ring-offset-2"
              >
                Request Access
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        {/* Story: Why this matters */}
        <section className="py-20 bg-white" id="how-it-works">
          <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-6 tracking-tight">
                A coordinated view of regional agriculture
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light leading-relaxed mb-6">
                Governments need clarity to act quickly. Procur unifies market
                activity—production, demand, QA, and logistics—into one trusted
                view. Ministries can anticipate shortages, support farmers, and
                negotiate better pricing at scale.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pillars.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.title}
                      className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-5"
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-accent2)] text-white flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-[color:var(--secondary-black)] font-medium mb-1">
                        {p.title}
                      </h3>
                      <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                  alt="Dashboard preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-accent2)]/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-20" aria-labelledby="features-heading">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-14">
              <h2
                id="features-heading"
                className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight"
              >
                What ministries get
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                Practical tools designed for public sector outcomes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Measurable public outcomes
                </h2>
                <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-10 leading-relaxed">
                  The platform helps ministries stretch budgets, strengthen
                  local supply, and ensure timely delivery to schools,
                  hospitals, and vulnerable communities.
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
                  alt="Impact visualization"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="request-access" className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight">
              Bring insights to your ministry
            </h2>
            <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-8 max-w-2xl mx-auto">
              We partner with governments to deploy dashboards, alerts, and
              reporting tailored to national goals.
            </p>
            <Link
              href="/contact?topic=insights"
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
