"use client";

import { TrendDown, TrendUp } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { EntryType } from "@/lib/entries";
import { formatAmount, formatWhole } from "@/lib/money";
import { AnimatedNumber } from "./animated-number";

/** A just-submitted amount that floats up from the profit number. */
export type ProfitFloat = { id: string; type: EntryType; cents: number };

type ProfitCardProps = { profit: number; float: ProfitFloat | null; onFloatDone: (id: string) => void };

export function ProfitCard({ profit, float, onFloatDone }: ProfitCardProps) {
  const reduceMotion = useReducedMotion();
  const inTheBlack = profit >= 0;
  const tone = inTheBlack ? "text-profit" : "text-loss";
  const Trend = inTheBlack ? TrendUp : TrendDown;
  const long = formatWhole(profit).length > 8;

  return (
    <section
      aria-labelledby="profit-heading"
      className={`rounded-box p-6 transition-colors duration-500 motion-reduce:transition-none ${inTheBlack ? "bg-profit-tint" : "bg-loss-tint"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="profit-heading" className="text-[15px] font-medium text-muted">
          Profit this month
        </h2>
        <p className={`flex items-center gap-1.5 text-[15px] font-semibold transition-colors duration-500 motion-reduce:transition-none ${tone}`}>
          <Trend size={18} weight="bold" aria-hidden />
          {inTheBlack ? "In the black" : "In the red"}
        </p>
      </div>
      <div className="relative mt-4">
        <p
          aria-hidden
          className={`font-semibold leading-none tracking-[-0.045em] transition-colors duration-500 motion-reduce:transition-none ${tone} ${long ? "text-[48px]" : "text-[64px]"}`}
        >
          <AnimatedNumber value={profit} format={formatWhole} />
        </p>
        <AnimatePresence>
          {float && !reduceMotion && (
            <motion.span
              key={float.id}
              aria-hidden
              className={`absolute right-0 bottom-2 rounded-box px-3 py-1 text-[17px] font-semibold tabular-nums ring-4 ${inTheBlack ? "ring-profit-tint" : "ring-loss-tint"} ${float.type === "income" ? "bg-profit text-surface" : "bg-raised text-ink"}`}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: -24 }}
              transition={{ duration: 0.9, ease: "easeOut", times: [0, 0.15, 0.6, 1] }}
              onAnimationComplete={() => onFloatDone(float.id)}
            >
              {float.type === "income" ? "+" : "−"}
              {formatAmount(float.cents)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
