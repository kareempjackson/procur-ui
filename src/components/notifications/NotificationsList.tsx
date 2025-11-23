"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectNotifications,
  fetchNotifications,
  markNotificationRead,
} from "@/store/slices/notificationsSlice";

export default function NotificationsList() {
  const { items, status } = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotifications(undefined));
    }
  }, [status, dispatch]);

  const safeItems = Array.isArray(items)
    ? items
    : Array.isArray((items as unknown as { data?: unknown })?.data)
      ? ((items as unknown as { data: unknown[] }).data as any[])
      : [];

  const unreadCount = useMemo(
    () => safeItems.filter((n) => !n.read_at).length,
    [safeItems]
  );

  const handleNotificationClick = (n: any) => {
    // Prefer explicit cta_url from notification payload
    const ctaUrl: string | undefined =
      (n.data && (n.data.cta_url as string)) ||
      (n.data && (n.data.link as string));

    if (ctaUrl) {
      router.push(ctaUrl);
    }

    if (!n.read_at) {
      void dispatch(markNotificationRead({ id: n.id }));
    }
  };

  if (status === "loading") {
    return (
      <div className="content-spacing">
        <div className="card">
          <div className="animate-pulse">Loading notifications...</div>
        </div>
      </div>
    );
  }

  if (!safeItems.length) {
    return (
      <div className="content-spacing">
        <div className="card" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-family)",
              color: "var(--primary-base)",
              fontSize: "1.25rem",
              marginBottom: "0.75rem",
            }}
          >
            You're all caught up
          </h2>
          <p style={{ color: "#6b7280" }}>
            No notifications yet. We'll let you know when something arrives.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-spacing">
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontWeight: 600, color: "var(--primary-base)" }}>
            Notifications
          </h2>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            {unreadCount} unread
          </span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {safeItems.map((n) => (
            <li
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: "12px 8px",
                borderBottom: "1px solid #f1f5f9",
                background: n.read_at ? "#fff" : "#fff7ed",
                borderRadius: 10,
                marginBottom: 8,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  marginTop: 6,
                  background: n.read_at ? "#e5e7eb" : "var(--primary-accent2)",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ color: "#374151", marginTop: 4 }}>{n.body}</div>
              </div>
              {!n.read_at && (
                <button
                  className="btn btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(markNotificationRead({ id: n.id }));
                  }}
                >
                  Mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
