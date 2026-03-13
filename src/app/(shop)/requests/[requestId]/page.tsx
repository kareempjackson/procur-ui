import { Metadata } from "next";
import RequestDetailClient from "./RequestDetailClient";

type RequestDetailPageProps = {
  params: Promise<{ requestId: string }>;
};

export async function generateMetadata({
  params,
}: RequestDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  return {
    title: `Request #${requestId} · Procur`,
    description: `View details and bids for request #${requestId}.`,
    openGraph: {
      title: `Request #${requestId} · Procur`,
      description: `View details and bids for request #${requestId}.`,
    },
  };
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { requestId } = await params;
  return <RequestDetailClient requestId={requestId} />;
}
