"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  MapPinIcon,
  CreditCardIcon,
  BanknotesIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCart } from "@/store/slices/buyerCartSlice";
import {
  fetchAddresses,
  fetchOrders,
  createOrder,
  resetCreateOrderStatus,
} from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Demo data - will come from cart in real implementation
const demoOrderData = {
  sellers: [
    {
      id: "seller_1",
      name: "Caribbean Farms Co.",
      location: "Kingston, Jamaica",
      verified: true,
      items: [
        {
          id: "item_1",
          name: "Organic Cherry Tomatoes",
          image:
            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
          price: 3.5,
          quantity: 10,
          unit: "lb",
        },
        {
          id: "item_2",
          name: "Fresh Basil",
          image:
            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
          price: 8.5,
          quantity: 5,
          unit: "bunch",
        },
      ],
      subtotal: 77.5,
      shipping: 25.0,
      estimatedDelivery: "Oct 15, 2025",
    },
    {
      id: "seller_2",
      name: "Tropical Harvest Ltd",
      location: "Santo Domingo, DR",
      verified: true,
      items: [
        {
          id: "item_3",
          name: "Alphonso Mangoes",
          image:
            "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
          price: 4.2,
          quantity: 15,
          unit: "lb",
        },
      ],
      subtotal: 63.0,
      shipping: 30.0,
      estimatedDelivery: "Oct 12, 2025",
    },
  ],
};

const demoAddresses = [
  {
    id: "addr_1",
    label: "Home",
    name: "John Smith",
    street: "123 Main Street",
    apartment: "Apt 4B",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    country: "United States",
    phone: "(305) 555-0123",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Office",
    name: "John Smith",
    street: "456 Business Blvd",
    apartment: "Suite 200",
    city: "Miami",
    state: "FL",
    zipCode: "33102",
    country: "United States",
    phone: "(305) 555-0124",
    isDefault: false,
  },
];

const demoPaymentMethods = [
  {
    id: "pm_1",
    type: "card",
    cardBrand: "Visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    cardBrand: "Mastercard",
    last4: "5555",
    expiryMonth: "08",
    expiryYear: "2026",
    isDefault: false,
  },
];

type CheckoutStep = "shipping" | "review" | "payment";

