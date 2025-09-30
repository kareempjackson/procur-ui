import AuthGuard from "@/components/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Onboarding · Procur",
  description:
    "Help government agencies set up procurement processes, manage vendors, and ensure compliance with a streamlined onboarding experience.",
  openGraph: {
    title: "Government Onboarding · Procur",
    description:
      "Help government agencies set up procurement processes, manage vendors, and ensure compliance with a streamlined onboarding experience.",
  },
};

export default function GovernmentOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowAccountTypes={["government"]}>
      <div className="min-h-screen bg-[var(--primary-background)] overflow-x-hidden">
        {children}
      </div>
    </AuthGuard>
  );
}
