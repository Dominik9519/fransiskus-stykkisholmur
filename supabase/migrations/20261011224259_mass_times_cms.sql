-- Aktywny administrator.
-- Do zwykłej edycji treści nie wymagamy dodatkowego MFA,
-- dzięki czemu proboszcz może korzystać z Passkey bez kodu TOTP.
create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'superadmin')
      and active = true
  );
$$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;


create table public.mass_times (
  id uuid primary key default gen_random_uuid(),

  day_of_week integer not null
    check (day_of_week between 0 and 6),

  day_name text not null,

  time time not null,

  church text not null default 'St. Francis of Assisi',
  location text not null default 'Stykkishólmur',
  language text not null default 'Icelandic',

  published boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


alter table public.mass_times enable row level security;


-- Każdy może odczytać opublikowane Msze.
create policy "Public can read published mass times"
on public.mass_times
for select
using (published = true or public.is_active_admin());


-- Tylko aktywny administrator może dodawać.
create policy "Admins can insert mass times"
on public.mass_times
for insert
to authenticated
with check (public.is_active_admin());


-- Tylko aktywny administrator może edytować.
create policy "Admins can update mass times"
on public.mass_times
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


-- Tylko aktywny administrator może usuwać.
create policy "Admins can delete mass times"
on public.mass_times
for delete
to authenticated
using (public.is_active_admin());


-- Automatyczne updated_at.
create trigger mass_times_updated_at
before update on public.mass_times
for each row
execute procedure public.update_updated_at();


-- Obecny harmonogram strony.
insert into public.mass_times
  (day_of_week, day_name, time, church, location, language, sort_order)
values
  (0, 'Sunday',  '11:00', 'St. Francis of Assisi', 'Stykkishólmur', 'Icelandic', 1),
  (2, 'Tuesday', '18:00', 'St. Francis of Assisi', 'Stykkishólmur', 'Icelandic', 2),
  (5, 'Friday',  '18:00', 'St. Francis of Assisi', 'Stykkishólmur', 'Icelandic', 3);
