import { createClient } from "@supabase/supabase-js";
import { DEMO_EMAIL, DEMO_ENTRIES, DEMO_PASSWORD } from "../lib/demo";
import { sydneyMonth } from "../lib/time";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !secretKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.");
  process.exit(1);
}

const admin = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureDemoUser() {
  const created = await admin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });
  if (created.data.user) return created.data.user.id;

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const existing = data.users.find((user) => user.email === DEMO_EMAIL);
  if (!existing) throw created.error ?? new Error("Could not create the demo user.");

  const reset = await admin.auth.admin.updateUserById(existing.id, { password: DEMO_PASSWORD });
  if (reset.error) throw reset.error;
  return existing.id;
}

async function main() {
  const userId = await ensureDemoUser();

  const cleared = await admin.from("entries").delete().eq("user_id", userId);
  if (cleared.error) throw cleared.error;

  const now = Date.now();
  const monthStart = sydneyMonth(new Date(now)).start;
  const rows = DEMO_ENTRIES.map(({ at, ...entry }) => ({
    ...entry,
    user_id: userId,
    created_at: new Date(monthStart + Math.floor((now - monthStart) * at)).toISOString(),
  }));

  const inserted = await admin.from("entries").insert(rows);
  if (inserted.error) throw inserted.error;

  console.log(`Seeded ${rows.length} entries for ${DEMO_EMAIL}.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
