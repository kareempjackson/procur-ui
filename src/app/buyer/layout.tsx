import AuthGuard from "@/components/AuthGuard";
import BuyerTopNavigation from "@/components/navigation/BuyerTopNavigation";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowAccountTypes={["buyer"]}>
      <BuyerTopNavigation />
      {children}
    </AuthGuard>
  );
}
