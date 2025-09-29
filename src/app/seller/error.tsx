"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-medium text-black">
          We couldn’t load this section.
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {error?.message || "An unexpected error occurred."}
        </p>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-primary" onClick={() => reset()}>
            Retry
          </button>
          <a className="btn btn-ghost" href="/help/support">
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
