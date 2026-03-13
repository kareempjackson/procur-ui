import { Metadata } from "next";
import RequestDetailClient from "./RequestDetailClient";

type RequestDetailPageProps = {
  params: Promise<{ requestId: string }>;
};

export async function generateMetadata({
  params,
}: RequestDetailPageProps): Promise<Metadata> {
  const { requestId } = await params;
  const requestName = `Request ${requestId}`;
  return {
    title: `${requestName} Details · Procur`,
    description: `View and respond to ${requestName} on Procur.`,
    openGraph: {
      title: `${requestName} Details · Procur`,
      description: `View and respond to ${requestName} on Procur.`,
    },
  };
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { requestId } = await params;
  return <RequestDetailClient requestId={requestId} />;
}
