import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Onboarding · Procur",
  description:
    "Help sellers set up their profile, add products, and connect to payments with a friendly, step-by-step experience.",
};

export default function SellerOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--primary-background)] overflow-x-hidden">
      {children}
    </div>
  );
}
