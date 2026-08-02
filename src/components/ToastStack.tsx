import { useEffect } from "react";

export type ToastKind = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const kindStyles: Record<ToastKind, { bg: string; border: string; icon: string }> = {
  success: { bg: "rgba(34, 197, 94, 0.18)", border: "1px solid rgba(34, 197, 94, 0.35)", icon: "✓" },
  error: { bg: "rgba(239, 68, 68, 0.18)", border: "1px solid rgba(239, 68, 68, 0.35)", icon: "!" },
  info: { bg: "rgba(59, 130, 246, 0.18)", border: "1px solid rgba(59, 130, 246, 0.35)", icon: "ℹ" },
  warning: { bg: "rgba(245, 158, 11, 0.18)", border: "1px solid rgba(245, 158, 11, 0.35)", icon: "⚠" },
};

export const ToastStack = ({ toasts, onDismiss }: ToastProps) => {
  return (
    <div className="toastStack">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: number) => void;
}

const ToastCard = ({ toast, onDismiss }: ToastCardProps) => {
  const style = kindStyles[toast.kind];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className="toastCard"
      style={{ background: style.bg, border: style.border }}
      role="status"
    >
      <span className="toastIcon" aria-hidden>
        {style.icon}
      </span>
      <span className="toastMsg">{toast.message}</span>
      <button
        className="toastClose"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};
