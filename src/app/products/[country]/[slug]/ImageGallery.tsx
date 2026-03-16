"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  productName: string;
  discountPct: number;
  stockQty: number;
}

export default function ImageGallery({ images, productName, discountPct, stockQty }: Props) {
  const [active, setActive] = useState(0);
  const src = images[active] ?? "";
  const hasThumbs = images.length > 1;

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", width: "100%" }}>
      {/* Vertical thumbnail rail */}
      {hasThumbs && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                width: 66,
                height: 66,
                padding: 2,
                borderRadius: 8,
                border: `2px solid ${i === active ? "#2d4a3e" : "#e8e4dc"}`,
                background: "#fafaf9",
                cursor: "pointer",
                overflow: "hidden",
                flexShrink: 0,
                display: "block",
                transition: "border-color .15s",
              }}
            >
              <Image
                src={img}
                alt={`${productName} ${i + 1}`}
                width={60}
                height={60}
                style={{
                  objectFit: "cover",
                  borderRadius: 5,
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        style={{
          flex: 1,
          position: "relative",
          aspectRatio: "1 / 1",
          background: "#f5f1ea",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #e8e4dc",
        }}
      >
        {src ? (
          <Image
            src={src}
            alt={productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 480px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c8ddd4"
              strokeWidth="1"
              width={72}
              height={72}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {stockQty === 0 && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "rgba(0,0,0,.72)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 999,
              letterSpacing: ".04em",
            }}
          >
            Out of stock
          </div>
        )}
        {discountPct > 0 && stockQty > 0 && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "#d4783c",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            {discountPct}% Off
          </div>
        )}
      </div>
    </div>
  );
}
