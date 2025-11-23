"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "@/store";
import { selectAuthToken } from "@/store/slices/authSlice";
import { getApiClient } from "@/lib/apiClient";
import ProcurLoader from "@/components/ProcurLoader";
import { useToast } from "@/components/ui/Toast";

type TransactionDetailClientProps = {
  transactionId: string;
};

type Transaction = {
  id: string;
  transaction_number: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  platform_fee?: number;
  payment_processing_fee?: number;
  net_amount?: number;
  payment_method?: string;
  payment_reference?: string;
  gateway_transaction_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  order_id?: string;
  buyer_org_id?: string;
  seller_org_id?: string;
  processed_at?: string;
  settled_at?: string;
  created_at: string;
  updated_at: string;
  order?: {
    order_number: string;
    buyer_name?: string;
  };
};

export default function TransactionDetailClient({
  transactionId,
}: TransactionDetailClientProps) {
  const token = useAppSelector(selectAuthToken);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const apiClient = getApiClient();
        const response = await apiClient.get(
          `/sellers/transactions/${transactionId}`
        );
        setTransaction(response.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load transaction details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, token]);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(absAmount);
    return isNegative ? `-${formatted}` : formatted;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "sale":
        return "bg-green-100 text-green-800";
      case "refund":
        return "bg-red-100 text-red-800";
      case "payout":
        return "bg-blue-100 text-blue-800";
      case "fee":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case "failed":
      case "cancelled":
        return <XCircleIcon className="h-6 w-6 text-red-600" />;
      case "pending":
      case "processing":
        return <ClockIcon className="h-6 w-6 text-yellow-600" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download
    show("Receipt download functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ProcurLoader />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--secondary-black)] mb-2">
            Failed to Load Transaction
          </h2>
          <p className="text-[var(--secondary-muted-edge)] mb-6">
            {error || "Transaction not found"}
          </p>
          <Link
            href="/seller/transactions"
            className="inline-block px-6 py-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] transition-colors"
          >
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/seller/transactions"
            className="flex items-center gap-2 text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)] mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="font-medium">Back to Transactions</span>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--secondary-black)]">
                Transaction Details
              </h1>
              <p className="text-[var(--secondary-muted-edge)] mt-1">
                {transaction.transaction_number}
              </p>
            </div>
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--secondary-soft-highlight)]/30 text-[var(--secondary-black)] rounded-full hover:bg-[var(--primary-background)] transition-all font-medium text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download Receipt
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(transaction.status)}
              <div>
                <div className="text-sm text-[var(--secondary-muted-edge)]">
                  Transaction Status
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--secondary-muted-edge)]">
                Total Amount
              </div>
              <div className="text-3xl font-bold text-[var(--secondary-black)] mt-1">
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-5">
            Transaction Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                Transaction ID
              </div>
              <div className="font-mono text-sm text-[var(--secondary-black)]">
                {transaction.id}
              </div>
            </div>

            <div>
              <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                Transaction Number
              </div>
              <div className="font-medium text-sm text-[var(--secondary-black)]">
                {transaction.transaction_number}
              </div>
            </div>

            {transaction.order_id && (
              <div>
                <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                  Related Order
                </div>
                <Link
                  href={`/seller/orders/${transaction.order_id}`}
                  className="font-medium text-sm text-[var(--primary-accent2)] hover:text-[var(--primary-accent3)]"
                >
                  {transaction.order?.order_number || transaction.order_id}
                </Link>
              </div>
            )}

            {transaction.payment_method && (
              <div>
                <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                  Payment Method
                </div>
                <div className="font-medium text-sm text-[var(--secondary-black)] capitalize">
                  {transaction.payment_method.replace(/_/g, " ")}
                </div>
              </div>
            )}

            {transaction.payment_reference && (
              <div>
                <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                  Payment Reference
                </div>
                <div className="font-mono text-sm text-[var(--secondary-black)]">
                  {transaction.payment_reference}
                </div>
              </div>
            )}

            {transaction.gateway_transaction_id && (
              <div>
                <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                  Gateway Transaction ID
                </div>
                <div className="font-mono text-sm text-[var(--secondary-black)]">
                  {transaction.gateway_transaction_id}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                Created At
              </div>
              <div className="text-sm text-[var(--secondary-black)]">
                {formatDate(transaction.created_at)}
              </div>
            </div>

            {transaction.processed_at && (
              <div>
                <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                  Processed At
                </div>
                <div className="text-sm text-[var(--secondary-black)]">
                  {formatDate(transaction.processed_at)}
                </div>
              </div>
            )}

            {transaction.settled_at && (
              <div>
                <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                  Settled At
                </div>
                <div className="text-sm text-[var(--secondary-black)]">
                  {formatDate(transaction.settled_at)}
                </div>
              </div>
            )}
          </div>

          {transaction.description && (
            <div className="mt-6 pt-6 border-t border-[var(--secondary-soft-highlight)]/30">
              <div className="text-xs text-[var(--secondary-muted-edge)] mb-1.5">
                Description
              </div>
              <div className="text-sm text-[var(--secondary-black)]">
                {transaction.description}
              </div>
            </div>
          )}
        </div>

        {/* Amount Breakdown */}
        <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6 mb-6">
          <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-5">
            Amount Breakdown
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--secondary-soft-highlight)]/30">
              <div className="flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5 text-[var(--secondary-muted-edge)]" />
                <span className="text-sm font-medium text-[var(--secondary-black)]">
                  Gross Amount
                </span>
              </div>
              <span className="text-sm font-semibold text-[var(--secondary-black)]">
                {formatCurrency(transaction.amount, transaction.currency)}
              </span>
            </div>

            {transaction.platform_fee !== undefined &&
              transaction.platform_fee > 0 && (
                <div className="flex items-center justify-between py-3 border-b border-[var(--secondary-soft-highlight)]/30">
                  <div className="flex items-center gap-2">
                    <ReceiptPercentIcon className="h-5 w-5 text-[var(--secondary-muted-edge)]" />
                    <span className="text-sm font-medium text-[var(--secondary-black)]">
                      Platform Fee
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    -
                    {formatCurrency(
                      transaction.platform_fee,
                      transaction.currency
                    )}
                  </span>
                </div>
              )}

            {transaction.payment_processing_fee !== undefined &&
              transaction.payment_processing_fee > 0 && (
                <div className="flex items-center justify-between py-3 border-b border-[var(--secondary-soft-highlight)]/30">
                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-[var(--secondary-muted-edge)]" />
                    <span className="text-sm font-medium text-[var(--secondary-black)]">
                      Payment Processing Fee
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    -
                    {formatCurrency(
                      transaction.payment_processing_fee,
                      transaction.currency
                    )}
                  </span>
                </div>
              )}

            {transaction.net_amount !== undefined && (
              <div className="flex items-center justify-between py-3 bg-[var(--primary-background)] rounded-xl px-4">
                <span className="text-base font-semibold text-[var(--secondary-black)]">
                  Net Amount
                </span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(transaction.net_amount, transaction.currency)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Metadata */}
        {transaction.metadata &&
          Object.keys(transaction.metadata).length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--secondary-soft-highlight)]/20 p-6">
              <h2 className="text-lg font-semibold text-[var(--secondary-black)] mb-5">
                Additional Information
              </h2>
              <div className="space-y-3">
                {Object.entries(transaction.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between py-2"
                  >
                    <div className="text-xs text-[var(--secondary-muted-edge)] capitalize">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="text-sm text-[var(--secondary-black)] font-medium text-right max-w-xs">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
