import { Metadata } from "next";
import OrderDetailClient from "./OrderDetailClient";

export const metadata: Metadata = {
  title: "Order Details · Procur",
  description: "View and manage order details",
  openGraph: {
    title: "Order Details · Procur",
    description: "View and manage order details",
  },
};

export default function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  return <OrderDetailClient orderId={params.orderId} />;
}
