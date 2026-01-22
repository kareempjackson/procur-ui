"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import ProcurLoader from "@/components/ProcurLoader";
import {
  fetchSellerBalance,
  fetchPayoutSettings,
  fetchPayoutRequests,
  fetchCreditTransactions,
  requestPayout,
  cancelPayoutRequest,
} from "@/store/slices/sellerPayoutsSlice";
import {
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  CreditCardIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-3 w-3" />
          Paid
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircleIcon className="h-3 w-3" />
          Approved
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <ClockIcon className="h-3 w-3" />
          Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="h-3 w-3" />
          Rejected
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
          Cancelled
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
}

export default function SellerPayoutsPage() {
  const dispatch = useAppDispatch();
  const {
    balance,
    balanceStatus,
    settings,
    settingsStatus,
    payoutRequests,
    payoutRequestsTotal,
    payoutRequestsStatus,
    requestPayoutStatus,
    creditTransactions,
    creditTransactionsTotal,
    error,
  } = useAppSelector((s) => s.sellerPayouts);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNote, setRequestNote] = useState("");

  useEffect(() => {
    dispatch(fetchSellerBalance());
    dispatch(fetchPayoutSettings());
    dispatch(fetchCreditTransactions({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPayoutRequests({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  const totalPages = Math.ceil(payoutRequestsTotal / 20);
  const isLoading = balanceStatus === "loading" || payoutRequestsStatus === "loading";

  const handleRequestPayout = async () => {
    try {
      await dispatch(requestPayout({ note: requestNote || undefined })).unwrap();
      setShowRequestModal(false);
      setRequestNote("");
      // Refresh balance
      dispatch(fetchSellerBalance());
    } catch {
      // Error is handled in the slice
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (window.confirm("Are you sure you want to cancel this payout request?")) {
      await dispatch(cancelPayoutRequest(requestId));
    }
  };

  const minPayoutAmount = settings?.minimum_payout_amount || 100;
  const availableAmount = balance?.available_amount || 0;
  const progressToMinimum = Math.min(100, (availableAmount / minPayoutAmount) * 100);
  const amountToReachMin = Math.max(0, minPayoutAmount - availableAmount);
  const isEligibleForPayout = availableAmount >= minPayoutAmount;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-6 py-10">
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
                Payouts
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--secondary-black)]">
            Payouts
          </h1>
          <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
            Track your earnings and payout history
          </p>
        </div>

        {/* Balance & Schedule Cards - Primary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Available Balance */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#407178] to-[#2d5158] p-6 text-white min-h-[180px]">
            <div className="absolute top-4 right-4 opacity-20">
              <BanknotesIcon className="h-16 w-16" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-80">Available Balance</p>
              <p className="text-3xl font-bold mt-2">
                {balanceStatus === "loading" ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  formatCurrency(
                    balance?.available_amount || 0,
                    balance?.currency
                  )
                )}
              </p>
              {!isEligibleForPayout && balanceStatus !== "loading" && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs opacity-80 mb-1">
                    <span>Progress to min. payout</span>
                    <span>{formatCurrency(minPayoutAmount, balance?.currency)}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(progressToMinimum, 3)}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2 opacity-70">
                    {formatCurrency(amountToReachMin, balance?.currency)} more to reach minimum
                  </p>
                </div>
              )}
              {isEligibleForPayout && balanceStatus !== "loading" && (
                <p className="text-sm mt-3 bg-white/20 rounded-full px-3 py-1 inline-block">
                  ✓ Eligible for payout
                </p>
              )}
            </div>
          </div>

          {/* Payout Request */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white min-h-[180px]">
            <div className="absolute top-4 right-4 opacity-20">
              <CalendarDaysIcon className="h-16 w-16" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-80">Request Payout</p>
              {isEligibleForPayout ? (
                <>
                  <p className="text-xl font-bold mt-2">Ready to withdraw</p>
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="mt-4 px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Request Payout
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold mt-2">Not Eligible</p>
                  <p className="text-xs mt-3 opacity-70">
                    Reach {formatCurrency(minPayoutAmount, balance?.currency)} to request
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Processing */}
          <div className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-white p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-amber-50">
                <ArrowPathIcon className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-[var(--secondary-muted-edge)]">
                Processing
              </p>
            </div>
            <p className="text-2xl font-bold text-[var(--secondary-black)]">
              {balanceStatus === "loading" ? (
                <span className="animate-pulse">...</span>
              ) : (
                formatCurrency(
                  balance?.pending_amount || 0,
                  balance?.currency
                )
              )}
            </p>
            <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
              From orders being cleared
            </p>
          </div>

          {/* Next Payout */}
          <div className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-white p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-50">
                <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-[var(--secondary-muted-edge)]">
                Next Payout
              </p>
            </div>
            <p className="text-2xl font-bold text-[var(--secondary-black)]">
              {settingsStatus === "loading" ? (
                <span className="animate-pulse">...</span>
              ) : settings?.next_payout_date ? (
                formatDate(settings.next_payout_date)
              ) : (
                "—"
              )}
            </p>
            <p className="text-xs text-[var(--secondary-muted-edge)] mt-1">
              {settings?.payout_frequency_label || "Every 2 weeks"}
            </p>
          </div>

          {/* Account Credits */}
          <div
            className={`rounded-2xl p-5 ${
              balance?.has_credit_balance
                ? balance.credit_type === "owes_procur"
                  ? "border-2 border-red-200 bg-red-50"
                  : "border-2 border-emerald-200 bg-emerald-50"
                : "border border-[var(--secondary-soft-highlight)] bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-xl ${
                  balance?.has_credit_balance
                    ? balance.credit_type === "owes_procur"
                      ? "bg-red-100"
                      : "bg-emerald-100"
                    : "bg-gray-100"
                }`}
              >
                <CreditCardIcon
                  className={`h-5 w-5 ${
                    balance?.has_credit_balance
                      ? balance.credit_type === "owes_procur"
                        ? "text-red-600"
                        : "text-emerald-600"
                      : "text-gray-500"
                  }`}
                />
              </div>
              <p
                className={`text-sm font-medium ${
                  balance?.has_credit_balance
                    ? balance.credit_type === "owes_procur"
                      ? "text-red-700"
                      : "text-emerald-700"
                    : "text-[var(--secondary-muted-edge)]"
                }`}
              >
                {balance?.has_credit_balance
                  ? balance.credit_type === "owes_procur"
                    ? "Credit Owed"
                    : "Credit Due"
                  : "Account Credits"}
              </p>
            </div>
            <p
              className={`text-2xl font-bold ${
                balance?.has_credit_balance
                  ? balance.credit_type === "owes_procur"
                    ? "text-red-700"
                    : "text-emerald-700"
                  : "text-[var(--secondary-black)]"
              }`}
            >
              {balanceStatus === "loading" ? (
                <span className="animate-pulse">...</span>
              ) : (
                formatCurrency(
                  Math.abs(balance?.credit_amount || 0),
                  balance?.currency
                )
              )}
            </p>
            <p
              className={`text-xs mt-1 ${
                balance?.has_credit_balance
                  ? balance.credit_type === "owes_procur"
                    ? "text-red-600"
                    : "text-emerald-600"
                  : "text-[var(--secondary-muted-edge)]"
              }`}
            >
              {balance?.has_credit_balance
                ? balance.credit_type === "owes_procur"
                  ? "Deducted from payouts"
                  : "Added to payouts"
                : "No credits on account"}
            </p>
          </div>
        </div>

        {/* Credit Transaction History - Only show if there are transactions */}
        {creditTransactions.length > 0 && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-[var(--secondary-soft-highlight)] bg-white">
            <div className="px-6 py-4 border-b border-[var(--secondary-soft-highlight)] bg-gray-50">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
                  Credit History
                </h2>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                  {creditTransactionsTotal} transaction
                  {creditTransactionsTotal !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-sm text-[var(--secondary-muted-edge)] mt-1">
                Record of credits and debits on your account
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 border-b border-[var(--secondary-soft-highlight)]">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                      Date
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                      Type
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                      Amount
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                      Reason
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {creditTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-6 text-[var(--secondary-muted-edge)]">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === "credit"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {tx.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-6 font-semibold ${
                          tx.amount > 0 ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {formatCurrency(tx.amount, balance?.currency)}
                      </td>
                      <td className="py-3 px-6 text-[var(--secondary-muted-edge)] capitalize">
                        {tx.reason.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-6 text-[var(--secondary-muted-edge)] max-w-[200px] truncate">
                        {tx.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payout Policy Notice */}
        <div className="rounded-xl bg-[var(--primary-background)] border border-[var(--secondary-soft-highlight)] p-4 mb-8">
          <h3 className="text-sm font-semibold text-[var(--secondary-black)] mb-2">
            Payout Policy
          </h3>
          <ul className="text-xs text-[var(--secondary-muted-edge)] space-y-1">
            <li>
              • Minimum payout amount:{" "}
              <strong className="text-[var(--secondary-black)]">
                {formatCurrency(settings?.minimum_payout_amount || 100)}
              </strong>
            </li>
            <li>
              • Payouts are processed{" "}
              <strong className="text-[var(--secondary-black)]">
                every 2 weeks
              </strong>{" "}
              (bi-weekly)
            </li>
            <li>
              • Funds from delivered orders are added to your available balance
              after payment clears
            </li>
            <li>
              • Payouts are sent to your registered payout method (cash or
              cheque)
            </li>
            <li>
              • Any credit balance on your account will be adjusted in your payouts
            </li>
          </ul>
        </div>

        {/* Payout Requests */}
        <div className="rounded-2xl border border-[var(--secondary-soft-highlight)] bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--secondary-soft-highlight)]">
            <h2 className="text-lg font-semibold text-[var(--secondary-black)]">
              Payout Requests
            </h2>
          </div>

          {isLoading && payoutRequests.length === 0 ? (
            <div className="p-8">
              <ProcurLoader size="md" text="Loading requests..." />
            </div>
          ) : payoutRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary-background)] rounded-full flex items-center justify-center">
                <BanknotesIcon className="h-8 w-8 text-[var(--secondary-muted-edge)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--secondary-black)] mb-2">
                No payout requests yet
              </h3>
              <p className="text-sm text-[var(--secondary-muted-edge)]">
                Once you reach the minimum balance, you can request a payout.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--primary-background)] border-b border-[var(--secondary-soft-highlight)]">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                        Reference
                      </th>
                      <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                        Amount
                      </th>
                      <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                        Status
                      </th>
                      <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                        Requested
                      </th>
                      <th className="text-left py-3 px-6 font-medium text-[var(--secondary-black)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="border-b border-[var(--secondary-soft-highlight)]/50 hover:bg-[var(--primary-background)]/50"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {req.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-[var(--secondary-black)]">
                          {formatCurrency(req.amount, req.currency)}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(req.status)}
                          {req.rejection_reason && (
                            <p className="text-xs text-red-600 mt-1">
                              {req.rejection_reason}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-6 text-[var(--secondary-muted-edge)]">
                          {formatDate(req.requested_at)}
                        </td>
                        <td className="py-4 px-6">
                          {req.status === "pending" && (
                            <button
                              onClick={() => handleCancelRequest(req.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Cancel
                            </button>
                          )}
                          {req.status === "completed" && (
                            <span className="text-xs text-green-600">
                              Paid {formatDate(req.completed_at)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[var(--secondary-soft-highlight)] flex items-center justify-between">
                  <p className="text-xs text-[var(--secondary-muted-edge)]">
                    Showing {(currentPage - 1) * 20 + 1}-
                    {Math.min(currentPage * 20, payoutRequestsTotal)} of {payoutRequestsTotal}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-xs font-medium rounded-full border border-[var(--secondary-soft-highlight)] disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-xs font-medium rounded-full border border-[var(--secondary-soft-highlight)] disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Request Payout Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-xl font-semibold text-[var(--secondary-black)] mb-4">
                Request Payout
              </h3>
              <p className="text-sm text-[var(--secondary-muted-edge)] mb-4">
                You are requesting a payout of your full available balance:
              </p>
              <p className="text-2xl font-bold text-[var(--primary-base)] mb-4">
                {formatCurrency(balance?.available_amount || 0, balance?.currency)}
              </p>
              {error && (
                <p className="text-sm text-red-600 mb-4">{error}</p>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--secondary-black)] mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Add any notes for the admin..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestPayout}
                  disabled={requestPayoutStatus === "loading"}
                  className="flex-1 px-4 py-2 bg-[var(--primary-base)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-dark)] disabled:opacity-50"
                >
                  {requestPayoutStatus === "loading" ? "Submitting..." : "Request Payout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

