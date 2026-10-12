create table if not exists public.contact_settings (
  id integer primary key default 1 check (id = 1),
  parish_name text not null,
  address text not null,
  postal_code text not null,
  priest text not null,
  phone text not null,
  email text not null,
  facebook_url text,
  maps_url text,
  updated_at timestamptz not null default now()
);

alter table public.contact_settings enable row level security;


create or replace function public.set_contact_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_contact_settings_updated_at
on public.contact_settings;

create trigger set_contact_settings_updated_at
before update on public.contact_settings
for each row
execute function public.set_contact_settings_updated_at();


drop policy if exists "Public can view contact settings"
on public.contact_settings;

create policy "Public can view contact settings"
on public.contact_settings
for select
using (true);


drop policy if exists "Admins can insert contact settings"
on public.contact_settings;

create policy "Admins can insert contact settings"
on public.contact_settings
for insert
to authenticated
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can update contact settings"
on public.contact_settings;

create policy "Admins can update contact settings"
on public.contact_settings
for update
to authenticated
using (
  public.is_active_admin()
)
with check (
  public.is_active_admin()
);


insert into public.contact_settings (
  id,
  parish_name,
  address,
  postal_code,
  priest,
  phone,
  email,
  facebook_url,
  maps_url
)
values (
  1,
  'St. Francis of Assisi',
  'Austurgata 7',
  '340 Stykkishólmur',
  'Rev. Krzysztof Sliwa',
  '+354 850 7576',
  'sliwcok@gmail.com',
  'https://www.facebook.com/',
  'https://maps.google.com/?q=Austurgata+7,+340+Stykkisholmur'
)
on conflict (id) do nothing;
