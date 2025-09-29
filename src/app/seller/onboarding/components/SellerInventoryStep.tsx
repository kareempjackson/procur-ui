"use client";

import { useState } from "react";

interface SellerOnboardingData {
  businessName: string;
  farmType: string;
  location: string;
  farmSize: string;
  certifications: string[];
  primaryProducts: string[];
  seasonalAvailability: string[];
  farmingMethods: string[];
  paymentInfo: {
    bankAccount: string;
    payoutSchedule: string;
  };
  completedActions: string[];
}

interface SellerInventoryStepProps {
  data: SellerOnboardingData;
  onNext: () => void;
  onBack: () => void;
}

const inventoryFeatures = [
  {
    id: "stock_tracking",
    title: "Stock Level Tracking",
    description: "Monitor quantities in real-time as orders come in",
    icon: "📊",
    benefit: "Never oversell your products",
  },
  {
    id: "harvest_planning",
    title: "Harvest Planning",
    description: "Schedule future harvests and pre-sell upcoming crops",
    icon: "📅",
    benefit: "Secure buyers before harvest",
  },
  {
    id: "quality_grades",
    title: "Quality Grades",
    description: "Set different prices for various quality levels",
    icon: "⭐",
    benefit: "Maximize revenue per harvest",
  },
  {
    id: "batch_tracking",
    title: "Batch Tracking",
    description: "Track products from field to buyer for traceability",
    icon: "🔍",
    benefit: "Meet food safety requirements",
  },
];

const mockInventoryItems = [
  {
    id: 1,
    name: "Organic Hass Avocados",
    category: "Fruits",
    stock: 250,
    unit: "lbs",
    price: "$2.50/lb",
    status: "in_stock",
    harvest_date: "Available Now",
  },
  {
    id: 2,
    name: "Baby Spinach",
    category: "Vegetables",
    stock: 150,
    unit: "lbs",
    price: "$3.20/lb",
    status: "low_stock",
    harvest_date: "Next Week",
  },
  {
    id: 3,
    name: "Honeycrisp Apples",
    category: "Fruits",
    stock: 0,
    unit: "lbs",
    price: "$1.80/lb",
    status: "pre_order",
    harvest_date: "Oct 15-30",
  },
];

export default function SellerInventoryStep({
  data,
  onNext,
  onBack,
}: SellerInventoryStepProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onNext();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "text-green-600 bg-green-50";
      case "low_stock":
        return "text-yellow-600 bg-yellow-50";
      case "pre_order":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_stock":
        return "In Stock";
      case "low_stock":
        return "Low Stock";
      case "pre_order":
        return "Pre-Order";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary-black)] mb-4">
            Manage your inventory
          </h1>
          <p className="text-lg text-[var(--secondary-muted-edge)] max-w-2xl mx-auto">
            Learn how Procur helps you track stock levels, manage orders, and
            maximize your sales potential.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
              Powerful inventory tools
            </h2>

            <div className="space-y-4">
              {inventoryFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="seller-card p-6 hover:shadow-lg transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[var(--primary-accent1)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--secondary-black)] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[var(--secondary-muted-edge)] leading-relaxed mb-3">
                        {feature.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[var(--primary-accent2)] rounded-full" />
                        <span className="text-sm font-medium text-[var(--primary-accent2)]">
                          {feature.benefit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Getting Started Tips */}
            <div className="bg-[var(--primary-accent1)]/10 rounded-2xl p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-3">
                Getting Started
              </h3>
              <ul className="text-sm text-[var(--secondary-muted-edge)] space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-[var(--primary-accent2)] mt-1">•</span>
                  <span>
                    Add your first products after completing onboarding
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[var(--primary-accent2)] mt-1">•</span>
                  <span>Set stock levels and pricing for each item</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[var(--primary-accent2)] mt-1">•</span>
                  <span>Enable notifications for low stock alerts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[var(--primary-accent2)] mt-1">•</span>
                  <span>Use harvest planning for seasonal crops</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--secondary-black)]">
              Your inventory dashboard
            </h2>

            {/* Inventory Preview */}
            <div className="inventory-preview">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--secondary-black)]">
                  Current Inventory
                </h3>
                <button className="text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] transition-colors">
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {mockInventoryItems.map((item) => (
                  <div key={item.id} className="inventory-item">
                    <div className="inventory-item-image">
                      <span className="text-lg">
                        {item.category === "Fruits" ? "🍎" : "🥬"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-[var(--secondary-black)] text-sm">
                          {item.name}
                        </h4>
                        <span className="text-sm font-medium text-[var(--primary-accent2)]">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-[var(--secondary-muted-edge)]">
                            {item.stock > 0
                              ? `${item.stock} ${item.unit}`
                              : "Pre-order"}
                          </span>
                          <span
                            className={`
                              text-xs px-2 py-1 rounded-full font-medium
                              ${getStatusColor(item.status)}
                            `}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--secondary-muted-edge)]">
                          {item.harvest_date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="farm-stats-grid mt-6">
                <div className="farm-stat-card">
                  <div className="farm-stat-number">3</div>
                  <div className="farm-stat-label">Products</div>
                </div>
                <div className="farm-stat-card">
                  <div className="farm-stat-number">400</div>
                  <div className="farm-stat-label">Total lbs</div>
                </div>
                <div className="farm-stat-card">
                  <div className="farm-stat-number">$980</div>
                  <div className="farm-stat-label">Potential Value</div>
                </div>
              </div>
            </div>

            {/* Order Management Preview */}
            <div className="seller-card p-6">
              <h3 className="font-semibold text-[var(--secondary-black)] mb-4">
                Order Management
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--secondary-soft-highlight)]/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--secondary-black)]">
                        Order #1234
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        50 lbs Organic Avocados
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    Shipped
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--primary-accent2)]/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[var(--primary-accent2)]/20 rounded-full flex items-center justify-center">
                      <span className="text-[var(--primary-accent2)] text-sm">
                        📦
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--secondary-black)]">
                        Order #1235
                      </div>
                      <div className="text-xs text-[var(--secondary-muted-edge)]">
                        25 lbs Baby Spinach
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--primary-accent2)]">
                    Processing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button
            onClick={onBack}
            className="btn btn-ghost text-base px-6 py-3 order-2 sm:order-1"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className={`
              btn btn-primary text-base px-8 py-3 min-w-[160px] order-1 sm:order-2
              transition-all duration-300 ease-out
              hover:shadow-lg hover:shadow-[var(--primary-accent2)]/20
              disabled:opacity-70 disabled:cursor-not-allowed
              ${isLoading ? "scale-95" : "hover:scale-105"}
            `}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              "Continue to Payments"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
