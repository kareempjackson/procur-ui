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

export default function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  return <ProductClient productId={params.productId} />;
}
