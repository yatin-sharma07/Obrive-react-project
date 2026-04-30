"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning";

interface ConfirmationAlertProps {
  isOpen: boolean;
  title: string;
  description?: string;
  type?: AlertType;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
}

export default function ConfirmationAlert({
  isOpen,
  title,
  description,
  type = "info",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationAlertProps) {
  if (!isOpen) return null;

  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const styleConfig = {
    success: {
      icon: "text-emerald-600",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      light: "bg-emerald-50 text-emerald-700",
    },
    error: {
      icon: "text-red-600",
      btn: "bg-red-600 hover:bg-red-700",
      light: "bg-red-50 text-red-700",
    },
    info: {
      icon: "text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700",
      light: "bg-blue-50 text-blue-700",
    },
    warning: {
      icon: "text-amber-600",
      btn: "bg-amber-600 hover:bg-amber-700",
      light: "bg-amber-50 text-amber-700",
    },
  };

  const config = styleConfig[type];
  const IconComponent = iconMap[type];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${config.light}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {title}
                </h3>
                {description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {description}
                  </p>
                )}
              </div>

              <button
                onClick={onCancel}
                className="flex-shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onCancel}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
              >
                {cancelLabel}
              </button>
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  className={`inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${config.btn}`}
                >
                  {confirmLabel}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}