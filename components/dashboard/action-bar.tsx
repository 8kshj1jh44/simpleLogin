"use client";

import { Check, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type ActionBarProps = { onJobDone: () => void; onExpense: () => void };

export function ActionBar({ onJobDone, onExpense }: ActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-[480px] grid-cols-[auto_1fr] gap-3 px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button variant="secondary" onClick={onExpense} className="h-16 px-5 text-[17px]">
          <Plus size={20} weight="bold" aria-hidden />
          Expense
        </Button>
        <Button onClick={onJobDone} className="h-16 text-xl">
          <Check size={24} weight="bold" aria-hidden />
          Job done
        </Button>
      </div>
    </div>
  );
}
