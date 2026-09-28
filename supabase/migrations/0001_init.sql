-- One Login: a single ledger of jobs (income) and expenses per user.
-- Money is stored as integer cents. Never floats.
-- Idempotent: the hosted project already had this schema before migrations were tracked.

create table if not exists public.entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type         text not null check (type in ('income', 'expense')),
  customer     text,
  description  text not null,
  amount_cents integer not null check (amount_cents > 0),
  created_at   timestamptz not null default now()
);

create index if not exists entries_user_id_created_at_idx
  on public.entries (user_id, created_at desc);

alter table public.entries enable row level security;

drop policy if exists "Users can read their own entries" on public.entries;
create policy "Users can read their own entries"
  on public.entries for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add their own entries" on public.entries;
create policy "Users can add their own entries"
  on public.entries for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own entries" on public.entries;
create policy "Users can delete their own entries"
  on public.entries for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.entries to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'entries'
  ) then
    alter publication supabase_realtime add table public.entries;
  end if;
end $$;
