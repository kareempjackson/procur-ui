"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import { getApiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  PIECE = "piece",
  DOZEN = "dozen",
  LITER = "liter",
  ML = "ml",
  GALLON = "gallon",
}

interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

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
  subcategory?: string;
  tags?: string[];
  base_price: number;
  sale_price?: number;
  currency?: string;
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  unit_of_measurement: MeasurementUnit;
  weight?: number;
  dimensions?: ProductDimensions;
  condition?: ProductCondition;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  status?: ProductStatus;
  is_featured?: boolean;
  is_organic?: boolean;
  is_local?: boolean;
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AddProductPage() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    category: "",
    base_price: 0,
    unit_of_measurement: MeasurementUnit.PIECE,
    currency: "USD",
    stock_quantity: 0,
    min_stock_level: 0,
    condition: ProductCondition.NEW,
    status: ProductStatus.DRAFT,
    is_featured: false,
    is_organic: false,
    is_local: false,
  });

  // Tags input state
  const [tagInput, setTagInput] = useState("");

  // Dimensions state
  const [showDimensions, setShowDimensions] = useState(false);
  const [dimensions, setDimensions] = useState<ProductDimensions>({
    length: 0,
    width: 0,
    height: 0,
    unit: "cm",
  });

  // Image state
  const [images, setImages] = useState<(ProductImage | null)[]>(
    Array(5).fill(null)
  );
  const [imageError, setImageError] = useState<string | null>(null);

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

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags?.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleDimensionChange = (
    field: keyof ProductDimensions,
    value: string | number
  ) => {
    setDimensions((prev) => ({
      ...prev,
      [field]:
        typeof value === "string" ? value : parseFloat(value.toString()) || 0,
    }));
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

  const uploadImageToStorage = async (file: File): Promise<string> => {
    // This is a placeholder for actual image upload logic
    // In a real implementation, you would upload to a cloud storage service
    // and return the URL. For now, we'll create a mock URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/images/${Date.now()}-${file.name}`);
      }, 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const apiClient = getApiClient(() => token);

      // First, create the product
      const productData = {
        ...formData,
        dimensions: showDimensions ? dimensions : undefined,
      };

      const response = await apiClient.post("/sellers/products", productData);
      const productId = response.data.id;

      // Then, upload images if any exist
      const uploadedImages = images.filter(
        (img): img is ProductImage => img !== null
      );

      if (uploadedImages.length > 0) {
        for (let i = 0; i < uploadedImages.length; i++) {
          const image = uploadedImages[i];
          try {
            // Upload image to storage and get URL
            const imageUrl = await uploadImageToStorage(image.file);

            // Add image to product
            await apiClient.post(`/sellers/products/${productId}/images`, {
              image_url: imageUrl,
              alt_text: `${formData.name} - Image ${i + 1}`,
              display_order: i,
              is_primary: i === 0, // First image is primary
            });
          } catch (imageError) {
            console.error(`Failed to upload image ${i + 1}:`, imageError);
            // Continue with other images even if one fails
          }
        }
      }

      setSuccess(true);

      // Redirect to product list or product detail after a short delay
      setTimeout(() => {
        router.push("/seller/inventory");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)]">
        <TopNavigation />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
            <h1 className="text-2xl font-medium text-[var(--secondary-black)] mb-2">
              Product Created Successfully!
            </h1>
            <p className="text-[var(--primary-base)] mb-6">
              Your product has been added to your catalog. Redirecting to
              inventory...
            </p>
            <Link href="/seller/inventory" className="btn btn-primary">
              View Inventory
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <TopNavigation />

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
          <h1 className="text-[32px] leading-tight text-[var(--secondary-black)] font-medium">
            Add New Product
          </h1>
          <p className="mt-2 text-[var(--secondary-muted-edge)]">
            Create a new product listing for your catalog
          </p>
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

        {/* Form */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
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

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Category *
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      required
                      maxLength={100}
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Vegetables"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subcategory"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Subcategory
                    </label>
                    <input
                      type="text"
                      id="subcategory"
                      name="subcategory"
                      maxLength={100}
                      value={formData.subcategory || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Fresh Vegetables"
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

              {/* Product Details */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <h2 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                  Product Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      maxLength={100}
                      value={formData.sku || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., TOM-ROM-001"
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
                      maxLength={100}
                      value={formData.barcode || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Product barcode"
                    />
                  </div>

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
                      maxLength={100}
                      value={formData.brand || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., FreshFarm"
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
                      maxLength={100}
                      value={formData.model || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Premium"
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
                      maxLength={50}
                      value={formData.color || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Red"
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
                      maxLength={50}
                      value={formData.size || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="e.g., Large"
                    />
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
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="input w-full"
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
                      htmlFor="status"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      <option value={ProductStatus.DRAFT}>Draft</option>
                      <option value={ProductStatus.ACTIVE}>Active</option>
                      <option value={ProductStatus.INACTIVE}>Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                  >
                    Tags
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagAdd}
                      className="input w-full"
                      placeholder="Type a tag and press Enter"
                    />
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[var(--primary-accent1)] text-[var(--secondary-black)]"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="ml-2 text-[var(--primary-base)] hover:text-[var(--secondary-black)]"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
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
                      Base Price *
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
                        className="input w-full pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="sale_price"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Sale Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary-base)]">
                        $
                      </span>
                      <input
                        type="number"
                        id="sale_price"
                        name="sale_price"
                        min="0"
                        step="0.01"
                        value={formData.sale_price || ""}
                        onChange={handleInputChange}
                        className="input w-full pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="unit_of_measurement"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Unit of Measurement *
                    </label>
                    <select
                      id="unit_of_measurement"
                      name="unit_of_measurement"
                      required
                      value={formData.unit_of_measurement}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
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

                  <div>
                    <label
                      htmlFor="stock_quantity"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="stock_quantity"
                      name="stock_quantity"
                      min="0"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="min_stock_level"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Minimum Stock Level
                    </label>
                    <input
                      type="number"
                      id="min_stock_level"
                      name="min_stock_level"
                      min="0"
                      value={formData.min_stock_level}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="max_stock_level"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Maximum Stock Level
                    </label>
                    <input
                      type="number"
                      id="max_stock_level"
                      name="max_stock_level"
                      min="0"
                      value={formData.max_stock_level || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="weight"
                      className="block text-sm font-medium text-[var(--secondary-black)] mb-2"
                    >
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      min="0"
                      step="0.01"
                      value={formData.weight || ""}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Dimensions */}
              <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-[var(--secondary-black)]">
                    Physical Dimensions
                  </h2>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showDimensions}
                      onChange={(e) => setShowDimensions(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-[var(--primary-base)]">
                      Add dimensions
                    </span>
                  </label>
                </div>

                {showDimensions && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Length
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dimensions.length}
                        onChange={(e) =>
                          handleDimensionChange("length", e.target.value)
                        }
                        className="input w-full"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dimensions.width}
                        onChange={(e) =>
                          handleDimensionChange("width", e.target.value)
                        }
                        className="input w-full"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={dimensions.height}
                        onChange={(e) =>
                          handleDimensionChange("height", e.target.value)
                        }
                        className="input w-full"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                        Unit
                      </label>
                      <select
                        value={dimensions.unit}
                        onChange={(e) =>
                          handleDimensionChange("unit", e.target.value)
                        }
                        className="input w-full"
                      >
                        <option value="cm">cm</option>
                        <option value="in">inches</option>
                        <option value="m">meters</option>
                        <option value="ft">feet</option>
                      </select>
                    </div>
                  </div>
                )}
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

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_local"
                      checked={formData.is_local}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-sm text-[var(--secondary-black)]">
                      Locally Sourced
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[var(--secondary-soft-highlight)]">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-ghost order-2 sm:order-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <div className="flex gap-3 order-1 sm:order-2 sm:ml-auto">
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({
                        ...prev,
                        status: ProductStatus.DRAFT,
                      }));
                      handleSubmit(e);
                    }}
                    className="btn btn-ghost"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save as Draft"}
                  </button>

                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData((prev) => ({
                        ...prev,
                        status: ProductStatus.ACTIVE,
                      }));
                      handleSubmit(e);
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
                      {formData.is_local && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Local
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
                        {formData.sale_price &&
                        formData.sale_price < formData.base_price ? (
                          <>
                            <span className="text-lg font-semibold text-[var(--primary-accent2)]">
                              ${formData.sale_price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${formData.base_price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-[var(--secondary-black)]">
                            ${formData.base_price.toFixed(2)}
                          </span>
                        )}
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
                          formData.stock_quantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {formData.stock_quantity > 0
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
                    {formData.weight && <div>Weight: {formData.weight}kg</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
