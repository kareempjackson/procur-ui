"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import { getApiClient } from "@/lib/apiClient";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useAppDispatch, useAppSelector } from "@/store";
import { createSellerProduct } from "@/store/slices/sellerProductsSlice";
import type { RootState } from "@/store";

// Fallback shim in case any stale code still references this symbol
const createAuthenticatedSupabaseClient = (_accessToken: string) =>
  getSupabaseClient();

// Enums matching the API
enum ProductStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

enum ProductCondition {
  NEW = "new",
  USED = "used",
  REFURBISHED = "refurbished",
}

enum MeasurementUnit {
  KG = "kg",
  G = "g",
  LB = "lb",
  OZ = "oz",
  BAG = "bag",
  BUCKET = "bucket",
  PIECE = "piece",
  DOZEN = "dozen",
  LITER = "liter",
  ML = "ml",
  GALLON = "gallon",
}

// Product categories for dropdown
enum ProductCategory {
  VEGETABLES = "Vegetables",
  FRUITS = "Fruits",
  HERBS = "Herbs",
  GRAINS = "Grains",
  LEGUMES = "Legumes",
  ROOT_CROPS = "Root Crops",
  SPICES = "Spices",
  BEVERAGES = "Beverages",
  DAIRY = "Dairy",
  MEAT = "Meat",
  MEAT_POULTRY = "Meat & Poultry",
  SEAFOOD = "Seafood",
  OTHER = "Other",
}

const CATEGORY_OPTIONS = Object.values(ProductCategory);

// Removed ProductDimensions and related UI/state

