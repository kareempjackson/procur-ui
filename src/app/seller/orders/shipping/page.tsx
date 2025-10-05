import { Metadata } from "next";
import ShippingClient from "./ShippingClient";

export const metadata: Metadata = {
  title: "Shipping Management · Procur",
  description: "Manage orders ready to ship and track shipments.",
  openGraph: {
    title: "Shipping Management · Procur",
    description: "Manage orders ready to ship and track shipments.",
  },
};

export default function ShippingManagementPage() {
  return <ShippingClient />;
}
