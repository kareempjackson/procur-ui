"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import GovernmentTopNavigation from "@/components/navigation/GovernmentTopNavigation";
import GovernmentSideNavigation from "@/components/navigation/GovernmentSideNavigation";
import GovernmentMobileSideNav from "@/components/navigation/GovernmentMobileSideNav";
import ProcurFooter from "@/components/footer/ProcurFooter";
import { ToastProvider } from "@/components/ui/Toast";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ToastProvider>
      <AuthGuard allowAccountTypes={["government"]}>
        <div
          className="gov-theme"
          style={{
            minHeight: "100vh",
            background: "#faf8f4",
            fontFamily: "'Urbanist', system-ui, sans-serif",
          }}
        >
          {/* Icon rail + slide-out panel (fixed, floats over everything) */}
          <GovernmentSideNavigation
            collapsed={!panelOpen}
            onToggle={() => setPanelOpen(!panelOpen)}
          />

          {/* Mobile drawer */}
          <GovernmentMobileSideNav
            isOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />

          {/* Full-width top nav */}
          <GovernmentTopNavigation
            onMobileMenuToggle={() => setMobileNavOpen(true)}
          />

          {/* Page content — padded left on desktop to clear icon rail */}
          <main className="gov-main-content" style={{ flex: 1 }}>
            {children}
          </main>

          {/* Full-width footer */}
          <ProcurFooter />
        </div>
      </AuthGuard>
    </ToastProvider>
  );
}
