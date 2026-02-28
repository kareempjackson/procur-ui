import { Metadata } from "next";
import SuppliersClient from "./SuppliersClient";

export const metadata: Metadata = {
  title: "Suppliers · Procur",
  description:
    "Browse verified suppliers and farms across the Caribbean. Find trusted partners for your produce needs.",
  openGraph: {
    title: "Suppliers · Procur",
    description:
      "Browse verified suppliers and farms across the Caribbean. Find trusted partners for your produce needs.",
  },
};

export default function SuppliersPage() {
  return <SuppliersClient />;
}
