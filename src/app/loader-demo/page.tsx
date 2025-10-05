"use client";

import { useState } from "react";
import ProcurLoader from "@/components/ProcurLoader";

export default function LoaderDemo() {
  const [showFullscreen, setShowFullscreen] = useState(false);

  return (
    <>
      {showFullscreen && (
        <ProcurLoader size="lg" text="Loading your content..." fullscreen />
      )}

      <div className="min-h-screen bg-[var(--primary-background)] p-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--secondary-black)] mb-2">
              Procur Loader Demo
            </h1>
            <p className="text-[var(--secondary-muted-edge)]">
              Custom loading animation with the Procur logo
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--secondary-soft-highlight)]">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6 text-center">
              Full Screen Overlay (Default)
            </h2>
            <p className="text-center text-[var(--secondary-muted-edge)] mb-6">
              This is the default behavior - covers the entire screen with a
              colored background
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowFullscreen(true);
                  setTimeout(() => setShowFullscreen(false), 3000);
                }}
                className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
              >
                Show Fullscreen Loader (3s)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--secondary-soft-highlight)]">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6 text-center">
                Small (Inline)
              </h2>
              <ProcurLoader size="sm" text="Loading..." fullscreen={false} />
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--secondary-soft-highlight)]">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6 text-center">
                Medium (Inline)
              </h2>
              <ProcurLoader
                size="md"
                text="Loading products..."
                fullscreen={false}
              />
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--secondary-soft-highlight)]">
              <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6 text-center">
                Large (Inline)
              </h2>
              <ProcurLoader
                size="lg"
                text="Loading seller profile..."
                fullscreen={false}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-sm border border-[var(--secondary-soft-highlight)]">
            <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-8 text-center">
              Without Text (Inline)
            </h2>
            <div className="flex items-center justify-center">
              <ProcurLoader size="lg" fullscreen={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
