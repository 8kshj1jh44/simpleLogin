import { formatWhole } from "@/lib/money";
import { AnimatedNumber } from "./animated-number";

function Stat({ label, cents }: { label: string; cents: number }) {
  return (
    <div className="px-5 py-4">
      <p className="text-[15px] font-medium text-muted">{label}</p>
      <p aria-hidden className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink">
        <AnimatedNumber value={cents} format={formatWhole} />
      </p>
    </div>
  );
}

/** Share of this month's income that's left after expenses. Null when nothing has come in. */
function keptRatio(income: number, expense: number) {
  return income === 0 ? null : (income - expense) / income;
}

/** Green is what you kept, grey is what expenses took. */
function MarginBar({ kept }: { kept: number | null }) {
  return (
    <div aria-hidden className="h-1.5 bg-spent">
      <div
        className="h-full origin-left bg-profit transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `scaleX(${Math.min(1, Math.max(0, kept ?? 0))})` }}
      />
    </div>
  );
}

export function FlowTiles({ income, expense }: { income: number; expense: number }) {
  const kept = keptRatio(income, expense);
  const keptPercent = kept === null ? null : Math.round(kept * 100);

  return (
    <section aria-label="Money in and out" className="overflow-hidden rounded-box border border-line bg-surface">
      <MarginBar kept={kept} />
      {keptPercent !== null && (
        <p className="px-5 pt-2 text-right text-[13px] font-medium text-muted tabular-nums">
          Kept {keptPercent < 0 ? `−${Math.abs(keptPercent)}` : keptPercent}%
        </p>
      )}
      <div className="grid grid-cols-2 divide-x divide-line">
        <Stat label="$ In" cents={income} />
        <Stat label="$ Out" cents={expense} />
      </div>
    </section>
  );
}
