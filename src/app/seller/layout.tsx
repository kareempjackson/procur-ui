import AuthGuard from "@/components/AuthGuard";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import ProcurFooter from "@/components/footer/ProcurFooter";
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
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#faf8f4" }}>
          <SellerTopNavigation />
          <main style={{ flex: 1 }}>{children}</main>
          <ProcurFooter />
        </div>
      </AuthGuard>
    </ToastProvider>
  );
}
