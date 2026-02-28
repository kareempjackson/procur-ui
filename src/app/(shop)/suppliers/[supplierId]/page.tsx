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

export default function SupplierPage({
  params,
}: {
  params: { supplierId: string };
}) {
  return <SupplierClient supplierId={params.supplierId} />;
}
