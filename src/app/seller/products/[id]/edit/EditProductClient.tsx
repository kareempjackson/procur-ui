"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiClient } from "@/lib/apiClient";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ADMIN_CATALOG_PRODUCT_CATEGORIES } from "@/lib/adminCatalogProductCategories";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  updateSellerProduct,
  type SellerProduct,
  type ProductImage as ExistingImage,
} from "@/store/slices/sellerProductsSlice";
import ProcurLoader from "@/components/ProcurLoader";

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

interface NewProductImage {
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  short_description?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  tags?: string[];
  base_price?: number;
  stock_quantity?: number;
  unit_of_measurement?: MeasurementUnit;
  condition?: ProductCondition;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  status?: ProductStatus;
  is_featured?: boolean;
  is_organic?: boolean;
}

// Remove empty-string and empty-array fields to satisfy backend validators
function buildCleanUpdatePayload(
  update: UpdateProductData
): Partial<UpdateProductData> {
  const cleaned: Partial<UpdateProductData> = {};
  Object.entries(update).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    (cleaned as any)[key] = value;
  });
  return cleaned;
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function normalizeCategoryToAdminList(category?: string | null): string {
  const raw = typeof category === "string" ? category.trim() : "";
  if (!raw) return "";
  if (ADMIN_CATALOG_PRODUCT_CATEGORIES.includes(raw as any)) return raw;

  const legacyMap: Record<string, string> = {
    Herbs: "Herbs & Spices",
    Spices: "Herbs & Spices",
    Grains: "Grains & Cereals",
    Dairy: "Dairy & Eggs",
    Meat: "Meat & Poultry",
    "Root Crops": "Vegetables",
    Legumes: "Other",
    Beverages: "Beverages",
    Vegetables: "Vegetables",
    Fruits: "Fruits",
    Seafood: "Seafood",
    Other: "Other",
  };

  return legacyMap[raw] ?? "Other";
}

interface EditProductClientProps {
  productId: string;
}

