"use client";

import { useCallback, useEffect, useState } from "react";

export type Toast = {
  id: number;
  message: string;
  tone: "success" | "error";
  action?: { label: string; onClick: () => void };
};

const VISIBLE_MS = 4000;

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const show = useCallback((next: Omit<Toast, "id">) => setToast({ ...next, id: Date.now() }), []);
  const dismiss = useCallback(() => setToast(null), []);

  return { toast, show, dismiss };
}
