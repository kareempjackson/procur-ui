import { Metadata } from "next";
import SavedSuppliersClient from "./SavedSuppliersClient";

export const metadata: Metadata = {
  title: "Saved Suppliers · Procur",
  description:
    "Your saved suppliers and favorite farms. Quick access to your trusted partners.",
  openGraph: {
    title: "Saved Suppliers · Procur",
    description:
      "Your saved suppliers and favorite farms. Quick access to your trusted partners.",
  },
};

export default function SavedSuppliersPage() {
  return <SavedSuppliersClient />;
}
