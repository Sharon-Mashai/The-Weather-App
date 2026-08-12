import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {Cancel01Icon} from "@hugeicons/core-free-icons";

export type ToastKind = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastStack({
  toasts,
  onDismiss,
}: ToastStackProps) {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        onDismiss(toast.id);
      }, 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, onDismiss]);

  const getIcon = (kind: ToastKind) => {
    switch (kind) {
      case "success":
        return "";
      case "error":
        return "";
      case "warning":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="toastStack">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toastCard toast-${toast.kind}`}
        >
          <div className="toastIcon">
            {getIcon(toast.kind)}
          </div>

          <div className="toastMsg">
            {toast.message}
          </div>

          <button className="toastClose"
            onClick={() => onDismiss(toast.id)}  >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}