"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { addEntry, deleteEntry } from "@/app/actions";
import { byNewest, type Entry } from "@/lib/entries";
import { createClient } from "@/lib/supabase/client";
import { isInMonth } from "@/lib/time";
import type { EntryInput } from "@/lib/validation";

export type LiveEntry = Entry & { pending?: boolean };

// An entry still saving was just added, so it's the newest even if this device's clock runs behind the server's.
const pendingFirst = (a: LiveEntry, b: LiveEntry) => Number(Boolean(b.pending)) - Number(Boolean(a.pending)) || byNewest(a, b);

type Options = { initialEntries: Entry[]; userId: string; month: { start: number; end: number } };

/** This month's entries: optimistic writes, undo, and live updates from other devices. */
export function useEntries({ initialEntries, userId, month }: Options) {
  const [entries, setEntries] = useState<LiveEntry[]>(initialEntries);
  const inFlight = useRef(new Set<string>());
  const undone = useRef(new Set<string>());
  const addedHere = useRef(new Map<string, Entry>());

  const { start, end } = month;

  // Keyed by id, so an entry seen twice (optimistic, server reply, realtime) is only ever counted once.
  const upsert = useCallback(
    (entry: LiveEntry) => {
      if (undone.current.has(entry.id) || !isInMonth(entry.created_at, { start, end })) return;
      setEntries((prev) => [entry, ...prev.filter((e) => e.id !== entry.id)].sort(pendingFirst));
    },
    [start, end],
  );

  const remove = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let active = true;

    (async () => {
      // The browser client reads its session from cookies lazily. Without this, the channel joins
      // before the user's JWT is known, as anon, and row-level security hides every event.
      const { data } = await supabase.auth.getSession();
      if (!active || !data.session) return;
      await supabase.realtime.setAuth(data.session.access_token);
      if (!active) return;

      channel = supabase
        .channel(`entries:${userId}`)
        .on<Entry>(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "entries", filter: `user_id=eq.${userId}` },
          ({ new: entry }) => {
            if (!inFlight.current.has(entry.id)) upsert(entry);
          },
        )
        // Delete events can't be filtered server-side; they only carry the id.
        .on<Entry>("postgres_changes", { event: "DELETE", schema: "public", table: "entries" }, ({ old }) => {
          if (old.id) remove(old.id);
        })
        .subscribe();
    })();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId, upsert, remove]);

  /** Shows the entry immediately; resolves false (and rolls back) if the server rejects it. */
  const add = useCallback(
    async (input: EntryInput) => {
      inFlight.current.add(input.id);
      upsert({ ...input, created_at: new Date().toISOString(), pending: true });

      const result = await addEntry(input).catch(() => null);
      inFlight.current.delete(input.id);

      if (!result?.ok) {
        remove(input.id);
        return false;
      }
      if (undone.current.has(input.id)) {
        await deleteEntry(input.id);
        return true;
      }
      addedHere.current.set(result.data.id, result.data);
      upsert(result.data);
      return true;
    },
    [upsert, remove],
  );

  /** Removes the entry now; deletes it server-side once the insert has landed. */
  const undo = useCallback(
    async (id: string) => {
      undone.current.add(id);
      remove(id);
      if (inFlight.current.has(id)) return true;

      const result = await deleteEntry(id).catch(() => null);
      if (result?.ok) return true;

      undone.current.delete(id);
      const entry = addedHere.current.get(id);
      if (entry) upsert(entry);
      return false;
    },
    [upsert, remove],
  );

  return { entries, add, undo };
}
