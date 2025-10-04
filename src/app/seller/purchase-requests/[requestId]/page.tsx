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
  const requestName = `Request ${params.requestId}`;
  return {
    title: `${requestName} Details · Procur`,
    description: `View and respond to ${requestName} on Procur.`,
    openGraph: {
      title: `${requestName} Details · Procur`,
      description: `View and respond to ${requestName} on Procur.`,
    },
  };
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  return <RequestDetailClient requestId={params.requestId} />;
}
