import AuthGuard from "@/components/AuthGuard";
import GovernmentTopNavigation from "@/components/navigation/GovernmentTopNavigation";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Portal",
  description:
    "Monitor agricultural data, track compliance, and access reporting tools on Procur's government portal.",
};

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthGuard allowAccountTypes={["government"]}>
        <GovernmentTopNavigation />
        {children}
      </AuthGuard>
      <Footer />
    </>
  );
}