export default function CheckoutClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux state
  const { cart, status: cartStatus } = useAppSelector(
    (state) => state.buyerCart
  );
  const { addresses, addressesStatus, createOrderStatus, createOrderError } =
    useAppSelector((state) => state.buyerOrders);

  // Local state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState(
    demoPaymentMethods[0].id
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  const [intentValid, setIntentValid] = useState<boolean>(false);

  // Payment method: card (Stripe), bank_transfer, cash
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "bank_transfer" | "cash"
  >("card");

  // Stripe publishable key handling
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = React.useMemo(() => {
    return publishableKey ? loadStripe(publishableKey) : null;
  }, [publishableKey]);

  // Auto-create a PaymentIntent when on card payment step
  useEffect(() => {
    if (
      currentStep === "payment" &&
      paymentMethod === "card" &&
      publishableKey &&
      selectedAddress &&
      !clientSecret &&
      !isStartingPayment
    ) {
      startPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, paymentMethod, publishableKey, selectedAddress]);

  // Reset PaymentElement readiness when the intent changes
  useEffect(() => {
    setPaymentElementReady(false);
    setIntentValid(false);
  }, [clientSecret]);

  // Verify client secret is valid for this publishable key before mounting PaymentElement
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!clientSecret || !stripePromise) return;
      const stripe = await stripePromise;
      if (!stripe) return;
      const res = await stripe.retrievePaymentIntent(clientSecret);
      if (cancelled) return;
      if (res.error) {
        setIntentValid(false);
        setPaymentError(
          res.error.message || "Invalid payment session. Please try again."
        );
      } else {
        setIntentValid(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientSecret, stripePromise]);

  // Unified Pay handler
  const handlePay = async () => {
    if (paymentMethod === "card") {
      if (!publishableKey) {
        setPaymentError("Payments are not configured.");
        return;
      }
      if (!clientSecret) {
        await startPayment();
      }
      // Optimistically refresh cart and orders so UI reflects changes after redirect
      dispatch(fetchCart());
      dispatch(fetchOrders({ page: 1, limit: 20 } as any));
      setAutoConfirm(true);
      return;
    }

    if (!cart || !selectedAddress) return;
    setPaymentError(null);
    setIsPlacingOrder(true);
    try {
      const items = cart.seller_groups.flatMap((g) =>
        g.items.map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
        }))
      );
      await dispatch(
        createOrder({
          items,
          shipping_address_id: selectedAddress,
          billing_address_id: selectedAddress,
          buyer_notes: deliveryInstructions || undefined,
        })
      ).unwrap();
      // Refresh cart and orders after order creation (non-card flows)
      dispatch(fetchCart());
      dispatch(fetchOrders({ page: 1, limit: 20 } as any));
    } catch (e: any) {
      setPaymentError(e?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // New address form state
  const [addrName, setAddrName] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrApartment, setAddrApartment] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [addrCountry, setAddrCountry] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);

  // Fetch cart and addresses on mount
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Set default address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddress(defaultAddr.id);
    }
  }, [addresses, selectedAddress]);

  // Handle successful order creation
  useEffect(() => {
    if (createOrderStatus === "succeeded") {
      // Redirect to order confirmation
      router.push("/buyer/order-confirmation");
      dispatch(resetCreateOrderStatus());
    }
  }, [createOrderStatus, router, dispatch]);

  const steps = [
    { id: "shipping", label: "Shipping", icon: TruckIcon },
    { id: "review", label: "Review", icon: CheckIcon },
    { id: "payment", label: "Payment", icon: CreditCardIcon },
  ];

  const getStepIndex = (step: CheckoutStep) =>
    steps.findIndex((s) => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  // Transform cart data for display
  const demoOrderData = cart
    ? {
        sellers: cart.seller_groups.map((group) => ({
          id: group.seller_org_id,
          name: group.seller_name,
          location: "Caribbean", // TODO: Get from API when available
          verified: false, // TODO: Get from API when available
          items: group.items.map((item) => ({
            id: item.id,
            name: item.product_name,
            image:
              item.image_url ||
              "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
            price: item.unit_price,
            quantity: item.quantity,
            unit: item.unit_of_measurement,
          })),
          subtotal: group.subtotal,
          shipping: group.estimated_shipping,
          estimatedDelivery: "Oct 15-20, 2025",
        })),
      }
    : { sellers: [] };

  const demoAddresses = addresses.map((addr: any) => ({
    id: addr.id,
    label: addr.label || addr.type || "Address",
    name: addr.contact_name || "", // TODO: Get from profile
    street: addr.street_address || addr.address_line1,
    apartment: addr.address_line2 || "",
    city: addr.city,
    state: addr.state,
    zipCode: addr.postal_code,
    country: addr.country,
    phone: addr.contact_phone || "",
    isDefault: addr.is_default,
  }));

  const calculateTotals = () => {
    if (!cart) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }

    return {
      subtotal: cart.subtotal,
      shipping: cart.estimated_shipping,
      tax: cart.estimated_tax,
      total: cart.total,
    };
  };

  const totals = calculateTotals();

  const startPayment = async () => {
    if (!cart || !selectedAddress) return;
    setPaymentError(null);
    setIsStartingPayment(true);
    try {
      const api = getApiClient();
      const { data } = await api.post("/buyers/checkout/payment-intent", {
        shipping_address_id: selectedAddress,
        billing_address_id: selectedAddress,
        buyer_notes: deliveryInstructions || undefined,
      });
      setClientSecret(data.client_secret);
      setOrderIds(data.order_ids || []);
    } catch (e: any) {
      setPaymentError(e?.message || "Failed to start payment");
    } finally {
      setIsStartingPayment(false);
    }
  };
  const selectedAddressData = demoAddresses.find(
    (addr) => addr.id === selectedAddress
  );
  const selectedPaymentData = demoPaymentMethods.find(
    (pm) => pm.id === selectedPayment
  );

  const handleNextStep = () => {
    if (currentStep === "shipping") setCurrentStep("review");
    else if (currentStep === "review") setCurrentStep("payment");
  };

  const handlePreviousStep = () => {
    if (currentStep === "payment") setCurrentStep("review");
    else if (currentStep === "review") setCurrentStep("shipping");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Header */}
      <div className="bg-white border-b border-[var(--secondary-soft-highlight)]/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/buyer/cart"
              className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="font-medium">Back to Cart</span>
            </Link>
            <Image
              src="/images/logos/procur-logo.svg"
              alt="Procur"
              width={100}
              height={28}
              className="h-7 w-auto"
            />
            <div className="w-24" /> {/* Spacer for centering */}
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = index < currentStepIndex;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[var(--primary-accent2)] text-white shadow-lg scale-110"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium mt-2 ${
                        isActive
                          ? "text-[var(--primary-accent2)]"
                          : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-4 rounded-full transition-all ${
                        index < currentStepIndex
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Step Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Step */}
            {currentStep === "shipping" && (
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6">
                <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                  Shipping Address
                </h2>

                {!showAddressForm ? (
                  <div className="space-y-4">
                    {demoAddresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedAddress === address.id
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[var(--secondary-black)]">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--secondary-black)]">
                              {address.name}
                            </p>
                            <p className="text-sm text-[var(--secondary-muted-edge)]">
                              {address.street}
                              {address.apartment && `, ${address.apartment}`}
                            </p>
                            <p className="text-sm text-[var(--secondary-muted-edge)]">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-[var(--secondary-muted-edge)]">
                              {address.phone}
                            </p>
                          </div>
                          <button
                            className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
                            onClick={(e) => {
                              e.preventDefault();
                              // Edit address
                            }}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </label>
                    ))}

                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full p-4 border-2 border-dashed border-[var(--secondary-soft-highlight)] rounded-xl text-[var(--primary-accent2)] hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addressError && (
                      <div className="p-3 text-sm rounded-lg border border-red-200 bg-red-50 text-red-700">
                        {addressError}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          Full Name
                        </label>
                        <input
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          placeholder="Name for delivery"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          Phone
                        </label>
                        <input
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          placeholder="e.g., (305) 555-0123"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          Street Address
                        </label>
                        <input
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          placeholder="123 Main Street"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          Apartment, Suite, etc (Optional)
                        </label>
                        <input
                          value={addrApartment}
                          onChange={(e) => setAddrApartment(e.target.value)}
                          placeholder="Apt 4B"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          City
                        </label>
                        <input
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          placeholder="City"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          State / Province
                        </label>
                        <input
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          placeholder="State"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          Postal Code
                        </label>
                        <input
                          value={addrZip}
                          onChange={(e) => setAddrZip(e.target.value)}
                          placeholder="ZIP / Postal Code"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--secondary-black)]">
                          Country
                        </label>
                        <input
                          value={addrCountry}
                          onChange={(e) => setAddrCountry(e.target.value)}
                          placeholder="Country"
                          className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                        />
                      </div>

                      {/* Live Map Preview */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                          Map Preview
                        </label>
                        <div className="rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/30 h-64">
                          <iframe
                            title="address-map"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                              [
                                addrStreet,
                                addrApartment,
                                addrCity,
                                addrState,
                                addrZip,
                                addrCountry,
                              ]
                                .filter(Boolean)
                                .join(", ")
                            )}&output=embed`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={async () => {
                          setAddressError(null);
                          if (
                            !addrStreet ||
                            !addrCity ||
                            !addrState ||
                            !addrZip ||
                            !addrCountry
                          ) {
                            setAddressError(
                              "Please complete street, city, state, postal code, and country."
                            );
                            return;
                          }
                          setIsSavingAddress(true);
                          try {
                            const api = getApiClient();
                            const { data } = await api.post(
                              "/buyers/addresses",
                              {
                                street_address: [addrStreet, addrApartment]
                                  .filter(Boolean)
                                  .join(", "),
                                city: addrCity,
                                state: addrState || undefined,
                                postal_code: addrZip || undefined,
                                country: addrCountry,
                                contact_name: addrName || undefined,
                                contact_phone: addrPhone || undefined,
                                is_default: false,
                                is_shipping: true,
                                is_billing: false,
                              }
                            );
                            await dispatch(fetchAddresses());
                            if (data?.id) {
                              setSelectedAddress(data.id);
                            }
                            setShowAddressForm(false);
                          } catch (e: any) {
                            setAddressError(
                              e?.message || "Failed to save address"
                            );
                          } finally {
                            setIsSavingAddress(false);
                          }
                        }}
                        disabled={isSavingAddress}
                        className="px-5 py-3 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors disabled:opacity-50"
                      >
                        {isSavingAddress ? "Saving..." : "Save Address"}
                      </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-sm text-[var(--primary-accent2)]"
                    >
                      Cancel
                    </button>
                    </div>
                  </div>
                )}

                {/* Delivery Instructions */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g., Leave at door, Ring doorbell, etc."
                    rows={3}
                    className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <div className="space-y-6">
                {/* Shipping Address Review */}
                <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--secondary-black)]">
                      Shipping Address
                    </h2>
                    <button
                      onClick={() => setCurrentStep("shipping")}
                      className="text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  {selectedAddressData && (
                    <div className="bg-[var(--primary-background)] rounded-lg p-4">
                      <p className="font-semibold text-[var(--secondary-black)]">
                        {selectedAddressData.name}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                        {selectedAddressData.street}
                        {selectedAddressData.apartment &&
                          `, ${selectedAddressData.apartment}`}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        {selectedAddressData.city}, {selectedAddressData.state}{" "}
                        {selectedAddressData.zipCode}
                      </p>
                      <p className="text-sm text-[var(--secondary-muted-edge)]">
                        {selectedAddressData.phone}
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Items Review */}
                <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6">
                  <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                    Review Items
                  </h2>
                  <div className="space-y-6">
                    {demoOrderData.sellers.map((seller) => (
                      <div key={seller.id}>
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-semibold text-[var(--secondary-black)]">
                            {seller.name}
                          </h3>
                          {seller.verified && (
                            <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                          )}
                        </div>
                        <div className="space-y-3">
                          {seller.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-[var(--secondary-black)] text-sm">
                                  {item.name}
                                </p>
                                <p className="text-xs text-[var(--secondary-muted-edge)]">
                                  Qty: {item.quantity} {item.unit}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-[var(--secondary-black)]">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-xs text-[var(--secondary-muted-edge)]">
                                  ${item.price.toFixed(2)}/{item.unit}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--secondary-soft-highlight)]/30 flex justify-between text-sm">
                          <span className="text-[var(--secondary-muted-edge)]">
                            Delivery by {seller.estimatedDelivery}
                          </span>
                          <span className="font-medium text-[var(--secondary-black)]">
                            +${seller.shipping.toFixed(2)} shipping
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6">
                <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-6">
                  Payment Method
                </h2>

                {/* Payment method selector */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      paymentMethod === "card"
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                        }`}
                      >
                    <CreditCardIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                    <div className="text-left">
                      <p className="font-medium text-[var(--secondary-black)] text-sm">
                        Credit Card
                      </p>
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Pay securely with Stripe
                              </p>
                            </div>
                  </button>
                    <button
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                        : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                    }`}
                  >
                    <BanknotesIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                    <div className="text-left">
                      <p className="font-medium text-[var(--secondary-black)] text-sm">
                        Bank Transfer
                      </p>
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Get instructions to pay offline
                      </p>
                    </div>
                  </button>
                    <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      paymentMethod === "cash"
                        ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                        : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                    }`}
                  >
                    <BanknotesIcon className="h-5 w-5 text-[var(--secondary-black)]" />
                    <div className="text-left">
                      <p className="font-medium text-[var(--secondary-black)] text-sm">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-[var(--secondary-muted-edge)]">
                        Pay the courier upon delivery
                      </p>
                    </div>
                    </button>
                </div>

                {/* For non-card methods show simple instructions; card uses Stripe Payment Element below */}
                {paymentMethod !== "card" && (
                  <div className="space-y-3">
                    <div className="p-4 border border-[var(--secondary-soft-highlight)]/30 rounded-xl bg-[var(--primary-background)]">
                      <p className="text-sm font-medium text-[var(--secondary-black)]">
                        {paymentMethod === "bank_transfer"
                          ? "Bank Transfer Instructions"
                          : "Cash on Delivery"}
                      </p>
                      <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
                        {paymentMethod === "bank_transfer"
                          ? "Place the order to receive bank details and reference number. Your order will be pending until payment is verified."
                          : "Place the order and pay the courier upon delivery. Exact cash may be required depending on region."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Stripe Elements (render after clientSecret) */}
                {paymentMethod === "card" &&
                  clientSecret &&
                  stripePromise &&
                  intentValid && (
                  <div className="mt-6">
                    <Elements
                        key={clientSecret}
                        stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <div className="p-4 border border-[var(--secondary-soft-highlight)]/30 rounded-xl">
                          <PaymentElement
                            onReady={() => setPaymentElementReady(true)}
                          />
                      </div>
                        <StripeConfirmButton
                          orderId={orderIds[0]}
                          setError={setPaymentError}
                          isConfirming={isConfirming}
                          setIsConfirming={setIsConfirming}
                          autoConfirm={autoConfirm}
                          ready={paymentElementReady}
                          renderButton={false}
                        />
                    </Elements>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Secure Payment
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Your payment information is encrypted and secure. We never
                      store your full card details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePreviousStep}
                  className="flex items-center gap-2 px-6 py-3 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full hover:bg-white transition-all"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Previous
                </button>
              )}
              <div className="flex-1" />
              {currentStep !== "payment" ? (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all shadow-md"
                >
                  Continue
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <div className="space-y-3">
                  {(paymentError || createOrderError) && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        {paymentError || createOrderError}
                      </p>
                    </div>
                  )}
                    <button
                    onClick={handlePay}
                    disabled={
                      isStartingPayment ||
                      isPlacingOrder ||
                      !selectedAddress ||
                      !cart ||
                      (paymentMethod === "card" && !publishableKey)
                    }
                      className="flex items-center gap-2 px-8 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {isStartingPayment || isPlacingOrder ? (
                      <span>Processing...</span>
                    ) : paymentMethod === "card" ? (
                      <>
                        <CreditCardIcon className="h-5 w-5" /> Pay Now
                      </>
                      ) : (
                        <>
                        <TruckIcon className="h-5 w-5" /> Place Order
                        </>
                      )}
                    </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Subtotal
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Shipping
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${totals.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Tax
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    ${totals.tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[var(--secondary-black)]">
                      Total
                    </span>
                    <span className="font-bold text-xl text-[var(--secondary-black)]">
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Preview - Detailed */}
              <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-4">
                <p className="text-sm font-medium text-[var(--secondary-black)] mb-3">
                  {demoOrderData.sellers.reduce(
                    (sum, s) => sum + s.items.length,
                    0
                  )}{" "}
                  items
                </p>
                <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                  {demoOrderData.sellers.map((seller) => (
                    <div key={seller.id} className="space-y-2">
                      <p className="text-xs font-semibold text-[var(--secondary-black)]">
                        {seller.name}
                      </p>
                      <div className="space-y-2">
                        {seller.items.map((it) => (
                          <div key={it.id} className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={it.image}
                                alt={it.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[var(--secondary-black)] truncate">
                                {it.name}
                              </p>
                              <p className="text-[10px] text-[var(--secondary-muted-edge)]">
                                {it.quantity} × ${it.price.toFixed(2)} {it.unit}
                              </p>
                            </div>
                            <div className="text-xs font-semibold text-[var(--secondary-black)]">
                              ${(it.price * it.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StripeConfirmButton(props: {
  orderId?: string;
  setError: (s: string | null) => void;
  isConfirming: boolean;
  setIsConfirming: (b: boolean) => void;
  autoConfirm?: boolean;
  ready?: boolean;
  renderButton?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    orderId,
    setError,
    isConfirming,
    setIsConfirming,
    autoConfirm,
    ready,
    renderButton = true,
  } = props;

  const onConfirm = async () => {
    if (!stripe || !elements) return;
    setError(null);
    setIsConfirming(true);
    try {
      // Optimistically refresh store so UI reflects cleared cart and new orders
      dispatch(fetchCart());
      dispatch(fetchOrders({ page: 1, limit: 20 } as any));
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/buyer/order-confirmation/${orderId || ""}`,
        },
      });
      if (error) {
        setError(error.message || "Payment failed");
      }
    } finally {
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    if (autoConfirm && ready && stripe && elements && !isConfirming) {
      onConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConfirm, ready, stripe, elements]);

  if (!renderButton) return null;

  return (
    <button
      onClick={onConfirm}
      disabled={!stripe || !elements || isConfirming}
      className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConfirming ? (
        <span>Processing...</span>
      ) : (
        <>
          <CheckIcon className="h-5 w-5" /> Pay Now
        </>
      )}
    </button>
  );
}
