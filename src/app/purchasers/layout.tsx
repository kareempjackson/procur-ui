import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/footer/Footer";

export default function BuyersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthGuard allowAccountTypes={["buyer"]}>{children}</AuthGuard>
      <Footer />
    </>
  );
}
