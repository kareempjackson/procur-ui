import { Metadata } from "next";
import ProductClient from "./ProductClient";

export const metadata: Metadata = {
  title: "Product Details · Procur",
  description: "View product details and place your order.",
  openGraph: {
    title: "Product Details · Procur",
    description: "View product details and place your order.",
  },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <ProductClient productId={productId} />;
}
