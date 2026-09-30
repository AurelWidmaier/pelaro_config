-- Datenbankschema des Supabase-Projekts „config“ (Stand der angewendeten Migrationen).
-- Nur zur Dokumentation / zum Neuaufsetzen – angewendet wird es über Supabase.

-- Admins (Zugriff per E-Mail des eingeloggten Supabase-Users)
create table public.admin_users (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

create policy "Admins sehen Admin-Liste" on public.admin_users
  for select to authenticated using ((select private.is_admin()));

-- Produktkatalog: Rahmen, Schaltgruppen, Laufräder (data = Produktfelder ohne ID)
create table public.products (
  id text primary key,
  category text not null check (category in ('frame', 'groupset', 'wheels')),
  data jsonb not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create index products_category_idx on public.products (category, sort_order);

create policy "Aktive Produkte lesbar" on public.products
  for select to anon, authenticated using (active or (select private.is_admin()));
create policy "Admins legen Produkte an" on public.products
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admins ändern Produkte" on public.products
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins löschen Produkte" on public.products
  for delete to authenticated using ((select private.is_admin()));

-- Einstellungen, z. B. key = 'standard_parts'
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;

create policy "Einstellungen lesbar" on public.settings
  for select to anon, authenticated using (true);
create policy "Admins legen Einstellungen an" on public.settings
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admins ändern Einstellungen" on public.settings
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at := now(); return new; end $$;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- Besuchsstatistik (visitor_id/session_id nur mit Einwilligung)
create table public.page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  path text not null check (char_length(path) between 1 and 300),
  referrer text check (char_length(referrer) <= 500),
  is_entry boolean not null default false,
  visitor_id uuid,
  session_id uuid
);
alter table public.page_views enable row level security;
create index page_views_created_at_idx on public.page_views (created_at);

create policy "Jeder darf Aufrufe melden" on public.page_views
  for insert to anon, authenticated with check (true);
create policy "Admins lesen Aufrufe" on public.page_views
  for select to authenticated using ((select private.is_admin()));

-- Statistik-Funktionen (security invoker: RLS greift, zusätzlich Admin-Prüfung)
-- admin_visit_stats(days)          -> Tageswerte: page_views, visits, unique_visitors
-- admin_visit_summary(days)        -> Summen inkl. Einwilligungsquote
-- admin_top_pages(days, max_rows)  -> meistbesuchte Pfade
-- Besuche = eindeutige session_id + anonyme Einstiegs-Aufrufe (is_entry, ohne session_id).
-- Vollständige Definitionen: siehe Migration „move_is_admin_private“ im Supabase-Dashboard.

-- Produktbilder
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;
create policy "Admins laden Produktbilder hoch" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and (select private.is_admin()));
create policy "Admins ändern Produktbilder" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and (select private.is_admin()));
create policy "Admins löschen Produktbilder" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and (select private.is_admin()));
