create table public.news (
  id uuid primary key default gen_random_uuid(),

  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',

  image_url text,

  published_at date not null default current_date,

  published boolean not null default false,
  show_on_homepage boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news enable row level security;


-- Publicznie można czytać tylko opublikowane newsy.
create policy "Public can read published news"
on public.news
for select
using (
  published = true
  or public.is_active_admin()
);


-- Administratorzy mogą dodawać newsy.
create policy "Admins can insert news"
on public.news
for insert
to authenticated
with check (public.is_active_admin());


-- Administratorzy mogą edytować newsy.
create policy "Admins can update news"
on public.news
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());


-- Administratorzy mogą usuwać newsy.
create policy "Admins can delete news"
on public.news
for delete
to authenticated
using (public.is_active_admin());


create trigger news_updated_at
before update on public.news
for each row
execute procedure public.update_updated_at();


-- Obecne newsy ze strony.
insert into public.news
(
  slug,
  title,
  excerpt,
  content,
  image_url,
  published_at,
  published,
  show_on_homepage
)
values
(
  'parish-life-is-growing-in-snaefellsnes',
  'Parish life is growing in Snæfellsnes',
  'A short update from parish life in Stykkishólmur and the wider Snæfellsnes community.',
  'Parish life in Snæfellsnes continues to grow through prayer, community gatherings and regular celebrations of Holy Mass.

We are grateful for everyone who takes part in parish life and helps create a welcoming place for residents and visitors.

More updates and announcements will be published here regularly.',
  '/stykkisholmur-panorama.jpg',
  '2027-01-05',
  true,
  true
),
(
  'new-year-parish-update',
  'New Year parish update',
  'A few words as we begin the new year together as a parish community.',
  'We begin the new year with gratitude and hope.

Please check the Mass Times and Events sections for the latest parish schedule.',
  '/church.jpg',
  '2027-01-02',
  true,
  false
);
