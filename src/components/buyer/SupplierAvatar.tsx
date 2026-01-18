"use client";

import React from "react";
import Image from "next/image";

export type SupplierAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeClassMap: Record<SupplierAvatarSize, string> = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export default function SupplierAvatar({
  name,
  imageUrl,
  size = "md",
  className = "",
  priority = false,
}: {
  name: string;
  imageUrl?: string | null;
  size?: SupplierAvatarSize;
  className?: string;
  priority?: boolean;
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const hasImage = typeof imageUrl === "string" && imageUrl.trim().length > 0;

  return (
    <div
      className={[
        "relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0",
        "bg-[var(--primary-accent2)]/10",
        sizeClassMap[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={name ? `${name} profile` : "Supplier profile"}
    >
      {hasImage ? (
        <Image
          src={imageUrl as string}
          alt={name || "Supplier"}
          fill
          sizes="96px"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <span className="text-sm font-bold text-[var(--primary-accent2)]">
          {initial}
        </span>
      )}
    </div>
  );
}


