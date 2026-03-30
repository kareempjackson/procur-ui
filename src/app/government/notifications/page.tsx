"use client";

import NotificationsList from "@/components/notifications/NotificationsList";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { GOV } from "../styles";

export default function GovernmentNotificationsPage() {
  useNotificationsSocket();
  return (
    <div style={{ minHeight: "100vh", background: GOV.bg, color: GOV.text }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: GOV.text,
            margin: 0,
            letterSpacing: "-.4px",
            marginBottom: 24,
          }}
        >
          Notifications
        </h1>
        <NotificationsList />
      </div>
    </div>
  );
}
