"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCart,
  updateCartItemAsync,
  removeCartItemAsync,
} from "@/store/slices/buyerCartSlice";
import { getEstimatedDeliveryRangeLabel } from "@/lib/utils/date";

const DEBOUNCE_DELAY = 500;
const MIN_ORDER = 30;

const AVATAR_COLORS = ["#2d4a3e", "#d4783c", "#5a7650", "#1c2b23", "#407178", "#653011"];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, status, error } = useAppSelector((s) => s.buyerCart);
  const deliveryLabel = getEstimatedDeliveryRangeLabel();

  const [localQty, setLocalQty] = useState<Record<string, number>>({});
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const syncTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  // Seed localQty from server cart (only for new items)
  useEffect(() => {
    if (!cart) return;
    setLocalQty((prev) => {
      const next = { ...prev };
      let changed = false;
      cart.seller_groups.forEach((g) => g.items.forEach((item) => {
        if (next[item.id] === undefined) { next[item.id] = item.quantity; changed = true; }
      }));
      return changed ? next : prev;
    });
  }, [cart]);

  useEffect(() => () => { Object.values(syncTimers.current).forEach(clearTimeout); }, []);

  const getQty = useCallback((id: string, srv: number) => localQty[id] ?? srv, [localQty]);

  const updateQty = useCallback((itemId: string, qty: number, min: number, max: number) => {
    const clamped = Math.max(min, Math.min(max, qty));
    setLocalQty((p) => ({ ...p, [itemId]: clamped }));
    if (syncTimers.current[itemId]) clearTimeout(syncTimers.current[itemId]);
    syncTimers.current[itemId] = setTimeout(() => {
      dispatch(updateCartItemAsync({ itemId, quantity: clamped }));
    }, DEBOUNCE_DELAY);
  }, [dispatch]);

  const confirmDelete = () => {
    if (pendingDelete) { dispatch(removeCartItemAsync(pendingDelete.id)); setPendingDelete(null); }
  };

  const sellers = cart ? cart.seller_groups.map((g) => ({
    id: g.seller_org_id,
    name: g.seller_name,
    shipping: g.estimated_shipping,
    items: g.items.map((i) => ({
      id: i.id,
      productId: i.product_id,
      name: i.product_name,
      image: i.image_url,
      price: i.unit_price,
      unit: i.unit_of_measurement,
      quantity: i.quantity,
      maxStock: i.stock_quantity,
      inStock: i.stock_quantity > 0,
    })),
  })) : [];

  const sellerSub = (items: typeof sellers[0]["items"]) =>
    items.reduce((s, i) => s + i.price * getQty(i.id, i.quantity), 0);

  const subtotal = sellers.reduce((s, g) => s + sellerSub(g.items), 0);
  const feeRate = cart?.platform_fee_percent || 0;
  const fee = Number(((subtotal * feeRate) / 100).toFixed(2));
  const shipping = cart?.estimated_shipping || 0;
  const total = subtotal + shipping + fee;
  const totalItems = sellers.reduce((s, g) => s + g.items.reduce((ss, i) => ss + getQty(i.id, i.quantity), 0), 0);
  const hasOutOfStock = sellers.some((g) => g.items.some((i) => !i.inStock));
  const belowMin = subtotal < MIN_ORDER;
  const shortfall = Math.max(0, MIN_ORDER - subtotal);
  const canCheckout = !belowMin && !hasOutOfStock;

  if (status === "loading" && !cart) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        <span style={{ fontSize: 13, color: "#8a9e92" }}>Loading cart…</span>
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#8a9e92", marginBottom: 16, fontSize: 14 }}>{error}</p>
          <button onClick={() => dispatch(fetchCart())} style={{ padding: "10px 24px", background: "#d4783c", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", fontFamily: "'Urbanist', system-ui, sans-serif", color: "#1c2b23" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: isMobile ? "20px 16px 48px" : "32px 28px 64px" }}>

        {/* Page title row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.3px", margin: 0 }}>
            Cart
            {sellers.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 600, color: "#b0c0b6", marginLeft: 10 }}>
                {totalItems} item{totalItems !== 1 ? "s" : ""} from {sellers.length} farm{sellers.length !== 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <Link href="/" style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", textDecoration: "none", transition: "color .12s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2d4a3e")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8a9e92")}
          >
            ← Continue shopping
          </Link>
        </div>

        {sellers.length === 0 ? (
          /* ── Empty state ── */
          <div style={{ textAlign: "center", padding: "72px 20px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#b0c0b6" strokeWidth="1.5" strokeLinecap="round" width={48} height={48} style={{ margin: "0 auto 16px", display: "block" }}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#3e5549", margin: "0 0 4px" }}>Your cart is empty</h2>
            <p style={{ fontSize: 13, color: "#8a9e92", marginBottom: 20 }}>Browse fresh produce from verified farms</p>
            <Link href="/" style={{ display: "inline-block", padding: "10px 24px", fontSize: 12.5, fontWeight: 700, color: "#2d4a3e", border: "1px solid #ebe7df", borderRadius: 6, background: "#fff", textDecoration: "none" }}>
              Browse products
            </Link>
          </div>
        ) : (
          /* ── Cart layout ── */
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 20, alignItems: "start" }}>

            {/* Left: seller groups */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Alerts */}
              {belowMin && (
                <div style={{ background: "#fff7f0", border: "1px solid #f0d0b0", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#d4783c" strokeWidth="2" strokeLinecap="round" width={15} height={15} style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span style={{ fontSize: 12.5, color: "#1c2b23" }}>
                    <strong>Minimum order ${MIN_ORDER.toFixed(2)}</strong> — add ${shortfall.toFixed(2)} more to proceed.
                  </span>
                </div>
              )}

              {hasOutOfStock && (
                <div style={{ background: "#fff0f0", border: "1px solid #f0b0b0", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#b43c3c" strokeWidth="2" strokeLinecap="round" width={15} height={15} style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span style={{ fontSize: 12.5, color: "#1c2b23" }}>Some items are out of stock. Remove them to continue.</span>
                </div>
              )}

              {/* Seller group cards */}
              {sellers.map((seller) => {
                const sub = sellerSub(seller.items);
                return (
                  <div key={seller.id} style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>

                    {/* Group header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(235,231,223,.4)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: avatarColor(seller.name), color: "#f5f1ea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {seller.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{seller.name}</span>
                        <span style={{ fontSize: 10.5, color: "#b0c0b6", marginLeft: 2 }}>Delivery {deliveryLabel}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>${sub.toFixed(2)}</div>
                        <div style={{ fontSize: 10, color: "#b0c0b6", marginTop: 1 }}>
                          {seller.shipping === 0 ? "Free shipping" : `$${seller.shipping.toFixed(2)} shipping`}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    {seller.items.map((item, idx) => {
                      const qty = getQty(item.id, item.quantity);
                      const lineTotal = item.price * qty;
                      return (
                        <div
                          key={item.id}
                          style={{
                            display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 12,
                            padding: "12px 16px", alignItems: "center",
                            borderBottom: idx < seller.items.length - 1 ? "1px solid rgba(235,231,223,.25)" : "none",
                          }}
                        >
                          {/* Image */}
                          <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", background: "#ebe7df", position: "relative", flexShrink: 0 }}>
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="56px" />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "#ebe7df" }} />
                            )}
                            {!item.inStock && (
                              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>Out of stock</span>
                              </div>
                            )}
                          </div>

                          {/* Name + unit */}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                            <div style={{ fontSize: 10.5, color: "#b0c0b6", marginTop: 1 }}>${item.price.toFixed(2)}/{item.unit}</div>
                          </div>

                          {/* Actions: qty + price + remove */}
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            {/* Qty stepper */}
                            <div style={{ display: "flex", alignItems: "center", border: "1px solid #ebe7df", borderRadius: 6, height: 32, overflow: "hidden" }}>
                              <button
                                onClick={() => updateQty(item.id, qty - 1, 1, item.maxStock)}
                                disabled={!item.inStock || qty <= 1}
                                style={{ width: 32, height: "100%", background: "#faf8f4", border: "none", cursor: qty <= 1 ? "default" : "pointer", color: qty <= 1 ? "#d0ccc6" : "#8a9e92", display: "flex", alignItems: "center", justifyContent: "center", transition: "color .12s" }}
                                onMouseEnter={(e) => { if (qty > 1) e.currentTarget.style.color = "#2d4a3e"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = qty <= 1 ? "#d0ccc6" : "#8a9e92"; }}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M5 12h14"/></svg>
                              </button>
                              <input
                                type="number"
                                value={qty}
                                min={1}
                                max={item.maxStock}
                                onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v)) updateQty(item.id, v, 1, item.maxStock); }}
                                style={{ width: 36, border: "none", borderLeft: "1px solid #ebe7df", borderRight: "1px solid #ebe7df", outline: "none", textAlign: "center", fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: "#1c2b23", background: "#fff", height: "100%", fontVariantNumeric: "tabular-nums" }}
                              />
                              <button
                                onClick={() => updateQty(item.id, qty + 1, 1, item.maxStock)}
                                disabled={!item.inStock || qty >= item.maxStock}
                                style={{ width: 32, height: "100%", background: "#faf8f4", border: "none", cursor: qty >= item.maxStock ? "default" : "pointer", color: qty >= item.maxStock ? "#d0ccc6" : "#8a9e92", display: "flex", alignItems: "center", justifyContent: "center", transition: "color .12s" }}
                                onMouseEnter={(e) => { if (qty < item.maxStock) e.currentTarget.style.color = "#2d4a3e"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = qty >= item.maxStock ? "#d0ccc6" : "#8a9e92"; }}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={14} height={14}><path d="M12 5v14M5 12h14"/></svg>
                              </button>
                            </div>

                            {/* Line total */}
                            <div style={{ textAlign: "right", minWidth: 60 }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>${lineTotal.toFixed(2)}</div>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => setPendingDelete({ id: item.id, name: item.name })}
                              style={{ padding: 6, color: "#b0c0b6", background: "none", border: "none", cursor: "pointer", borderRadius: 4, transition: "color .12s", display: "flex" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#b43c3c")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "#b0c0b6")}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}>
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Right: order summary */}
            <div style={{ position: "sticky", top: 80 }}>
              <div style={{ background: "#fff", border: "1px solid #ebe7df", borderRadius: 10, overflow: "hidden" }}>

                {/* Summary header */}
                <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #ebe7df" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#1c2b23" }}>Order summary</div>
                </div>

                {/* Summary rows */}
                <div style={{ padding: "14px 18px" }}>
                  {[
                    { label: `Subtotal (${totalItems} item${totalItems !== 1 ? "s" : ""})`, val: `$${subtotal.toFixed(2)}` },
                    { label: "Delivery", val: shipping === 0 ? "Free" : `$${shipping.toFixed(2)}` },
                    { label: `Platform fee (${feeRate.toFixed(0)}%)`, val: `$${fee.toFixed(2)}` },
                  ].map((row, i, arr) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: 12.5, borderBottom: i < arr.length - 1 ? "1px solid rgba(235,231,223,.3)" : "none" }}>
                      <span style={{ color: "#8a9e92", fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontWeight: 700, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderTop: "1px solid #ebe7df", background: "#faf8f4" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#1c2b23", letterSpacing: "-.2px", fontVariantNumeric: "tabular-nums" }}>${total.toFixed(2)}</span>
                </div>

                {/* CTA */}
                <div style={{ padding: "0 18px 18px", marginTop: 2 }}>
                  <Link
                    href="/checkout"
                    onClick={(e) => { if (!canCheckout) e.preventDefault(); }}
                    style={{
                      display: "block", width: "100%", padding: "13px 0", textAlign: "center",
                      background: canCheckout ? "#d4783c" : "#e0d8d0",
                      color: canCheckout ? "#fff" : "#b0a898",
                      fontSize: 13.5, fontWeight: 700, borderRadius: 999, textDecoration: "none",
                      cursor: canCheckout ? "pointer" : "not-allowed",
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) => { if (canCheckout) e.currentTarget.style.background = "#c06830"; }}
                    onMouseLeave={(e) => { if (canCheckout) e.currentTarget.style.background = "#d4783c"; }}
                  >
                    Proceed to checkout
                  </Link>
                  {belowMin && (
                    <p style={{ fontSize: 11, color: "#d4783c", textAlign: "center", marginTop: 8, margin: "8px 0 0" }}>
                      Add ${shortfall.toFixed(2)} more to unlock checkout
                    </p>
                  )}
                </div>

                {/* Note */}
                <div style={{ padding: "0 18px 14px" }}>
                  <p style={{ fontSize: 10, color: "#b0c0b6", textAlign: "center", lineHeight: 1.4 }}>
                    Prices include applicable taxes. Delivery dates are estimates.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {pendingDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} onClick={() => setPendingDelete(null)} />
          <div style={{ position: "relative", background: "#faf8f4", borderRadius: 12, padding: "24px", maxWidth: 320, width: "calc(100% - 40px)", border: "1px solid #ebe7df" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 6px" }}>Remove item?</h3>
            <p style={{ fontSize: 13, color: "#8a9e92", margin: "0 0 20px" }}>
              Remove <strong style={{ color: "#1c2b23" }}>{pendingDelete.name}</strong> from your cart?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPendingDelete(null)} style={{ flex: 1, padding: "10px 0", border: "1px solid #ebe7df", borderRadius: 6, background: "transparent", fontSize: 13, fontWeight: 600, color: "#1c2b23", cursor: "pointer", fontFamily: "inherit" }}>
                Keep it
              </button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 6, background: "#b43c3c", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
