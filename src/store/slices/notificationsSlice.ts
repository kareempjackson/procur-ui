import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiClient } from "@/lib/apiClient";
import axios from "axios";
import type { RootState } from "..";

export type NotificationItem = {
  id: string;
  event_id: string;
  recipient_user_id: string;
  title: string;
  body: string;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  category?: string | null;
  priority?: "low" | "normal" | "high" | string;
  created_at: string;
  read_at?: string | null;
};

export type NotificationSettings = {
  channels?: Record<string, boolean>;
  categories?: Record<string, boolean>;
  quiet_hours?: { start: string; end: string; tz?: string } | null;
};

export type NotificationsState = {
  items: NotificationItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: NotificationsState = {
  items: [],
  status: "idle",
  error: null,
};

function getClient() {
  return getApiClient(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { accessToken?: string };
      return parsed.accessToken ?? null;
    } catch {
      return null;
    }
  });
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const msg = (error.response?.data as any)?.message; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  if (typeof error === "object" && error !== null) {
    const maybeMsg = (error as { message?: unknown }).message;
    if (typeof maybeMsg === "string") return maybeMsg;
  }
  return fallback;
}

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (payload: { limit?: number } | undefined, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.get("/notifications", {
        params: { limit: payload?.limit ?? 50 },
      });
      return (data?.data ?? data) as NotificationItem[];
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to fetch notifications")
      );
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const client = getClient();
      await client.post(`/notifications/${payload.id}/read`);
      return { id: payload.id };
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, "Failed to mark read"));
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  "notifications/updateSettings",
  async (payload: NotificationSettings, { rejectWithValue }) => {
    try {
      const client = getClient();
      const { data } = await client.put("/notifications/settings", payload);
      return data as NotificationSettings;
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to update settings")
      );
    }
  }
);

export const registerDeviceToken = createAsyncThunk(
  "notifications/registerDevice",
  async (
    payload: {
      platform: string;
      provider: string;
      token: string;
      userAgent?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const client = getClient();
      const { data } = await client.post("/notifications/devices", payload);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(
        extractErrorMessage(err, "Failed to register device")
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    receivedNotification(state, action: PayloadAction<NotificationItem>) {
      const exists = state.items.find((n) => n.id === action.payload.id);
      if (exists) return;
      state.items = [action.payload, ...state.items];
    },
    clearNotifications(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<NotificationItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = {
            ...state.items[idx],
            read_at: new Date().toISOString(),
          } as NotificationItem;
        }
      });
  },
});

export const { receivedNotification, clearNotifications } =
  notificationsSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications;

export default notificationsSlice.reducer;
