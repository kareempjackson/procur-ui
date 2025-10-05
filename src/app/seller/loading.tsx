import ProcurLoader from "@/components/ProcurLoader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--primary-background)]">
      <ProcurLoader size="lg" text="Loading..." />
    </div>
  );
}
