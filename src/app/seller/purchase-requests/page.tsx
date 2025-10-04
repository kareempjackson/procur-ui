import { Metadata } from "next";
import PurchaseRequestsClient from "./PurchaseRequestsClient";

export const metadata: Metadata = {
  title: "Purchase Requests · Procur",
  description: "View and respond to buyer purchase requests.",
  openGraph: {
    title: "Purchase Requests · Procur",
    description: "View and respond to buyer purchase requests.",
  },
};

export default function PurchaseRequestsPage() {
  return <PurchaseRequestsClient />;
}
