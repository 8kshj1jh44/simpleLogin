"use client";

import { ArrowDown } from "@phosphor-icons/react";
import { motion } from "motion/react";

export function EmptyState() {
  return (
    <div className="rounded-box border border-dashed border-line px-6 py-8 text-center">
      <p className="text-lg font-semibold text-ink">Nothing logged this month yet.</p>
      <p className="mt-1 text-[15px] text-muted">Finished a job? Tap the yellow button.</p>
      <motion.span
        aria-hidden
        className="mt-4 inline-block text-ink"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={28} weight="bold" />
      </motion.span>
    </div>
  );
}
