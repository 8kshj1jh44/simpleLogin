"use client";

import { useCallback, useMemo, useState } from "react";
import { EntrySheet } from "@/components/sheet/entry-sheet";
import { ToastView } from "@/components/toast-view";
import { useEntries } from "@/hooks/use-entries";
import { useNow } from "@/hooks/use-now";
import { useToast } from "@/hooks/use-toast";
import { recentCustomers, summarise, type Entry, type EntryType } from "@/lib/entries";
import { formatAmount, formatWhole } from "@/lib/money";
import type { EntryInput } from "@/lib/validation";
import { ActionBar } from "./action-bar";
import { FlowTiles } from "./flow-tiles";
import { Header } from "./header";
import { ProfitCard, type ProfitFloat } from "./profit-card";
import { RecentList } from "./recent-list";

type DashboardProps = {
  initialEntries: Entry[];
  userId: string;
  monthName: string;
  month: { start: number; end: number };
  serverNow: number;
};

export function Dashboard({ initialEntries, userId, monthName, month, serverNow }: DashboardProps) {
  const { entries, add, undo } = useEntries({ initialEntries, userId, month });
  const { toast, show, dismiss } = useToast();
  const [sheet, setSheet] = useState<EntryType | null>(null);
  const now = useNow(serverNow);
  const totals = useMemo(() => summarise(entries), [entries]);
  const customers = useMemo(() => recentCustomers(entries), [entries]);
  const [float, setFloat] = useState<ProfitFloat | null>(null);

  const closeSheet = useCallback(() => setSheet(null), []);
  const clearFloat = useCallback((id: string) => setFloat((prev) => (prev?.id === id ? null : prev)), []);

  async function handleSubmit(input: EntryInput) {
    setSheet(null);
    navigator.vibrate?.(10);
    setFloat({ id: input.id, type: input.type, cents: input.amount_cents });

    const amount = formatAmount(input.amount_cents);
    show({
      tone: "success",
      message: input.type === "income" ? `Nice one. +${amount} in.` : `Logged. −${amount} out.`,
      action: {
        label: "Undo",
        onClick: async () => {
          if (!(await undo(input.id))) show({ tone: "error", message: "Couldn't undo that. Try again." });
        },
      },
    });

    if (!(await add(input))) {
      show({
        tone: "error",
        message: "Couldn't save that. Check your signal.",
        action: { label: "Retry", onClick: () => handleSubmit(input) },
      });
    }
  }

  return (
    <>
      <main
        inert={sheet !== null}
        className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-5 px-5 pt-[max(8px,env(safe-area-inset-top))] pb-[calc(max(16px,env(safe-area-inset-bottom))+112px)]"
      >
        <Header monthName={monthName} />
        <h1 className="sr-only">One Login, {monthName}</h1>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Profit this month {formatWhole(totals.profit)}. In {formatWhole(totals.income)}. Out{" "}
          {formatWhole(totals.expense)}.
        </p>
        <ProfitCard profit={totals.profit} float={float} onFloatDone={clearFloat} />
        <FlowTiles income={totals.income} expense={totals.expense} />
        <div className="mt-3">
          <RecentList entries={entries} now={now} />
        </div>
      </main>

      <div inert={sheet !== null}>
        <ActionBar onJobDone={() => setSheet("income")} onExpense={() => setSheet("expense")} />
      </div>

      <EntrySheet type={sheet} customers={customers} onClose={closeSheet} onSubmit={handleSubmit} />
      <ToastView toast={toast} onDismiss={dismiss} />
    </>
  );
}
