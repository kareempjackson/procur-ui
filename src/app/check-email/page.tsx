export const dynamic = "force-static";

export default function CheckEmailPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--primary-background)] text-[var(--foreground)] relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(0,0,0,0.04),transparent_60%)]" />
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-24 md:py-32">
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-base)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Check your email
            </h1>
            <p className="mt-3 text-sm text-neutral-600">
              We sent a verification link to your inbox. Click the link to
              verify your email and activate your account.
            </p>
            <div className="mt-6 w-full text-left">
              <ul className="list-disc space-y-2 text-sm text-neutral-600 marker:text-neutral-400 pl-5">
                <li>It may take a minute to arrive.</li>
                <li>Check Promotions/Spam if you don’t see it.</li>
                <li>The link expires for your security.</li>
              </ul>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="/login" className="btn btn-primary !rounded-full">
                Back to login
              </a>
              <a href="/signup" className="btn btn-ghost !rounded-full">
                Use a different email
              </a>
            </div>
          </div>
        </section>
        <p className="mt-8 text-center text-xs text-neutral-500">
          Didn’t get the email? Wait a moment, then request another from the
          app.
        </p>
      </main>
    </div>
  );
}
