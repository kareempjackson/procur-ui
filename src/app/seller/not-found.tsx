import Link from "next/link";
import { Alert } from "@/components/ui/Alert";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="w-full max-w-2xl">
        <Alert
          variant="warning"
          title="Page not found"
          description="That seller page doesn’t exist (or it was moved)."
          actions={
            <>
              <Link className="btn btn-primary" href="/seller">
                Back to dashboard
              </Link>
              <Link className="btn btn-ghost" href="/help/support">
                Contact support
              </Link>
            </>
          }
        />
      </div>
    </div>
  );
}


