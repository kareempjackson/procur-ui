import AuthGuard from "@/components/AuthGuard";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowAccountTypes={["government"]}>{children}</AuthGuard>;
}
