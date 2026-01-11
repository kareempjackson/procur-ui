"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import GovernmentTopNavigation from "@/components/navigation/GovernmentTopNavigation";
import GovernmentSideNavigation from "@/components/navigation/GovernmentSideNavigation";
import GovernmentMobileSideNav from "@/components/navigation/GovernmentMobileSideNav";
import Footer from "@/components/footer/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ToastProvider>
      <AuthGuard allowAccountTypes={["government"]}>
        <div className="flex min-h-screen bg-[var(--primary-background)]">
          {/* Desktop Side Navigation */}
          <GovernmentSideNavigation
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Mobile Side Navigation Drawer */}
          <GovernmentMobileSideNav
            isOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Navigation */}
            <GovernmentTopNavigation
              onMobileMenuToggle={() => setMobileNavOpen(true)}
            />

            {/* Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </AuthGuard>
    </ToastProvider>
  );
}
