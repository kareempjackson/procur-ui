import AuthGuard from "@/components/AuthGuard";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
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
    <>
      <AuthGuard allowAccountTypes={["seller"]}>
        <SellerTopNavigation />
        {children}
      </AuthGuard>
      <Footer />
    </>
  );
}
