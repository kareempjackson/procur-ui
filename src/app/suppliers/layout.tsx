import AuthGuard from "@/components/AuthGuard";

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowAccountTypes={["seller"]}>{children}</AuthGuard>;
}
