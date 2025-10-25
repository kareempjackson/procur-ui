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
  ShieldCheckIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function PaymentsPage() {
  const user = useAppSelector(selectAuthUser);

  const features = [
    {
      title: "Milestone Escrow",
      description:
        "Funds are reserved at order, released as harvest, QA, and delivery milestones are verified.",
      icon: ShieldCheckIcon,
    },
    {
      title: "Fast Payouts",
      description:
        "Sellers receive automatic payouts to bank or wallet once milestones clear.",
      icon: BanknotesIcon,
    },
    {
      title: "Buyer Protection",
      description:
        "If items fail QA or quantities change, funds are held until resolved.",
      icon: CheckBadgeIcon,
    },
    {
      title: "Secure Processing",
      description:
        "PCI-compliant providers, 3D Secure where available, and fraud screening.",
      icon: LockClosedIcon,
    },
  ];

  const flow = [
    {
      step: "1",
      title: "Order & Fund",
      description:
        "Buyer places an order—funds are authorized or deposited into neutral escrow.",
    },
    {
      step: "2",
      title: "Harvest & QA",
      description:
        "Seller harvests; QA verifies quality and quantity. Adjustments are recorded if needed.",
    },
    {
      step: "3",
      title: "Deliver",
      description:
        "Driver completes delivery with digital proof. Buyer confirms receipt.",
    },
    {
      step: "4",
      title: "Release & Payout",
      description:
        "Escrow releases funds—seller receives payout; buyer gets a final invoice.",
    },
  ];

  const outcomes = [
    { label: "Chargebacks reduced", value: "-41%" },
    { label: "Payment disputes resolved", value: "92%" },
    { label: "Average payout time", value: "T+1" },
    { label: "On-escrow transactions", value: "100%" },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      {/* Notice */}
      <div className="bg-[var(--secondary-muted-edge)] text-white text-center py-2 text-sm">
        Payments are handled by trusted regional providers
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
              alt="Secure payments and escrow"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
          <div className="relative max-w-[1280px] mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight leading-[1.1]">
              Escrow & Payments
            </h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl leading-relaxed">
              Confidence for buyers. Reliable cash flow for sellers. Funds move
              when milestones do.
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

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-6 tracking-tight">
                Trust built into every transaction
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light leading-relaxed mb-6">
                Perishables are unique: quality can change between harvest and
                delivery. Our escrow system aligns payments to reality—releasing
                funds as each stage is verified.
              </p>
              <ul className="space-y-3 text-[color:var(--secondary-black)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary-accent2)]"></span>{" "}
                  Milestones aligned to harvest, QA, and delivery
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary-accent2)]"></span>{" "}
                  Automatic adjustments for shortfalls and substitutions
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary-accent2)]"></span>{" "}
                  Clear dispute process with digital evidence
                </li>
              </ul>
            </div>
            <div>
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg"
                  alt="Escrow dashboard"
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
                What you can count on
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                Secure rails with marketplace-native protections
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Flow steps */}
        <section className="py-20 bg-[var(--primary-background)]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight">
                How escrow works
              </h2>
              <p className="text-lg text-[var(--secondary-muted-edge)] font-light">
                Four clear steps from order to payout
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {flow.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-accent2)] text-white flex items-center justify-center mb-3 font-medium">
                    {s.step}
                  </div>
                  <h3 className="text-[color:var(--secondary-black)] font-medium mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-6 tracking-tight">
                  Payments that build trust
                </h2>
                <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-10 leading-relaxed">
                  Clear milestones and fast payouts reduce friction and align
                  incentives across buyers, sellers, and logistics.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {outcomes.map((o) => (
                    <div
                      key={o.label}
                      className="text-center rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-[var(--primary-background)] p-6"
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
                  alt="Secure payment flows"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="get-started" className="py-24">
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-[var(--secondary-black)] mb-4 tracking-tight">
              Enable escrow for your account
            </h2>
            <p className="text-lg text-[var(--secondary-muted-edge)] font-light mb-8 max-w-2xl mx-auto">
              We’ll help configure payment rails and milestones that fit your
              workflow.
            </p>
            <Link
              href="/contact?topic=payments"
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
