import { Metadata } from "next";
import ProductPreviewClient from "./ProductPreviewClient";

export const metadata: Metadata = {
  title: "Product Preview · Procur",
  description: "Preview how your product appears to buyers",
  openGraph: {
    title: "Product Preview · Procur",
    description: "Preview how your product appears to buyers",
  },
};

export default async function ProductPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductPreviewClient productId={id} />;
}
