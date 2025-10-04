import { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "Analytics · Procur",
  description: "View your sales analytics and performance metrics.",
  openGraph: {
    title: "Analytics · Procur",
    description: "View your sales analytics and performance metrics.",
  },
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
