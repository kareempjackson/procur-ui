"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  CheckBadgeIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from "@/components/footer/Footer";
import ProcurLoader from "@/components/ProcurLoader";

interface SellerProfile {
  id: string;
  business_name: string;
  display_name: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  specialties: string[];
  certifications: string[];
  rating: number;
  total_reviews: number;
  years_in_business: number;
  is_verified: boolean;
  is_local: boolean;
  is_organic_certified: boolean;
  delivery_radius: number;
  min_order_amount: number;
  response_time: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  sku?: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  base_price: number;
  sale_price?: number;
  currency: string;
  stock_quantity: number;
  unit_of_measurement: string;
  condition: string;
  status: string;
  is_featured: boolean;
  is_organic: boolean;
  is_local: boolean;
  images?: Array<{
    id: string;
    image_url: string;
    alt_text?: string;
    is_primary: boolean;
  }>;
}

interface Review {
  id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  product_name?: string;
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PublicSellerPage() {
  const params = useParams();
  const businessName = params.businessName as string;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [requestForm, setRequestForm] = useState({
    product_name: "",
    quantity: "",
    unit: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    delivery_date: "",
  });

  // Demo data - replace with API calls
  useEffect(() => {
    const loadSellerData = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo seller data
      const demoSeller: SellerProfile = {
        id: "seller-1",
        business_name: decodeURIComponent(businessName).replace(/-/g, " "),
        display_name: "Green Valley Organic Farm",
        description:
          "Family-owned organic farm specializing in fresh, locally-grown produce. We've been serving the community for over 25 years with sustainable farming practices and the highest quality fruits and vegetables. Our commitment to organic farming ensures you get the freshest, most nutritious produce while supporting environmental sustainability.",
        logo_url:
          "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200&h=200&fit=crop&crop=center",
        banner_url:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop&crop=center",
        address: {
          street: "1234 Farm Road",
          city: "Green Valley",
          state: "California",
          country: "United States",
          postal_code: "95945",
        },
        contact: {
          phone: "+1 (555) 123-4567",
          email: "info@greenvalleyorganic.com",
          website: "https://greenvalleyorganic.com",
        },
        specialties: [
          "Organic Vegetables",
          "Fresh Fruits",
          "Herbs & Spices",
          "Seasonal Produce",
        ],
        certifications: [
          "USDA Organic",
          "Non-GMO Project",
          "California Certified Organic",
        ],
        rating: 4.8,
        total_reviews: 127,
        years_in_business: 25,
        is_verified: true,
        is_local: true,
        is_organic_certified: true,
        delivery_radius: 50,
        min_order_amount: 25,
        response_time: "Within 2 hours",
      };

      // Demo products
      const demoProducts: Product[] = [
        {
          id: "1",
          name: "Organic Roma Tomatoes",
          description:
            "Fresh, vine-ripened organic Roma tomatoes perfect for cooking and sauces.",
          short_description: "Fresh, vine-ripened organic Roma tomatoes",
          sku: "TOM-ROM-001",
          category: "Vegetables",
          subcategory: "Tomatoes",
          tags: ["organic", "fresh", "local"],
          base_price: 4.99,
          currency: "USD",
          stock_quantity: 150,
          unit_of_measurement: "lb",
          condition: "new",
          status: "active",
          is_featured: true,
          is_organic: true,
          is_local: true,
          images: [
            {
              id: "img1",
              image_url:
                "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=400&fit=crop&crop=center",
              alt_text: "Fresh organic Roma tomatoes",
              is_primary: true,
            },
          ],
        },
        {
          id: "2",
          name: "Fresh Organic Spinach",
          description:
            "Tender, nutrient-rich organic spinach leaves, perfect for salads and cooking.",
          short_description: "Tender, nutrient-rich organic spinach leaves",
          sku: "SPN-ORG-001",
          category: "Vegetables",
          subcategory: "Leafy Greens",
          tags: ["organic", "leafy greens", "fresh"],
          base_price: 3.49,
          currency: "USD",
          stock_quantity: 80,
          unit_of_measurement: "bunch",
          condition: "new",
          status: "active",
          is_featured: false,
          is_organic: true,
          is_local: true,
          images: [
            {
              id: "img2",
              image_url:
                "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center",
              alt_text: "Fresh organic spinach",
              is_primary: true,
            },
          ],
        },
        {
          id: "3",
          name: "Organic Strawberries",
          description:
            "Sweet, juicy organic strawberries grown with care and harvested at peak ripeness.",
          short_description: "Sweet, juicy organic strawberries",
          sku: "STR-ORG-001",
          category: "Fruits",
          subcategory: "Berries",
          tags: ["organic", "sweet", "berries"],
          base_price: 6.99,
          sale_price: 5.99,
          currency: "USD",
          stock_quantity: 45,
          unit_of_measurement: "lb",
          condition: "new",
          status: "active",
          is_featured: true,
          is_organic: true,
          is_local: true,
          images: [
            {
              id: "img3",
              image_url:
                "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&crop=center",
              alt_text: "Fresh organic strawberries",
              is_primary: true,
            },
          ],
        },
        {
          id: "4",
          name: "Farm Fresh Eggs",
          description:
            "Free-range eggs from happy hens, collected daily for maximum freshness.",
          short_description: "Free-range eggs from happy hens",
          sku: "EGG-FR-001",
          category: "Dairy & Eggs",
          subcategory: "Eggs",
          tags: ["free-range", "fresh", "local"],
          base_price: 5.99,
          currency: "USD",
          stock_quantity: 60,
          unit_of_measurement: "dozen",
          condition: "new",
          status: "active",
          is_featured: false,
          is_organic: false,
          is_local: true,
          images: [
            {
              id: "img4",
              image_url:
                "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&crop=center",
              alt_text: "Farm fresh eggs",
              is_primary: true,
            },
          ],
        },
        {
          id: "5",
          name: "Organic Bell Peppers",
          description:
            "Colorful organic bell peppers in red, yellow, and green varieties.",
          short_description: "Colorful organic bell peppers",
          sku: "PEP-MIX-001",
          category: "Vegetables",
          subcategory: "Peppers",
          tags: ["organic", "colorful", "mixed"],
          base_price: 4.49,
          currency: "USD",
          stock_quantity: 90,
          unit_of_measurement: "lb",
          condition: "new",
          status: "active",
          is_featured: false,
          is_organic: true,
          is_local: true,
          images: [
            {
              id: "img5",
              image_url:
                "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&crop=center",
              alt_text: "Organic bell peppers",
              is_primary: true,
            },
          ],
        },
        {
          id: "6",
          name: "Fresh Basil",
          description:
            "Aromatic fresh basil perfect for cooking, garnishing, and making pesto.",
          short_description: "Aromatic fresh basil",
          sku: "BAS-FR-001",
          category: "Herbs",
          subcategory: "Fresh Herbs",
          tags: ["herbs", "aromatic", "fresh"],
          base_price: 2.99,
          currency: "USD",
          stock_quantity: 30,
          unit_of_measurement: "bunch",
          condition: "new",
          status: "active",
          is_featured: false,
          is_organic: true,
          is_local: true,
          images: [
            {
              id: "img6",
              image_url:
                "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=400&fit=crop&crop=center",
              alt_text: "Fresh basil",
              is_primary: true,
            },
          ],
        },
      ];

      // Demo reviews
      const demoReviews: Review[] = [
        {
          id: "1",
          buyer_name: "Sarah M.",
          rating: 5,
          comment:
            "Amazing quality produce! The tomatoes were so fresh and flavorful. Will definitely order again.",
          created_at: "2024-01-20T10:30:00Z",
          product_name: "Organic Roma Tomatoes",
        },
        {
          id: "2",
          buyer_name: "Mike R.",
          rating: 5,
          comment:
            "Best strawberries I've ever had! Sweet, juicy, and perfectly ripe. Fast delivery too.",
          created_at: "2024-01-18T14:15:00Z",
          product_name: "Organic Strawberries",
        },
        {
          id: "3",
          buyer_name: "Jennifer L.",
          rating: 4,
          comment:
            "Great selection of organic vegetables. The spinach was very fresh. Highly recommend!",
          created_at: "2024-01-15T09:45:00Z",
          product_name: "Fresh Organic Spinach",
        },
      ];

      setSeller(demoSeller);
      setProducts(demoProducts);
      setReviews(demoReviews);
      setLoading(false);
    };

    loadSellerData();
  }, [businessName]);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle request submission
    console.log("Request submitted:", requestForm);
    setShowRequestModal(false);
    // Reset form
    setRequestForm({
      product_name: "",
      quantity: "",
      unit: "",
      description: "",
      contact_email: "",
      contact_phone: "",
      delivery_date: "",
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {rating >= star ? (
              <StarIconSolid
                className={`${sizeClasses[size]} text-yellow-400`}
              />
            ) : rating >= star - 0.5 ? (
              <div className="relative">
                <StarIcon className={`${sizeClasses[size]} text-gray-300`} />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <StarIconSolid
                    className={`${sizeClasses[size]} text-yellow-400`}
                  />
                </div>
              </div>
            ) : (
              <StarIcon className={`${sizeClasses[size]} text-gray-300`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)]">
        <TopNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <ProcurLoader size="lg" text="Loading seller profile..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-[var(--primary-background)]">
        <TopNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-[var(--secondary-black)] mb-2">
              Seller Not Found
            </h1>
            <p className="text-[var(--primary-base)] mb-4">
              The seller you&apos;re looking for doesn't exist.
            </p>
            <Link href="/" className="btn btn-primary">
              Back to Home
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

      {/* Hero Banner */}
      <section className="relative">
        {seller.banner_url && (
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={seller.banner_url}
              alt={`${seller.display_name} banner`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 seller-banner-overlay"></div>
          </div>
        )}

        {/* Seller Profile Header */}
        <div className="max-w-7xl mx-auto px-6">
          <div className={`relative ${seller.banner_url ? "-mt-20" : "pt-10"}`}>
            <div className="bg-white rounded-2xl shadow-lg border border-[var(--secondary-soft-highlight)] p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-100 border border-[var(--secondary-soft-highlight)]">
                    {seller.logo_url ? (
                      <img
                        src={seller.logo_url}
                        alt={`${seller.display_name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--primary-base)] text-2xl font-bold">
                        {seller.display_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl md:text-3xl font-medium text-[var(--secondary-black)]">
                          {seller.display_name}
                        </h1>
                        {seller.is_verified && (
                          <CheckBadgeIcon
                            className="h-6 w-6 text-blue-500"
                            title="Verified Seller"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          {renderStars(seller.rating)}
                          <span className="text-sm text-[var(--primary-base)] ml-1">
                            {seller.rating} ({seller.total_reviews} reviews)
                          </span>
                        </div>
                        <span className="text-sm text-[var(--primary-base)]">
                          {seller.years_in_business} years in business
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-[var(--primary-base)] mb-3">
                        <MapPinIcon className="h-4 w-4" />
                        <span>
                          {seller.address.city}, {seller.address.state}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {seller.is_organic_certified && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Organic Certified
                          </span>
                        )}
                        {seller.is_local && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Local Producer
                          </span>
                        )}
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {seller.delivery_radius}mi delivery
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowRequestModal(true)}
                        className="btn btn-primary px-6"
                      >
                        Request Produce
                      </button>
                      <div className="flex gap-2">
                        <button className="p-2 border border-[var(--secondary-soft-highlight)] rounded-full hover:bg-gray-50 transition-colors">
                          <HeartIcon className="h-5 w-5 text-[var(--primary-base)]" />
                        </button>
                        <button className="p-2 border border-[var(--secondary-soft-highlight)] rounded-full hover:bg-gray-50 transition-colors">
                          <ShareIcon className="h-5 w-5 text-[var(--primary-base)]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-[var(--secondary-soft-highlight)]">
                <p className="text-[var(--primary-base)] leading-relaxed">
                  {seller.description}
                </p>
              </div>

              {/* Key Info Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <ClockIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      Response Time
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      {seller.response_time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <TruckIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      Min Order
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      ${seller.min_order_amount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <ShieldCheckIcon className="h-5 w-5 text-[var(--primary-accent2)]" />
                  <div>
                    <div className="text-sm font-medium text-[var(--secondary-black)]">
                      Certifications
                    </div>
                    <div className="text-xs text-[var(--primary-base)]">
                      {seller.certifications.length} active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)] mb-6">
              <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                {seller.contact.phone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-4 w-4 text-[var(--primary-base)]" />
                    <span className="text-sm text-[var(--primary-base)]">
                      {seller.contact.phone}
                    </span>
                  </div>
                )}
                {seller.contact.email && (
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-4 w-4 text-[var(--primary-base)]" />
                    <span className="text-sm text-[var(--primary-base)]">
                      {seller.contact.email}
                    </span>
                  </div>
                )}
                {seller.contact.website && (
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-4 w-4 text-[var(--primary-base)]" />
                    <a
                      href={seller.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--primary-accent2)] hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)] mb-6">
              <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {seller.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[var(--primary-background)] text-[var(--primary-base)] text-sm rounded-full border border-[var(--secondary-soft-highlight)]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--secondary-soft-highlight)]">
              <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-4">
                Certifications
              </h3>
              <div className="space-y-2">
                {seller.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckBadgeIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-[var(--primary-base)]">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Products Section */}
            <section className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-medium text-[var(--secondary-black)]">
                    Available Products
                  </h2>
                  <p className="text-sm text-[var(--primary-base)] mt-1">
                    {filteredProducts.length} products available
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input h-10"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-white rounded-full border border-[var(--secondary-soft-highlight)] p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={classNames(
                        "p-2 rounded-full transition-colors",
                        viewMode === "grid"
                          ? "bg-[var(--primary-accent2)] text-white"
                          : "text-[var(--primary-base)] hover:bg-gray-50"
                      )}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={classNames(
                        "p-2 rounded-full transition-colors",
                        viewMode === "list"
                          ? "bg-[var(--primary-accent2)] text-white"
                          : "text-[var(--primary-base)] hover:bg-gray-50"
                      )}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] overflow-hidden product-card-hover"
                    >
                      {/* Product Image */}
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={
                            product.images?.[0]?.image_url ||
                            "/images/products/placeholder.jpg"
                          }
                          alt={product.images?.[0]?.alt_text || product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium text-[var(--secondary-black)] line-clamp-2">
                            {product.name}
                          </h3>
                          {product.is_organic && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex-shrink-0">
                              Organic
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-[var(--primary-base)] mb-3 line-clamp-2">
                          {product.short_description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {product.sale_price ? (
                              <>
                                <span className="text-lg font-semibold text-[var(--primary-accent2)]">
                                  ${product.sale_price}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.base_price}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-[var(--primary-accent2)]">
                                ${product.base_price}
                              </span>
                            )}
                            <span className="text-sm text-[var(--primary-base)]">
                              /{product.unit_of_measurement}
                            </span>
                          </div>

                          <button className="p-2 border border-[var(--secondary-soft-highlight)] rounded-full hover:bg-[var(--primary-accent2)] hover:text-white hover:border-[var(--primary-accent2)] transition-colors">
                            <ShoppingCartIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-[var(--primary-base)]">
                          <span>
                            Stock: {product.stock_quantity}{" "}
                            {product.unit_of_measurement}
                          </span>
                          <span className="capitalize">{product.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={
                              product.images?.[0]?.image_url ||
                              "/images/products/placeholder.jpg"
                            }
                            alt={product.images?.[0]?.alt_text || product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-[var(--secondary-black)]">
                                  {product.name}
                                </h3>
                                {product.is_organic && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Organic
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[var(--primary-base)] mb-2">
                                {product.short_description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-[var(--primary-base)]">
                                <span>
                                  Stock: {product.stock_quantity}{" "}
                                  {product.unit_of_measurement}
                                </span>
                                <span className="capitalize">
                                  {product.category}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                {product.sale_price ? (
                                  <>
                                    <span className="text-lg font-semibold text-[var(--primary-accent2)]">
                                      ${product.sale_price}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.base_price}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-semibold text-[var(--primary-accent2)]">
                                    ${product.base_price}
                                  </span>
                                )}
                                <span className="text-sm text-[var(--primary-base)]">
                                  /{product.unit_of_measurement}
                                </span>
                              </div>
                              <button className="p-2 border border-[var(--secondary-soft-highlight)] rounded-full hover:bg-[var(--primary-accent2)] hover:text-white hover:border-[var(--primary-accent2)] transition-colors">
                                <ShoppingCartIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-medium text-[var(--secondary-black)]">
                    Customer Reviews
                  </h2>
                  <p className="text-sm text-[var(--primary-base)] mt-1">
                    {reviews.length} reviews • {seller.rating} average rating
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)] p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[var(--secondary-black)]">
                            {review.buyer_name}
                          </span>
                          {review.product_name && (
                            <span className="text-sm text-[var(--primary-base)]">
                              • {review.product_name}
                            </span>
                          )}
                        </div>
                        {renderStars(review.rating, "sm")}
                      </div>
                      <span className="text-sm text-[var(--primary-base)]">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[var(--primary-base)] leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Request Produce Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-[var(--secondary-black)]">
                  Request Produce
                </h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestForm.product_name}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        product_name: e.target.value,
                      })
                    }
                    className="input w-full"
                    placeholder="What produce are you looking for?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={requestForm.quantity}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          quantity: e.target.value,
                        })
                      }
                      className="input w-full"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                      Unit *
                    </label>
                    <select
                      required
                      value={requestForm.unit}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, unit: e.target.value })
                      }
                      className="input w-full"
                    >
                      <option value="">Select unit</option>
                      <option value="lb">Pounds (lb)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="dozen">Dozen</option>
                      <option value="bunch">Bunch</option>
                      <option value="box">Box</option>
                      <option value="case">Case</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Additional Details
                  </label>
                  <textarea
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        description: e.target.value,
                      })
                    }
                    className="input w-full h-20 rounded-2xl"
                    placeholder="Any specific requirements, quality preferences, or other details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={requestForm.contact_email}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        contact_email: e.target.value,
                      })
                    }
                    className="input w-full"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={requestForm.contact_phone}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        contact_phone: e.target.value,
                      })
                    }
                    className="input w-full"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    value={requestForm.delivery_date}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        delivery_date: e.target.value,
                      })
                    }
                    className="input w-full"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="btn btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
