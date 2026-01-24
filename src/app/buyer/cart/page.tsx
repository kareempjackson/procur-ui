"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrashIcon,
  HeartIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  MapPinIcon,
  TruckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCart,
  updateCartItemAsync,
  removeCartItemAsync,
} from "@/store/slices/buyerCartSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getEstimatedDeliveryRangeLabel } from "@/lib/utils/date";

const DEBOUNCE_DELAY = 500; // ms to wait before syncing
const ERROR_DELAY = 800; // ms to wait before showing errors

export default function BuyerCartPage() {
  const dispatch = useAppDispatch();
  const { cart, status, error } = useAppSelector((state) => state.buyerCart);
  const estimatedDeliveryLabel = getEstimatedDeliveryRangeLabel();

  // Local quantity state for optimistic updates
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  // Track if user is actively editing (for hiding errors)
  const [isEditing, setIsEditing] = useState(false);
  // Track item pending deletion for confirmation
  const [pendingDeleteItem, setPendingDeleteItem] = useState<{ id: string; name: string } | null>(null);
  // Refs for debouncing
  const syncTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const editingTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Initialize local quantities from cart
  useEffect(() => {
    if (cart) {
      setLocalQuantities((prev) => {
        const next = { ...prev };
        let changed = false;
        cart.seller_groups.forEach((group) => {
          group.items.forEach((item) => {
            // Only set if not already in local state
            if (next[item.id] === undefined) {
              next[item.id] = item.quantity;
              changed = true;
            }
          });
        });
        return changed ? next : prev;
      });
    }
  }, [cart]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(syncTimers.current).forEach(clearTimeout);
      if (editingTimer.current) clearTimeout(editingTimer.current);
    };
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    // Update local state immediately
    setLocalQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));

    // Mark as editing and reset the timer
    setIsEditing(true);
    if (editingTimer.current) clearTimeout(editingTimer.current);
    editingTimer.current = setTimeout(() => setIsEditing(false), ERROR_DELAY);

    // Clear existing sync timer for this item
    if (syncTimers.current[itemId]) {
      clearTimeout(syncTimers.current[itemId]);
    }

    // Set new sync timer
    syncTimers.current[itemId] = setTimeout(() => {
      dispatch(updateCartItemAsync({ itemId, quantity: newQuantity }));
    }, DEBOUNCE_DELAY);
  }, [dispatch]);

  // Get the display quantity
  const getDisplayQuantity = useCallback((itemId: string, serverQuantity: number) => {
    return localQuantities[itemId] ?? serverQuantity;
  }, [localQuantities]);

  const confirmRemoveItem = () => {
    if (pendingDeleteItem) {
      dispatch(removeCartItemAsync(pendingDeleteItem.id));
      setPendingDeleteItem(null);
    }
  };

  const cancelRemoveItem = () => {
    setPendingDeleteItem(null);
  };

  const moveToCart = (itemId: string) => {
    // TODO: Implement move to cart functionality
    console.log("Moving item to cart:", itemId);
  };

  const minOrderThreshold = 30;

  // Transform Redux cart to UI format
  const cartData = cart
    ? {
        sellers: cart.seller_groups.map((group) => ({
          id: group.seller_org_id,
          name: group.seller_name,
          location: "Caribbean", // TODO: Get from API when available
          verified: false, // TODO: Get from API when available
          estimatedDelivery: estimatedDeliveryLabel, // TODO: Calculate from API
          shippingCost: group.estimated_shipping,
          minOrderMet: true, // TODO: Get from API
          minOrderAmount: minOrderThreshold, // TODO: Get from API
          items: group.items.map((item) => ({
            id: item.id,
            productId: item.product_id,
            name: item.product_name,
            image:
              item.image_url ||
              "/images/backgrounds/alyona-chipchikova-3Sm2M93sQeE-unsplash.jpg",
            price: item.unit_price,
            unit: item.unit_of_measurement,
            quantity: item.quantity,
            minOrder: 1, // TODO: Get from product API
            maxStock: item.stock_quantity,
            inStock: item.stock_quantity > 0,
            subtotal: item.total_price,
          })),
        })),
        savedForLater: [] as any[], // TODO: Implement saved for later
      }
    : { sellers: [], savedForLater: [] as any[] };

  const calculateSellerSubtotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.price * getDisplayQuantity(item.id, item.quantity), 0);
  };

  // Calculate totals using local quantities for real-time updates
  const calculatedSubtotal = cartData.sellers.reduce(
    (sum, seller) => sum + calculateSellerSubtotal(seller.items),
    0
  );
  const platformFeePercent = cart?.platform_fee_percent || 0;
  const calculatedPlatformFee = Number(((calculatedSubtotal * platformFeePercent) / 100).toFixed(2));
  const shipping = cart?.estimated_shipping || 0;

  const totals = {
    subtotal: calculatedSubtotal,
    platformFeePercent,
    platformFeeAmount: calculatedPlatformFee,
    shipping,
    total: calculatedSubtotal + shipping + calculatedPlatformFee,
  };

  // Calculate total items using local quantities
  const totalItems = cartData.sellers.reduce(
    (sum, seller) => sum + seller.items.reduce(
      (s, item) => s + getDisplayQuantity(item.id, item.quantity),
      0
    ),
    0
  );
  const hasStockIssues = cartData.sellers.some((seller) =>
    seller.items.some((item) => !item.inStock)
  );
  const hasMinOrderIssues = totals.subtotal < minOrderThreshold;
  const minOrderShortfall = Math.max(
    0,
    minOrderThreshold - (totals.subtotal || 0)
  );

  // Loading state
  if (status === "loading" && !cart) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader size="lg" text="Loading cart..." />
      </div>
    );
  }

  // Error state
  if (status === "failed" && error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBagIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Failed to Load Cart
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchCart())}
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--secondary-black)]">
              Shopping Cart
            </h1>
            <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
              {totalItems} {totalItems === 1 ? "item" : "items"} from{" "}
              {cartData.sellers.length}{" "}
              {cartData.sellers.length === 1 ? "seller" : "sellers"}
            </p>
          </div>
          <Link
            href="/buyer"
            className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
        </div>

        {cartData.sellers.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-[var(--primary-background)] rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="h-12 w-12 text-[var(--secondary-muted-edge)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--secondary-black)] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[var(--secondary-muted-edge)] mb-8">
              Start adding products to your cart from our marketplace
            </p>
            <Link
              href="/buyer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Alert Messages - fade based on editing state */}
              <div 
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  hasMinOrderIssues && !isEditing 
                    ? "opacity-100 max-h-24" 
                    : "opacity-0 max-h-0"
                }`}
              >
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 text-sm">
                      Minimum order: ${minOrderThreshold.toFixed(2)}
                    </h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      Add ${minOrderShortfall.toFixed(2)} more to checkout.
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  hasStockIssues && !isEditing
                    ? "opacity-100 max-h-24" 
                    : "opacity-0 max-h-0"
                }`}
              >
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 text-sm">
                      Stock Issues Detected
                    </h3>
                    <p className="text-red-700 text-sm mt-1">
                      Some items in your cart are currently out of stock. Remove
                      them to proceed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Grouped by Seller */}
              {cartData.sellers.map((seller, index) => {
                const sellerSubtotal = calculateSellerSubtotal(seller.items);
                const meetsMinOrder = sellerSubtotal >= seller.minOrderAmount;

                return (
                  <div
                    key={seller.id || `seller-${index}`}
                    className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden"
                  >
                    {/* Seller Header */}
                    <div className="bg-[var(--primary-background)] px-6 py-4 border-b border-[var(--secondary-soft-highlight)]/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Link
                              href={`/buyer/supplier/${seller.id}`}
                              className="font-semibold text-[var(--secondary-black)] hover:text-[var(--primary-accent2)] transition-colors"
                            >
                              {seller.name}
                            </Link>
                            {seller.verified && (
                              <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[var(--secondary-muted-edge)]">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              {seller.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <TruckIcon className="h-4 w-4" />
                              Delivery by {seller.estimatedDelivery}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-[var(--secondary-black)] tabular-nums transition-all duration-150">
                            ${sellerSubtotal.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Min Order Warning - fade based on editing state */}
                      <div 
                        className={`transition-all duration-300 ease-out overflow-hidden ${
                          !meetsMinOrder && !isEditing 
                            ? "opacity-100 max-h-16 mt-3" 
                            : "opacity-0 max-h-0 mt-0"
                        }`}
                      >
                        <div className="px-3 py-2 bg-yellow-100 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            <span className="font-semibold">
                              Minimum order:
                            </span>{" "}
                            ${seller.minOrderAmount.toFixed(2)} — Add $
                            {(seller.minOrderAmount - sellerSubtotal).toFixed(
                              2
                            )}{" "}
                            more to checkout
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seller Items */}
                    <div className="divide-y divide-[var(--secondary-soft-highlight)]/20">
                      {seller.items.map((item, itemIndex) => (
                        <div
                          key={item.id || `item-${itemIndex}`}
                          className="p-6"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <Link
                              href={`/buyer/product/${item.productId}`}
                              className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 group"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              {!item.inStock && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">
                                    Out of Stock
                                  </span>
                                </div>
                              )}
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/buyer/product/${item.productId}`}
                                    className="font-semibold text-[var(--secondary-black)] hover:text-[var(--primary-accent2)] transition-colors line-clamp-2"
                                  >
                                    {item.name}
                                  </Link>
                                </div>

                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                  <div className="font-bold text-lg text-[var(--secondary-black)] tabular-nums">
                                    ${item.price.toFixed(2)}
                                    <span className="text-sm font-normal text-[var(--secondary-muted-edge)]">
                                      /{item.unit}
                                    </span>
                                  </div>
                                  <div className="text-sm font-semibold text-[var(--secondary-black)] mt-1 tabular-nums transition-all duration-150">
                                    ${(item.price * getDisplayQuantity(item.id, item.quantity)).toFixed(2)}{" "}
                                    total
                                  </div>
                                </div>
                              </div>

                              {/* Quantity & Actions */}
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-[var(--secondary-black)]">
                                    Qty
                                  </span>
                                  <div className="flex items-center gap-1 border border-[var(--secondary-soft-highlight)]/30 rounded-full px-1.5 py-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentQty = getDisplayQuantity(item.id, item.quantity);
                                        updateQuantity(
                                          item.id,
                                          Math.max(item.minOrder, currentQty - 1)
                                        );
                                      }}
                                      className="w-7 h-7 rounded-full hover:bg-[var(--primary-background)] transition-colors text-[var(--secondary-black)] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                                      disabled={
                                        !item.inStock ||
                                        getDisplayQuantity(item.id, item.quantity) <= item.minOrder
                                      }
                                      aria-label="Decrease quantity"
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      inputMode="numeric"
                                      value={getDisplayQuantity(item.id, item.quantity)}
                                      min={item.minOrder}
                                      max={item.maxStock}
                                      onChange={(e) => {
                                        const raw = Number(e.target.value);
                                        if (!Number.isFinite(raw)) return;
                                        const next = Math.max(
                                          item.minOrder,
                                          Math.min(item.maxStock, Math.floor(raw))
                                        );
                                        updateQuantity(item.id, next);
                                      }}
                                      className="w-14 text-center text-sm bg-transparent outline-none text-[var(--secondary-black)]"
                                      aria-label="Quantity"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentQty = getDisplayQuantity(item.id, item.quantity);
                                        updateQuantity(
                                          item.id,
                                          Math.min(item.maxStock, currentQty + 1)
                                        );
                                      }}
                                      className="w-7 h-7 rounded-full hover:bg-[var(--primary-background)] transition-colors text-[var(--secondary-black)] text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                                      disabled={
                                        !item.inStock ||
                                        getDisplayQuantity(item.id, item.quantity) >= item.maxStock
                                      }
                                      aria-label="Increase quantity"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="text-sm text-[var(--secondary-muted-edge)]">
                                    {item.unit}
                                  </span>
                                </div>

                                {/* Item Actions */}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setPendingDeleteItem({ id: item.id, name: item.name })}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Saved for Later */}
              {cartData.savedForLater.length > 0 && (
                <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--secondary-soft-highlight)]/30">
                    <h3 className="font-semibold text-[var(--secondary-black)]">
                      Saved for Later ({cartData.savedForLater.length})
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {cartData.savedForLater.map((item, savedIndex) => (
                      <div
                        key={item.id || `saved-${savedIndex}`}
                        className="border border-[var(--secondary-soft-highlight)]/30 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="text-sm font-semibold text-[var(--secondary-black)] line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[var(--secondary-muted-edge)] mb-2">
                          {item.sellerName}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[var(--secondary-black)]">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => moveToCart(item.id)}
                            className="text-xs text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Right Side (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-6">
                  <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--secondary-muted-edge)]">
                        Subtotal ({totalItems} items)
                      </span>
                      <span className="font-medium text-[var(--secondary-black)] tabular-nums transition-all duration-200">
                        ${totals.subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--secondary-muted-edge)]">
                        Delivery
                      </span>
                      <span className="font-medium text-[var(--secondary-black)] tabular-nums">
                        ${totals.shipping.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--secondary-muted-edge)]">
                        Platform fee ({totals.platformFeePercent.toFixed(2)}%)
                      </span>
                      <span className="font-medium text-[var(--secondary-black)] tabular-nums transition-all duration-200">
                        ${totals.platformFeeAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-[var(--secondary-soft-highlight)]/30 pt-3">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-[var(--secondary-black)]">
                          Total
                        </span>
                        <span className="font-bold text-xl text-[var(--secondary-black)] tabular-nums transition-all duration-200">
                          ${totals.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/buyer/checkout"
                    className={`w-full mt-6 py-3.5 rounded-full font-semibold text-center transition-all flex items-center justify-center gap-2 ${
                      hasMinOrderIssues || hasStockIssues
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)] shadow-md hover:shadow-lg"
                    }`}
                    onClick={(e) => {
                      if (hasMinOrderIssues || hasStockIssues) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Proceed to Checkout
                    <ArrowLeftIcon className="h-4 w-4 rotate-180" />
                  </Link>

                  <p className="text-xs text-center text-[var(--secondary-muted-edge)] mt-3">
                    Secure checkout with 256-bit SSL encryption
                  </p>
                </div>

                {/* Shopping Benefits */}
                <div className="bg-gradient-to-br from-[var(--primary-accent2)]/10 to-[var(--primary-accent3)]/10 rounded-3xl border border-[var(--primary-accent2)]/20 p-6">
                  <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                    Why Shop With Us
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)] flex-shrink-0" />
                      <span className="text-[var(--secondary-black)]">
                        Verified sellers only
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <TruckIcon className="h-5 w-5 text-[var(--primary-accent2)] flex-shrink-0" />
                      <span className="text-[var(--secondary-black)]">
                        Fast & reliable delivery
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <HeartIcon className="h-5 w-5 text-[var(--primary-accent2)] flex-shrink-0" />
                      <span className="text-[var(--secondary-black)]">
                        Fresh, quality produce
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      {pendingDeleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={cancelRemoveItem}
          />
          
          {/* Dialog */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <TrashIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Remove item?
                </h3>
                <p className="mt-1 text-sm text-[var(--secondary-muted-edge)]">
                  Are you sure you want to remove{" "}
                  <span className="font-medium text-[var(--secondary-black)]">
                    {pendingDeleteItem.name}
                  </span>{" "}
                  from your cart?
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelRemoveItem}
                className="flex-1 px-4 py-2.5 rounded-full border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] font-medium hover:bg-[var(--primary-background)] transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={confirmRemoveItem}
                className="flex-1 px-4 py-2.5 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
