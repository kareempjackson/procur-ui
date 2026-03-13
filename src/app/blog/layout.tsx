import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, updates, and insights from the Procur team. Farmer spotlights, product news, agricultural research, and more.",
  openGraph: {
    title: "Blog | Procur",
    description:
      "Stories, updates, and insights from the Procur team. Farmer spotlights, product news, agricultural research, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Procur",
    description:
      "Stories, updates, and insights from the Procur team.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
