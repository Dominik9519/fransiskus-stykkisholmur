create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  event_date date not null,
  event_time time without time zone,
  location text,
  type text,
  excerpt text,
  content text,
  image_url text,
  published boolean not null default true,
  show_on_homepage boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;


-- Automatically update updated_at

create or replace function public.set_events_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_events_updated_at on public.events;

create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_events_updated_at();


-- RLS

drop policy if exists "Public can view published events"
on public.events;

create policy "Public can view published events"
on public.events
for select
using (
  published = true
  or public.is_active_admin()
);


drop policy if exists "Admins can insert events"
on public.events;

create policy "Admins can insert events"
on public.events
for insert
to authenticated
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can update events"
on public.events;

create policy "Admins can update events"
on public.events
for update
to authenticated
using (
  public.is_active_admin()
)
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can delete events"
on public.events;

create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (
  public.is_active_admin()
);


-- Existing events

insert into public.events (
  slug,
  title,
  event_date,
  event_time,
  location,
  type,
  excerpt,
  content,
  image_url,
  published,
  show_on_homepage
)
values
(
  'feast-of-saint-francis',
  'Feast of Saint Francis',
  '2027-01-10',
  '18:00',
  'St. Francis of Assisi, Stykkishólmur',
  'Feast',
  'Join us for the celebration of the Feast of Saint Francis.',
  'We warmly invite everyone to join us for the celebration of the Feast of Saint Francis.

The celebration will include Holy Mass and time together as a parish community.',
  '/church.jpg',
  true,
  true
),
(
  'bible-study',
  'Bible study',
  '2027-01-17',
  '19:00',
  'Parish house, Stykkishólmur',
  'Parish life',
  'An evening of prayer, Scripture and conversation.',
  'Our Bible study evening is open to everyone.

We will read Scripture together and share reflections in a relaxed atmosphere.',
  '/stykkisholmur-panorama.jpg',
  true,
  true
),
(
  'fellowship-after-mass',
  'Fellowship after Mass',
  '2027-01-24',
  '11:00',
  'St. Francis of Assisi, Stykkishólmur',
  'Community',
  'Stay after Mass for coffee and fellowship with the parish community.',
  'After Sunday Mass we invite everyone to stay for coffee and fellowship.

It is a simple opportunity to meet, talk and spend time together.',
  '/church.jpg',
  true,
  true
)
on conflict (slug) do nothing;


-- Event images Storage bucket

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'event-images',
  'event-images',
  true,
  8388608,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- Storage policies

drop policy if exists "Public can view event images"
on storage.objects;

create policy "Public can view event images"
on storage.objects
for select
using (
  bucket_id = 'event-images'
);


drop policy if exists "Admins can upload event images"
on storage.objects;

create policy "Admins can upload event images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'event-images'
  and public.is_active_admin()
);


drop policy if exists "Admins can update event images"
on storage.objects;

create policy "Admins can update event images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'event-images'
  and public.is_active_admin()
)
with check (
  bucket_id = 'event-images'
  and public.is_active_admin()
);


drop policy if exists "Admins can delete event images"
on storage.objects;

create policy "Admins can delete event images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'event-images'
  and public.is_active_admin()
);
