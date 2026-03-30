"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ScaleIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchSupplyDemand,
  fetchTransactions,
  fetchMarketStats,
  selectSupplyDemand,
  selectSupplyDemandStatus,
  selectTransactions,
  selectTransactionsStatus,
  selectMarketStats,
  selectMarketStatsStatus,
  selectSelectedPeriod,
  setSelectedPeriod as setReduxSelectedPeriod,
} from "@/store/slices/governmentMarketSlice";
import {
  GOV,
  govCard,
  govCardPadded,
  govSectionHeader,
  govViewAllLink,
  govKpiLabel,
  govKpiValue,
  govKpiSub,
  govPageTitle,
  govPageSubtitle,
  govPillButton,
  govStatusPillStyle,
  govStatusLabel,
  govHoverBg,
} from "../styles";

export default function MarketPage() {
  const dispatch = useAppDispatch();

  // Redux state
  const supplyDemandData = useAppSelector(selectSupplyDemand);
  const supplyDemandStatus = useAppSelector(selectSupplyDemandStatus);
  const transactions = useAppSelector(selectTransactions);
  const transactionsStatus = useAppSelector(selectTransactionsStatus);
  const marketStats = useAppSelector(selectMarketStats);
  const marketStatsStatus = useAppSelector(selectMarketStatsStatus);
  const reduxSelectedPeriod = useAppSelector(selectSelectedPeriod);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "quarter" | "year"
  >(reduxSelectedPeriod);

  // Hover states
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [hoveredSdItem, setHoveredSdItem] = useState<string | null>(null);

  // Fetch data on mount and when period changes
  useEffect(() => {
    if (
      supplyDemandStatus === "idle" ||
      selectedPeriod !== reduxSelectedPeriod
    ) {
      dispatch(setReduxSelectedPeriod(selectedPeriod));
      dispatch(fetchSupplyDemand({ period: selectedPeriod }));
    }
  }, [supplyDemandStatus, selectedPeriod, reduxSelectedPeriod, dispatch]);

  useEffect(() => {
    if (transactionsStatus === "idle") {
      dispatch(fetchTransactions({ page: 1, limit: 10 }));
    }
  }, [transactionsStatus, dispatch]);

  useEffect(() => {
    if (marketStatsStatus === "idle") {
      dispatch(fetchMarketStats({ period: selectedPeriod }));
    }
  }, [marketStatsStatus, selectedPeriod, dispatch]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(fetchSupplyDemand({ period: selectedPeriod }));
    dispatch(fetchTransactions({ page: 1, limit: 10 }));
    dispatch(fetchMarketStats({ period: selectedPeriod }));
  };

  // Mock market data (fallback)
  const mockSupplyDemandData = [
    {
      crop: "Tomatoes",
      supply: 45000,
      demand: 48000,
      gap: -3000,
      gapPercentage: -6.3,
      avgPrice: "$2.50/kg",
      trend: "increasing",
    },
    {
      crop: "Lettuce",
      supply: 24000,
      demand: 20000,
      gap: 4000,
      gapPercentage: 20,
      avgPrice: "$3.20/kg",
      trend: "stable",
    },
    {
      crop: "Peppers",
      supply: 50000,
      demand: 48500,
      gap: 1500,
      gapPercentage: 3.1,
      avgPrice: "$2.80/kg",
      trend: "stable",
    },
    {
      crop: "Sweet Potato",
      supply: 70000,
      demand: 65000,
      gap: 5000,
      gapPercentage: 7.7,
      avgPrice: "$1.80/kg",
      trend: "decreasing",
    },
    {
      crop: "Bananas",
      supply: 35000,
      demand: 42000,
      gap: -7000,
      gapPercentage: -16.7,
      avgPrice: "$1.50/kg",
      trend: "increasing",
    },
  ];

  const mockTransactions = [
    {
      id: "1",
      date: "2024-10-03",
      seller: "Green Valley Farms",
      sellerId: "1",
      buyer: "Fresh Market Ltd",
      crop: "Tomatoes",
      quantity: "1,000 kg",
      pricePerUnit: "$2.50/kg",
      totalValue: "$2,500",
      status: "completed" as const,
    },
    {
      id: "2",
      date: "2024-10-03",
      seller: "Sunrise Agricultural Co.",
      sellerId: "2",
      buyer: "Island Grocers",
      crop: "Lettuce",
      quantity: "500 kg",
      pricePerUnit: "$3.20/kg",
      totalValue: "$1,600",
      status: "completed",
    },
    {
      id: "3",
      date: "2024-10-02",
      seller: "Highland Produce Ltd.",
      sellerId: "3",
      buyer: "Restaurants United",
      crop: "Peppers",
      quantity: "800 kg",
      pricePerUnit: "$2.80/kg",
      totalValue: "$2,240",
      status: "completed",
    },
    {
      id: "4",
      date: "2024-10-02",
      seller: "Coastal Farms Group",
      sellerId: "4",
      buyer: "Export Co.",
      crop: "Sweet Potato",
      quantity: "2,000 kg",
      pricePerUnit: "$1.80/kg",
      totalValue: "$3,600",
      status: "pending",
    },
  ];

  const mockMarketStats = {
    totalTransactions: 234,
    totalValue: 548900,
    averageTransactionValue: 2345,
    topCrop: "Tomatoes",
    supplyDeficit: -10000,
    supplyDeficitCount: 2,
  };

  const mockPriceHistory = [
    {
      crop: "Tomatoes",
      lastMonth: "$2.30/kg",
      current: "$2.50/kg",
      change: "+8.7%",
    },
    {
      crop: "Lettuce",
      lastMonth: "$3.10/kg",
      current: "$3.20/kg",
      change: "+3.2%",
    },
    {
      crop: "Peppers",
      lastMonth: "$2.85/kg",
      current: "$2.80/kg",
      change: "-1.8%",
    },
    {
      crop: "Sweet Potato",
      lastMonth: "$1.90/kg",
      current: "$1.80/kg",
      change: "-5.3%",
    },
  ];

  // Use API data with fallback to mock data
  const displaySupplyDemand =
    supplyDemandData.length > 0 ? supplyDemandData : mockSupplyDemandData;
  const displayTransactions =
    transactions.length > 0 ? transactions : mockTransactions;
  const displayMarketStats = marketStats || mockMarketStats;

  // Loading states
  const isLoading =
    supplyDemandStatus === "loading" ||
    transactionsStatus === "loading" ||
    marketStatsStatus === "loading";

  /* ── chart‑bar colors ─────────────────────────────────────────────────── */
  const supplyColor = "#2d4a3e";
  const demandColor = "#d4783c";

  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div>
            <h1 style={govPageTitle}>Market Intelligence</h1>
            <p style={govPageSubtitle}>
              Monitor supply, demand, pricing trends, and market transactions
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              style={{
                ...govPillButton,
                padding: "9px 12px",
                opacity: isLoading ? 0.5 : 1,
              }}
              title="Refresh data"
            >
              <ArrowPathIcon
                style={{
                  width: 18,
                  height: 18,
                  color: GOV.muted,
                  animation: isLoading ? "spin 1s linear infinite" : undefined,
                }}
              />
            </button>

            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(
                  e.target.value as "week" | "month" | "quarter" | "year"
                )
              }
              style={{
                ...govPillButton,
                appearance: "auto" as React.CSSProperties["appearance"],
                paddingRight: 12,
              }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* ── Market Stats (4‑col grid) ────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {/* Transactions */}
          <div style={govCardPadded}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <ShoppingBagIcon style={{ width: 16, height: 16, color: GOV.muted }} />
              <span style={govKpiLabel}>Transactions</span>
            </div>
            <div style={govKpiValue}>{displayMarketStats.totalTransactions}</div>
          </div>

          {/* Total Value */}
          <div style={govCardPadded}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <BanknotesIcon style={{ width: 16, height: 16, color: GOV.muted }} />
              <span style={govKpiLabel}>Total Value</span>
            </div>
            <div style={govKpiValue}>
              ${((displayMarketStats.totalValue ?? 0) / 1000).toFixed(0)}K
            </div>
          </div>

          {/* Avg Transaction */}
          <div style={govCardPadded}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <ScaleIcon style={{ width: 16, height: 16, color: GOV.muted }} />
              <span style={govKpiLabel}>Avg Transaction</span>
            </div>
            <div style={govKpiValue}>
              ${(displayMarketStats.averageTransactionValue ?? 0).toLocaleString()}
            </div>
          </div>

          {/* Supply Deficit */}
          <div style={govCardPadded}>
            <span style={govKpiLabel}>Supply Deficit</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span
                style={{
                  ...govKpiValue,
                  color:
                    displayMarketStats.supplyDeficit < 0 ? GOV.danger : GOV.success,
                }}
              >
                {displayMarketStats.supplyDeficitCount} crops
              </span>
              {displayMarketStats.supplyDeficit < 0 ? (
                <ArrowTrendingDownIcon style={{ width: 18, height: 18, color: GOV.danger }} />
              ) : (
                <ArrowTrendingUpIcon style={{ width: 18, height: 18, color: GOV.success }} />
              )}
            </div>
          </div>
        </div>

        {/* ── Two‑column body ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* ── Left Column ────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Supply vs Demand */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2 style={govSectionHeader}>Supply vs Demand Analysis</h2>
                  <p style={{ fontSize: 11.5, color: GOV.muted, marginTop: 2, fontWeight: 500 }}>
                    Market balance by crop type
                  </p>
                </div>
                <Link
                  href="/government/reporting?type=market-requirements"
                  style={govViewAllLink}
                >
                  Generate Report &rarr;
                </Link>
              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "10px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: GOV.muted, fontWeight: 600 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: supplyColor, display: "inline-block" }} />
                  Supply
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: GOV.muted, fontWeight: 600 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: demandColor, display: "inline-block" }} />
                  Demand
                </span>
              </div>

              {displaySupplyDemand.map((item, idx) => {
                const isLast = idx === displaySupplyDemand.length - 1;
                const isHovered = hoveredSdItem === item.crop;
                return (
                  <div
                    key={item.crop}
                    onMouseEnter={() => setHoveredSdItem(item.crop)}
                    onMouseLeave={() => setHoveredSdItem(null)}
                    style={{
                      padding: "18px 20px",
                      borderBottom: isLast ? "none" : `1px solid ${GOV.border}`,
                      background: isHovered ? govHoverBg : "transparent",
                      transition: "background .15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: GOV.text,
                            margin: 0,
                          }}
                        >
                          {item.crop}
                        </h3>
                        <div
                          style={{
                            fontSize: 12,
                            color: GOV.muted,
                            marginTop: 2,
                          }}
                        >
                          Average Price: {item.avgPrice}
                        </div>
                      </div>
                      <span
                        style={{
                          ...govStatusPillStyle(
                            item.gap < 0 ? "critical" : item.gap > 5000 ? "warning" : "active"
                          ),
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {item.gap < 0 ? (
                          <>
                            <ArrowTrendingDownIcon style={{ width: 12, height: 12 }} />
                            Shortage
                          </>
                        ) : (
                          <>
                            <ArrowTrendingUpIcon style={{ width: 12, height: 12 }} />
                            Surplus
                          </>
                        )}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 2 }}>
                          Supply
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: GOV.text }}>
                          {item.supply.toLocaleString()} kg
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 2 }}>
                          Demand
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: GOV.text }}>
                          {item.demand.toLocaleString()} kg
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 2 }}>
                          Gap
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: item.gap < 0 ? GOV.danger : GOV.success,
                          }}
                        >
                          {item.gap > 0 ? "+" : ""}
                          {item.gap.toLocaleString()} kg
                        </div>
                      </div>
                    </div>

                    {/* Visual Bar */}
                    <div
                      style={{
                        position: "relative",
                        height: 28,
                        background: GOV.brandLight,
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          borderRadius: 6,
                          background: `${supplyColor}30`,
                          width: `${Math.min(
                            (item.supply / Math.max(item.supply, item.demand)) * 100,
                            100
                          )}%`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          borderRadius: 6,
                          border: `2px solid ${demandColor}`,
                          boxSizing: "border-box",
                          width: `${Math.min(
                            (item.demand / Math.max(item.supply, item.demand)) * 100,
                            100
                          )}%`,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: GOV.text,
                          }}
                        >
                          {item.gapPercentage > 0 ? "+" : ""}
                          {item.gapPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Recent Transactions ────────────────────────────────────────── */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h2 style={govSectionHeader}>Recent Transactions</h2>
                <p style={{ fontSize: 11.5, color: GOV.muted, marginTop: 2, fontWeight: 500 }}>
                  Latest market activity
                </p>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: `1px solid ${GOV.border}`,
                        background: GOV.brandLight,
                      }}
                    >
                      {["Date", "Seller", "Buyer", "Crop", "Quantity", "Value", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "10px 16px",
                              textAlign: "left",
                              fontSize: 10.5,
                              fontWeight: 700,
                              color: GOV.muted,
                              textTransform: "uppercase",
                              letterSpacing: ".04em",
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {displayTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        onMouseEnter={() => setHoveredRow(transaction.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          borderBottom: `1px solid ${GOV.border}`,
                          background:
                            hoveredRow === transaction.id ? govHoverBg : "transparent",
                          transition: "background .15s",
                        }}
                      >
                        <td style={{ padding: "12px 16px", color: GOV.text, fontWeight: 500 }}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <Link
                            href={`/government/vendors/${transaction.sellerId}`}
                            style={{ color: GOV.accent, fontWeight: 600, textDecoration: "none" }}
                          >
                            {transaction.seller}
                          </Link>
                        </td>
                        <td style={{ padding: "12px 16px", color: GOV.text, fontWeight: 500 }}>
                          {transaction.buyer}
                        </td>
                        <td style={{ padding: "12px 16px", color: GOV.text, fontWeight: 500 }}>
                          {transaction.crop}
                        </td>
                        <td style={{ padding: "12px 16px", color: GOV.text, fontWeight: 500 }}>
                          {transaction.quantity}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: 700,
                            color: GOV.brand,
                          }}
                        >
                          {transaction.totalValue}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={govStatusPillStyle(transaction.status)}>
                            {govStatusLabel(transaction.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Right Column ───────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Price Trends */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h2 style={govSectionHeader}>Price Trends</h2>
                <p style={{ fontSize: 11.5, color: GOV.muted, marginTop: 2, fontWeight: 500 }}>
                  Month-over-month comparison
                </p>
              </div>

              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {mockPriceHistory.map((item) => {
                  const isIncrease = item.change.startsWith("+");
                  return (
                    <div
                      key={item.crop}
                      style={{
                        ...govCardPadded,
                        padding: "14px 16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: GOV.text,
                            margin: 0,
                          }}
                        >
                          {item.crop}
                        </h3>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: isIncrease ? GOV.success : GOV.danger,
                          }}
                        >
                          {isIncrease ? (
                            <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
                          ) : (
                            <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />
                          )}
                          {item.change}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".04em" }}>
                            Last Month
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: GOV.text, marginTop: 2 }}>
                            {item.lastMonth}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" as const }}>
                          <div style={{ fontSize: 10.5, color: GOV.muted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".04em" }}>
                            Current
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: GOV.text, marginTop: 2 }}>
                            {item.current}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market Insights */}
            <div style={govCardPadded}>
              <h3 style={{ ...govSectionHeader, marginBottom: 14 }}>Market Insights</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Shortage alert */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 8,
                    background: GOV.dangerBg,
                    border: `1px solid ${GOV.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <ArrowTrendingDownIcon
                      style={{ width: 18, height: 18, color: GOV.danger, flexShrink: 0, marginTop: 1 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: GOV.text }}>
                        Tomato Shortage Alert
                      </div>
                      <div style={{ fontSize: 11.5, color: GOV.textSecondary, marginTop: 3, lineHeight: 1.45 }}>
                        Demand exceeds supply by 6.3%. Consider incentive programs
                        for increased production.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surplus insight */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 8,
                    background: GOV.successBg,
                    border: `1px solid ${GOV.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <ArrowTrendingUpIcon
                      style={{ width: 18, height: 18, color: GOV.success, flexShrink: 0, marginTop: 1 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: GOV.text }}>
                        Sweet Potato Surplus
                      </div>
                      <div style={{ fontSize: 11.5, color: GOV.textSecondary, marginTop: 3, lineHeight: 1.45 }}>
                        Supply exceeds demand. Explore export opportunities or
                        processing initiatives.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ ...govCard, overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${GOV.border}`,
                }}
              >
                <h3 style={govSectionHeader}>Quick Actions</h3>
              </div>
              <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { href: "/government/reporting?type=market-requirements", label: "Market Requirements Report", key: "mrr" },
                  { href: "/government/reporting?type=quarterly-sales", label: "Quarterly Sales Report", key: "qsr" },
                  { href: "/government/data", label: "Export Market Data", key: "emd" },
                ].map((action) => (
                  <Link
                    key={action.key}
                    href={action.href}
                    onMouseEnter={() => setHoveredAction(action.key)}
                    onMouseLeave={() => setHoveredAction(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: GOV.text,
                      textDecoration: "none",
                      background: hoveredAction === action.key ? govHoverBg : "transparent",
                      transition: "background .15s",
                    }}
                  >
                    <ChartBarIcon style={{ width: 16, height: 16, color: GOV.muted }} />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* spin keyframes for the refresh icon */}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
