"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchFavoriteSellers,
  toggleSellerFavoriteAsync,
} from "@/store/slices/buyerMarketplaceSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/store/slices/authSlice";
import { useToast } from "@/components/ui/Toast";
import SupplierAvatar from "@/components/buyer/SupplierAvatar";

const T = {
  pageBg: "#faf8f4",
  cardBg: "#f5f1ea",
  border: "#e8e4dc",
  teal: "#2d4a3e",
  orange: "#d4783c",
  orangeHover: "#c26838",
  dark: "#1c2b23",
  muted: "#8a9e92",
  tealText: "#3e5549",
  font: "'Urbanist', system-ui, sans-serif",
};

export default function SavedSuppliersClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { favoriteSellers, favoriteSellersStatus, favoriteSellersError } =
    useAppSelector((state) => state.buyerMarketplace);
  const authToken = useSelector(selectAuthToken);
  const { show } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFavoriteSellers());
  }, [dispatch]);

  const filteredSuppliers = favoriteSellers.filter((supplier) => {
    if (
      searchQuery &&
      !supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleToggleFavorite = async (supplierId: string) => {
    try {
      await dispatch(
        toggleSellerFavoriteAsync({ sellerId: supplierId, isFavorited: true })
      ).unwrap();
      dispatch(fetchFavoriteSellers());
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      show("Failed to update favorite status. Please try again.");
    }
  };

  const handleMessageSupplier = async (
    supplierId: string,
    supplierName: string
  ) => {
    if (!authToken) {
      router.push("/login");
      return;
    }
    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.post("/conversations/start", {
        contextType: "supplier",
        contextId: supplierId,
        title: `Chat with ${supplierName}`,
      });
      if (data?.id) {
        router.push(`/inbox?conversationId=${data.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  if (favoriteSellersStatus === "loading") {
    return <ProcurLoader size="lg" text="Loading saved suppliers..." />;
  }

  if (favoriteSellersStatus === "failed" && favoriteSellersError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: T.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.font,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.dark, marginBottom: 8 }}>
            Failed to Load Saved Suppliers
          </h2>
          <p style={{ color: T.muted, marginBottom: 16 }}>{favoriteSellersError}</p>
          <button
            onClick={() => dispatch(fetchFavoriteSellers())}
            style={{
              padding: "10px 24px",
              background: T.orange,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: T.font,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: T.font }}>
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: T.dark, marginBottom: 4 }}>
                Saved Suppliers
              </h1>
              <p style={{ fontSize: 14, color: T.muted }}>
                Your favorite suppliers for quick access
              </p>
            </div>
            <Link
              href="/suppliers"
              style={{
                padding: "10px 20px",
                background: T.orange,
                color: "#fff",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Browse All Suppliers
            </Link>
          </div>
        </div>

        {/* Summary Card */}
        {favoriteSellers.length > 0 && (
          <div
            style={{
              background: T.teal,
              borderRadius: 14,
              padding: "24px 28px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
            }}
          >
            <div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Total Saved</div>
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>
                {favoriteSellers.length}
              </div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>
                suppliers ready to serve you
              </div>
            </div>
            <div style={{ fontSize: 72, opacity: 0.18 }}>♥</div>
          </div>
        )}

        {/* Search */}
        <div
          style={{
            background: T.cardBg,
            borderRadius: 12,
            border: `1px solid ${T.border}`,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: T.muted,
                  fontSize: 15,
                  pointerEvents: "none",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved suppliers..."
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 40px",
                  border: `1px solid ${T.border}`,
                  borderRadius: 999,
                  fontSize: 14,
                  background: "#fff",
                  color: T.dark,
                  outline: "none",
                  fontFamily: T.font,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
          {filteredSuppliers.length > 0 && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: `1px solid ${T.border}`,
                fontSize: 13,
                color: T.muted,
              }}
            >
              Showing {filteredSuppliers.length} of {favoriteSellers.length} saved suppliers
            </div>
          )}
        </div>

        {/* Suppliers Grid */}
        {filteredSuppliers.length === 0 ? (
          <div
            style={{
              background: T.cardBg,
              borderRadius: 14,
              border: `1px solid ${T.border}`,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>♡</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: T.dark, marginBottom: 8 }}>
              {searchQuery ? "No Suppliers Found" : "No Saved Suppliers Yet"}
            </h3>
            <p style={{ color: T.muted, marginBottom: 24 }}>
              {searchQuery
                ? "Try adjusting your search terms"
                : "Save your favorite suppliers for quick access"}
            </p>
            <Link
              href="/suppliers"
              style={{
                padding: "12px 24px",
                background: T.orange,
                color: "#fff",
                borderRadius: 999,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Browse Suppliers
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                onMouseEnter={() => setHoveredCard(supplier.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: hoveredCard === supplier.id
                    ? `1.5px solid ${T.teal}`
                    : `1px solid ${T.border}`,
                  overflow: "hidden",
                  transition: "border-color 0.15s",
                }}
              >
                {/* Supplier Banner */}
                <div
                  style={{
                    position: "relative",
                    height: 120,
                    background: T.cardBg,
                  }}
                >
                  {supplier.logo_url ? (
                    <Image
                      src={supplier.logo_url}
                      alt={supplier.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        fontSize: 48,
                        opacity: 0.3,
                        color: T.teal,
                      }}
                    >
                      🏪
                    </div>
                  )}

                  {/* Remove Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(supplier.id)}
                    title="Remove from saved"
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 34,
                      height: 34,
                      background: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      color: T.orange,
                    }}
                  >
                    ♥
                  </button>
                </div>

                {/* Supplier Info */}
                <div style={{ padding: "16px 20px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <SupplierAvatar
                          name={supplier.name}
                          imageUrl={supplier.logo_url}
                          size="sm"
                        />
                        <Link
                          href={`/suppliers/${supplier.id}`}
                          style={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: T.dark,
                            textDecoration: "none",
                          }}
                        >
                          {supplier.name}
                        </Link>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.muted }}>
                        <span>📍</span>
                        {supplier.location || "Caribbean"}
                      </div>
                    </div>
                    {supplier.is_verified && (
                      <span style={{ fontSize: 18, color: T.teal, marginLeft: 8 }} title="Verified">✓</span>
                    )}
                  </div>

                  {/* Rating */}
                  {supplier.average_rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ color: "#f59e0b", fontSize: 14 }}>★</span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: T.dark }}>
                        {supplier.average_rating.toFixed(1)}
                      </span>
                      {(supplier.total_reviews || 0) > 0 && (
                        <span style={{ fontSize: 12, color: T.muted }}>
                          ({supplier.total_reviews} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Product Count */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.muted, marginBottom: 16 }}>
                    <span>🛒</span>
                    <span>{supplier.product_count} products available</span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <Link
                      href={`/suppliers/${supplier.id}`}
                      style={{
                        padding: "9px 12px",
                        background: T.orange,
                        color: "#fff",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      🏪 Visit Shop
                    </Link>
                    <button
                      onClick={() => handleMessageSupplier(supplier.id, supplier.name)}
                      style={{
                        padding: "9px 12px",
                        background: "#fff",
                        color: T.teal,
                        border: `1.5px solid ${T.teal}`,
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        fontFamily: T.font,
                      }}
                    >
                      💬 Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
