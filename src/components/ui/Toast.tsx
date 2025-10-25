"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Toast = { id: number; message: string };

type ToastContextType = {
  show: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const api = useMemo<ToastContextType>(
    () => ({
      show: (message: string, durationMs = 2200) => {
        const id = Date.now() + Math.random();
        setToasts((list) => [...list, { id, message }]);
        window.setTimeout(
          () => setToasts((list) => list.filter((t) => t.id !== id)),
          durationMs
        );
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-full bg-black/80 text-white text-sm px-4 py-2 animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
