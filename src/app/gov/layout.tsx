import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/footer/Footer";

export default function GovernmentLayout({
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
