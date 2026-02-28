import { Metadata } from "next";
import RequestDetailClient from "./RequestDetailClient";

type RequestDetailPageProps = {
  params: {
    requestId: string;
  };
};

export async function generateMetadata({
  params,
}: RequestDetailPageProps): Promise<Metadata> {
  return {
    title: `Request #${params.requestId} · Procur`,
    description: `View details and bids for request #${params.requestId}.`,
    openGraph: {
      title: `Request #${params.requestId} · Procur`,
      description: `View details and bids for request #${params.requestId}.`,
    },
  };
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  return <RequestDetailClient requestId={params.requestId} />;
}
