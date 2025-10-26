"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  FunnelIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchFavoriteSellers,
  toggleSellerFavoriteAsync,
} from "@/store/slices/buyerMarketplaceSlice";
import ProcurLoader from "@/components/ProcurLoader";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { selectAuthToken } from "@/store/slices/authSlice";

export default function SavedSuppliersClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { favoriteSellers, favoriteSellersStatus, favoriteSellersError } =
    useAppSelector((state) => state.buyerMarketplace);
  const authToken = useSelector(selectAuthToken);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch favorite sellers on mount
  useEffect(() => {
    dispatch(fetchFavoriteSellers());
  }, [dispatch]);

  // Filter suppliers based on search
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
      // Toggle favorite (remove since we're on saved page)
      await dispatch(
        toggleSellerFavoriteAsync({ sellerId: supplierId, isFavorited: true })
      ).unwrap();

      // Refresh the list to show updated state
      dispatch(fetchFavoriteSellers());
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      // Show error notification (optional - you could add toast notifications)
      alert("Failed to update favorite status. Please try again.");
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
        router.push(`/buyer/messages?conversationId=${data.id}`);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  // Loading state with ProcurLoader
  if (favoriteSellersStatus === "loading") {
    return <ProcurLoader size="lg" text="Loading saved suppliers..." />;
  }

  // Error state
  if (favoriteSellersStatus === "failed" && favoriteSellersError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <BuildingStorefrontIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-[var(--secondary-black)] mb-2">
            Failed to Load Saved Suppliers
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-4">
            {favoriteSellersError}
          </p>
          <button
            onClick={() => dispatch(fetchFavoriteSellers())}
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
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-[var(--secondary-black)] mb-1">
                Saved Suppliers
              </h1>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Your favorite suppliers for quick access
              </p>
            </div>
            <Link
              href="/buyer/suppliers"
              className="px-5 py-2.5 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Browse All Suppliers
            </Link>
          </div>
        </div>

        {/* Summary Card */}
        {favoriteSellers.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">Total Saved</div>
                <div className="text-4xl font-bold">
                  {favoriteSellers.length}
                </div>
                <div className="text-sm opacity-80 mt-2">
                  suppliers ready to serve you
                </div>
              </div>
              <HeartSolidIcon className="h-24 w-24 opacity-20" />
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--secondary-muted-edge)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved suppliers..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[var(--secondary-soft-highlight)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)]/20 focus:border-[var(--primary-accent2)] transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border border-[var(--secondary-soft-highlight)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
            </button>
          </div>

          {filteredSuppliers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--secondary-soft-highlight)]">
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                Showing {filteredSuppliers.length} of {favoriteSellers.length}{" "}
                saved suppliers
              </div>
            </div>
          )}
        </div>

        {/* Suppliers Grid */}
        {filteredSuppliers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 p-12 text-center">
            <HeartIcon className="h-16 w-16 text-[var(--secondary-muted-edge)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
              {searchQuery ? "No Suppliers Found" : "No Saved Suppliers Yet"}
            </h3>
            <p className="text-[var(--secondary-muted-edge)] mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Save your favorite suppliers for quick access"}
            </p>
            <Link
              href="/buyer/suppliers"
              className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200"
            >
              Browse Suppliers
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/30 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Supplier Header */}
                <div className="relative h-32 bg-gradient-to-br from-[var(--primary-accent2)]/10 to-[var(--primary-accent3)]/10">
                  {supplier.logo_url ? (
                    <Image
                      src={supplier.logo_url}
                      alt={supplier.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BuildingStorefrontIcon className="h-16 w-16 text-[var(--primary-accent2)]/30" />
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(supplier.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg"
                  >
                    <HeartSolidIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  </button>
                </div>

                {/* Supplier Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link
                        href={`/buyer/supplier/${supplier.id}`}
                        className="font-semibold text-base text-[var(--secondary-black)] hover:text-[var(--primary-accent2)] transition-colors line-clamp-1 mb-1 block"
                      >
                        {supplier.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-[var(--secondary-muted-edge)]">
                        <MapPinIcon className="h-3.5 w-3.5" />
                        {supplier.location || "Caribbean"}
                      </div>
                    </div>
                    {supplier.is_verified && (
                      <CheckBadgeIcon className="h-5 w-5 text-[var(--primary-accent2)] flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Rating */}
                  {supplier.average_rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-sm text-[var(--secondary-black)]">
                          {supplier.average_rating.toFixed(1)}
                        </span>
                      </div>
                      {(supplier.total_reviews || 0) > 0 && (
                        <span className="text-xs text-[var(--secondary-muted-edge)]">
                          ({supplier.total_reviews} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Product Count */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-[var(--secondary-muted-edge)]">
                    <ShoppingCartIcon className="h-4 w-4" />
                    <span>{supplier.product_count} products available</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/buyer/supplier/${supplier.id}`}
                      className="px-3 py-2 bg-[var(--primary-accent2)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-accent3)] transition-all duration-200 flex items-center justify-center gap-1"
                    >
                      <BuildingStorefrontIcon className="h-4 w-4" />
                      Visit Shop
                    </Link>
                    <button
                      onClick={() =>
                        handleMessageSupplier(supplier.id, supplier.name)
                      }
                      className="px-3 py-2 border border-[var(--secondary-soft-highlight)] text-[var(--secondary-black)] rounded-full text-sm font-medium hover:bg-[var(--primary-background)] transition-all duration-200 flex items-center justify-center gap-1"
                    >
                      <ChatBubbleLeftIcon className="h-4 w-4" />
                      Message
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
