create table if not exists public.parish_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  eyebrow text,
  intro text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parish_page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null
    references public.parish_pages(id)
    on delete cascade,
  heading text not null,
  text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.parish_pages enable row level security;
alter table public.parish_page_sections enable row level security;


create or replace function public.set_parish_page_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_parish_page_updated_at
on public.parish_pages;

create trigger set_parish_page_updated_at
before update on public.parish_pages
for each row
execute function public.set_parish_page_updated_at();


-- Pages RLS

drop policy if exists "Public can view published parish pages"
on public.parish_pages;

create policy "Public can view published parish pages"
on public.parish_pages
for select
using (
  published = true
  or public.is_active_admin()
);


drop policy if exists "Admins can insert parish pages"
on public.parish_pages;

create policy "Admins can insert parish pages"
on public.parish_pages
for insert
to authenticated
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can update parish pages"
on public.parish_pages;

create policy "Admins can update parish pages"
on public.parish_pages
for update
to authenticated
using (
  public.is_active_admin()
)
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can delete parish pages"
on public.parish_pages;

create policy "Admins can delete parish pages"
on public.parish_pages
for delete
to authenticated
using (
  public.is_active_admin()
);


-- Sections RLS

drop policy if exists "Public can view published parish sections"
on public.parish_page_sections;

create policy "Public can view published parish sections"
on public.parish_page_sections
for select
using (
  exists (
    select 1
    from public.parish_pages p
    where p.id = parish_page_sections.page_id
      and (
        p.published = true
        or public.is_active_admin()
      )
  )
);


drop policy if exists "Admins can insert parish sections"
on public.parish_page_sections;

create policy "Admins can insert parish sections"
on public.parish_page_sections
for insert
to authenticated
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can update parish sections"
on public.parish_page_sections;

create policy "Admins can update parish sections"
on public.parish_page_sections
for update
to authenticated
using (
  public.is_active_admin()
)
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can delete parish sections"
on public.parish_page_sections;

create policy "Admins can delete parish sections"
on public.parish_page_sections
for delete
to authenticated
using (
  public.is_active_admin()
);


-- Existing pages

insert into public.parish_pages (
  slug,
  title,
  eyebrow,
  intro,
  published
)
values
(
  'about',
  'About Our Parish',
  'Our community',
  'St. Francis of Assisi Parish serves the Catholic community in Stykkishólmur and the surrounding area.',
  true
),
(
  'st-francis',
  'St. Francis of Assisi',
  'Our patron saint',
  'St. Francis of Assisi is known for his simplicity, humility and love for God, people and creation.',
  true
),
(
  'churches',
  'Our Churches',
  'Places of worship',
  'Discover the churches and places of worship connected with our parish.',
  true
),
(
  'clergy',
  'Clergy',
  'Serving our parish',
  'Meet the priest serving St. Francis of Assisi Parish in Stykkishólmur.',
  true
)
on conflict (slug) do nothing;


-- About

insert into public.parish_page_sections (
  page_id,
  heading,
  text,
  sort_order
)
select
  id,
  'A welcoming parish',
  'Our parish is a place of prayer, worship and community for residents and visitors alike.',
  0
from public.parish_pages
where slug = 'about'
and not exists (
  select 1
  from public.parish_page_sections s
  where s.page_id = parish_pages.id
    and s.sort_order = 0
);

insert into public.parish_page_sections (
  page_id,
  heading,
  text,
  sort_order
)
select
  id,
  'Faith by Breiðafjörður',
  'We gather for Holy Mass, parish events and moments of fellowship throughout the year.',
  1
from public.parish_pages
where slug = 'about'
and not exists (
  select 1
  from public.parish_page_sections s
  where s.page_id = parish_pages.id
    and s.sort_order = 1
);


-- St Francis

insert into public.parish_page_sections (
  page_id,
  heading,
  text,
  sort_order
)
select
  id,
  'A life of simplicity',
  'Francis chose a life of prayer, service and simplicity, becoming one of the most beloved saints in the Catholic Church.',
  0
from public.parish_pages
where slug = 'st-francis'
and not exists (
  select 1
  from public.parish_page_sections s
  where s.page_id = parish_pages.id
    and s.sort_order = 0
);

insert into public.parish_page_sections (
  page_id,
  heading,
  text,
  sort_order
)
select
  id,
  'Our inspiration',
  'His example continues to inspire our parish community to live with faith, gratitude and care for others.',
  1
from public.parish_pages
where slug = 'st-francis'
and not exists (
  select 1
  from public.parish_page_sections s
  where s.page_id = parish_pages.id
    and s.sort_order = 1
);


-- Churches

insert into public.parish_page_sections (
  page_id,
  heading,
  text,
  sort_order
)
select
  id,
  'St. Francis of Assisi',
  'Our parish church is located in Stykkishólmur and serves as the main place for Holy Mass and parish celebrations.',
  0
from public.parish_pages
where slug = 'churches'
and not exists (
  select 1
  from public.parish_page_sections s
  where s.page_id = parish_pages.id
    and s.sort_order = 0
);


-- Clergy

insert into public.parish_page_sections (
  page_id,
  heading,
  text,
  sort_order
)
select
  id,
  'Rev. Krzysztof Sliwa',
  'Parish priest serving the Catholic community in Stykkishólmur and the surrounding area.',
  0
from public.parish_pages
where slug = 'clergy'
and not exists (
  select 1
  from public.parish_page_sections s
  where s.page_id = parish_pages.id
    and s.sort_order = 0
);
