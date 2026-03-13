import { Metadata } from "next";
import TransactionDetailClient from "./TransactionDetailClient";

export const metadata: Metadata = {
  title: "Transaction Details · Procur",
  description: "View detailed transaction information.",
  openGraph: {
    title: "Transaction Details · Procur",
    description: "View detailed transaction information.",
  },
};

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TransactionDetailClient transactionId={id} />;
}
