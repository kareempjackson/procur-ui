import type { Metadata } from "next";
import MarketplaceClient from "./MarketplaceClient";

export const metadata: Metadata = {
  title: "Fresh Produce Marketplace · Procur",
  description:
    "Discover verified farms and fresh produce suppliers across the Caribbean and beyond. Browse countries, farms, and products on Procur's public marketplace.",
  openGraph: {
    title: "Fresh Produce Marketplace · Procur",
    description:
      "Explore public farm profiles and products, then create a Procur account to buy with confidence.",
  },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
