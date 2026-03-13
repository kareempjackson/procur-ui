import { Metadata } from "next";
import SupplierClient from "./SupplierClient";

export const metadata: Metadata = {
  title: "Supplier Profile · Procur",
  description: "View supplier profile and products.",
  openGraph: {
    title: "Supplier Profile · Procur",
    description: "View supplier profile and products.",
  },
};

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;
  return <SupplierClient supplierId={supplierId} />;
}
