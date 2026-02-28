"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSellers } from "@/store/slices/buyerMarketplaceSlice";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/store/slices/authSlice";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#2d4a3e", "#d4783c", "#5a7650", "#1c2b23", "#407178", "#653011"];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

const FARM_COVERS = [
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=280&fit=crop",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=280&fit=crop",
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=280&fit=crop",
  "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=280&fit=crop",
  "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&h=280&fit=crop",
  "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=280&fit=crop",
];
function farmCover(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 17 + name.charCodeAt(i)) & 0xffff;
  return FARM_COVERS[h % FARM_COVERS.length];
}

type Tab = "all" | "verified" | "top";

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SuppliersClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sellers, status } = useAppSelector((s) => s.buyerMarketplace);
  const authToken = useSelector(selectAuthToken);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(fetchSellers({ page: 1, limit: 50, search: search || undefined }));
    }, 300);
    return () => clearTimeout(id);
  }, [search, dispatch]);

  const handleMessage = async (e: React.MouseEvent, supplierId: string, supplierName: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!authToken) { router.push("/login"); return; }
    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "supplier",
        contextId: supplierId,
        title: `Chat with ${supplierName}`,
      });
      if (data?.id) router.push(`/inbox?conversationId=${data.id}`);
    } catch {}
  };

  let list = sellers.map((s) => ({
    id: String(s.id),
    name: s.name,
    location: s.location || "Caribbean",
    rating: s.average_rating ?? 0,
    totalReviews: s.review_count || 0,
    products: s.product_count || 0,
    completedOrders: s.completed_orders ?? 0,
    verified: s.is_verified ?? false,
    coverImage: s.header_image_url ?? null,
    avatarUrl: s.logo_url ?? null,
  }));

  if (tab === "verified") list = list.filter((s) => s.verified);
  if (tab === "top") list = [...list].sort((a, b) => b.rating - a.rating);

  const isLoading = status === "loading" && sellers.length === 0;

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif", color: "#1c2b23" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 28px 64px" }}>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.3px", margin: 0 }}>
            Browse Suppliers
          </h1>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#b0c0b6", marginLeft: 10 }}>
            {list.length} supplier{list.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: "#fff", border: "1px solid #ebe7df", borderRadius: 8, flex: 1, maxWidth: 400 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#b0c0b6" strokeWidth="2" width={15} height={15}>
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "#1c2b23", fontWeight: 500, background: "transparent", width: "100%" }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Tab pills */}
          <div style={{ display: "flex", gap: 4 }}>
            {(["all", "verified", "top"] as Tab[]).map((t) => {
              const labels: Record<Tab, string> = { all: "All", verified: "Verified", top: "Top Rated" };
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "7px 14px", fontSize: 11.5, fontWeight: 700, borderRadius: 5, border: "none", cursor: "pointer",
                    background: active ? "#2d4a3e" : "none",
                    color: active ? "#f5f1ea" : "#8a9e92",
                    transition: "color .12s, background .12s",
                  }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: "#ebe7df", borderRadius: 10, height: 300, opacity: 0.5 }} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#8a9e92" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={48} height={48} style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "#1c2b23" }}>No suppliers found</div>
            <div style={{ fontSize: 13 }}>Try a different search or tab</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {list.map((s) => (
              <SupplierCard key={s.id} supplier={s} onMessage={handleMessage} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface SupplierItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  totalReviews: number;
  products: number;
  completedOrders: number;
  verified: boolean;
  coverImage: string | null;
  avatarUrl: string | null;
}

function SupplierCard({
  supplier: s,
  onMessage,
}: {
  supplier: SupplierItem;
  onMessage: (e: React.MouseEvent, id: string, name: string) => void;
}) {
  const [coverErr, setCoverErr] = useState(false);
  const [avatarErr, setAvatarErr] = useState(false);

  const coverSrc = coverErr || !s.coverImage ? farmCover(s.name) : s.coverImage;
  const stats = [
    { value: s.products, label: "Products" },
    { value: s.completedOrders, label: "Orders" },
    { value: s.rating > 0 ? s.rating.toFixed(1) : "—", label: "Rating" },
  ];

  return (
    <Link href={`/suppliers/${s.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div
        style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "background .12s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#faf8f4")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
      >
        {/* Cover image */}
        <div style={{ height: 140, position: "relative", background: "#ebe7df", overflow: "hidden" }}>
          <Image
            src={coverSrc}
            alt={s.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="400px"
            onError={() => setCoverErr(true)}
          />
          {s.verified && (
            <span style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 3, padding: "3px 8px", background: "rgba(245,241,234,.92)", borderRadius: 4, fontSize: 9.5, fontWeight: 700, color: "#2e7d4f" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width={11} height={11}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px 16px" }}>

          {/* Avatar + name + location */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: avatarColor(s.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#f5f1ea", flexShrink: 0, overflow: "hidden", position: "relative" }}>
              {s.avatarUrl && !avatarErr
                ? <Image src={s.avatarUrl} alt={s.name} fill style={{ objectFit: "cover" }} sizes="36px" onError={() => setAvatarErr(true)} />
                : s.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
              <div style={{ fontSize: 10.5, color: "#8a9e92", marginTop: 1 }}>{s.location}</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", marginBottom: 12 }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 0", position: "relative" }}>
                {i < 2 && (
                  <span style={{ position: "absolute", right: 0, top: "25%", height: "50%", width: 1, background: "#ebe7df" }} />
                )}
                <strong style={{ fontSize: 16, fontWeight: 800, color: "#1c2b23", display: "block", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {stat.value}
                </strong>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#b0c0b6", textTransform: "uppercase", letterSpacing: ".04em", marginTop: 2, display: "block" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ flex: 1, padding: "8px 0", fontSize: 11.5, fontWeight: 700, background: "#2d4a3e", color: "#f5f1ea", borderRadius: 6, border: "none", cursor: "pointer", transition: "background .12s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#253d33")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2d4a3e")}
            >
              View
            </button>
            <button
              onClick={(e) => onMessage(e, s.id, s.name)}
              style={{ flex: 1, padding: "8px 0", fontSize: 11.5, fontWeight: 700, background: "none", border: "1px solid #ebe7df", color: "#6a7f73", borderRadius: 6, cursor: "pointer", transition: "border-color .12s, color .12s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2d4a3e"; e.currentTarget.style.color = "#2d4a3e"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ebe7df"; e.currentTarget.style.color = "#6a7f73"; }}
            >
              Message
            </button>
          </div>

        </div>
      </div>
    </Link>
  );
}
