import AuthGuard from "@/components/AuthGuard";

export default function BuyersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowAccountTypes={["buyer"]}>{children}</AuthGuard>;
}
