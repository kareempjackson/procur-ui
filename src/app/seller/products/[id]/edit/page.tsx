import { Metadata } from "next";
import EditProductClient from "./EditProductClient";

export const metadata: Metadata = {
  title: "Edit Product · Procur",
  description: "Update your product listing",
  openGraph: {
    title: "Edit Product · Procur",
    description: "Update your product listing",
  },
};

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditProductClient productId={params.id} />;
}
