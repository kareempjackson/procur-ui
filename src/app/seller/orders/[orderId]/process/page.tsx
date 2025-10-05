import { Metadata } from "next";
import OrderProcessingClient from "./OrderProcessingClient";

export const metadata: Metadata = {
  title: "Process Order · Procur",
  description: "Process and fulfill your order.",
  openGraph: {
    title: "Process Order · Procur",
    description: "Process and fulfill your order.",
  },
};

export default function OrderProcessingPage({
  params,
}: {
  params: { orderId: string };
}) {
  return <OrderProcessingClient orderId={params.orderId} />;
}
