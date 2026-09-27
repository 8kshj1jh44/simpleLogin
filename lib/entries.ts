import { parseTimestamp } from "./time";

export type EntryType = "income" | "expense";

export type Entry = {
  id: string;
  type: EntryType;
  customer: string | null;
  description: string;
  amount_cents: number;
  created_at: string;
};

export const ENTRY_COLUMNS = "id, type, customer, description, amount_cents, created_at";

export function byNewest(a: Entry, b: Entry) {
  return parseTimestamp(b.created_at) - parseTimestamp(a.created_at);
}

export function summarise(entries: Entry[]) {
  let income = 0;
  let expense = 0;
  for (const entry of entries) {
    if (entry.type === "income") income += entry.amount_cents;
    else expense += entry.amount_cents;
  }
  return { income, expense, profit: income - expense };
}

/** Most recent distinct customer names (entries must be newest first). */
export function recentCustomers(entries: Entry[], limit = 4) {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const entry of entries) {
    const name = entry.customer?.trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    names.push(name);
    if (names.length === limit) break;
  }
  return names;
}
