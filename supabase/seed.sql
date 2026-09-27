-- Local seed, run automatically by `supabase db reset`.
-- For a hosted Supabase project use `npm run seed:demo` instead.
-- Demo credentials must match lib/demo.ts.

do $$
declare
  demo_id     uuid        := '00000000-0000-4000-8000-00000000de30';
  month_start timestamptz := date_trunc('month', now() at time zone 'Australia/Sydney') at time zone 'Australia/Sydney';
  span        interval    := now() - month_start;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new
  ) values (
    '00000000-0000-0000-0000-000000000000', demo_id, 'authenticated', 'authenticated',
    'demo@onelogin.app', extensions.crypt('out-simple-them', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(),
    '', '', '', ''
  ) on conflict (id) do nothing;

  insert into auth.identities (
    id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
  ) values (
    demo_id, demo_id, demo_id::text, 'email',
    jsonb_build_object('sub', demo_id::text, 'email', 'demo@onelogin.app', 'email_verified', true),
    now(), now(), now()
  ) on conflict do nothing;

  delete from public.entries where user_id = demo_id;

  insert into public.entries (user_id, type, customer, description, amount_cents, created_at) values
    (demo_id, 'income',  'Smith',    'Hot water system',     185000, month_start + span * 0.04),
    (demo_id, 'expense', null,       'Reece materials',       42000, month_start + span * 0.12),
    (demo_id, 'income',  'Nguyen',   'Switchboard upgrade',  240000, month_start + span * 0.25),
    (demo_id, 'income',  'Patel',    'Blocked drain',         32000, month_start + span * 0.38),
    (demo_id, 'expense', null,       'Ampol fuel',             9500, month_start + span * 0.50),
    (demo_id, 'income',  'O''Brien', 'Deck repairs',          95000, month_start + span * 0.63),
    (demo_id, 'expense', null,       'Bunnings materials',    18650, month_start + span * 0.80),
    (demo_id, 'income',  'Kowalski', 'Six LED downlights',    68000, month_start + span * 0.94);
end $$;
