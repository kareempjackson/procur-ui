import { Metadata } from "next";
import HelpClient from "./HelpClient";

export const metadata: Metadata = {
  title: "Help & Support · Procur",
  description: "Get help and support for your Procur buyer account.",
  openGraph: {
    title: "Help & Support · Procur",
    description: "Get help and support for your Procur buyer account.",
  },
};

export default function HelpPage() {
  return <HelpClient />;
}
