import AuthGuard from "@/components/AuthGuard";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowAccountTypes={["seller"]}>
      <SellerTopNavigation />
      {children}
    </AuthGuard>
  );
}