export default function EditProductClient({
  productId,
}: EditProductClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Product data
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [formData, setFormData] = useState<UpdateProductData>({});

  // Existing images from the database
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  // New images to upload
  const [newImages, setNewImages] = useState<(NewProductImage | null)[]>(
    Array(5).fill(null)
  );
  const [imageError, setImageError] = useState<string | null>(null);

  // Combined images for preview
  const allImages = [
    ...existingImages.map((img) => img.image_url),
    ...newImages.filter((img) => img !== null).map((img) => img!.preview),
  ];

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiClient = getApiClient(() => accessToken);
        const { data } = await apiClient.get(`/sellers/products/${productId}`);
        const productData = data as SellerProduct;

        setProduct(productData);
        setFormData({
          name: productData.name,
          description: productData.description || "",
          short_description: productData.short_description || "",
          sku: productData.sku || "",
          barcode: productData.barcode || "",
          category: normalizeCategoryToAdminList(productData.category),
          tags: productData.tags || [],
          base_price: productData.base_price,
          stock_quantity: productData.stock_quantity || 0,
          unit_of_measurement:
            productData.unit_of_measurement as MeasurementUnit,
          condition: productData.condition as ProductCondition,
          brand: productData.brand || "",
          model: productData.model || "",
          color: productData.color || "",
          size: productData.size || "",
          status: productData.status as ProductStatus,
          is_featured: productData.is_featured || false,
          is_organic: productData.is_organic || false,
        });
        setExistingImages(productData.images || []);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId && accessToken) {
      fetchProduct();
    }
  }, [productId, accessToken]);

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

  const handleNewImageUpload = (
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

    // Update new images array
    setNewImages((prev) => {
      const updated = [...prev];
      updated[index] = {
        file,
        preview,
        uploaded: false,
      };
      return updated;
    });

    // Clear the input value to allow re-uploading the same file
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      const updated = [...prev];
      // Revoke the object URL to free memory
      if (updated[index]?.preview) {
        URL.revokeObjectURL(updated[index]!.preview);
      }
      updated[index] = null;
      return updated;
    });
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const apiClient = getApiClient(() => accessToken);
      await apiClient.delete(
        `/sellers/products/${productId}/images/${imageId}`
      );

      // Remove from UI immediately
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Failed to delete image:", err);
      setImageError("Failed to delete image. Please try again.");
    }
  };

  // Cleanup function to revoke object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      newImages.forEach((image) => {
        if (image?.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const uploadImageToStorage = async (
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Update product using Redux thunk
      const cleanedUpdate = buildCleanUpdatePayload(formData);
      const result = await dispatch(
        updateSellerProduct({ id: productId, update: cleanedUpdate })
      );

      // Check if update was successful
      if (updateSellerProduct.fulfilled.match(result)) {
        // Upload new images if any exist
        const uploadedNewImages = newImages.filter(
          (img): img is NewProductImage => img !== null
        );

        if (uploadedNewImages.length > 0) {
          const apiClient = getApiClient(() => accessToken);
          const currentMaxOrder = Math.max(
            ...existingImages.map((img) => img.display_order),
            -1
          );

          for (let i = 0; i < uploadedNewImages.length; i++) {
            const image = uploadedNewImages[i];
            try {
              const imageUrl = await uploadImageToStorage(image.file, i);

              await apiClient.post(`/sellers/products/${productId}/images`, {
                image_url: imageUrl,
                alt_text: `${formData.name} - Image ${currentMaxOrder + i + 2}`,
                display_order: currentMaxOrder + i + 1,
                is_primary: existingImages.length === 0 && i === 0,
              });
            } catch (imageError) {
              console.error(`Failed to upload image ${i + 1}:`, imageError);
              // Continue with other images even if one fails
            }
          }
        }

        // Redirect to products list
        router.push("/seller/products");
      } else {
        // Handle rejected action
        throw new Error(
          (result.payload as string) || "Failed to update product"
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-red-800 font-medium mb-2">
              Error Loading Product
            </h2>
            <p className="text-red-600">{error}</p>
            <Link
              href="/seller/products"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              Back to Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
              <Link
                href="/seller/products"
                className="px-2 py-1 rounded-full hover:bg-white"
              >
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="px-2 py-1 rounded-full bg-white text-[var(--secondary-black)]">
                Edit
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[32px] leading-tight text-[var(--secondary-black)] font-medium">
                Edit Product
              </h1>
              <p className="mt-2 text-[var(--secondary-muted-edge)]">
                Update your product listing information
              </p>
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

        {/* Form with 2-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Images */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Product Images
                </h2>
                <p className="text-sm text-[var(--primary-base)] mb-4">
                  Upload up to 5 high-quality images of your product. The first
                  image will be used as the primary image.
                </p>

                <div className="space-y-4">
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-[var(--secondary-black)] mb-3">
                        Current Images
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {existingImages.map((image, index) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.image_url}
                              alt={image.alt_text || "Product"}
                              className="w-full h-32 object-cover rounded-lg border border-[var(--secondary-soft-highlight)]"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeExistingImage(image.id)}
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
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Images */}
                  <div>
                    <h3 className="text-sm font-medium text-[var(--secondary-black)] mb-3">
                      Add New Images
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="relative">
                          {newImages[index] ? (
                            <div className="relative group">
                              <img
                                src={newImages[index]!.preview}
                                alt={`New image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-[var(--secondary-soft-highlight)]"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeNewImage(index)}
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
                                Image {index + 1}
                              </span>
                              <input
                                id={`image-upload-${index}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleNewImageUpload(e, index)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Instructions */}
                  <div className="text-sm text-[var(--primary-base)] space-y-1">
                    <p>• Supported formats: JPG, PNG, WebP</p>
                    <p>• Maximum file size: 5MB per image</p>
                    <p>• Recommended dimensions: 800x800px or larger</p>
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
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                      placeholder="e.g., Organic Roma Tomatoes"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {ADMIN_CATALOG_PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
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
                      className="input w-full rounded-full"
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
                      className="input w-full rounded-2xl"
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
                        value={formData.base_price || ""}
                        onChange={handleInputChange}
                        className="input w-full pl-8 text-right rounded-full"
                        placeholder="0.00"
                      />
                    </div>
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
                        value={formData.stock_quantity || ""}
                        onChange={handleInputChange}
                        className="input w-32 rounded-full"
                        placeholder="0"
                      />
                      <select
                        id="unit_of_measurement"
                        name="unit_of_measurement"
                        required
                        value={formData.unit_of_measurement || ""}
                        onChange={handleInputChange}
                        className="input w-full rounded-full"
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

                  <div>
                    <label
                      htmlFor="condition"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                    >
                      <option value={ProductCondition.NEW}>New</option>
                      <option value={ProductCondition.USED}>Used</option>
                      <option value={ProductCondition.REFURBISHED}>
                        Refurbished
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="sku"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      SKU
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                      placeholder="Product SKU"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="barcode"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Barcode
                    </label>
                    <input
                      type="text"
                      id="barcode"
                      name="barcode"
                      value={formData.barcode || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                      placeholder="Product barcode"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Product Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                      placeholder="Brand name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="model"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Model
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                      placeholder="Model"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="color"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Color
                    </label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      value={formData.color || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                      placeholder="Color"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="size"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Size
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                      placeholder="Size"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || ""}
                      onChange={handleInputChange}
                      className="input w-full rounded-full"
                    >
                      <option value={ProductStatus.DRAFT}>Draft</option>
                      <option value={ProductStatus.ACTIVE}>Active</option>
                      <option value={ProductStatus.INACTIVE}>Inactive</option>
                      <option value={ProductStatus.OUT_OF_STOCK}>
                        Out of Stock
                      </option>
                      <option value={ProductStatus.DISCONTINUED}>
                        Discontinued
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[var(--primary-accent2)] border-gray-300 rounded focus:ring-[var(--primary-accent2)]"
                      />
                      <span className="text-sm text-[var(--secondary-black)]">
                        Featured
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="is_organic"
                        checked={formData.is_organic || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[var(--primary-accent2)] border-gray-300 rounded focus:ring-[var(--primary-accent2)]"
                      />
                      <span className="text-sm text-[var(--secondary-black)]">
                        Organic
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6">
                <Link
                  href="/seller/products"
                  className="px-6 py-3 text-[var(--secondary-black)] hover:bg-gray-50 rounded-full transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={classNames(
                    "px-8 py-3 rounded-full font-medium transition-all",
                    isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[var(--primary-accent2)] text-white hover:bg-[var(--primary-accent3)] shadow-sm hover:shadow"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating Product...
                    </span>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Live Preview */}
          <div className="xl:col-span-2">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Live Preview
                </h3>

                {/* Product Card Preview */}
                <div className="border border-[var(--secondary-soft-highlight)] rounded-lg overflow-hidden">
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-50">
                    {allImages.length > 0 ? (
                      <img
                        src={allImages[0]}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm text-gray-400">
                          No image uploaded
                        </p>
                      </div>
                    )}

                    {/* Image indicators */}
                    {allImages.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{allImages.length - 1} more
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
                          ${(formData.base_price || 0).toFixed(2)}
                        </span>
                        <span className="text-sm text-[var(--primary-base)]">
                          / {formData.unit_of_measurement || "unit"}
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
