const TIME_ZONE = "Australia/Sydney";

const partsFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

const monthFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: TIME_ZONE,
  month: "long",
});

function sydneyParts(date: Date) {
  const parts = Object.fromEntries(
    partsFormatter.formatToParts(date).map((part) => [part.type, Number(part.value)]),
  );
  return parts as Record<"year" | "month" | "day" | "hour" | "minute" | "second", number>;
}

function sydneyOffsetMs(date: Date) {
  const p = sydneyParts(date);
  const wallClock = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return wallClock - Math.floor(date.getTime() / 1000) * 1000;
}

/** The UTC instant of midnight on the 1st of a month in Sydney. monthIndex may overflow (12 = next January). */
function sydneyMonthStart(year: number, monthIndex: number) {
  const wallClock = Date.UTC(year, monthIndex, 1);
  // Two passes so the offset is sampled at the real instant, even across a DST change.
  let instant = wallClock - sydneyOffsetMs(new Date(wallClock));
  instant = wallClock - sydneyOffsetMs(new Date(instant));
  return instant;
}

/** The current calendar month in Sydney time: [start, end) as UTC epoch ms, plus its display name. */
export function sydneyMonth(now: Date = new Date()) {
  const { year, month } = sydneyParts(now);
  return {
    start: sydneyMonthStart(year, month - 1),
    end: sydneyMonthStart(year, month),
    name: monthFormatter.format(now),
  };
}

/** Postgres sends microseconds; the JS spec (and older Safari) only guarantees milliseconds. */
export function parseTimestamp(iso: string) {
  return Date.parse(iso.replace(/(\.\d{3})\d+/, "$1"));
}

export function isInMonth(iso: string, month: { start: number; end: number }) {
  const at = parseTimestamp(iso);
  return at >= month.start && at < month.end;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function relativeTime(iso: string, now: number) {
  const elapsed = Math.max(0, now - parseTimestamp(iso));
  if (elapsed < MINUTE) return "Just now";
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;
  if (elapsed < 2 * DAY) return "Yesterday";
  return `${Math.floor(elapsed / DAY)}d ago`;
}
