"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { ENTRY_COLUMNS, type Entry } from "@/lib/entries";
import { createClient, getUserId } from "@/lib/supabase/server";
import { entryInputSchema } from "@/lib/validation";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function addEntry(input: unknown): Promise<Result<Entry>> {
  const parsed = entryInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "That entry doesn't look right." };

  const { supabase, userId } = await getUserId();
  if (!userId) return { ok: false, error: "You've been signed out." };

  const { id, type, customer, description, amount_cents } = parsed.data;
  const { data, error } = await supabase
    .from("entries")
    .insert({ id, type, customer, description, amount_cents })
    .select(ENTRY_COLUMNS)
    .single<Entry>();

  if (!error) return { ok: true, data };

  // Retrying an insert whose reply was lost: the row already exists, so hand it back.
  if (error.code === "23505") {
    const existing = await supabase.from("entries").select(ENTRY_COLUMNS).eq("id", id).single<Entry>();
    if (existing.data) return { ok: true, data: existing.data };
  }
  return { ok: false, error: "Couldn't save that." };
}

export async function deleteEntry(id: unknown): Promise<Result<null>> {
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { ok: false, error: "Unknown entry." };

  const { supabase, userId } = await getUserId();
  if (!userId) return { ok: false, error: "You've been signed out." };

  const { error } = await supabase.from("entries").delete().eq("id", parsed.data);
  if (error) return { ok: false, error: "Couldn't undo that." };
  return { ok: true, data: null };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