interface ProductImage {
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

interface CreateProductData {
  name: string;
  description?: string;
  short_description?: string;
  sku?: string;
  barcode?: string;
  category: string;
  tags?: string[];
  base_price: number;
  stock_quantity?: number;
  unit_of_measurement: MeasurementUnit;
  condition?: ProductCondition;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  status?: ProductStatus;
  is_featured?: boolean;
  is_organic?: boolean;
}

type CatalogProduct = {
  id: string;
  name: string;
  category?: string | null;
  unit: string;
  basePrice: number;
  minSellerPrice?: number | null;
  maxSellerPrice?: number | null;
  shortDescription?: string | null;
};

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const DRAFT_STORAGE_KEY = "seller-product-draft";
const DRAFT_AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    category: "",
    base_price: 0,
    unit_of_measurement: MeasurementUnit.PIECE,
    stock_quantity: 0,
    condition: ProductCondition.NEW,
    status: ProductStatus.DRAFT,
    is_featured: false,
    is_organic: false,
  });

  // Removed physical dimensions state

  // Image state
  const [images, setImages] = useState<(ProductImage | null)[]>(
    Array(5).fill(null)
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | "">("");
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Restore draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          // Only restore if there's actual content
          if (
            parsedDraft.name ||
            parsedDraft.category ||
            parsedDraft.base_price > 0
          ) {
            setFormData(parsedDraft);
            setDraftRestored(true);
          }
        } catch (e) {
          console.error("Failed to restore draft:", e);
        }
      }
    }
  }, []);

  // Load catalog products for seller to reference
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const client = getApiClient(() => accessToken);
        const { data } = await client.get<CatalogProduct[]>(
          "/sellers/catalog-products"
        );
        setCatalogProducts(data ?? []);
      } catch (e) {
        // Non-fatal; seller can still create products without catalog mapping
        console.error("Failed to load catalog products", e);
        setCatalogError(
          "Catalog products could not be loaded. You can still create a product without linking to one."
        );
      }
    };

    void loadCatalog();
  }, [accessToken]);

  // Auto-save draft to localStorage
  useEffect(() => {
    // Don't auto-save if form is empty or being submitted
    if (isSubmitting) return;
    if (!formData.name && !formData.category && formData.base_price === 0)
      return;

    const autoSaveInterval = setInterval(() => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
          setLastSaved(new Date());
        } catch (e) {
          console.error("Failed to auto-save draft:", e);
        }
      }
    }, DRAFT_AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [formData, isSubmitting]);

  // Clear draft from localStorage
  const clearDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setLastSaved(null);
      setDraftRestored(false);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Please upload a valid image file (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    // Clear any previous errors
    setImageError(null);

    // Create preview URL
    const preview = URL.createObjectURL(file);

    // Update images array
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = {
        file,
        preview,
        uploaded: false,
      };
      return newImages;
    });

    // Clear the input value to allow re-uploading the same file
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      // Revoke the object URL to free memory
      if (newImages[index]?.preview) {
        URL.revokeObjectURL(newImages[index]!.preview);
      }
      newImages[index] = null;
      return newImages;
    });
  };

  // Cleanup function to revoke object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image?.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const uploadImageToStorage = async (
    productId: string,
    file: File,
    index: number
  ): Promise<string> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error(
        "Storage not configured. Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9_.-]/g, "_");
    const objectPath = `products/${productId}/${Date.now()}_${index}_${safeName}`;

    const { data, error } = await supabase.storage
      .from("procur-img")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    const { data: publicData } = supabase.storage
      .from("procur-img")
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  };

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
    desiredStatus: ProductStatus
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateProductData = {
        ...formData,
        status: desiredStatus,
      };

      const catalog = catalogProducts.find((p) => p.id === selectedCatalogId);
      if (catalog) {
        const price = payload.base_price;
        if (catalog.minSellerPrice != null && price < catalog.minSellerPrice) {
          throw new Error(
            `Price must be at least ${catalog.minSellerPrice.toFixed(
              2
            )} XCD for ${catalog.name}.`
          );
        }
        if (catalog.maxSellerPrice != null && price > catalog.maxSellerPrice) {
          throw new Error(
            `Price must be at most ${catalog.maxSellerPrice.toFixed(
              2
            )} XCD for ${catalog.name}.`
          );
        }
      }

      // Create product using Redux thunk
      const result = await dispatch(
        createSellerProduct({
          ...payload,
          admin_product_id: selectedCatalogId || undefined,
        })
      );

      // Check if creation was successful
      if (createSellerProduct.fulfilled.match(result)) {
        const productId = result.payload.id;

        // Upload images if any exist
        const uploadedImages = images.filter(
          (img): img is ProductImage => img !== null
        );

        if (uploadedImages.length > 0) {
          const apiClient = getApiClient(() => accessToken);

          // Upload all images + register metadata in parallel
          await Promise.all(
            uploadedImages.map(async (image, i) => {
              try {
                const imageUrl = await uploadImageToStorage(
                  productId,
                  image.file,
                  i
                );

                await apiClient.post(`/sellers/products/${productId}/images`, {
                  image_url: imageUrl,
                  alt_text: `${formData.name} - Image ${i + 1}`,
                  display_order: i,
                  is_primary: i === 0,
                });
              } catch (imageError) {
                console.error(`Failed to upload image ${i + 1}:`, imageError);
                // Continue with other images even if one fails
              }
            })
          );
        }

        // Clear draft after successful submission
        clearDraft();

        // Redirect to products list
        router.push("/seller/products");
      } else {
        // Handle rejected action
        throw new Error(
          (result.payload as string) || "Failed to create product"
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen removed; we redirect directly to /seller/products

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav
          className="mb-6 text-sm text-[var(--primary-base)]"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="px-2 py-1 rounded-full hover:bg-white">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/seller"
                className="px-2 py-1 rounded-full hover:bg-white"
              >
                Seller
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="px-2 py-1 rounded-full bg-white text-[var(--secondary-black)]">
                Add Product
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[32px] leading-tight text-[var(--secondary-black)] font-medium">
                Add New Product
              </h1>
              <p className="mt-2 text-[var(--secondary-muted-edge)]">
                Create a new product listing for your catalog
              </p>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm">
              {draftRestored && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Draft restored</span>
                </div>
              )}
              {lastSaved && (
                <div className="flex items-center gap-1.5 text-[var(--secondary-muted-edge)]">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-xs">
                    Auto-saved {new Date(lastSaved).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {catalogError && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-800">
            {catalogError}
          </div>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-3">
            <form
              onSubmit={(e) =>
                handleSubmit(e, formData.status ?? ProductStatus.DRAFT)
              }
              className="space-y-8"
            >
              {/* Product Images - Moved to top */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Product Images
                </h2>
                <p className="text-sm text-[var(--primary-base)] mb-4">
                  Upload up to 5 high-quality images of your product. The first
                  image will be used as the primary image.
                </p>

                <div className="space-y-4">
                  {/* Image Upload Area */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="relative">
                        {images[index] ? (
                          <div className="relative group">
                            <img
                              src={images[index].preview}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-[var(--secondary-soft-highlight)]"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="text-white hover:text-red-300 transition-colors"
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-[var(--primary-accent2)] text-white text-xs px-2 py-1 rounded">
                                Primary
                              </div>
                            )}
                          </div>
                        ) : (
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="w-full h-32 border-2 border-dashed border-[var(--secondary-soft-highlight)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--primary-accent2)] transition-colors"
                          >
                            <svg
                              className="w-8 h-8 text-[var(--primary-base)] mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <span className="text-sm text-[var(--primary-base)]">
                              {index === 0
                                ? "Primary Image"
                                : `Image ${index + 1}`}
                            </span>
                            <input
                              id={`image-upload-${index}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Upload Instructions */}
                  <div className="text-sm text-[var(--primary-base)] space-y-1">
                    <p>• Supported formats: JPG, PNG, WebP</p>
                    <p>• Maximum file size: 5MB per image</p>
                    <p>• Recommended dimensions: 800x800px or larger</p>
                    <p>
                      • The first image will be used as the primary product
                      image
                    </p>
                  </div>

                  {imageError && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {imageError}
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Basic Information
                </h2>

                {/* Catalog product selector – treated as Category */}
                <div className="mb-6">
                  <label
                    htmlFor="catalog-product"
                    className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                  >
                    Category *
                  </label>
                  <select
                    id="catalog-product"
                    className="input w-full"
                    required
                    value={selectedCatalogId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCatalogId(value);

                      const selected = catalogProducts.find(
                        (p) => p.id === value
                      );
                      // Use the catalog product's category if available, otherwise fall back to its name
                      if (selected) {
                        setFormData((prev) => ({
                          ...prev,
                          category: selected.category || selected.name,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          category: "",
                        }));
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {catalogProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                        {p.category ? ` – ${p.category}` : ""}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-[var(--primary-base)]">
                    Selecting a category links this product to a catalog item
                    and may enforce a price range if defined.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      maxLength={255}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Organic Roma Tomatoes"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="short_description"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Short Description
                    </label>
                    <input
                      type="text"
                      id="short_description"
                      name="short_description"
                      maxLength={500}
                      value={formData.short_description || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Brief product description for listings"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Full Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Detailed product description, growing methods, certifications, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Pricing & Inventory
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="base_price"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Price per unit *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary-base)]">
                        $
                      </span>
                      <input
                        type="number"
                        id="base_price"
                        name="base_price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.base_price}
                        onChange={handleInputChange}
                        className="input w-full pl-8 text-right"
                        placeholder="0.00"
                      />
                    </div>
                    {selectedCatalogId && (
                      <p className="mt-1 text-xs text-[var(--primary-base)]">
                        {(() => {
                          const catalog = catalogProducts.find(
                            (p) => p.id === selectedCatalogId
                          );
                          if (!catalog) return null;
                          const min = catalog.minSellerPrice;
                          const max = catalog.maxSellerPrice;
                          if (min == null && max == null) {
                            return "No specific price range enforced for the selected catalog product.";
                          }
                          if (min != null && max != null) {
                            return `Required range for this catalog product: ${min.toFixed(
                              2
                            )} – ${max.toFixed(2)} XCD per unit.`;
                          }
                          if (min != null) {
                            return `Price must be at least ${min.toFixed(
                              2
                            )} XCD per unit for this catalog product.`;
                          }
                          return `Price must be at most ${max!.toFixed(
                            2
                          )} XCD per unit for this catalog product.`;
                        })()}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                      Quantity and unit
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        id="stock_quantity"
                        name="stock_quantity"
                        min="0"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        className="input w-32"
                        placeholder="0"
                      />
                      <select
                        id="unit_of_measurement"
                        name="unit_of_measurement"
                        required
                        value={formData.unit_of_measurement}
                        onChange={handleInputChange}
                        className="input w-full"
                      >
                        <option value={MeasurementUnit.BAG}>Bag</option>
                        <option value={MeasurementUnit.BUCKET}>Bucket</option>
                        <option value={MeasurementUnit.PIECE}>Piece</option>
                        <option value={MeasurementUnit.DOZEN}>Dozen</option>
                        <option value={MeasurementUnit.KG}>Kilogram</option>
                        <option value={MeasurementUnit.G}>Gram</option>
                        <option value={MeasurementUnit.LB}>Pound</option>
                        <option value={MeasurementUnit.OZ}>Ounce</option>
                        <option value={MeasurementUnit.LITER}>Liter</option>
                        <option value={MeasurementUnit.ML}>Milliliter</option>
                        <option value={MeasurementUnit.GALLON}>Gallon</option>
                      </select>
                    </div>
                    <p className="mt-2 text-xs text-[var(--primary-base)]">
                      Price shown is per selected unit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Attributes */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Product Attributes
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm text-[var(--secondary-black)]">
                      Featured Product
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_organic"
                      checked={formData.is_organic}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm text-[var(--secondary-black)]">
                      Organic Product
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[var(--secondary-soft-highlight)]">
                <div className="flex gap-3 order-2 sm:order-1">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-ghost"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  {(formData.name ||
                    formData.category ||
                    formData.base_price > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to clear the draft? This cannot be undone."
                          )
                        ) {
                          setFormData({
                            name: "",
                            category: "",
                            base_price: 0,
                            unit_of_measurement: MeasurementUnit.PIECE,
                            stock_quantity: 0,
                            condition: ProductCondition.NEW,
                            status: ProductStatus.DRAFT,
                            is_featured: false,
                            is_organic: false,
                          });
                          setImages(Array(5).fill(null));
                          clearDraft();
                        }
                      }}
                      className="btn btn-ghost text-red-600 hover:bg-red-50"
                      disabled={isSubmitting}
                    >
                      Clear Draft
                    </button>
                  )}
                </div>

                <div className="flex gap-3 order-1 sm:order-2 sm:ml-auto">
                  <button
                    type="submit"
                    onClick={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        status: ProductStatus.DRAFT,
                      }));
                      handleSubmit(e, ProductStatus.DRAFT);
                    }}
                    className="btn btn-ghost"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save as Draft"}
                  </button>

                  <button
                    type="submit"
                    onClick={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        status: ProductStatus.ACTIVE,
                      }));
                      handleSubmit(e, ProductStatus.ACTIVE);
                    }}
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? images.some((img) => img !== null)
                        ? "Publishing & uploading images..."
                        : "Publishing..."
                      : "Publish Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Preview Panel */}
          <div className="xl:col-span-2">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Product Preview
                </h3>

                {/* Product Card Preview */}
                <div className="border border-[var(--secondary-soft-highlight)] rounded-xl overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-50 relative">
                    {images[0] ? (
                      <img
                        src={images[0].preview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-400">
                            No image uploaded
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Image indicators */}
                    {images.filter((img) => img !== null).length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{images.filter((img) => img !== null).length - 1} more
                      </div>
                    )}

                    {/* Status badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {formData.is_featured && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                      {formData.is_organic && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Organic
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h4 className="font-medium text-[var(--secondary-black)] mb-2">
                      {formData.name || "Product Name"}
                    </h4>

                    {formData.short_description && (
                      <p className="text-sm text-[var(--primary-base)] mb-3 line-clamp-2">
                        {formData.short_description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-[var(--secondary-black)]">
                          ${formData.base_price.toFixed(2)}
                        </span>
                        <span className="text-sm text-[var(--primary-base)]">
                          / {formData.unit_of_measurement}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--primary-base)]">
                        Category: {formData.category || "Not set"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          (formData.stock_quantity ?? 0) > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(formData.stock_quantity ?? 0) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {formData.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-[var(--primary-accent1)] text-[var(--secondary-black)] rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {formData.tags.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{formData.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-[var(--primary-base)] mb-2">
                    <strong>Preview:</strong> This is how your product will
                    appear to buyers
                  </p>
                  <div className="text-xs text-[var(--primary-base)] space-y-1">
                    <div>
                      Status:{" "}
                      <span className="capitalize">{formData.status}</span>
                    </div>
                    <div>
                      Stock: {formData.stock_quantity}{" "}
                      {formData.unit_of_measurement}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
