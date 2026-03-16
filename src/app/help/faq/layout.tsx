import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about buying, selling, payments, logistics, and getting started on Procur — the Caribbean's fresh produce marketplace.",
  openGraph: {
    title: "FAQ — Procur",
    description:
      "Answers to common questions about buying, selling, payments, and logistics on Procur.",
    url: "https://procur.io/help/faq",
  },
  twitter: {
    card: "summary",
    title: "FAQ — Procur",
    description: "Answers to common questions about Procur.",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
