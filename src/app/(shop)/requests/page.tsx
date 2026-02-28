import { Metadata } from "next";
import RequestsClient from "./RequestsClient";

export const metadata: Metadata = {
  title: "My Requests · Procur",
  description: "View and manage your produce requests and bids.",
  openGraph: {
    title: "My Requests · Procur",
    description: "View and manage your produce requests and bids.",
  },
};

export default function RequestsPage() {
  return <RequestsClient />;
}
