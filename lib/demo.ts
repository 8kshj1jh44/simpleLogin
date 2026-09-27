// Public, throwaway credentials for the "Try the demo" button.
// Must match supabase/seed.sql.
export const DEMO_EMAIL = "demo@onelogin.app";
export const DEMO_PASSWORD = "out-simple-them";

type DemoEntry = {
  type: "income" | "expense";
  customer: string | null;
  description: string;
  amount_cents: number;
  // Position between the start of the month (0) and now (1).
  at: number;
};

export const DEMO_ENTRIES: DemoEntry[] = [
  { type: "income", customer: "Smith", description: "Hot water system", amount_cents: 185000, at: 0.04 },
  { type: "expense", customer: null, description: "Reece materials", amount_cents: 42000, at: 0.12 },
  { type: "income", customer: "Nguyen", description: "Switchboard upgrade", amount_cents: 240000, at: 0.25 },
  { type: "income", customer: "Patel", description: "Blocked drain", amount_cents: 32000, at: 0.38 },
  { type: "expense", customer: null, description: "Ampol fuel", amount_cents: 9500, at: 0.5 },
  { type: "income", customer: "O'Brien", description: "Deck repairs", amount_cents: 95000, at: 0.63 },
  { type: "expense", customer: null, description: "Bunnings materials", amount_cents: 18650, at: 0.8 },
  { type: "income", customer: "Kowalski", description: "Six LED downlights", amount_cents: 68000, at: 0.94 },
];
