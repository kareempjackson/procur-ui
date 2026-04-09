"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCart } from "@/store/slices/buyerCartSlice";
import {
  fetchAddresses,
  fetchOrders,
  createOrder,
  resetCreateOrderStatus,
} from "@/store/slices/buyerOrdersSlice";
import { fetchBuyerCreditBalance } from "@/store/slices/buyerCreditsSlice";
import { getApiClient } from "@/lib/apiClient";
import { getEstimatedDeliveryRangeLabel } from "@/lib/utils/date";
import { selectCountry } from "@/store/slices/countrySlice";

type Step = "delivery" | "payment";

function extractRaw(e: unknown): string {
  if (typeof e === "string") return e;
  if (e && typeof e === "object") {
    const m = (e as any)?.message ?? (e as any)?.payload ?? "";
    if (typeof m === "string") return m;
  }
  return "";
}

function friendlyOrderError(e: unknown): string {
  const raw = extractRaw(e);
  const lo = raw.toLowerCase();
  if (lo.includes("insufficient stock")) {
    const m = raw.match(/insufficient stock for product (.+)/i);
    return m ? `"${m[1]}" is out of stock at that quantity. Please update your cart.` : "One or more items ran out of stock. Please update your cart.";
  }
  if (lo.includes("address not found")) return "The selected address is no longer valid. Please choose another.";
  if (lo.includes("product") && lo.includes("not found")) return "Some items are no longer available. Please update your cart.";
  if (lo.includes("unauthorized") || lo.includes("forbidden") || lo.includes("expired token")) return "Your session expired. Please sign in again.";
  if (lo.includes("network") || lo.includes("timeout")) return "Connection issue. Check your internet and try again.";
  if (lo.includes("failed to create") || lo.includes("database") || lo.includes("exception")) return "Server error. Please try again in a moment.";
  if (raw && raw.length < 140) return raw;
  return "Couldn't place your order. Please try again or contact support.";
}

function friendlyAddressError(e: unknown): string {
  const status = (e as any)?.response?.status;
  const data = (e as any)?.response?.data;
  if (status === 401 || status === 403) return "Your session expired. Please sign in again.";
  if (data?.message) {
    if (Array.isArray(data.message)) return "Please fill in all required address fields.";
    const m = data.message as string;
    if (m.toLowerCase().includes("duplicate") || m.toLowerCase().includes("already exists")) return "This address is already saved.";
    if (m.length < 140) return m;
  }
  if (status === 422 || status === 400) return "Please check your address details.";
  return "Failed to save address. Please check your details and try again.";
}

const INPUT: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 8, border: "1px solid #e8e4dc",
  background: "#fff", fontSize: 13, color: "#1c2b23", outline: "none",
  fontFamily: "'Urbanist', system-ui, sans-serif", boxSizing: "border-box",
};

const PAYMENT_METHODS = [
  { id: "bank_transfer" as const, label: "Bank transfer", desc: "We'll send payment details after confirmation" },
  { id: "cash_on_delivery" as const, label: "Cash on delivery", desc: "Pay the driver at the time of delivery" },
  { id: "cheque_on_delivery" as const, label: "Cheque on delivery", desc: "Pay by cheque when goods arrive" },
];

