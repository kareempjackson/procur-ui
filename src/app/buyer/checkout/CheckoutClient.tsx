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
  createOrder,
  resetCreateOrderStatus,
} from "@/store/slices/buyerOrdersSlice";
import ProcurLoader from "@/components/ProcurLoader";

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

  const demoAddresses = addresses.map((addr) => ({
    id: addr.id,
    label: addr.type,
    name: "", // TODO: Get from profile
    street: addr.address_line1,
    apartment: addr.address_line2 || "",
    city: addr.city,
    state: addr.state,
    zipCode: addr.postal_code,
    country: addr.country,
    phone: "", // TODO: Get from profile
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

  const handlePlaceOrder = () => {
    if (!cart || !selectedAddress) {
      return;
    }

    // Collect all cart items for the order
    const orderItems = cart.seller_groups.flatMap((group) =>
      group.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }))
    );

    dispatch(
      createOrder({
        items: orderItems,
        shipping_address_id: selectedAddress,
        billing_address_id: selectedAddress, // Using same for now
        buyer_notes: deliveryInstructions || undefined,
      })
    );
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
    <div className="min-h-screen bg-[var(--primary-background)]">
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
                    {/* Address form would go here */}
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      Address form placeholder
                    </p>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-sm text-[var(--primary-accent2)]"
                    >
                      Cancel
                    </button>
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

                {!showPaymentForm ? (
                  <div className="space-y-4">
                    {demoPaymentMethods.map((payment) => (
                      <label
                        key={payment.id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPayment === payment.id
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            value={payment.id}
                            checked={selectedPayment === payment.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                          />
                          <div className="flex-1 flex items-center gap-3">
                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                {payment.cardBrand}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-[var(--secondary-black)]">
                                {payment.cardBrand} •••• {payment.last4}
                              </p>
                              <p className="text-sm text-[var(--secondary-muted-edge)]">
                                Expires {payment.expiryMonth}/
                                {payment.expiryYear}
                              </p>
                            </div>
                          </div>
                          {payment.isDefault && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                              Default
                            </span>
                          )}
                        </div>
                      </label>
                    ))}

                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="w-full p-4 border-2 border-dashed border-[var(--secondary-soft-highlight)] rounded-xl text-[var(--primary-accent2)] hover:border-[var(--primary-accent2)] hover:bg-[var(--primary-accent2)]/5 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add New Payment Method
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-[var(--secondary-muted-edge)]">
                      Payment form placeholder
                    </p>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="text-sm text-[var(--primary-accent2)]"
                    >
                      Cancel
                    </button>
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
                  {createOrderError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{createOrderError}</p>
                    </div>
                  )}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={
                      createOrderStatus === "loading" ||
                      !selectedAddress ||
                      !cart
                    }
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createOrderStatus === "loading" ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        Place Order
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

              {/* Items Preview */}
              <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-4">
                <p className="text-sm font-medium text-[var(--secondary-black)] mb-3">
                  {demoOrderData.sellers.reduce(
                    (sum, s) => sum + s.items.length,
                    0
                  )}{" "}
                  items from {demoOrderData.sellers.length} sellers
                </p>
                <div className="space-y-2">
                  {demoOrderData.sellers.map((seller) => (
                    <div
                      key={seller.id}
                      className="text-xs text-[var(--secondary-muted-edge)]"
                    >
                      {seller.name}: {seller.items.length}{" "}
                      {seller.items.length === 1 ? "item" : "items"}
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
