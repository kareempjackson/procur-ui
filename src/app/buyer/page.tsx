import { Metadata } from "next";
import BuyerClient from "./BuyerClient";

export const metadata: Metadata = {
  title: "Marketplace · Procur",
  description:
    "Browse trusted farms, explore current inventory, and pre-order upcoming harvests.",
  openGraph: {
    title: "Marketplace · Procur",
    description:
      "Browse trusted farms, explore current inventory, and pre-order upcoming harvests.",
  },
};

export default function BuyerPage() {
  return <BuyerClient />;
}
