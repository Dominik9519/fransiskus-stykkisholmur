create table if not exists public.live_stream_settings (
  id integer primary key default 1 check (id = 1),
  title text not null default 'Holy Mass Live',
  description text not null default 'Watch Holy Mass live from St. Francis of Assisi Parish in Stykkishólmur.',
  youtube_url text,
  live_now boolean not null default false,
  scheduled_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.live_stream_settings enable row level security;


create or replace function public.set_live_stream_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_live_stream_updated_at
on public.live_stream_settings;

create trigger set_live_stream_updated_at
before update on public.live_stream_settings
for each row
execute function public.set_live_stream_updated_at();


drop policy if exists "Public can view live stream settings"
on public.live_stream_settings;

create policy "Public can view live stream settings"
on public.live_stream_settings
for select
using (true);


drop policy if exists "Admins can insert live stream settings"
on public.live_stream_settings;

create policy "Admins can insert live stream settings"
on public.live_stream_settings
for insert
to authenticated
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can update live stream settings"
on public.live_stream_settings;

create policy "Admins can update live stream settings"
on public.live_stream_settings
for update
to authenticated
using (
  public.is_active_admin()
)
with check (
  public.is_active_admin()
);


insert into public.live_stream_settings (
  id,
  title,
  description,
  youtube_url,
  live_now,
  scheduled_at
)
values (
  1,
  'Holy Mass Live',
  'Watch Holy Mass live from St. Francis of Assisi Parish in Stykkishólmur.',
  null,
  false,
  null
)
on conflict (id) do nothing;
