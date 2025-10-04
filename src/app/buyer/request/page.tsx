import { Metadata } from "next";
import RequestClient from "./RequestClient";

export const metadata: Metadata = {
  title: "Make a Request · Procur",
  description: "Request specific produce from our network of suppliers.",
  openGraph: {
    title: "Make a Request · Procur",
    description: "Request specific produce from our network of suppliers.",
  },
};

export default function RequestPage() {
  return <RequestClient />;
}
