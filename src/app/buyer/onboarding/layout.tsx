import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer Onboarding · Procur",
  description:
    "Welcome new buyers, set preferences, and help them start sourcing products quickly.",
  openGraph: {
    title: "Buyer Onboarding · Procur",
    description:
      "Welcome new buyers, set preferences, and help them start sourcing products quickly.",
  },
};

export default function OnboardingLayout({
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
