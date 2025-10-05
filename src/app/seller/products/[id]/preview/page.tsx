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

export default function ProductPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductPreviewClient productId={params.id} />;
}
