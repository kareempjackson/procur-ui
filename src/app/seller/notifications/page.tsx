"use client";

import NotificationsList from "@/components/notifications/NotificationsList";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";

export default function SellerNotificationsPage() {
  useNotificationsSocket();
  return <NotificationsList />;
}
