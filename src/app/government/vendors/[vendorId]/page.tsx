"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function VendorDetailPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = use(params);
  const [activeTab, setActiveTab] = useState<
    "personal" | "farm" | "production" | "programs" | "market" | "products"
  >("personal");

  // Mock vendor data - will be replaced with API
  const vendor = {
    id: vendorId,
    name: "Green Valley Farms",
    contactPerson: "John Smith",
    email: "john@greenvalley.com",
    phone: "+1-473-555-0123",
    location: "St. George's, Grenada",
    gps: { lat: 12.0561, lng: -61.7516 },
    totalAcreage: 250,
    utilizedAcreage: 180,
    availableAcreage: 70,
    complianceStatus: "compliant",
    registeredDate: "2022-01-15",
    crops: [
      { name: "Tomatoes", variety: "Roma", acreage: 60 },
      { name: "Lettuce", variety: "Iceberg", acreage: 40 },
      { name: "Peppers", variety: "Bell Pepper", acreage: 80 },
    ],
    infrastructure: {
      irrigation: true,
      rainwaterHarvesting: true,
      ponds: 2,
      greenhouses: 3,
      shadeHouses: 1,
      transportation: "2 trucks, 1 van",
    },
    production: [
      {
        id: "1",
        crop: "Tomatoes",
        variety: "Roma",
        acreage: 60,
        datePlanted: "2024-08-15",
        expectedHarvest: "2024-11-15",
        expectedAmount: "15,000 kg",
        chemicals: [
          { name: "Fertilizer NPK", dose: "50kg/acre", date: "2024-08-20" },
          { name: "Pesticide", dose: "2L/acre", date: "2024-09-10" },
        ],
        storage: "Climate-controlled warehouse",
      },
      {
        id: "2",
        crop: "Lettuce",
        variety: "Iceberg",
        acreage: 40,
        datePlanted: "2024-09-01",
        expectedHarvest: "2024-10-30",
        expectedAmount: "8,000 kg",
        chemicals: [
          { name: "Organic Fertilizer", dose: "30kg/acre", date: "2024-09-05" },
        ],
        storage: "Cold storage",
      },
    ],
    programs: [
      {
        id: "1",
        name: "Irrigation Support Program",
        enrolledDate: "2023-06-01",
        status: "active",
        performance: "excellent",
      },
      {
        id: "2",
        name: "Organic Certification",
        enrolledDate: "2023-08-15",
        status: "active",
        performance: "good",
      },
      {
        id: "3",
        name: "Youth Farmer Initiative",
        enrolledDate: "2024-01-10",
        status: "active",
        performance: "good",
      },
    ],
    marketActivity: {
      requirements: [
        {
          crop: "Tomatoes",
          quantity: "1,000 kg",
          frequency: "Weekly",
          preferredVariety: "Roma, Cherry",
        },
      ],
      transactions: [
        {
          date: "2024-09-15",
          crop: "Lettuce",
          quantity: "500 kg",
          buyer: "Fresh Market Ltd",
          amount: "$1,250",
        },
        {
          date: "2024-09-10",
          crop: "Peppers",
          quantity: "300 kg",
          buyer: "Island Grocers",
          amount: "$900",
        },
      ],
    },
    products: [
      {
        id: "1",
        name: "Organic Roma Tomatoes",
        quantity: "500 kg",
        harvestDate: "2024-09-20",
        status: "available",
        uploadedBy: "vendor",
      },
      {
        id: "2",
        name: "Fresh Iceberg Lettuce",
        quantity: "200 kg",
        harvestDate: "2024-09-22",
        status: "sold",
        uploadedBy: "government",
      },
    ],
  };

  const tabs = [
    { id: "personal" as const, label: "Personal Details" },
    { id: "farm" as const, label: "Farm Details" },
    { id: "production" as const, label: "Production" },
    { id: "programs" as const, label: "Programs" },
    { id: "market" as const, label: "Market Activity" },
    { id: "products" as const, label: "Products" },
  ];

  return (
    <div className="min-h-screen bg-[var(--primary-background)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Back Button */}
        <Link
          href="/government/vendors"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--secondary-muted-edge)] hover:text-[color:var(--secondary-black)] mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Vendors
        </Link>

        {/* Header */}
        <div className="rounded-3xl bg-[var(--primary-accent1)]/14 border border-[color:var(--secondary-soft-highlight)] px-6 sm:px-10 py-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-[color:var(--secondary-black)]">
                  {vendor.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    vendor.complianceStatus === "compliant"
                      ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                      : "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]"
                  }`}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  {vendor.complianceStatus === "compliant"
                    ? "Compliant"
                    : "Alert"}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm text-[color:var(--secondary-muted-edge)]">
                  <MapPinIcon className="h-5 w-5" />
                  {vendor.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-[color:var(--secondary-muted-edge)]">
                  <PhoneIcon className="h-5 w-5" />
                  {vendor.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-[color:var(--secondary-muted-edge)]">
                  <EnvelopeIcon className="h-5 w-5" />
                  {vendor.email}
                </div>
                <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                  Registered:{" "}
                  {new Date(vendor.registeredDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Link
              href={`/government/products/upload?vendorId=${vendorId}`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-accent2)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Upload Product
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Total Acreage
            </div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--secondary-black)]">
              {vendor.totalAcreage}
            </div>
            <div className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
              acres total
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Utilized Acreage
            </div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--primary-base)]">
              {vendor.utilizedAcreage}
            </div>
            <div className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
              {Math.round((vendor.utilizedAcreage / vendor.totalAcreage) * 100)}
              % utilized
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--secondary-muted-edge)]">
              Available Acreage
            </div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--secondary-black)]">
              {vendor.availableAcreage}
            </div>
            <div className="mt-1 text-xs text-[color:var(--secondary-muted-edge)]">
              acres not planted
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[color:var(--secondary-soft-highlight)] mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "text-[var(--primary-accent2)] border-[var(--primary-accent2)]"
                    : "text-[color:var(--secondary-muted-edge)] border-transparent hover:text-[color:var(--secondary-black)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white p-6">
          {/* Personal Details Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Contact Person
                    </label>
                    <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                      {vendor.contactPerson}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Email
                    </label>
                    <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                      {vendor.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Phone
                    </label>
                    <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                      {vendor.phone}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Registered Date
                    </label>
                    <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                      {new Date(vendor.registeredDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Farm Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Address
                    </label>
                    <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                      {vendor.location}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      GPS Coordinates
                    </label>
                    <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                      {vendor.gps.lat}, {vendor.gps.lng}
                    </div>
                  </div>
                </div>
                {/* Map Placeholder */}
                <div className="mt-4 h-64 rounded-xl bg-gray-100 flex items-center justify-center border border-[color:var(--secondary-soft-highlight)]">
                  <div className="text-center">
                    <MapPinIcon className="h-12 w-12 mx-auto text-[color:var(--secondary-muted-edge)] mb-2" />
                    <div className="text-sm text-[color:var(--secondary-muted-edge)]">
                      Map visualization
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Land Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Total Acreage
                    </label>
                    <div className="mt-1 text-2xl font-semibold text-[color:var(--secondary-black)]">
                      {vendor.totalAcreage}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Utilized
                    </label>
                    <div className="mt-1 text-2xl font-semibold text-[color:var(--primary-base)]">
                      {vendor.utilizedAcreage}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                      Available
                    </label>
                    <div className="mt-1 text-2xl font-semibold text-[color:var(--secondary-black)]">
                      {vendor.availableAcreage}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Farm Details Tab */}
          {activeTab === "farm" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Crop Types
                </h2>
                <div className="space-y-3">
                  {vendor.crops.map((crop, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-[color:var(--secondary-soft-highlight)]"
                    >
                      <div>
                        <div className="font-medium text-sm text-[color:var(--secondary-black)]">
                          {crop.name}
                        </div>
                        <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                          Variety: {crop.variety}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-[color:var(--secondary-black)]">
                          {crop.acreage} acres
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Infrastructure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-[color:var(--secondary-soft-highlight)]">
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      Irrigation System
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        vendor.infrastructure.irrigation
                          ? "text-[color:var(--primary-base)]"
                          : "text-[color:var(--secondary-muted-edge)]"
                      }`}
                    >
                      {vendor.infrastructure.irrigation ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-[color:var(--secondary-soft-highlight)]">
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      Rainwater Harvesting
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        vendor.infrastructure.rainwaterHarvesting
                          ? "text-[color:var(--primary-base)]"
                          : "text-[color:var(--secondary-muted-edge)]"
                      }`}
                    >
                      {vendor.infrastructure.rainwaterHarvesting ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-[color:var(--secondary-soft-highlight)]">
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      Ponds
                    </span>
                    <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                      {vendor.infrastructure.ponds}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-[color:var(--secondary-soft-highlight)]">
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      Greenhouses
                    </span>
                    <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                      {vendor.infrastructure.greenhouses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-[color:var(--secondary-soft-highlight)]">
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      Shade Houses
                    </span>
                    <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                      {vendor.infrastructure.shadeHouses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-[color:var(--secondary-soft-highlight)]">
                    <span className="text-sm text-[color:var(--secondary-black)]">
                      Transportation
                    </span>
                    <span className="text-sm font-medium text-[color:var(--secondary-black)]">
                      {vendor.infrastructure.transportation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Production Tab */}
          {activeTab === "production" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                Current Production Cycles
              </h2>
              {vendor.production.map((prod) => (
                <div
                  key={prod.id}
                  className="border border-[color:var(--secondary-soft-highlight)] rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[color:var(--secondary-black)]">
                        {prod.crop} - {prod.variety}
                      </h3>
                      <p className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                        {prod.acreage} acres
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[var(--primary-accent1)]/15 text-[color:var(--primary-accent3)] px-3 py-1 text-xs font-medium">
                      In Progress
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Date Planted
                      </label>
                      <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                        {new Date(prod.datePlanted).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Expected Harvest
                      </label>
                      <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                        {new Date(prod.expectedHarvest).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Expected Amount
                      </label>
                      <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                        {prod.expectedAmount}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider">
                        Post-Harvest Storage
                      </label>
                      <div className="mt-1 text-sm text-[color:var(--secondary-black)]">
                        {prod.storage}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[color:var(--secondary-muted-edge)] uppercase tracking-wider mb-2 block">
                      Chemical Usage
                    </label>
                    <div className="space-y-2">
                      {prod.chemicals.map((chem, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                        >
                          <div>
                            <div className="text-sm font-medium text-[color:var(--secondary-black)]">
                              {chem.name}
                            </div>
                            <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                              Dose: {chem.dose}
                            </div>
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)]">
                            {new Date(chem.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === "programs" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                Enrolled Programs
              </h2>
              <div className="space-y-4">
                {vendor.programs.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between p-5 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-gray-50/50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-[color:var(--secondary-black)]">
                        {program.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[color:var(--secondary-muted-edge)]">
                        <span>
                          Enrolled:{" "}
                          {new Date(program.enrolledDate).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          Performance:{" "}
                          <span
                            className={`font-medium ${
                              program.performance === "excellent"
                                ? "text-[color:var(--primary-base)]"
                                : "text-[color:var(--primary-accent3)]"
                            }`}
                          >
                            {program.performance}
                          </span>
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[var(--primary-base)]/10 text-[color:var(--primary-base)] px-3 py-1 text-xs font-medium">
                      {program.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Activity Tab */}
          {activeTab === "market" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Purchase Requirements
                </h2>
                <div className="space-y-3">
                  {vendor.marketActivity.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-gray-50/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-[color:var(--secondary-black)]">
                            {req.crop}
                          </div>
                          <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                            Quantity: {req.quantity} · Frequency:{" "}
                            {req.frequency}
                          </div>
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                            Preferred: {req.preferredVariety}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)] mb-4">
                  Recent Transactions
                </h2>
                <div className="space-y-3">
                  {vendor.marketActivity.transactions.map((trans, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-[color:var(--secondary-soft-highlight)]"
                    >
                      <div>
                        <div className="font-medium text-[color:var(--secondary-black)]">
                          {trans.crop} - {trans.quantity}
                        </div>
                        <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                          {trans.buyer} ·{" "}
                          {new Date(trans.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-semibold text-[color:var(--primary-base)]">
                        {trans.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[color:var(--secondary-black)]">
                  Listed Products
                </h2>
                <Link
                  href={`/government/products/upload?vendorId=${vendorId}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--primary-accent3)] transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Upload Product
                </Link>
              </div>
              <div className="space-y-3">
                {vendor.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-5 rounded-xl border border-[color:var(--secondary-soft-highlight)] bg-gray-50/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-[color:var(--secondary-black)]">
                          {product.name}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            product.status === "available"
                              ? "bg-[var(--primary-base)]/10 text-[color:var(--primary-base)]"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {product.status}
                        </span>
                        {product.uploadedBy === "government" && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
                            Gov. Upload
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[color:var(--secondary-muted-edge)] mt-1">
                        {product.quantity} · Harvested:{" "}
                        {new Date(product.harvestDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
