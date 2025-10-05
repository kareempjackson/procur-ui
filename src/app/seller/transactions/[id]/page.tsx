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

export default function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <TransactionDetailClient transactionId={params.id} />;
}
