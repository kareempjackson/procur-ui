import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Procur team. Whether you're a buyer, supplier, or partner, we're here to help you connect with fresh Caribbean produce.",
  openGraph: {
    title: "Contact Procur",
    description:
      "Get in touch with the Procur team. Whether you're a buyer, supplier, or partner, we're here to help.",
    url: "https://procur.io/company/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact Procur",
    description: "Get in touch with the Procur team.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
