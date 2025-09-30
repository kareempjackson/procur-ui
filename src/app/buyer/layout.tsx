import AuthGuard from "@/components/AuthGuard";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowAccountTypes={["buyer"]}>{children}</AuthGuard>;
}
