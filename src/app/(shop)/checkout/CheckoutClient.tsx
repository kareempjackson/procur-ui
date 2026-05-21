"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { buyerApi, type SavedPaymentMethod } from "@/lib/api/buyerApi";
import { getEstimatedDeliveryRangeLabel } from "@/lib/utils/date";
import { selectCountry } from "@/store/slices/countrySlice";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { makeMoneyFormatter } from "@/lib/utils/formatMoney";

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
  if (lo.includes("card declined") || lo.includes("card_declined")) return "Your card was declined. Try a different card or payment method.";
  if (lo.includes("insufficient_funds") || lo.includes("insufficient funds")) return "The card was declined for insufficient funds. Try another card.";
  if (lo.includes("expired_card") || lo.includes("expired card")) return "Your card has expired. Update it on your saved cards.";
  if (lo.includes("processing_error") || lo.includes("processing error")) return "We couldn't process the card. Please try again.";
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
  { id: "credit_card" as const, label: "Credit / debit card", desc: "Visa, Mastercard, Amex. Charged immediately." },
  { id: "bank_transfer" as const, label: "Bank transfer", desc: "We'll send payment details after confirmation" },
  { id: "cash_on_delivery" as const, label: "Cash on delivery", desc: "Pay the driver at the time of delivery" },
  { id: "cheque_on_delivery" as const, label: "Cheque on delivery", desc: "Pay by cheque when goods arrive" },
];

type PayMethodId = (typeof PAYMENT_METHODS)[number]["id"];

// 32 departments + the capital district. Stored as state on the address row.
const COLOMBIA_DEPARTMENTS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Distrito Capital de Bogotá",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
];

