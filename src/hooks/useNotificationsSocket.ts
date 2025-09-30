"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/store";
import { receivedNotification } from "@/store/slices/notificationsSlice";

let socket: Socket | null = null;

export function useNotificationsSocket() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.accessToken);

  useEffect(() => {
    if (!token) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_WS_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000";

    socket = io(baseUrl, {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("connect", () => {
      // Connected
    });

    socket.on("notification", (data: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatch(receivedNotification(data));
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [token, dispatch]);
}
