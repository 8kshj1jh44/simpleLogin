import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";
import { ENTRY_COLUMNS, type Entry } from "@/lib/entries";
import { getUserId } from "@/lib/supabase/server";
import { sydneyMonth } from "@/lib/time";

export default async function HomePage() {
  const { supabase, userId } = await getUserId();
  if (!userId) redirect("/login");

  const now = new Date();
  const month = sydneyMonth(now);

  const { data, error } = await supabase
    .from("entries")
    .select(ENTRY_COLUMNS)
    .gte("created_at", new Date(month.start).toISOString())
    .lt("created_at", new Date(month.end).toISOString())
    .order("created_at", { ascending: false })
    .overrideTypes<Entry[], { merge: false }>();

  if (error) throw error;

  return (
    <Dashboard
      initialEntries={data}
      userId={userId}
      monthName={month.name}
      month={{ start: month.start, end: month.end }}
      serverNow={now.getTime()}
    />
  );
}
