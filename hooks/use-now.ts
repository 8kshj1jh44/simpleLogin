"use client";

import { useEffect, useState } from "react";

/** Starts from the server's clock so the first client render matches the HTML, then ticks. */
export function useNow(serverNow: number, intervalMs = 30_000) {
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
