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
      <AuthGuard allowAccountTypes={["buyer"]}>
        <div className="bg-white min-h-screen flex flex-col">
          <BuyerTopNavigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </AuthGuard>
    </ToastProvider>
  );
}
