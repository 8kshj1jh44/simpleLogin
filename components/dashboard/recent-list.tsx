"use client";

import { Check, Receipt } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { LiveEntry } from "@/hooks/use-entries";
import { formatExact } from "@/lib/money";
import { relativeTime } from "@/lib/time";
import { EmptyState } from "./empty-state";

const RECENT_COUNT = 5;

function Row({ entry, now }: { entry: LiveEntry; now: number }) {
  const income = entry.type === "income";
  const title = income ? (entry.customer ?? entry.description) : entry.description;
  const subtitle = income && entry.customer ? entry.description : null;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: entry.pending ? 0.55 : 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[72px] items-center gap-3 px-4 py-3"
    >
      <span
        aria-hidden
        className={`grid size-10 shrink-0 place-items-center rounded-full ${income ? "bg-profit-tint text-profit" : "bg-raised text-muted"}`}
      >
        {income ? <Check size={20} weight="bold" /> : <Receipt size={20} weight="bold" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[17px] font-semibold text-ink">{title}</p>
        {subtitle && <p className="truncate text-[15px] text-muted">{subtitle}</p>}
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-[17px] font-semibold tabular-nums ${income ? "text-profit" : "text-ink"}`}>
          {income ? "+" : "−"}
          {formatExact(entry.amount_cents)}
        </p>
        <p className="text-[14px] text-faint">{relativeTime(entry.created_at, now)}</p>
      </div>
    </motion.li>
  );
}

export function RecentList({ entries, now }: { entries: LiveEntry[]; now: number }) {
  return (
    <section aria-labelledby="recent-heading">
      <h2 id="recent-heading" className="mb-3 text-[17px] font-semibold text-ink">
        Recent
      </h2>
      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-box border border-line bg-surface">
          <AnimatePresence initial={false}>
            {entries.slice(0, RECENT_COUNT).map((entry) => (
              <Row key={entry.id} entry={entry} now={now} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
