"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface VendorLocation {
  vendorId: string;
  vendor: string;
  region: string;
  gps: {
    lat: number;
    lng: number;
  };
  total_acreage: number;
  utilized_acreage: number;
  available_acreage: number;
  utilization_rate: number;
  crops: string[];
}

interface LandMapProps {
  vendors: VendorLocation[];
  onVendorClick?: (vendorId: string) => void;
}

export default function LandMap({ vendors, onVendorClick }: LandMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      // Center on Grenada
      mapRef.current = L.map(mapContainerRef.current, {
        center: [12.1165, -61.679],
        zoom: 10,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Filter out vendors without valid coordinates
    const validVendors = vendors.filter(
      (vendor) =>
        vendor.gps &&
        vendor.gps.lat !== 0 &&
        vendor.gps.lng !== 0 &&
        !isNaN(vendor.gps.lat) &&
        !isNaN(vendor.gps.lng)
    );

    if (validVendors.length === 0) return;

    // Create sleek custom icons based on utilization rate
    const getMarkerIcon = (utilizationRate: number) => {
      let color = "#10b981"; // green - high utilization
      let bgColor = "rgba(16, 185, 129, 0.15)"; // green with opacity

      if (utilizationRate < 60) {
        color = "#ef4444"; // red - low utilization
        bgColor = "rgba(239, 68, 68, 0.15)";
      } else if (utilizationRate < 80) {
        color = "#f59e0b"; // orange - medium utilization
        bgColor = "rgba(245, 158, 11, 0.15)";
      }

      return L.divIcon({
        className: "custom-marker",
        html: `
          <div class="marker-container">
            <div class="marker-pulse" style="background-color: ${bgColor};"></div>
            <div class="marker-pin" style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);">
              <div class="marker-inner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    };

    // Add markers for each vendor
    validVendors.forEach((vendor) => {
      const marker = L.marker([vendor.gps.lat, vendor.gps.lng], {
        icon: getMarkerIcon(vendor.utilization_rate),
      }).addTo(mapRef.current!);

      // Create sleek popup content
      const utilizationColor =
        vendor.utilization_rate >= 80
          ? "#10b981"
          : vendor.utilization_rate >= 60
          ? "#f59e0b"
          : "#ef4444";
      const popupContent = `
        <div style="min-width: 240px; font-family: system-ui, -apple-system, sans-serif; padding: 16px;">
          <div style="font-weight: 600; font-size: 15px; margin-bottom: 10px; color: #111827; line-height: 1.3;">
            ${vendor.vendor}
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; margin-bottom: 14px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>${vendor.region}</span>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;">
            <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 10px; border-radius: 8px;">
              <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Total</div>
              <div style="font-weight: 700; font-size: 16px; color: #111827;">${
                vendor.total_acreage
              }</div>
              <div style="font-size: 10px; color: #9ca3af;">acres</div>
            </div>
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 10px; border-radius: 8px;">
              <div style="font-size: 10px; color: #059669; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Utilized</div>
              <div style="font-weight: 700; font-size: 16px; color: #047857;">${
                vendor.utilized_acreage
              }</div>
              <div style="font-size: 10px; color: #059669;">acres</div>
            </div>
          </div>
          
          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Utilization Rate</span>
              <span style="font-size: 13px; font-weight: 700; color: ${utilizationColor};">${
        vendor.utilization_rate
      }%</span>
            </div>
            <div style="position: relative; background: #f3f4f6; border-radius: 9999px; height: 6px; overflow: hidden;">
              <div style="
                background: linear-gradient(90deg, ${utilizationColor} 0%, ${utilizationColor}cc 100%);
                height: 100%;
                width: ${vendor.utilization_rate}%;
                transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 8px ${utilizationColor}44;
              "></div>
            </div>
          </div>
          
          ${
            vendor.crops && vendor.crops.length > 0
              ? `
            <div style="padding-top: 10px; border-top: 1px solid #f3f4f6;">
              <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 500;">Crops</div>
              <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                ${vendor.crops
                  .slice(0, 3)
                  .map(
                    (crop) =>
                      `<span style="
                        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                        color: #1e40af;
                        padding: 4px 10px;
                        border-radius: 6px;
                        font-size: 11px;
                        font-weight: 500;
                        box-shadow: 0 1px 2px rgba(30, 64, 175, 0.1);
                      ">${crop}</span>`
                  )
                  .join("")}
                ${
                  vendor.crops.length > 3
                    ? `<span style="
                        font-size: 11px; 
                        color: #6b7280;
                        padding: 4px 10px;
                        background: #f9fafb;
                        border-radius: 6px;
                        font-weight: 500;
                      ">+${vendor.crops.length - 3} more</span>`
                    : ""
                }
              </div>
            </div>
          `
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        minWidth: 260,
        className: "custom-popup",
        closeButton: true,
        autoPan: true,
        autoPanPadding: [50, 50],
      });

      // Handle click
      if (onVendorClick) {
        marker.on("click", () => {
          onVendorClick(vendor.vendorId);
        });
      }
    });

    // Fit bounds to show all markers
    if (validVendors.length > 0) {
      const bounds = L.latLngBounds(
        validVendors.map((vendor) => [vendor.gps.lat, vendor.gps.lng])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup function
    return () => {
      // Don't destroy the map on cleanup, just clear markers
    };
  }, [vendors, onVendorClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="h-96 rounded-xl overflow-hidden" />

      {/* Sleek Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white/98 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 p-4 text-xs z-[1000] transition-all duration-200 hover:shadow-3xl">
        <div className="font-bold text-gray-900 mb-3 text-[11px] uppercase tracking-wide">
          Utilization Rate
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 opacity-30 animate-ping group-hover:opacity-50"></div>
            </div>
            <span className="text-gray-700 font-medium">
              80%+ <span className="text-gray-400">High</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-orange-500 opacity-30 animate-ping group-hover:opacity-50"></div>
            </div>
            <span className="text-gray-700 font-medium">
              60-79% <span className="text-gray-400">Med</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 group cursor-default">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500 opacity-30 animate-ping group-hover:opacity-50"></div>
            </div>
            <span className="text-gray-700 font-medium">
              &lt;60% <span className="text-gray-400">Low</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sleek Vendor Count Badge */}
      <div className="absolute top-4 left-4 bg-gradient-to-br from-white to-gray-50 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 px-4 py-3 text-xs z-[1000] transition-all duration-200 hover:shadow-3xl hover:scale-105">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <div>
            <div className="font-bold text-gray-900 text-lg leading-none">
              {
                vendors.filter(
                  (v) =>
                    v.gps &&
                    v.gps.lat !== 0 &&
                    v.gps.lng !== 0 &&
                    !isNaN(v.gps.lat) &&
                    !isNaN(v.gps.lng)
                ).length
              }
            </div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wide mt-0.5">
              Vendors Shown
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
