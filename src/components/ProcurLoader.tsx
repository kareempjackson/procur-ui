"use client";

import React from "react";

const W: Record<string, number> = { sm: 80, md: 120, lg: 160 };

export default function ProcurLoader({
  size = "md",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  text,
  className = "",
  fullscreen = true,
}: {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullscreen?: boolean;
}) {
  const w = W[size];
  const h = Math.round(w * (96 / 368));

  const content = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes procurPulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 1; }
        }
        @keyframes procurPatternFade {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.09; }
        }
      `}</style>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logos/procur-logo.svg"
        alt="Procur"
        width={w}
        height={h}
        style={{ display: "block", animation: "procurPulse 1.8s ease-in-out infinite" }}
      />
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className={className}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f4",
          overflow: "hidden",
        }}
      >
        {/* Tiled brand pattern backdrop */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-10%",
            backgroundImage: "url(/images/pattern.svg)",
            backgroundSize: "320px 320px",
            backgroundRepeat: "repeat",
            animation: "procurPatternFade 1.8s ease-in-out infinite",
          }}
        />
        {/* Wordmark */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
    >
      {content}
    </div>
  );
}