export default function CheckoutClient() {
  return (
    <Elements stripe={getStripe()}>
      <CheckoutInner />
    </Elements>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const deliveryLabel = getEstimatedDeliveryRangeLabel();

  const { cart } = useAppSelector((s) => s.buyerCart);
  const { addresses, addressesStatus, createOrderStatus } = useAppSelector((s) => s.buyerOrders);
  const { creditAmount } = useAppSelector((s) => s.buyerCredits);
  const country = useAppSelector(selectCountry);
  const isColombia = country?.code === "col";
  const fmt = useMemo(() => makeMoneyFormatter(cart?.currency), [cart?.currency]);

  // Pickup is only available for single-seller carts where the seller has a pickup_address set.
  const singleSellerGroup =
    cart?.seller_groups.length === 1 ? cart.seller_groups[0] : null;
  const pickupAvailable = Boolean(singleSellerGroup?.pickup_address);

  const [fulfillmentMethod, setFulfillmentMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const isPickup = fulfillmentMethod === "pickup";

  // Card-only context: Colombia OR pickup. Same restriction in both cases.
  const cardOnlyContext = isColombia || isPickup;

  const visiblePaymentMethods = useMemo(
    () =>
      cardOnlyContext
        ? PAYMENT_METHODS.filter((m) => m.id === "credit_card")
        : PAYMENT_METHODS,
    [cardOnlyContext],
  );

  // Defend against cart edits that remove pickup availability mid-flow.
  useEffect(() => {
    if (!pickupAvailable && fulfillmentMethod === "pickup") {
      setFulfillmentMethod("delivery");
    }
  }, [pickupAvailable, fulfillmentMethod]);

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
  const [payMethod, setPayMethod] = useState<PayMethodId>("credit_card");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [savingAddr, setSavingAddr] = useState(false);
  const [addrError, setAddrError] = useState<string | null>(null);
  const [deletingAddrId, setDeletingAddrId] = useState<string | null>(null);

  // Stripe / saved-card state
  const stripe = useStripe();
  const elements = useElements();
  const [savedCards, setSavedCards] = useState<SavedPaymentMethod[]>([]);
  const [savedCardsLoaded, setSavedCardsLoaded] = useState(false);
  const [cardMode, setCardMode] = useState<"saved" | "new">("new");
  const [selectedSavedPmId, setSelectedSavedPmId] = useState<string>("");
  const [saveCardForLater, setSaveCardForLater] = useState(true);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

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

  // When the context only offers card payments (Colombia OR pickup), force the selection
  // to credit_card.
  useEffect(() => {
    if (cardOnlyContext && payMethod !== "credit_card") {
      setPayMethod("credit_card");
    }
  }, [cardOnlyContext, payMethod]);

  // Open the address form pre-filled with the country name so Colombian users don't have to
  // re-type it (and so the conditional Colombian layout renders immediately).
  useEffect(() => {
    if (isColombia && showAddrForm && !aCountry) {
      setACountry("Colombia");
    }
  }, [isColombia, showAddrForm, aCountry]);

  const addressFormIsColombia =
    isColombia || aCountry.trim().toLowerCase() === "colombia";

  useEffect(() => {
    let cancelled = false;
    buyerApi
      .listPaymentMethods()
      .then((cards) => {
        if (cancelled) return;
        setSavedCards(cards);
        setSavedCardsLoaded(true);
        if (cards.length > 0) {
          const def = cards.find((c) => c.is_default) ?? cards[0];
          setSelectedSavedPmId(def.id);
          setCardMode("saved");
        }
      })
      .catch(() => {
        if (!cancelled) setSavedCardsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const handleDeleteAddress = async (
    e: React.MouseEvent<HTMLButtonElement>,
    addressId: string,
  ) => {
    // The outer <label> wraps the whole card and binds the radio; without stopPropagation
    // the click would also select the address we're about to remove.
    e.preventDefault();
    e.stopPropagation();
    if (deletingAddrId) return;
    const confirmMsg = isColombia
      ? "¿Eliminar esta dirección?"
      : "Remove this delivery address?";
    if (typeof window !== "undefined" && !window.confirm(confirmMsg)) return;
    setDeletingAddrId(addressId);
    setAddrError(null);
    try {
      await buyerApi.deleteAddress(addressId);
      if (selectedAddr === addressId) setSelectedAddr("");
      await dispatch(fetchAddresses());
    } catch (err) {
      setAddrError(friendlyAddressError(err));
    } finally {
      setDeletingAddrId(null);
    }
  };

  const handleSaveAddress = async () => {
    // Colombia mode locks the country and requires departamento; the rest of the world keeps
    // the original lenient validation (street + city + country).
    const effectiveCountry = addressFormIsColombia ? "Colombia" : aCountry;
    if (!aStreet || !aCity || !effectiveCountry) {
      setAddrError(
        addressFormIsColombia
          ? "Dirección, ciudad y país son obligatorios."
          : "Street, city and country are required.",
      );
      return;
    }
    if (addressFormIsColombia && !aState) {
      setAddrError("Selecciona un departamento.");
      return;
    }
    setAddrError(null);
    setSavingAddr(true);
    try {
      const api = getApiClient();
      const res = await api.post("/buyers/addresses", {
        label: aName || "Home",
        contact_name: aName,
        street_address: aStreet,
        address_line2: aApt || undefined,
        city: aCity,
        state: aState || undefined,
        postal_code: aZip || undefined,
        country: effectiveCountry,
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

  const orderErrorRef = useRef<HTMLDivElement | null>(null);

  const showOrderError = (msg: string) => {
    setOrderError(msg);
    // Defer to next frame so the error block has mounted before we scroll.
    requestAnimationFrame(() => {
      orderErrorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  const validatePlaceOrder = (): string | null => {
    if (!cart || !cart.seller_groups?.length) {
      return "Your cart is empty. Add items before placing an order.";
    }
    if (!isPickup && !selectedAddr) {
      return "Choose a delivery address before placing your order.";
    }
    if (!payMethod) {
      return "Select a payment method to continue.";
    }
    if (payMethod === "credit_card") {
      if (cardMode === "new" && !cardComplete) {
        return (
          cardError ||
          "Enter complete card details (number, expiration, CVC) to continue."
        );
      }
      if (cardMode === "saved" && !selectedSavedPmId) {
        return "Pick a saved card or switch to enter a new card.";
      }
      if (!stripe || !elements) {
        return "Card payments aren't ready yet. Wait a moment and try again.";
      }
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    setOrderError(null);
    setCardError(null);
    const validationError = validatePlaceOrder();
    if (validationError) {
      showOrderError(validationError);
      return;
    }
    // Type guard: validatePlaceOrder rejects null/empty carts above.
    if (!cart) return;
    setPlacing(true);
    try {
      const items = cart.seller_groups.flatMap((g) =>
        g.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
      );
      const creditsAppliedCents = Math.round(creditsApplied * 100);

      // Address fields are omitted for pickup orders; the backend writes shipping_address: null.
      const addressFields = isPickup
        ? {}
        : { shipping_address_id: selectedAddr, billing_address_id: selectedAddr };

      if (payMethod === "credit_card") {
        const orderId = await placeCreditCardOrder({
          items,
          ...addressFields,
          buyer_notes: notes || undefined,
          credits_applied_cents: creditsAppliedCents > 0 ? creditsAppliedCents : undefined,
          fulfillment_method: fulfillmentMethod,
        });
        dispatch(fetchCart());
        dispatch(fetchOrders({ page: 1, limit: 20 } as any));
        if (orderId) router.push(`/order-confirmation/${orderId}`);
        return;
      }

      const created = await dispatch(createOrder({
        items,
        ...addressFields,
        buyer_notes: notes || undefined,
        credits_applied_cents: creditsAppliedCents > 0 ? creditsAppliedCents : undefined,
        payment_method: payMethod,
        fulfillment_method: fulfillmentMethod,
      })).unwrap();

      const orderId = (created as any)?.id || (created as any)?.order?.id || (created as any)?.data?.id || (created as any)?.data?.order?.id;
      dispatch(fetchCart());
      dispatch(fetchOrders({ page: 1, limit: 20 } as any));
      if (orderId) {
        router.push(`/order-confirmation/${orderId}`);
      } else {
        showOrderError("Order placed, but we couldn't load confirmation. Check your Orders page.");
      }
    } catch (e) {
      showOrderError(friendlyOrderError(e));
    } finally {
      setPlacing(false);
    }
  };

  /**
   * Places an order paid by credit card.
   *
   * Flow:
   *  1. Mint a Stripe PaymentMethod (saved-card path: reuse stored pm_; new-card path: createPaymentMethod via Elements).
   *  2. POST /buyers/orders — server creates+confirms a PaymentIntent.
   *  3. If server replies requires_action, drive Stripe.confirmCardPayment client-side (3DS).
   *  4. Retry POST /buyers/orders with stripe_payment_intent_id so the server reuses the now-succeeded intent.
   */
  const placeCreditCardOrder = async (
    base: {
      items: { product_id: string; quantity: number }[];
      shipping_address_id?: string;
      billing_address_id?: string;
      buyer_notes?: string;
      credits_applied_cents?: number;
      fulfillment_method?: "delivery" | "pickup";
    },
  ): Promise<string | null> => {
    if (!stripe) {
      throw new Error("Card payments are not ready yet. Please try again in a moment.");
    }

    // 1. Resolve a Stripe PaymentMethod id.
    let stripePaymentMethodId: string;
    let savePaymentMethod = false;
    if (cardMode === "saved") {
      if (!selectedSavedPmId) {
        throw new Error("Select a saved card to continue.");
      }
      const card = savedCards.find((c) => c.id === selectedSavedPmId);
      if (!card) throw new Error("Saved card no longer available.");
      stripePaymentMethodId = card.stripe_payment_method_id;
    } else {
      const cardEl = elements?.getElement(CardElement);
      if (!cardEl) throw new Error("Card form is not ready. Please try again.");
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardEl,
      });
      if (error || !paymentMethod) {
        throw new Error(error?.message || "Card details are invalid.");
      }
      stripePaymentMethodId = paymentMethod.id;
      savePaymentMethod = saveCardForLater;
    }

    // 2. First attempt: server creates + confirms PaymentIntent.
    const api = getApiClient();
    const tryCreate = async (extra: {
      stripe_payment_intent_id?: string;
    }) => {
      try {
        const res = await api.post("/buyers/orders", {
          ...base,
          payment_method: "credit_card",
          stripe_payment_method_id: stripePaymentMethodId,
          save_payment_method: savePaymentMethod,
          ...extra,
        });
        return { ok: true as const, data: res.data };
      } catch (err: any) {
        const data = err?.response?.data;
        // Server signals 3DS handoff via { requires_action, client_secret, payment_intent_id }
        const reqAction =
          data?.requires_action ||
          (typeof data?.message === "object" && (data.message as any)?.requires_action);
        if (reqAction) {
          const payload =
            data?.requires_action ? data : (data?.message as any);
          return {
            ok: false as const,
            requiresAction: true as const,
            clientSecret: payload.client_secret as string,
            paymentIntentId: payload.payment_intent_id as string,
          };
        }
        throw err;
      }
    };

    let result = await tryCreate({});
    if (!result.ok && result.requiresAction) {
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(result.clientSecret);
      if (confirmError || !paymentIntent || paymentIntent.status !== "succeeded") {
        throw new Error(
          confirmError?.message || "Card authentication failed. Try a different card.",
        );
      }
      // Retry with the now-succeeded PaymentIntent id; server skips creation and uses it.
      result = await tryCreate({ stripe_payment_intent_id: paymentIntent.id });
      if (!result.ok) {
        throw new Error("Payment authenticated but order creation failed. Contact support.");
      }
    }

    if (!result.ok) {
      throw new Error("Could not place card order.");
    }
    const created = result.data;
    return (
      created?.id ||
      created?.order?.id ||
      created?.data?.id ||
      created?.data?.order?.id ||
      null
    );
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
                {/* Fulfillment method picker — only shown when the cart's single seller offers pickup */}
                {pickupAvailable && singleSellerGroup && (
                  <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "20px", marginBottom: 14 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 12px" }}>
                      {isColombia ? "¿Cómo quieres recibirlo?" : "How would you like to receive it?"}
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(["delivery", "pickup"] as const).map((m) => (
                        <label key={m} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${fulfillmentMethod === m ? "#2d4a3e" : "#e8e4dc"}`, background: fulfillmentMethod === m ? "rgba(45,74,62,.06)" : "#fff", cursor: "pointer" }}>
                          <input type="radio" name="fulfillment" value={m} checked={fulfillmentMethod === m} onChange={() => setFulfillmentMethod(m)} style={{ marginTop: 2, accentColor: "#2d4a3e", flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>
                              {m === "delivery"
                                ? isColombia ? "Entrega a domicilio" : "Delivery"
                                : isColombia ? "Recoger en el local" : "Pickup"}
                            </div>
                            <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 1 }}>
                              {m === "delivery"
                                ? isColombia ? "Courier a tu dirección guardada" : "Courier to your saved address"
                                : isColombia
                                  ? `Recoge en ${singleSellerGroup.seller_name}, pago con tarjeta`
                                  : `Collect from ${singleSellerGroup.seller_name}, paid by card`}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pickup location card — replaces the delivery-address picker when pickup is selected */}
                {isPickup && singleSellerGroup?.pickup_address && (
                  <div style={{ background: "#f5f1ea", borderRadius: 12, border: "1px solid #e8e4dc", padding: "20px", marginBottom: 14 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23", margin: "0 0 8px" }}>
                      {isColombia ? "Recoger en" : "Pickup at"}
                    </h2>
                    <div style={{ fontSize: 13, color: "#1c2b23", fontWeight: 600 }}>{singleSellerGroup.seller_name}</div>
                    <div style={{ fontSize: 12.5, color: "#3e5549", marginTop: 6, lineHeight: 1.55 }}>
                      {(() => {
                        const a = singleSellerGroup.pickup_address!;
                        const line1 = [a.street_address, a.address_line2].filter(Boolean).join(", ");
                        const line2 = [a.city, a.state, a.postal_code].filter(Boolean).join(", ");
                        const line3 = a.country;
                        return (
                          <>
                            {line1 && <div>{line1}</div>}
                            {line2 && <div>{line2}</div>}
                            {line3 && <div>{line3}</div>}
                            {(a.contact_name || a.contact_phone) && (
                              <div style={{ marginTop: 8, color: "#1c2b23" }}>
                                {[a.contact_name, a.contact_phone].filter(Boolean).join(" · ")}
                              </div>
                            )}
                            {a.hours && (
                              <div style={{ marginTop: 4, color: "#8a9e92" }}>{a.hours}</div>
                            )}
                            {a.instructions && (
                              <div style={{ marginTop: 8, padding: "8px 10px", background: "#fff", borderRadius: 8, border: "1px solid #e8e4dc", color: "#3e5549" }}>
                                {a.instructions}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <p style={{ fontSize: 11.5, color: "#8a9e92", marginTop: 12, marginBottom: 0 }}>
                      {isColombia
                        ? "Pago con tarjeta hoy. Muestra esta confirmación al recoger."
                        : "Paid by card today. Show this confirmation when collecting."}
                    </p>
                  </div>
                )}

                {/* Delivery address — hidden when picking up */}
                {!isPickup && (
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
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b23" }}>{addr.label}{addr.isDefault && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: "#2d4a3e", background: "rgba(45,74,62,.1)", padding: "1px 6px", borderRadius: 4 }}>Default</span>}</div>
                          <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 2 }}>{addr.street}{addr.apt ? `, ${addr.apt}` : ""}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</div>
                          {addr.phone && <div style={{ fontSize: 11.5, color: "#8a9e92", marginTop: 1 }}>{addr.phone}</div>}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAddress(e, addr.id)}
                          disabled={deletingAddrId === addr.id}
                          aria-label={isColombia ? "Eliminar dirección" : "Remove address"}
                          title={isColombia ? "Eliminar" : "Remove"}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#c0392b",
                            cursor: deletingAddrId === addr.id ? "wait" : "pointer",
                            padding: 6,
                            alignSelf: "flex-start",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: deletingAddrId === addr.id ? 0.4 : 1,
                            transition: "opacity .15s",
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width={16}
                            height={16}
                            aria-hidden="true"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </label>
                    ))}
                  </div>

                  {/* Add address form */}
                  {showAddrForm && (
                    <div style={{ marginTop: 14, padding: 16, background: "#fff", borderRadius: 10, border: "1px solid #e8e4dc" }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", margin: "0 0 12px" }}>
                        {addressFormIsColombia ? "Nueva dirección" : "New address"}
                      </h3>
                      {addressFormIsColombia ? (
                        // Colombia-specific layout: locked country, departamento dropdown,
                        // Spanish field labels with the data mapped onto the same backend schema
                        // (state ← departamento, address_line2 ← información adicional, etc.)
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <input placeholder="Nombre / etiqueta (ej. Casa, Oficina)" value={aName} onChange={(e) => setAName(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                          <input placeholder="Dirección * (Ej: Calle 100 #15-20)" value={aStreet} onChange={(e) => setAStreet(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                          <input placeholder="Información adicional (apto, piso, conjunto, barrio)" value={aApt} onChange={(e) => setAApt(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                          <input placeholder="Ciudad / Municipio *" value={aCity} onChange={(e) => setACity(e.target.value)} style={INPUT} />
                          <select value={aState} onChange={(e) => setAState(e.target.value)} style={INPUT}>
                            <option value="">Departamento *</option>
                            {COLOMBIA_DEPARTMENTS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <input placeholder="Código postal (opcional)" value={aZip} onChange={(e) => setAZip(e.target.value)} style={INPUT} />
                          <input value="Colombia" readOnly style={{ ...INPUT, color: "#8a9e92", background: "#f5f1ea" }} />
                          <input placeholder="Teléfono (Ej: 300 123 4567)" value={aPhone} onChange={(e) => setAPhone(e.target.value)} style={{ ...INPUT, gridColumn: "1 / -1" }} />
                        </div>
                      ) : (
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
                      )}
                      {addrError && <p style={{ fontSize: 12, color: "#c0392b", margin: "8px 0 0" }}>{addrError}</p>}
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={() => setShowAddrForm(false)} style={{ flex: 1, padding: "9px 0", border: "1px solid #e8e4dc", borderRadius: 999, background: "transparent", fontSize: 12, fontWeight: 600, color: "#8a9e92", cursor: "pointer", fontFamily: "inherit" }}>
                          {addressFormIsColombia ? "Cancelar" : "Cancel"}
                        </button>
                        <button onClick={handleSaveAddress} disabled={savingAddr} style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 999, background: "#2d4a3e", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                          {savingAddr
                            ? addressFormIsColombia ? "Guardando…" : "Saving…"
                            : addressFormIsColombia ? "Guardar dirección" : "Save address"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}

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
                              <div style={{ fontSize: 11.5, color: "#8a9e92" }}>Qty {item.qty} × {fmt(item.price)}/{item.unit}</div>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>{fmt(item.price * item.qty)}</div>
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
                  {isColombia && (
                    <p style={{ fontSize: 12, color: "#8a9e92", margin: "0 0 10px" }}>
                      Card payments only in Colombia. Pago seguro con Visa, Mastercard, American Express o tarjeta débito.
                    </p>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {visiblePaymentMethods.map((m) => (
                      <label key={m.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${payMethod === m.id ? "#2d4a3e" : "#e8e4dc"}`, background: payMethod === m.id ? "rgba(45,74,62,.06)" : "#fff", cursor: "pointer" }}>
                        <input type="radio" name="payment" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} style={{ marginTop: 2, accentColor: "#2d4a3e", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>{m.label}</div>
                          <div style={{ fontSize: 12, color: "#8a9e92", marginTop: 1 }}>{m.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Credit card details (saved or new) */}
                  {payMethod === "credit_card" && (
                    <div style={{ marginTop: 14, padding: 14, background: "#fff", borderRadius: 10, border: "1px solid #e8e4dc" }}>
                      {savedCards.length > 0 && (
                        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#1c2b23", cursor: "pointer" }}>
                            <input type="radio" name="cardMode" checked={cardMode === "saved"} onChange={() => setCardMode("saved")} style={{ accentColor: "#2d4a3e" }} />
                            Use saved card
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#1c2b23", cursor: "pointer" }}>
                            <input type="radio" name="cardMode" checked={cardMode === "new"} onChange={() => setCardMode("new")} style={{ accentColor: "#2d4a3e" }} />
                            Use new card
                          </label>
                        </div>
                      )}

                      {cardMode === "saved" && savedCards.length > 0 && (
                        <select
                          value={selectedSavedPmId}
                          onChange={(e) => setSelectedSavedPmId(e.target.value)}
                          style={{ ...INPUT, padding: "10px 12px" }}
                        >
                          {savedCards.map((c) => (
                            <option key={c.id} value={c.id}>
                              {(c.brand || "card").toUpperCase()} •••• {c.last4 || "????"} (exp {String(c.exp_month).padStart(2, "0")}/{String(c.exp_year).slice(-2)})
                              {c.is_default ? " — default" : ""}
                            </option>
                          ))}
                        </select>
                      )}

                      {cardMode === "new" && (
                        <>
                          <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #e8e4dc", background: "#fafaf9" }}>
                            <CardElement
                              options={{
                                style: {
                                  base: {
                                    fontSize: "13px",
                                    color: "#1c2b23",
                                    fontFamily: "'Urbanist', system-ui, sans-serif",
                                    "::placeholder": { color: "#8a9e92" },
                                  },
                                  invalid: { color: "#c0392b" },
                                },
                                hidePostalCode: true,
                              }}
                              onChange={(e) => {
                                setCardComplete(e.complete);
                                setCardError(e.error?.message || null);
                              }}
                            />
                          </div>
                          {cardError && (
                            <div style={{ marginTop: 8, fontSize: 12, color: "#c0392b" }}>
                              {cardError}
                            </div>
                          )}
                          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 13, color: "#1c2b23", cursor: "pointer" }}>
                            <input type="checkbox" checked={saveCardForLater} onChange={(e) => setSaveCardForLater(e.target.checked)} style={{ accentColor: "#2d4a3e" }} />
                            Save this card for next time
                          </label>
                        </>
                      )}

                      {savedCardsLoaded && savedCards.length === 0 && cardMode === "saved" && (
                        <p style={{ fontSize: 12, color: "#8a9e92" }}>No saved cards yet. Enter a new card above.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Credits */}
                {creditAmount > 0 && (
                  <div style={{ background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23" }}>Store credits</div>
                      <div style={{ fontSize: 12, color: "#6ee7b7" }}>{fmt(creditsApplied)} will be applied</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b23" }}>{fmt(creditAmount)}</div>
                  </div>
                )}

                {orderError && (
                  <div
                    ref={orderErrorRef}
                    role="alert"
                    aria-live="polite"
                    style={{ background: "#fff0f0", border: "1px solid #f0b0b0", borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#c0392b" }}
                  >
                    {orderError}
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  style={{ width: "100%", padding: "14px 0", border: "none", borderRadius: 999, background: placing ? "#ccc" : "#d4783c", color: "#fff", fontSize: 14, fontWeight: 700, cursor: placing ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "-.1px" }}
                >
                  {placing
                    ? "Placing order…"
                    : payMethod === "credit_card"
                      ? `Pay ${fmt(finalTotal)} & place order`
                      : `Place order — ${fmt(finalTotal)}`}
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
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>{fmt(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#8a9e92" }}>Tax</span>
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>{fmt(0)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#8a9e92" }}>Buyer Shipping</span>
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>{fmt(shipping)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#8a9e92" }}>Transaction Fee{feeRate > 0 ? ` (${feeRate.toFixed(1)}%)` : ""}</span>
                  <span style={{ fontWeight: 600, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>{fmt(feeAmt)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px dashed #e8e4dc", paddingTop: 9, marginTop: 2 }}>
                  <span style={{ color: creditsApplied > 0 ? "#059669" : "#8a9e92" }}>Discount</span>
                  <span style={{ fontWeight: 600, color: creditsApplied > 0 ? "#059669" : "#1c2b23", fontVariantNumeric: "tabular-nums" }}>
                    {creditsApplied > 0 ? `-${fmt(creditsApplied)}` : fmt(0)}
                  </span>
                </div>
                <div style={{ height: 1, background: "#e8e4dc" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1c2b23" }}>Total paid by buyer</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", fontVariantNumeric: "tabular-nums" }}>{fmt(finalTotal)}</span>
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
