"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { Toast } from "@/hooks/use-toast";

export function ToastView({ toast, onDismiss }: { toast: Toast | null; onDismiss: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-40 mx-auto max-w-[480px]"
      style={{ bottom: "calc(max(16px, env(safe-area-inset-bottom)) + 92px)" }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className="pointer-events-auto absolute inset-x-5 bottom-0 flex items-center gap-3 rounded-box border border-line bg-surface py-2 pr-2 pl-4 shadow-[0_16px_40px_-20px_rgb(11_13_16/0.5)]"
          >
            {toast.tone === "success" ? (
              <CheckCircle size={24} weight="fill" className="shrink-0 text-profit" aria-hidden />
            ) : (
              <WarningCircle size={24} weight="fill" className="shrink-0 text-loss" aria-hidden />
            )}
            <p className="flex-1 py-2 text-[16px] font-medium text-ink">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  onDismiss();
                  toast.action?.onClick();
                }}
                className="min-h-12 shrink-0 rounded-box px-4 text-[15px] font-semibold text-ink underline decoration-2 underline-offset-4 hover:bg-raised"
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
