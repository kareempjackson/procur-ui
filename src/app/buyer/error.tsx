"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/components/ui/Toast";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const toast = useToast();

  useEffect(() => {
    toast.show(
      {
        variant: "error",
        title: "Something went wrong",
        message: error?.message || "We couldn’t load this section.",
      },
      5000
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error?.message, error?.digest]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="w-full max-w-2xl">
        <Alert
          variant="error"
          title="We couldn’t load this section."
          description={
            error?.message ||
            "An unexpected error occurred. Please try again, or contact support if it keeps happening."
          }
          actions={
            <>
              <button type="button" className="btn btn-primary" onClick={reset}>
                Retry
              </button>
              <Link className="btn btn-ghost" href="/buyer">
                Back to dashboard
              </Link>
              <Link className="btn btn-ghost" href="/help/support">
                Contact support
              </Link>
            </>
          }
        />

        {process.env.NODE_ENV !== "production" ? (
          <details className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-medium text-black">
              Technical details
            </summary>
            <pre className="mt-3 whitespace-pre-wrap text-xs text-gray-700">
              {error?.stack || error?.message}
            </pre>
          </details>
        ) : null}
      </div>
    </div>
  );
}