export default function CheckoutClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deliveryLabel = getEstimatedDeliveryRangeLabel();

  const { cart } = useAppSelector((s) => s.buyerCart);
  const { addresses, addressesStatus, createOrderStatus } = useAppSelector((s) => s.buyerOrders);
  const { creditAmount } = useAppSelector((s) => s.buyerCredits);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [step, setStep] = useState<Step>("delivery");
  const [selectedAddr, setSelectedAddr] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [payMethod, setPayMethod] = useState<"bank_transfer" | "cash_on_delivery" | "cheque_on_delivery">("bank_transfer");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [savingAddr, setSavingAddr] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);

  // New address form fields
  const [aName, setAName] = useState("");
  const [aStreet, setAStreet] = useState("");
  const [aApt, setAApt] = useState("");
  const [aCity, setACity] = useState("");
  const [aState, setAState] = useState("");
  const [aZip, setAZip] = useState("");
  const [aCountry, setACountry] = useState("");
  const [aPhone, setAPhone] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
    dispatch(fetchBuyerCreditBalance());
  }, [dispatch]);

  // Auto-select default or first address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddr) {
      const def = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddr(def.id);
    }
  }, [addresses, selectedAddr]);

  useEffect(() => {
    if (createOrderStatus === "succeeded") dispatch(resetCreateOrderStatus());
  }, [createOrderStatus, dispatch]);

  const addrs = addresses.map((a: any) => ({
    id: a.id,
    label: a.label || a.type || "Address",
    name: a.contact_name || "",
    street: a.street_address || a.address_line1,
    apt: a.address_line2 || "",
    city: a.city,
    state: a.state,
    zip: a.postal_code,
    country: a.country,
    phone: a.contact_phone || "",
    isDefault: a.is_default,
  }));

  const selectedAddrData = addrs.find((a) => a.id === selectedAddr);

  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.estimated_shipping || 0;
  const feeAmt = cart?.platform_fee_amount || 0;
  const feeRate = cart?.platform_fee_percent || 0;
  const cartTotal = cart?.total || 0;
  const creditsApplied = Math.min(creditAmount, cartTotal);
  const finalTotal = Math.max(0, cartTotal - creditsApplied);

  const sellers = cart?.seller_groups.map((g) => ({
    id: g.seller_org_id,
    name: g.seller_name,
    items: g.items.map((i) => ({
      id: i.id,
      name: i.product_name,
      image: i.image_url || "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
      price: i.unit_price,
      qty: i.quantity,
      unit: i.unit_of_measurement,
    })),
    subtotal: g.subtotal,
  })) || [];

  const totalItems = cart?.total_items || 0;

  const handleSaveAddress = async () => {
    if (!aStreet || !aCity || !aCountry) { setAddrError("Street, city and country are required."); return; }
    setAddrError(null);
    setSavingAddr(true);
    try {
      const api = getApiClient(() => null);
      const res = await api.post("/buyers/addresses", {
        label: aName || "Home",
        contact_name: aName,
        street_address: aStreet,
        address_line2: aApt || undefined,
        city: aCity,
        state: aState || undefined,
        postal_code: aZip || undefined,
        country: aCountry,
        contact_phone: aPhone || undefined,
      });
      const newId = res.data?.id || res.data?.data?.id;
      await dispatch(fetchAddresses());
      if (newId) setSelectedAddr(newId);
      setShowAddrForm(false);
      setAName(""); setAStreet(""); setAApt(""); setACity(""); setAState(""); setAZip(""); setACountry(""); setAPhone("");
    } catch (e) {
      setAddrError(friendlyAddressError(e));
    } finally {
      setSavingAddr(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || !selectedAddr) return;
    setOrderError(null);
    setPlacing(true);
    try {
      const items = cart.seller_groups.flatMap((g) =>
        g.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
      );
      const creditsAppliedCents = Math.round(creditsApplied * 100);
      const created = await dispatch(createOrder({
        items,
        shipping_address_id: selectedAddr,
        billing_address_id: selectedAddr,
        buyer_notes: notes || undefined,
        credits_applied_cents: creditsAppliedCents > 0 ? creditsAppliedCents : undefined,
        payment_method: payMethod,
      })).unwrap();

      const orderId = (created as any)?.id || (created as any)?.order?.id || (created as any)?.data?.id || (created as any)?.data?.order?.id;
      dispatch(fetchCart());
      dispatch(fetchOrders({ page: 1, limit: 20 } as any));
      if (orderId) {
        router.push(`/order-confirmation/${orderId}`);
      } else {
        setOrderError("Order placed, but we couldn't load confirmation. Check your Orders page.");
      }
    } catch (e) {
      setOrderError(friendlyOrderError(e));
    } finally {
      setPlacing(false);
    }
  };

  const canProceed = selectedAddr && (cart?.total_items || 0) > 0;

  if (!cart && addressesStatus === "loading") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4" }}>
        <div style={{ color: "#8a9e92", fontSize: 14 }}>Loading checkout…</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "20px 16px 48px" : "32px 20px 64px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <Link href="/cart" style={{ color: "#8a9e92", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={14} height={14}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Cart
          </Link>
          <span style={{ color: "#e8e4dc" }}>/</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", margin: 0, letterSpacing: "-.3px" }}>Checkout</h1>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
          {(["delivery", "payment"] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
                  background: step === s ? "#2d4a3e" : (i < (step === "payment" ? 1 : 0) ? "#2d4a3e" : "#f5f1ea"),
                  color: step === s || i < (step === "payment" ? 1 : 0) ? "#fff" : "#8a9e92",
                  border: `1px solid ${step === s || i < (step === "payment" ? 1 : 0) ? "#2d4a3e" : "#e8e4dc"}`,
                }}>
                  {i < (step === "payment" ? 1 : -1) ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width={12} height={12}><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (i + 1)}
                </div>
                <span style={{ fontSize: 13, fontWeight: step === s ? 700 : 500, color: step === s ? "#1c2b23" : "#8a9e92" }}>
                  {s === "delivery" ? "Delivery" : "Payment"}
                </span>
              </div>
              {i < 1 && <div style={{ flex: 1, height: 1, background: "#e8e4dc", margin: "0 12px", maxWidth: 60 }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 20, alignItems: "start" }}>

          {/* Main panel */}
          <div>
            {step === "delivery" && (
              <div>
                {/* Delivery address */}
                <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "20px", marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Delivery address</h2>
                    <button onClick={() => setShowAddrForm(!showAddrForm)} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, color: "#d4783c", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={12} height={12}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      Add new
                    </button>
                  </div>

                  {/* Address list */}
                  {addrs.length === 0 && !showAddrForm && (
                    <p style={{ fontSize: 13, color: "#8a9e92" }}>No addresses saved yet. Add one below.</p>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {addrs.map((addr) => (
                      <label key={addr.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${selectedAddr === addr.id ? "#2d4a3e" : "#e8e4dc"}`, background: selectedAddr === addr.id ? "rgba(45,74,62,.06)" : "#fff", cursor: "pointer" }}>
                        <input type="radio" name="address" value={addr.id} checked={selectedAddr === addr.id} onChange={() => setSelectedAddr(addr.id)} style={{ marginTop: 2, accentColor: "#2d4a3e", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23" }}>{addr.label}{addr.isDefault && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: "#2d4a3e", background: "rgba(45,74,62,.1)", padding: "1px 6px", borderRadius: 4 }}>Default</span>}</div>
                          <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 2 }}>{addr.street}{addr.apt ? `, ${addr.apt}` : ""}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</div>
                          {addr.phone && <div style={{ fontSize: 11.5, color: "#8a9e92", marginTop: 1 }}>{addr.phone}</div>}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Add address form */}
                  {showAddrForm && (
                    <div style={{ marginTop: 14, padding: 16, background: "#fff", borderRadius: 10, border: "1px solid #e8e4dc" }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 12px" }}>New address</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input placeholder="Full name / label" value={aName} onChange={(e) => setAName(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                        <input placeholder="Street address *" value={aStreet} onChange={(e) => setAStreet(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                        <input placeholder="Apt / suite" value={aApt} onChange={(e) => setAApt(e.target.value)} style={INPUT} />
                        <input placeholder="City *" value={aCity} onChange={(e) => setACity(e.target.value)} style={INPUT} />
                        <input placeholder="State / parish" value={aState} onChange={(e) => setAState(e.target.value)} style={INPUT} />
                        <input placeholder="Postal code" value={aZip} onChange={(e) => setAZip(e.target.value)} style={INPUT} />
                        <input placeholder="Country *" value={aCountry} onChange={(e) => setACountry(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                        <input placeholder="Phone" value={aPhone} onChange={(e) => setAPhone(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                      </div>
                      {addrError && <p style={{ fontSize: 12, color: "#c0392b", margin: "8px 0 0" }}>{addrError}</p>}
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={() => setShowAddrForm(false)} style={{ flex: 1, padding: "9px 0", border: "1px solid #e8e4dc", borderRadius: 999, background: "transparent", fontSize: 12, fontWeight: 600, color: "#8a9e92", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        <button onClick={handleSaveAddress} disabled={savingAddr} style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 999, background: "#2d4a3e", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                          {savingAddr ? "Saving…" : "Save address"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery notes */}
                <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "20px", marginBottom: 14 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 10px" }}>Delivery instructions <span style={{ fontSize: 12, fontWeight: 400, color: "#8a9e92" }}>(optional)</span></h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Gate code, landmark, special handling…"
                    rows={3}
                    style={{ ...INPUT, resize: "vertical" }}
                  />
                </div>

                {/* Items in this order */}
                <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "20px" }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 14px" }}>Your order ({totalItems} items)</h2>
                  {sellers.map((g) => (
                    <div key={g.id} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#2d4a3e", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>{g.name}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {g.items.map((item) => (
                          <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ position: "relative", width: 44, height: 44, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                              <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                              <div style={{ fontSize: 11.5, color: "#8a9e92" }}>Qty {item.qty} × ${item.price.toFixed(2)}/{item.unit}</div>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>${(item.price * item.qty).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { if (canProceed) setStep("payment"); }}
                  disabled={!canProceed}
                  style={{ width: "100%", marginTop: 16, padding: "14px 0", border: "none", borderRadius: 999, background: canProceed ? "#d4783c" : "#ccc", color: canProceed ? "#fff" : "#999", fontSize: 14, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: "-.1px" }}
                >
                  Continue to payment
                </button>
                {!selectedAddr && <p style={{ fontSize: 12, color: "#8a9e92", textAlign: "center", marginTop: 6 }}>Select a delivery address to continue</p>}
              </div>
            )}

            {step === "payment" && (
              <div>
                {/* Selected address summary */}
                <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "16px 20px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#8a9e92", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Delivering to</div>
                    {selectedAddrData ? (
                      <>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23" }}>{selectedAddrData.label}</div>
                        <div style={{ fontSize: 12, color: "#8a9e92" }}>{selectedAddrData.street}, {selectedAddrData.city}, {selectedAddrData.country}</div>
                      </>
                    ) : <div style={{ fontSize: 13, color: "#8a9e92" }}>No address selected</div>}
                  </div>
                  <button onClick={() => setStep("delivery")} style={{ fontSize: 12, fontWeight: 600, color: "#d4783c", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Change</button>
                </div>

                {/* Payment method */}
                <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "20px", marginBottom: 14 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 14px" }}>Payment method</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {PAYMENT_METHODS.map((m) => (
                      <label key={m.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${payMethod === m.id ? "#2d4a3e" : "#e8e4dc"}`, background: payMethod === m.id ? "rgba(45,74,62,.06)" : "#fff", cursor: "pointer" }}>
                        <input type="radio" name="payment" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} style={{ marginTop: 2, accentColor: "#2d4a3e", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{m.label}</div>
                          <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 1 }}>{m.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Credits */}
                {creditAmount > 0 && (
                  <div style={{ background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>Store credits</div>
                      <div style={{ fontSize: 12, color: "#6ee7b7" }}>${creditsApplied.toFixed(2)} will be applied</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23" }}>${creditAmount.toFixed(2)}</div>
                  </div>
                )}

                {orderError && (
                  <div style={{ background: "#fff0f0", border: "1px solid #f0b0b0", borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#c0392b" }}>
                    {orderError}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || !selectedAddr}
                  style={{ width: "100%", padding: "14px 0", border: "none", borderRadius: 999, background: placing ? "#ccc" : "#d4783c", color: "#fff", fontSize: 14, fontWeight: 700, cursor: placing ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "-.1px" }}
                >
                  {placing ? "Placing order…" : `Place order — $${finalTotal.toFixed(2)}`}
                </button>
                <p style={{ fontSize: 11.5, color: "#8a9e92", textAlign: "center", marginTop: 8 }}>By placing your order you agree to our Terms of Service</p>
              </div>
            )}
          </div>

          {/* Order totals sidebar */}
          <div style={{ position: "sticky", top: 72 }}>
            {/* Cross-country shipping notice */}
            {cart?.seller_groups?.some((g: { seller_org_id: string }) => {
              // Show notice if any seller is from a different country
              return g.seller_org_id; // simplified — backend handles actual cross-country detection
            }) && shipping > 0 && (
              <div style={{ background: "rgba(45,74,62,.05)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" strokeWidth="1.5" width={18} height={18} style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
                <p style={{ fontSize: 11.5, color: "#3e5549", lineHeight: 1.5, margin: 0 }}>
                  Shipping includes cross-country delivery where applicable. Rates are set by each seller.
                </p>
              </div>
            )}
            <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "18px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23", margin: "0 0 14px" }}>Order total</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#8a9e92" }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#8a9e92" }}>Tax</span>
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>$0.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#8a9e92" }}>Buyer Shipping</span>
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>${shipping.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#8a9e92" }}>Transaction Fee{feeRate > 0 ? ` (${feeRate.toFixed(1)}%)` : ""}</span>
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>${feeAmt.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px dashed #e8e4dc", paddingTop: 9, marginTop: 2 }}>
                  <span style={{ color: creditsApplied > 0 ? "#059669" : "#8a9e92" }}>Discount</span>
                  <span style={{ fontWeight: 600, color: creditsApplied > 0 ? "#059669" : "#1c2b23", fontVariantNumeric: "tabular-nums" }}>
                    {creditsApplied > 0 ? `-$${creditsApplied.toFixed(2)}` : "$0.00"}
                  </span>
                </div>
                <div style={{ height: 1, background: "#e8e4dc" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23" }}>Total paid by buyer</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #e8e4dc" }}>
                <div style={{ fontSize: 11, color: "#8a9e92", lineHeight: 1.55 }}>
                  Estimated delivery: <strong style={{ color: "#1c2b23" }}>{deliveryLabel}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
