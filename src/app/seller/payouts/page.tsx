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

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const PAYOUT_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  completed:  { bg: "rgba(45,74,62,.12)",   color: "#1a4035", label: "Paid" },
  approved:   { bg: "rgba(45,74,62,.10)",   color: "#2d4a3e", label: "Approved" },
  pending:    { bg: "rgba(212,120,60,.12)", color: "#c26838", label: "Pending" },
  rejected:   { bg: "rgba(212,60,60,.12)",  color: "#9b2020", label: "Rejected" },
  cancelled:  { bg: "rgba(0,0,0,.06)",      color: "#6a7f73", label: "Cancelled" },
  failed:     { bg: "rgba(212,60,60,.12)",  color: "#9b2020", label: "Failed" },
};

const card: React.CSSProperties = { background: "#fff", border: "1px solid #ebe7df", borderRadius: 10 };
const pill = (bg: string, color: string): React.CSSProperties => ({ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: bg, color });
const ghostBtn: React.CSSProperties = { background: "none", border: "1px solid #e8e4dc", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 500, color: "#1c2b23", cursor: "pointer" };

export default function SellerPayoutsPage() {
  const dispatch = useAppDispatch();
  const {
    balance, balanceStatus, settings, settingsStatus,
    payoutRequests, payoutRequestsTotal, payoutRequestsStatus,
    requestPayoutStatus, creditTransactions, creditTransactionsTotal, error,
  } = useAppSelector((s) => s.sellerPayouts);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");

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
  const minAmt = settings?.minimum_payout_amount || 100;
  const available = balance?.available_amount || 0;
  const eligible = available >= minAmt;
  const progress = Math.min(100, (available / minAmt) * 100);

  const handleRequest = async () => {
    try {
      await dispatch(requestPayout({ note: note || undefined })).unwrap();
      setShowModal(false);
      setNote("");
      dispatch(fetchSellerBalance());
    } catch { /* handled in slice */ }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Cancel this payout request?")) {
      await dispatch(cancelPayoutRequest(id));
    }
  };

  const creditBg = balance?.has_credit_balance
    ? balance.credit_type === "owes_procur" ? "rgba(212,60,60,.07)" : "rgba(45,74,62,.07)"
    : "#fff";

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Urbanist', system-ui, sans-serif" }}>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23", margin: 0 }}>Payouts</h1>
          <p style={{ fontSize: 13, color: "#8a9e92", marginTop: 3 }}>Track your earnings and payout history</p>
        </div>

        {/* Top 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {/* Available Balance */}
          <div style={{ ...card, padding: "22px 24px", background: "#2d4a3e", border: "none", borderRadius: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: 8 }}>Available Balance</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              {balanceStatus === "loading" ? "..." : fmt(available, balance?.currency)}
            </div>
            {!eligible && balanceStatus !== "loading" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,.65)", marginBottom: 4 }}>
                  <span>Progress to min. payout</span>
                  <span>{fmt(minAmt, balance?.currency)}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,.2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(progress, 3)}%`, height: "100%", background: "#fff", borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginTop: 6 }}>
                  {fmt(Math.max(0, minAmt - available), balance?.currency)} more to reach minimum
                </div>
              </div>
            )}
            {eligible && balanceStatus !== "loading" && (
              <span style={{ ...pill("rgba(255,255,255,.2)", "#fff"), fontSize: 11 }}>✓ Eligible for payout</span>
            )}
          </div>

          {/* Request Payout */}
          <div style={{ ...card, padding: "22px 24px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#8a9e92", marginBottom: 8 }}>Request Payout</div>
            {eligible ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", marginBottom: 16 }}>Ready to withdraw</div>
                <button
                  onClick={() => setShowModal(true)}
                  style={{ padding: "9px 20px", background: "#d4783c", color: "#fff", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Request Payout
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", marginBottom: 8 }}>Not Eligible</div>
                <div style={{ fontSize: 12, color: "#8a9e92" }}>Reach {fmt(minAmt, balance?.currency)} to request</div>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          <div style={{ ...card, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8a9e92", marginBottom: 6 }}>Processing</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23" }}>
              {balanceStatus === "loading" ? "..." : fmt(balance?.pending_amount || 0, balance?.currency)}
            </div>
            <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 4 }}>From orders being cleared</div>
          </div>
          <div style={{ ...card, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8a9e92", marginBottom: 6 }}>Next Payout</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1c2b23" }}>
              {settingsStatus === "loading" ? "..." : fmtDate(settings?.next_payout_date || null)}
            </div>
            <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 4 }}>{settings?.payout_frequency_label || "Every 2 weeks"}</div>
          </div>
          <div style={{ ...card, padding: "16px 18px", background: creditBg, borderColor: balance?.has_credit_balance ? (balance.credit_type === "owes_procur" ? "rgba(212,60,60,.3)" : "rgba(45,74,62,.3)") : "#ebe7df" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8a9e92", marginBottom: 6 }}>
              {balance?.has_credit_balance ? (balance.credit_type === "owes_procur" ? "Credit Owed" : "Credit Due") : "Account Credits"}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: balance?.has_credit_balance ? (balance.credit_type === "owes_procur" ? "#9b2020" : "#1a4035") : "#1c2b23" }}>
              {balanceStatus === "loading" ? "..." : fmt(Math.abs(balance?.credit_amount || 0), balance?.currency)}
            </div>
            <div style={{ fontSize: 11, color: "#8a9e92", marginTop: 4 }}>
              {balance?.has_credit_balance ? (balance.credit_type === "owes_procur" ? "Deducted from payouts" : "Added to payouts") : "No credits on account"}
            </div>
          </div>
        </div>

        {/* Credit History */}
        {creditTransactions.length > 0 && (
          <div style={{ ...card, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0ece4" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23" }}>Credit History</span>
              <span style={{ fontSize: 12, color: "#8a9e92", marginLeft: 8 }}>{creditTransactionsTotal} transaction{creditTransactionsTotal !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#faf8f4", borderBottom: "1px solid #ebe7df" }}>
                    {["Date", "Type", "Amount", "Reason", "Note"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: "#6a7f73" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {creditTransactions.map((tx: any) => (
                    <tr key={tx.id} style={{ borderBottom: "1px solid #f8f6f2" }}>
                      <td style={{ padding: "10px 14px", color: "#8a9e92" }}>{fmtDate(tx.created_at)}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={pill(tx.type === "credit" ? "rgba(212,60,60,.10)" : "rgba(45,74,62,.10)", tx.type === "credit" ? "#9b2020" : "#1a4035")}>
                          {tx.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: tx.amount > 0 ? "#9b2020" : "#1a4035" }}>
                        {tx.amount > 0 ? "+" : ""}{fmt(tx.amount, balance?.currency)}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#8a9e92", textTransform: "capitalize" }}>{tx.reason.replace(/_/g, " ")}</td>
                      <td style={{ padding: "10px 14px", color: "#8a9e92", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Policy */}
        <div style={{ ...card, padding: "16px 18px", marginBottom: 20, background: "#faf8f4" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1c2b23", marginBottom: 8 }}>Payout Policy</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              `Minimum payout: ${fmt(settings?.minimum_payout_amount || 100)}`,
              "Payouts processed every 2 weeks (bi-weekly)",
              "Funds from delivered orders clear before payout",
              "Paid to your registered payout method (cash or cheque)",
              "Credit balance is adjusted from your payouts",
            ].map((item) => (
              <li key={item} style={{ fontSize: 12, color: "#6a7f73", display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ color: "#2d4a3e", fontWeight: 700, flexShrink: 0 }}>•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Payout Requests */}
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0ece4" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1c2b23" }}>Payout Requests</span>
          </div>

          {isLoading && payoutRequests.length === 0 ? (
            <div style={{ padding: 32 }}><ProcurLoader size="md" text="Loading requests…" /></div>
          ) : payoutRequests.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2b23", marginBottom: 6 }}>No payout requests yet</div>
              <div style={{ fontSize: 13, color: "#8a9e92" }}>Once eligible, you can request a payout above.</div>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#faf8f4", borderBottom: "1px solid #ebe7df" }}>
                      {["Reference", "Amount", "Status", "Requested", "Actions"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, color: "#6a7f73" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRequests.map((req: any) => {
                      const sm = PAYOUT_STATUS[req.status] ?? PAYOUT_STATUS.pending;
                      return (
                        <tr key={req.id} style={{ borderBottom: "1px solid #f8f6f2" }}>
                          <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: "#6a7f73" }}>
                            {req.id.slice(0, 8)}
                          </td>
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1c2b23" }}>
                            {fmt(req.amount, req.currency)}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={pill(sm.bg, sm.color)}>{sm.label}</span>
                            {req.rejection_reason && <div style={{ fontSize: 11, color: "#9b2020", marginTop: 4 }}>{req.rejection_reason}</div>}
                          </td>
                          <td style={{ padding: "12px 16px", color: "#8a9e92" }}>{fmtDate(req.requested_at)}</td>
                          <td style={{ padding: "12px 16px" }}>
                            {req.status === "pending" && (
                              <button onClick={() => handleCancel(req.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#9b2020", fontWeight: 600 }}>Cancel</button>
                            )}
                            {req.status === "completed" && (
                              <span style={{ fontSize: 12, color: "#2d4a3e", fontWeight: 600 }}>Paid {fmtDate(req.completed_at)}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div style={{ padding: "12px 16px", borderTop: "1px solid #f0ece4", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#8a9e92" }}>
                    {(currentPage - 1) * 20 + 1}–{Math.min(currentPage * 20, payoutRequestsTotal)} of {payoutRequestsTotal}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ ...ghostBtn, opacity: currentPage === 1 ? 0.4 : 1, fontSize: 12 }}>Prev</button>
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ ...ghostBtn, opacity: currentPage === totalPages ? 0.4 : 1, fontSize: 12 }}>Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", margin: "0 16px" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1c2b23", marginBottom: 8 }}>Request Payout</h3>
            <p style={{ fontSize: 13, color: "#8a9e92", marginBottom: 12 }}>Requesting your full available balance:</p>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#2d4a3e", marginBottom: 16 }}>
              {fmt(available, balance?.currency)}
            </div>
            {error && <div style={{ fontSize: 12, color: "#9b2020", marginBottom: 12 }}>{error}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#1c2b23", display: "block", marginBottom: 6 }}>Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes for the admin…"
                rows={3}
                style={{ width: "100%", border: "1px solid #ddd9d1", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ ...ghostBtn, flex: 1, textAlign: "center" as const }}>Cancel</button>
              <button
                onClick={handleRequest}
                disabled={requestPayoutStatus === "loading"}
                style={{ flex: 1, padding: "9px 0", background: "#2d4a3e", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: requestPayoutStatus === "loading" ? 0.6 : 1 }}
              >
                {requestPayoutStatus === "loading" ? "Submitting…" : "Request Payout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
