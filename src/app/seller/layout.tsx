import AuthGuard from "@/components/AuthGuard";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description:
    "Manage your products, fulfill orders, and grow your agricultural business on Procur's seller dashboard.",
};

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AuthGuard allowAccountTypes={["seller"]}>
        <div className="bg-white min-h-screen flex flex-col">
          <SellerTopNavigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </AuthGuard>
    </ToastProvider>
  );
}
