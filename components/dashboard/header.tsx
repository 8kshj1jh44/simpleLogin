import { SignOut } from "@phosphor-icons/react";
import { signOut } from "@/app/actions";
import { Wordmark } from "@/components/ui/logo";

export function Header({ monthName }: { monthName: string }) {
  return (
    <header className="flex h-14 items-center justify-between">
      <Wordmark />
      <div className="flex items-center gap-1">
        <span className="text-[15px] font-medium text-muted">{monthName}</span>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            className="grid size-12 place-items-center rounded-box text-faint transition-colors hover:bg-raised hover:text-ink"
          >
            <SignOut size={22} weight="bold" />
          </button>
        </form>
      </div>
    </header>
  );
}
