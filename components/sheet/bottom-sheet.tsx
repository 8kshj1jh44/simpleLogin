"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useEffect, useId, type ReactNode } from "react";
import { useKeyboardInset } from "@/hooks/use-keyboard-inset";

type BottomSheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  const titleId = useId();
  const dragControls = useDragControls();
  const keyboardInset = useKeyboardInset(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            aria-hidden
            className="fixed inset-0 z-40 bg-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            style={{ bottom: keyboardInset }}
            className="fixed inset-x-0 z-50 mx-auto max-w-[480px] rounded-t-box border border-b-0 border-line bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-[0_-16px_48px_-24px_rgb(11_13_16/0.45)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 380 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <div
              className="flex cursor-grab touch-none items-center justify-between pt-3 pb-4"
              onPointerDown={(event) => dragControls.start(event)}
            >
              <h2 id={titleId} className="pt-4 text-[22px] font-semibold tracking-[-0.02em] text-ink">
                {title}
              </h2>
              <span aria-hidden className="absolute top-2.5 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-line" />
              <button
                type="button"
                onClick={onClose}
                className="mt-4 -mr-2 min-h-12 rounded-box px-3 text-[15px] font-medium text-muted hover:bg-raised hover:text-ink"
              >
                Cancel
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
