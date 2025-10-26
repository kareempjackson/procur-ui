import AuthGuard from "@/components/AuthGuard";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";
import Footer from "@/components/footer/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer Dashboard",
  description:
    "Manage your orders, browse suppliers, and discover fresh produce on Procur's buyer dashboard.",
};

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="bg-white min-h-screen">
        <AuthGuard allowAccountTypes={["buyer"]}>
          <BuyerTopNavigation />
          {children}
        </AuthGuard>
        <Footer />
      </div>
    </ToastProvider>
  );
}
