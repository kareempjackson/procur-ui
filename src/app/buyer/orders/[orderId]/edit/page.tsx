"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchOrderDetail,
  updateOrder,
  clearCurrentOrder,
} from "@/store/slices/buyerOrdersSlice";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

interface EditableItem {
  id?: string;
  product_id?: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  unit?: string;
  image_url?: string;
  isNew?: boolean;
  isRemoved?: boolean;
  originalQuantity?: number;
}

interface SellerProduct {
  id: string;
  name: string;
  sku?: string;
  base_price: number;
  sale_price?: number;
  unit_of_measurement: string;
  stock_quantity: number;
  images?: string[];
  product_images?: { image_url: string; is_primary?: boolean }[];
}

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }> | { orderId: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { show } = useToast();
  const { currentOrder: order, orderDetailStatus, orderDetailError } =
    useAppSelector((state) => state.buyerOrders);
  const authToken = useAppSelector((state) => state.auth.accessToken);

  // Unwrap params for Next.js 15
  const unwrappedParams =
    typeof (params as any)?.then === "function"
      ? (React as any).use(params as Promise<{ orderId: string }>)
      : (params as { orderId: string });
  const orderId = unwrappedParams.orderId;

  // State
  const [editedItems, setEditedItems] = useState<EditableItem[]>([]);
  const [updateReason, setUpdateReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Marketplace browsing state
  const [showProductBrowser, setShowProductBrowser] = useState(false);
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Fetch order detail on mount
  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [orderId, dispatch]);

  // Initialize editable items from order
  useEffect(() => {
    if (order) {
      const items = (order as any)?.items || (order as any)?.order_items || [];
      const normalized = Array.isArray(items) ? items : [];
      setEditedItems(
        normalized.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name || item.name || "Item",
          product_sku: item.product_sku,
          quantity: Number(item.quantity || 0),
          unit_price: Number(item.unit_price || item.price || 0),
          unit:
            item.unit ||
            item.unit_of_measurement ||
            item?.product_snapshot?.unit_of_measurement ||
            "",
          image_url:
            item.image_url ||
            item.product_image ||
            item?.product_snapshot?.image_url,
          isNew: false,
          isRemoved: false,
          originalQuantity: Number(item.quantity || 0),
        }))
      );
    }
  }, [order]);

  // Load seller products when opening browser
  const loadSellerProducts = async () => {
    if (!authToken || !order?.seller_org_id) return;
    setLoadingProducts(true);
    try {
      const client = getApiClient(() => authToken);
      const { data } = await client.get(
        `/buyers/marketplace/sellers/${order.seller_org_id}/products?limit=50&in_stock=true`
      );
      const products = (data as any)?.products || (data as any)?.data || data;
      setSellerProducts(Array.isArray(products) ? products : []);
    } catch (err) {
      console.error("Failed to load seller products:", err);
      show("Failed to load products. Please try again.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleOpenProductBrowser = () => {
    setShowProductBrowser(true);
    if (sellerProducts.length === 0) {
      loadSellerProducts();
    }
  };

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return sellerProducts;
    const query = productSearch.toLowerCase();
    return sellerProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
    );
  }, [sellerProducts, productSearch]);

  // Check if product already in order
  const isProductInOrder = (productId: string) => {
    return editedItems.some(
      (item) => item.product_id === productId && !item.isRemoved
    );
  };

  // Update item quantity
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    setEditedItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, newQuantity), isRemoved: newQuantity === 0 }
          : item
      )
    );
  };

  // Remove item (mark as removed)
  const handleRemoveItem = (index: number) => {
    setEditedItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: 0, isRemoved: true } : item
      )
    );
  };

  // Restore removed item
  const handleRestoreItem = (index: number) => {
    setEditedItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: item.originalQuantity || 1, isRemoved: false }
          : item
      )
    );
  };

  // Remove new item completely
  const handleRemoveNewItem = (index: number) => {
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Get primary image from product
  const getProductImage = (product: SellerProduct): string | undefined => {
    // Try images array first
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    // Try product_images array (from API response)
    if (product.product_images && product.product_images.length > 0) {
      const primary = product.product_images.find((img) => img.is_primary);
      return primary?.image_url || product.product_images[0]?.image_url;
    }
    return undefined;
  };

  // Add product from marketplace
  const handleAddProduct = (product: SellerProduct) => {
    if (isProductInOrder(product.id)) {
      show("This product is already in your order.");
      return;
    }

    const price = product.sale_price || product.base_price;
    setEditedItems((prev) => [
      ...prev,
      {
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        quantity: 1,
        unit_price: price,
        unit: product.unit_of_measurement,
        image_url: getProductImage(product),
        isNew: true,
        isRemoved: false,
      },
    ]);
    show(`Added ${product.name} to order`);
  };

  // Calculate totals
  const activeItems = editedItems.filter((item) => !item.isRemoved);
  const subtotal = activeItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const currencyCode =
    (order as any)?.currency || (order as any)?.currency_code || "XCD";
  const formatCurrency = (value: number) =>
    `${currencyCode} ${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Check if anything changed
  const hasChanges = useMemo(() => {
    if (!order) return false;
    const originalItems =
      (order as any)?.items || (order as any)?.order_items || [];
    const hasNewItems = editedItems.some((item) => item.isNew);
    const hasRemovedItems = editedItems.some(
      (item) => item.isRemoved && !item.isNew
    );
    const hasQuantityChanges = editedItems.some(
      (item) =>
        !item.isNew &&
        !item.isRemoved &&
        item.quantity !== item.originalQuantity
    );
    return hasNewItems || hasRemovedItems || hasQuantityChanges;
  }, [editedItems, order]);

  // Save changes
  const handleSaveChanges = async () => {
    if (!hasChanges || activeItems.length === 0) {
      show("No changes to save or order would be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const itemsToUpdate = editedItems.map((item) => {
        if (item.isNew) {
          return {
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          };
        } else {
          return {
            id: item.id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          };
        }
      });

      await dispatch(
        updateOrder({
          orderId,
          updateDto: {
            items: itemsToUpdate,
            update_reason: updateReason || "Order updated by buyer",
          },
        })
      ).unwrap();

      show("Order updated successfully!");
      router.push(`/buyer/orders/${orderId}`);
    } catch (err: any) {
      console.error("Failed to update order:", err);
      show(err?.message || "Failed to update order. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if order is editable
  const isEditable =
    order?.status === "pending" || order?.status === "accepted";

  // Loading state
  if (orderDetailStatus === "loading" && !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader size="lg" text="Loading order..." />
      </div>
    );
  }

  // Error state
  if (orderDetailStatus === "failed" && orderDetailError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBagIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Failed to Load Order
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">
            {orderDetailError}
          </p>
          <button
            onClick={() => router.push("/buyer/orders")}
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBagIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Order Not Found
          </h2>
          <button
            onClick={() => router.push("/buyer/orders")}
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Not editable state
  if (!isEditable) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBagIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Order Cannot Be Edited
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">
            This order is already {order.status} and cannot be modified.
          </p>
          <button
            onClick={() => router.push(`/buyer/orders/${orderId}`)}
            className="px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold"
          >
            View Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href={`/buyer/orders/${orderId}`}
              className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="font-medium">Back to Order</span>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--secondary-black)]">
                    Edit Order {order.order_number}
                  </h1>
                  <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                    Modify quantities, remove items, or add new products from{" "}
                    {order.seller_name}
                  </p>
                </div>
              </div>

              {/* Current Items */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Order Items
                </h2>

                {editedItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--secondary-soft-highlight)]/50 p-8 text-center">
                    <ShoppingBagIcon className="h-12 w-12 text-[var(--secondary-muted-edge)] mx-auto mb-3 opacity-50" />
                    <p className="text-[var(--secondary-muted-edge)]">
                      No items in this order yet.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--secondary-soft-highlight)]/20 rounded-2xl border border-[var(--secondary-soft-highlight)]/20 overflow-hidden">
                    {editedItems.map((item, index) => (
                      <div
                        key={item.id || `new-${index}`}
                        className={`flex items-center justify-between gap-4 p-4 ${
                          item.isRemoved
                            ? "bg-red-50/50 opacity-60"
                            : item.isNew
                            ? "bg-green-50/50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          {item.image_url ? (
                            <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-[var(--secondary-soft-highlight)]/20 shrink-0">
                              <Image
                                src={item.image_url}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-14 w-14 rounded-xl border border-[var(--secondary-soft-highlight)]/20 bg-[var(--primary-background)]/30 flex items-center justify-center shrink-0">
                              <ShoppingBagIcon className="h-6 w-6 text-[var(--secondary-muted-edge)]" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p
                              className={`font-semibold text-[var(--secondary-black)] ${
                                item.isRemoved ? "line-through" : ""
                              }`}
                            >
                              {item.product_name}
                              {item.isNew && (
                                <span className="ml-2 text-xs text-green-600 font-medium">
                                  NEW
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-[var(--secondary-muted-edge)]">
                              {formatCurrency(item.unit_price)}
                              {item.unit ? ` / ${item.unit}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {item.isRemoved ? (
                            <button
                              onClick={() => handleRestoreItem(index)}
                              className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] font-medium"
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      index,
                                      item.quantity - 1
                                    )
                                  }
                                  className="h-8 w-8 rounded-full border border-[var(--secondary-soft-highlight)]/30 flex items-center justify-center hover:bg-[var(--primary-background)] transition-colors"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateQuantity(
                                      index,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 text-center border border-[var(--secondary-soft-highlight)]/30 rounded-lg py-1.5 text-sm font-medium"
                                  min={0}
                                />
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      index,
                                      item.quantity + 1
                                    )
                                  }
                                  className="h-8 w-8 rounded-full border border-[var(--secondary-soft-highlight)]/30 flex items-center justify-center hover:bg-[var(--primary-background)] transition-colors"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Line Total */}
                              <div className="w-28 text-right">
                                <p className="font-semibold text-[var(--secondary-black)]">
                                  {formatCurrency(item.quantity * item.unit_price)}
                                </p>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() =>
                                  item.isNew
                                    ? handleRemoveNewItem(index)
                                    : handleRemoveItem(index)
                                }
                                className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Products Button */}
                <button
                  onClick={handleOpenProductBrowser}
                  className="w-full py-4 border-2 border-dashed border-[var(--primary-accent2)]/30 rounded-2xl text-[var(--primary-accent2)] font-medium hover:bg-[var(--primary-accent2)]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Products from {order.seller_name}
                </button>
              </div>

              {/* Update Reason */}
              <div className="mt-6 pt-6 border-t border-[var(--secondary-soft-highlight)]/20">
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Reason for update (optional)
                </label>
                <input
                  type="text"
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  placeholder="e.g., Need additional quantities for event"
                  className="w-full px-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-xl focus:ring-2 focus:ring-[var(--primary-accent2)]/20 focus:border-[var(--primary-accent2)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[var(--secondary-soft-highlight)]/20 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Items ({activeItems.length})
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--secondary-muted-edge)]">
                    Delivery
                  </span>
                  <span className="font-medium text-[var(--secondary-black)]">
                    {formatCurrency(
                      Number((order as any)?.shipping_amount || 0)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-[var(--secondary-soft-highlight)]/20">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[var(--secondary-black)]">
                      Estimated Total
                    </span>
                    <span className="font-bold text-lg text-[var(--secondary-black)]">
                      {formatCurrency(
                        subtotal +
                          Number((order as any)?.shipping_amount || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || isSaving || activeItems.length === 0}
                  className="w-full py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>
                <Link
                  href={`/buyer/orders/${orderId}`}
                  className="block w-full py-3 text-center border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full font-semibold hover:bg-white transition-all"
                >
                  Cancel
                </Link>
              </div>

              {!hasChanges && (
                <p className="text-xs text-[var(--secondary-muted-edge)] text-center mt-3">
                  Make changes to enable the save button
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Product Browser Modal */}
      {showProductBrowser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[var(--secondary-soft-highlight)]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[var(--secondary-black)]">
                  Add Products from {order.seller_name}
                </h3>
                <button
                  onClick={() => setShowProductBrowser(false)}
                  className="h-10 w-10 rounded-full hover:bg-[var(--primary-background)] flex items-center justify-center"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--secondary-muted-edge)]" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border border-[var(--secondary-soft-highlight)]/30 rounded-xl focus:ring-2 focus:ring-[var(--primary-accent2)]/20 focus:border-[var(--primary-accent2)]"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingProducts ? (
                <div className="flex items-center justify-center py-12">
                  <ProcurLoader size="md" text="Loading products..." />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="h-12 w-12 text-[var(--secondary-muted-edge)] mx-auto mb-3 opacity-50" />
                  <p className="text-[var(--secondary-muted-edge)]">
                    {productSearch
                      ? "No products match your search"
                      : "No products available from this seller"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map((product) => {
                    const inOrder = isProductInOrder(product.id);
                    const price = product.sale_price || product.base_price;
                    const productImage = getProductImage(product);
                    return (
                      <div
                        key={product.id}
                        className={`border rounded-2xl p-4 ${
                          inOrder
                            ? "border-[var(--primary-accent2)] bg-[var(--primary-accent2)]/5"
                            : "border-[var(--secondary-soft-highlight)]/30 hover:border-[var(--primary-accent2)]/50"
                        } transition-colors`}
                      >
                        <div className="flex gap-3">
                          {productImage ? (
                            <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={productImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-xl bg-[var(--primary-background)] flex items-center justify-center shrink-0">
                              <ShoppingBagIcon className="h-6 w-6 text-[var(--secondary-muted-edge)]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[var(--secondary-black)] truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-[var(--primary-accent2)] font-medium">
                              {formatCurrency(price)} /{" "}
                              {product.unit_of_measurement}
                            </p>
                            <p className="text-xs text-[var(--secondary-muted-edge)]">
                              {product.stock_quantity > 0
                                ? `${product.stock_quantity} in stock`
                                : "Out of stock"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddProduct(product)}
                          disabled={inOrder || product.stock_quantity <= 0}
                          className={`w-full mt-3 py-2 rounded-full text-sm font-medium transition-colors ${
                            inOrder
                              ? "bg-[var(--primary-accent2)]/10 text-[var(--primary-accent2)] cursor-default"
                              : product.stock_quantity <= 0
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)]"
                          }`}
                        >
                          {inOrder
                            ? "Already in Order"
                            : product.stock_quantity <= 0
                            ? "Out of Stock"
                            : "Add to Order"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--secondary-soft-highlight)]/20">
              <button
                onClick={() => setShowProductBrowser(false)}
                className="w-full py-3 bg-[var(--primary-accent2)] text-white rounded-full font-semibold hover:bg-[var(--primary-accent3)] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

