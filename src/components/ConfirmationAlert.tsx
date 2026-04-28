"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  title?: string;
  description?: string;
  type?: AlertType;
  duration?: number;
  onClose?: () => void;
}

export default function ConfirmationAlert({
  title,
  description,
  type = "info",
  duration,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  // auto close with progress bar
  useEffect(() => {
    if (!duration) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setVisible(false);
        onClose?.();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  if (!visible) return null;

  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const styleConfig = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
      text: "text-emerald-900",
      progress: "bg-emerald-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      text: "text-red-900",
      progress: "bg-red-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-900",
      progress: "bg-blue-500",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      text: "text-amber-900",
      progress: "bg-amber-500",
    },
  };

  const config = styleConfig[type];
  const IconComponent = iconMap[type];

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg shadow-sm overflow-hidden animate-fadeIn`}
    >
      <div className="flex items-start gap-4 p-4">
        <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.icon}`} />
        
        <div className="flex-1 min-w-0">
          {title && <p className={`font-semibold text-sm ${config.text}`}>{title}</p>}
          {description && (
            <p className={`text-sm mt-1 opacity-90 ${config.text}`}>{description}</p>
          )}
        </div>

        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className={`flex-shrink-0 p-1 rounded hover:bg-white/50 transition-colors ${config.text}`}
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar for auto-close */}
      {duration && (
        <div className={`h-1 ${config.progress} transition-all`} style={{ width: `${progress}%` }} />
      )}
    </div>
  );
}