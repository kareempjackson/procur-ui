"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

/**
 * Wraps page content with a smooth fade transition on route changes.
 * Also shows a slim progress bar at the top during navigation.
 */
export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Route changed — fade in
      setIsTransitioning(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <>
      {/* Top progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 9999,
          pointerEvents: "none",
          opacity: isTransitioning ? 1 : 0,
          transition: "opacity .3s ease",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#2d4a3e",
            animation: isTransitioning ? "routeProgress .6s ease forwards" : "none",
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>

      {/* Page content with fade */}
      <div
        style={{
          opacity: isTransitioning ? 0.92 : 1,
          transition: "opacity .2s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
