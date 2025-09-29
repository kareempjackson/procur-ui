"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// Demo cart data
const demoCartItems = [
  {
    id: 1,
    name: "Organic Hass Avocados",
    supplier: "Green Valley Farms",
    price: 24.99,
    quantity: 2,
    unit: "per 5lb box",
    image: "/images/products/avocados.jpg",
    category: "Fruits",
    inStock: true,
  },
  {
    id: 2,
    name: "Fresh Roma Tomatoes",
    supplier: "Sunshine Produce Co.",
    price: 18.5,
    quantity: 3,
    unit: "per 10lb case",
    image: "/images/products/tomatoes.jpg",
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 3,
    name: "Premium Mixed Greens",
    supplier: "Leafy Greens LLC",
    price: 32.75,
    quantity: 1,
    unit: "per case (24 bags)",
    image: "/images/products/mixed-greens.jpg",
    category: "Leafy Greens",
    inStock: true,
  },
  {
    id: 4,
    name: "Organic Baby Carrots",
    supplier: "Earth Fresh Organics",
    price: 15.99,
    quantity: 4,
    unit: "per 5lb bag",
    image: "/images/products/carrots.jpg",
    category: "Root Vegetables",
    inStock: false,
  },
];

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState(demoCartItems);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setIsPromoApplied(true);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping =
    selectedShipping === "express"
      ? 25.0
      : selectedShipping === "standard"
      ? 12.5
      : 0;
  const discount = isPromoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal + shipping + tax - discount;

  const shippingOptions = [
    {
      id: "free",
      name: "Free Shipping",
      description: "5-7 business days",
      price: 0,
      icon: TruckIcon,
    },
    {
      id: "standard",
      name: "Standard Shipping",
      description: "2-3 business days",
      price: 12.5,
      icon: TruckIcon,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "Next business day",
      price: 25.0,
      icon: TruckIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Procur Logo */}
              <Image
                src="/images/logos/procur-logo.svg"
                alt="Procur"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[var(--primary-accent2)] rounded-full flex items-center justify-center">
                  <ShoppingCartIcon className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-lg font-medium text-[var(--secondary-black)]">
                  Checkout
                </h1>
              </div>
            </div>
            <div className="text-sm text-[var(--primary-base)] opacity-70">
              Step 2 of 3
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Order Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Order details
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Minimal Product Image */}
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      </div>

                      {/* Clean Product Info */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.supplier}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Minimal Quantity */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--primary-base)] hover:text-[var(--primary-accent2)] hover:bg-[var(--primary-background)] transition-colors"
                          disabled={!item.inStock}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium text-[var(--secondary-black)] w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--primary-base)] hover:text-[var(--primary-accent2)] hover:bg-[var(--primary-background)] transition-colors"
                          disabled={!item.inStock}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-[var(--secondary-black)]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--primary-base)] hover:text-[var(--primary-accent2)] hover:bg-[var(--primary-background)] transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimal Shipping */}
            <div>
              <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                Shipping
              </h2>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-full cursor-pointer transition-all ${
                      selectedShipping === option.id
                        ? "border-[var(--primary-accent2)] bg-[var(--primary-background)]"
                        : "border-[var(--secondary-soft-highlight)] hover:border-[var(--primary-base)]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="w-4 h-4 text-[var(--primary-accent2)] border-[var(--secondary-soft-highlight)] focus:ring-[var(--primary-accent2)]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[var(--secondary-black)]">
                          {option.name}
                        </p>
                        <p className="text-xs text-[var(--primary-base)] opacity-70">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[var(--secondary-black)]">
                      {option.price === 0
                        ? "Free"
                        : `$${option.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clean Promo Code */}
            <div>
              <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                Promo code
              </h2>
              <div className="flex space-x-3 items-stretch">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 border border-[var(--secondary-soft-highlight)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent bg-white h-12"
                  disabled={isPromoApplied}
                />
                <button
                  onClick={applyPromoCode}
                  disabled={isPromoApplied || !promoCode}
                  className="px-6 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-12"
                >
                  {isPromoApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {isPromoApplied && (
                <p className="text-[var(--secondary-highlight1)] text-sm mt-2">
                  ✓ 10% discount applied
                </p>
              )}
              <p className="text-[var(--primary-base)] opacity-70 text-xs mt-2">
                Try "SAVE10" for 10% off
              </p>
            </div>
          </div>

          {/* Clean Order Summary */}
          <div className="sticky top-8">
            <div className="card bg-[var(--primary-background)]">
              <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-6">
                Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--primary-base)]">Subtotal</span>
                  <span className="text-[var(--secondary-black)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[var(--primary-base)]">Shipping</span>
                  <span className="text-[var(--secondary-black)]">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[var(--primary-base)]">Tax</span>
                  <span className="text-[var(--secondary-black)]">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                {isPromoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--secondary-highlight1)]">
                      Discount
                    </span>
                    <span className="text-[var(--secondary-highlight1)]">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-[var(--secondary-soft-highlight)] pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-[var(--secondary-black)]">
                      Total
                    </span>
                    <span className="text-base font-medium text-[var(--secondary-black)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="btn btn-secondary w-full mt-6 py-3 text-sm font-medium">
                Complete order
              </button>

              <div className="flex items-center justify-center mt-4 text-xs text-[var(--primary-base)] opacity-70">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Continue Shopping */}
        <div className="mt-12 text-center">
          <button className="text-sm text-[var(--primary-base)] hover:text-[var(--primary-accent2)] transition-colors">
            ← Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
