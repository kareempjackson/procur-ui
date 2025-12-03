"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchHarvestFeed,
  addHarvestComment,
  createHarvestBuyerRequest,
  acknowledgeHarvestBuyerRequest,
} from "@/store/slices/harvestFeedSlice";
import { useToast } from "@/components/ui/Toast";

export default function ActivityFeed() {
  const dispatch = useAppDispatch();
  const feed = useAppSelector((s) => s.harvestFeed);
  const isBuyer = useAppSelector((s) => s.auth.user?.accountType === "buyer");
  const profile = useAppSelector((s) => s.profile.profile);
  const isFarmVerified = Boolean(profile?.organization?.farmVerified);
  const { show } = useToast();
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [requestDraft, setRequestDraft] = useState<
    Record<
      string,
      { quantity: string; unit: string; date?: string; notes?: string }
    >
  >({});

  useEffect(() => {
    if (feed.status === "idle") dispatch(fetchHarvestFeed());
  }, [dispatch, feed.status]);

  return (
    <section className="rounded-2xl border border-[color:var(--secondary-soft-highlight)] bg-white overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-[color:var(--secondary-soft-highlight)]">
        <div>
          <h2 className="text-base font-semibold text-[color:var(--secondary-black)]">
            Activity Feed
          </h2>
          <p className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
            Harvest updates, comments, and buyer requests
          </p>
        </div>
        {isFarmVerified ? (
          <Link
            href="/seller/harvest-update"
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary-accent2)] text-white px-4 py-2 text-xs font-medium hover:bg-[var(--primary-accent3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] focus:ring-offset-2"
          >
            Post update
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-500 px-4 py-2 text-xs font-medium cursor-not-allowed"
            title="Complete your seller verification to post updates."
          >
            Post update
          </button>
        )}
      </div>

      {feed.status === "loading" ? (
        <div className="p-5 text-sm text-[color:var(--secondary-muted-edge)]">
          Loading feed…
        </div>
      ) : feed.items.length === 0 ? (
        <div className="p-5 text-sm text-[color:var(--secondary-muted-edge)]">
          No harvest updates yet.
        </div>
      ) : (
        <div className="divide-y divide-[color:var(--secondary-soft-highlight)]/30">
          {feed.items.map((item) => (
            <div key={item.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--primary-accent1)]/20 flex items-center justify-center text-xs font-semibold text-[color:var(--primary-accent3)]">
                  {item.crop.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[color:var(--secondary-black)] font-medium">
                      {item.crop}
                      {item.quantity != null && item.unit && (
                        <span className="ml-1 text-[color:var(--secondary-muted-edge)] font-normal">
                          · {item.quantity} {item.unit}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[color:var(--secondary-muted-edge)]">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  {item.expected_harvest_window && (
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-0.5">
                      Window: {item.expected_harvest_window}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-sm text-[color:var(--secondary-black)] mt-2 whitespace-pre-wrap">
                      {item.notes}
                    </div>
                  )}

                  <div className="mt-3 flex gap-3 text-[11px] text-[color:var(--secondary-muted-edge)]">
                    <span>{item.comments_count} Comments</span>
                    <span className="h-1 w-1 rounded-full bg-[color:var(--secondary-soft-highlight)]"></span>
                    <span>{item.requests_count} Requests</span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {item.comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-[var(--primary-base)]/15 flex items-center justify-center text-[10px] text-[color:var(--primary-base)]">
                          B
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[color:var(--secondary-black)]">
                            {c.content}
                          </div>
                          <div className="text-[10px] text-[color:var(--secondary-muted-edge)] mt-0.5">
                            {new Date(c.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        value={commentDraft[item.id] || ""}
                        onChange={(e) =>
                          setCommentDraft((s) => ({
                            ...s,
                            [item.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment…"
                        className="flex-1 rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                      />
                      <button
                        onClick={() => {
                          const content = (commentDraft[item.id] || "").trim();
                          if (!content) return;
                          dispatch(
                            addHarvestComment({ harvestId: item.id, content })
                          );
                          setCommentDraft((s) => ({ ...s, [item.id]: "" }));
                          show("Comment posted successfully");
                        }}
                        className="rounded-full bg-[var(--primary-base)] text-white px-3 py-2 text-xs font-medium hover:opacity-90"
                      >
                        Comment
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-[color:var(--secondary-muted-edge)] mb-2">
                      Request from this harvest
                    </div>
                    {item.requests.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-3 mb-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-[color:var(--secondary-black)] font-medium">
                            {r.requested_quantity} {r.unit}
                          </div>
                          <span
                            className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              r.status === "pending"
                                ? "bg-[var(--secondary-highlight1)]/25 text-[color:var(--secondary-muted-edge)]"
                                : r.status === "acknowledged_yes"
                                  ? "bg-[var(--primary-base)]/15 text-[color:var(--primary-base)]"
                                  : "bg-[var(--primary-accent2)]/10 text-[color:var(--primary-accent2)]"
                            }`}
                          >
                            {r.status === "pending"
                              ? "Pending"
                              : r.status === "acknowledged_yes"
                                ? "Can fulfill"
                                : "Cannot fulfill"}
                          </span>
                        </div>
                        {r.seller_message && (
                          <div className="text-xs text-[color:var(--secondary-muted-edge)] mt-1">
                            {r.seller_message}
                          </div>
                        )}
                        {r.status === "pending" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => {
                                dispatch(
                                  acknowledgeHarvestBuyerRequest({
                                    requestId: r.id,
                                    can_fulfill: true,
                                  })
                                );
                                show("Marked as can fulfill");
                              }}
                              className="inline-flex items-center rounded-full bg-[var(--primary-base)] text-white px-3 py-1.5 text-[11px] font-medium hover:opacity-90"
                            >
                              Acknowledge yes
                            </button>
                            <button
                              onClick={() => {
                                dispatch(
                                  acknowledgeHarvestBuyerRequest({
                                    requestId: r.id,
                                    can_fulfill: false,
                                  })
                                );
                                show("Marked as cannot fulfill");
                              }}
                              className="inline-flex items-center rounded-full border border-[color:var(--secondary-soft-highlight)] bg-transparent text-[color:var(--secondary-muted-edge)] px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50"
                            >
                              Acknowledge no
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {isBuyer && (
                      <div className="rounded-xl border border-[color:var(--secondary-soft-highlight)] p-3">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            min={0}
                            placeholder="Quantity"
                            value={requestDraft[item.id]?.quantity || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || {
                                    quantity: "",
                                    unit: "kg",
                                  }),
                                  quantity: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                          />
                          <input
                            placeholder="Unit (e.g. kg)"
                            value={requestDraft[item.id]?.unit || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || { quantity: "", unit: "" }),
                                  unit: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                          />
                          <input
                            type="date"
                            value={requestDraft[item.id]?.date || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || { quantity: "", unit: "" }),
                                  date: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)]"
                          />
                          <input
                            placeholder="Notes (optional)"
                            value={requestDraft[item.id]?.notes || ""}
                            onChange={(e) =>
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: {
                                  ...(s[item.id] || { quantity: "", unit: "" }),
                                  notes: e.target.value,
                                },
                              }))
                            }
                            className="rounded-full border border-[color:var(--secondary-soft-highlight)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-base)] col-span-2"
                          />
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => {
                              const draft = requestDraft[item.id];
                              const quantity = Number(draft?.quantity || 0);
                              const unit = (draft?.unit || "").trim();
                              if (!quantity || !unit) return;
                              dispatch(
                                createHarvestBuyerRequest({
                                  harvestId: item.id,
                                  quantity,
                                  unit,
                                  requested_date: draft?.date,
                                  notes: draft?.notes,
                                })
                              );
                              setRequestDraft((s) => ({
                                ...s,
                                [item.id]: { quantity: "", unit: "" },
                              }));
                              show("Request submitted");
                            }}
                            className="inline-flex items-center rounded-full bg-[var(--primary-accent2)] text-white px-3 py-1.5 text-[11px] font-medium hover:bg-[var(--primary-accent3)]"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
