"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export type ToastVariant = "info" | "success" | "warning" | "error";

type ToastInput = {
  message: string;
  title?: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
};

type Toast = ToastInput & { id: number };

type ToastContextType = {
  show: (toast: string | ToastInput, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastVariantStyles: Record<
  ToastVariant,
  { container: string; iconWrap: string; Icon: React.ComponentType<any> }
> = {
  info: {
    container:
      "border-[color:var(--secondary-soft-highlight)] bg-white text-[color:var(--secondary-black)]",
    iconWrap: "bg-[color:var(--primary-background)] text-[color:var(--primary-base)]",
    Icon: InformationCircleIcon,
  },
  success: {
    container: "border-green-200 bg-green-50 text-green-900",
    iconWrap: "bg-green-100 text-green-700",
    Icon: CheckCircleIcon,
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    iconWrap: "bg-amber-100 text-amber-700",
    Icon: ExclamationTriangleIcon,
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    iconWrap: "bg-red-100 text-red-700",
    Icon: XCircleIcon,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const api = useMemo<ToastContextType>(
    () => ({
      show: (toast: string | ToastInput, durationMs = 2200) => {
        const id = Date.now() + Math.random();
        const input: ToastInput =
          typeof toast === "string" ? { message: toast } : toast;
        const normalized: Toast = {
          id,
          message: input.message,
          title: input.title,
          variant: input.variant || "info",
          actionLabel: input.actionLabel,
          onAction: input.onAction,
        };

        setToasts((list) => [...list, normalized]);

        if (durationMs > 0 && Number.isFinite(durationMs)) {
          window.setTimeout(
            () => setToasts((list) => list.filter((t) => t.id !== id)),
            durationMs
          );
        }
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] space-y-2 w-[min(92vw,360px)] pointer-events-none">
        {toasts.map((t) => (
          <ToastView
            key={t.id}
            toast={t}
            onClose={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const variant: ToastVariant = toast.variant || "info";
  const v = toastVariantStyles[variant];
  const Icon = v.Icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={[
        "pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg",
        "animate-in fade-in slide-in-from-bottom-2 duration-200",
        v.container,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl",
            v.iconWrap,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          {toast.title ? (
            <div className="text-sm font-semibold">{toast.title}</div>
          ) : null}
          <div className={toast.title ? "mt-1 text-xs opacity-90" : "text-sm"}>
            {toast.message}
          </div>
          {toast.actionLabel && toast.onAction ? (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  try {
                    toast.onAction?.();
                  } finally {
                    onClose();
                  }
                }}
                className="inline-flex items-center rounded-full border border-current/20 bg-white/60 px-3 py-1 text-[11px] font-medium hover:bg-white/80 transition-colors"
              >
                {toast.actionLabel}
              </button>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-current/70 hover:text-current hover:bg-black/5 transition-colors"
          aria-label="Dismiss"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
