// All money is integer cents. Formatting goes through a decimal string so no float ever touches a total.

export const MAX_CENTS = 10_000_000_00;

const wholeDollars = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const exactDollars = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

function toDecimalString(cents: number): `${number}` {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.trunc(abs / 100)}.${String(abs % 100).padStart(2, "0")}` as `${number}`;
}

const withMinusSign = (formatted: string) => formatted.replace("-", "−");

/** "$1,850" — for the big numbers. */
export function formatWhole(cents: number) {
  return withMinusSign(wholeDollars.format(toDecimalString(cents)));
}

/** "$1,850.00" — for the list. */
export function formatExact(cents: number) {
  return withMinusSign(exactDollars.format(toDecimalString(cents)));
}

/** "$450" or "$450.50" — only shows cents when there are some. */
export function formatAmount(cents: number) {
  return cents % 100 === 0 ? formatWhole(cents) : formatExact(cents);
}

/** "1,234.5" → 123450. Returns null for anything that isn't a plain dollar amount. */
export function parseCents(input: string): number | null {
  const match = /^(\d{0,8})(?:\.(\d{0,2}))?$/.exec(input.replace(/[\s,$]/g, ""));
  if (!match || (!match[1] && !match[2])) return null;
  return Number(match[1] || "0") * 100 + Number((match[2] ?? "").padEnd(2, "0"));
}

/** Keeps a price field to digits, one dot and two decimals as the user types. */
export function sanitizePrice(input: string) {
  const [dollars = "", ...rest] = input.replace(/[^\d.]/g, "").split(".");
  const trimmed = dollars.slice(0, 8);
  return rest.length ? `${trimmed}.${rest.join("").slice(0, 2)}` : trimmed;
}
