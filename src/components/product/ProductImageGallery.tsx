"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Props = {
  images: string[];
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
};

export default function ProductImageGallery({
  images,
  alt,
  fallbackSrc = "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
  priority = false,
}: Props) {
  const normalized = useMemo(
    () => (Array.isArray(images) ? images.filter((s) => typeof s === "string" && s.trim().length > 0) : []),
    [images]
  );

  const items = normalized.length > 0 ? normalized : [fallbackSrc];
  const [selected, setSelected] = useState(0);

  const goPrev = () => setSelected((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setSelected((i) => (i + 1) % items.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 bg-white group">
        <Image
          src={items[selected]}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
        />

        {items.length > 1 && (
          <>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-black/60 text-white px-2.5 py-1 rounded-full">
              {selected + 1} / {items.length}
            </div>

            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeftIcon className="h-5 w-5 text-[var(--secondary-black)]" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRightIcon className="h-5 w-5 text-[var(--secondary-black)]" />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {items.map((src, index) => (
            <button
              type="button"
              key={`${src}-${index}`}
              onClick={() => setSelected(index)}
              className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                selected === index
                  ? "border-[var(--primary-accent2)]"
                  : "border-[var(--secondary-soft-highlight)]/20 hover:border-[var(--secondary-soft-highlight)]"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={src} alt={`${alt} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


