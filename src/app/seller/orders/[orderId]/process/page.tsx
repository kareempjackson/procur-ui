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

export default async function OrderProcessingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderProcessingClient orderId={orderId} />;
}
