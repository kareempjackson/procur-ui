import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/footer/Footer";

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <>{children}</>
      <Footer />
    </>
  );
}
