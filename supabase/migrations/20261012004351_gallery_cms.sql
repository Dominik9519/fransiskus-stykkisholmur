create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  album_date date not null,
  cover_image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null
    references public.gallery_albums(id)
    on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;


-- updated_at

create or replace function public.set_gallery_album_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_gallery_album_updated_at
on public.gallery_albums;

create trigger set_gallery_album_updated_at
before update on public.gallery_albums
for each row
execute function public.set_gallery_album_updated_at();


-- Album RLS

drop policy if exists "Public can view published gallery albums"
on public.gallery_albums;

create policy "Public can view published gallery albums"
on public.gallery_albums
for select
using (
  published = true
  or public.is_active_admin()
);


drop policy if exists "Admins can insert gallery albums"
on public.gallery_albums;

create policy "Admins can insert gallery albums"
on public.gallery_albums
for insert
to authenticated
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can update gallery albums"
on public.gallery_albums;

create policy "Admins can update gallery albums"
on public.gallery_albums
for update
to authenticated
using (
  public.is_active_admin()
)
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can delete gallery albums"
on public.gallery_albums;

create policy "Admins can delete gallery albums"
on public.gallery_albums
for delete
to authenticated
using (
  public.is_active_admin()
);


-- Photo RLS

drop policy if exists "Public can view photos from published albums"
on public.gallery_photos;

create policy "Public can view photos from published albums"
on public.gallery_photos
for select
using (
  exists (
    select 1
    from public.gallery_albums album
    where album.id = gallery_photos.album_id
      and (
        album.published = true
        or public.is_active_admin()
      )
  )
);


drop policy if exists "Admins can insert gallery photos"
on public.gallery_photos;

create policy "Admins can insert gallery photos"
on public.gallery_photos
for insert
to authenticated
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can update gallery photos"
on public.gallery_photos;

create policy "Admins can update gallery photos"
on public.gallery_photos
for update
to authenticated
using (
  public.is_active_admin()
)
with check (
  public.is_active_admin()
);


drop policy if exists "Admins can delete gallery photos"
on public.gallery_photos;

create policy "Admins can delete gallery photos"
on public.gallery_photos
for delete
to authenticated
using (
  public.is_active_admin()
);


-- Seed existing albums

insert into public.gallery_albums (
  slug,
  title,
  album_date,
  cover_image_url,
  published
)
values
(
  'parish-life',
  'Parish Life',
  '2027-01-01',
  '/stykkisholmur-panorama.jpg',
  true
),
(
  'christmas-2026',
  'Christmas 2026',
  '2026-12-01',
  '/church.jpg',
  true
)
on conflict (slug) do nothing;


-- Seed existing photos

insert into public.gallery_photos (
  album_id,
  image_url,
  sort_order
)
select
  id,
  '/stykkisholmur-panorama.jpg',
  0
from public.gallery_albums
where slug = 'parish-life'
and not exists (
  select 1
  from public.gallery_photos
  where album_id = gallery_albums.id
    and image_url = '/stykkisholmur-panorama.jpg'
);

insert into public.gallery_photos (
  album_id,
  image_url,
  sort_order
)
select
  id,
  '/church.jpg',
  1
from public.gallery_albums
where slug = 'parish-life'
and not exists (
  select 1
  from public.gallery_photos
  where album_id = gallery_albums.id
    and image_url = '/church.jpg'
);

insert into public.gallery_photos (
  album_id,
  image_url,
  sort_order
)
select
  id,
  '/church.jpg',
  0
from public.gallery_albums
where slug = 'christmas-2026'
and not exists (
  select 1
  from public.gallery_photos
  where album_id = gallery_albums.id
    and image_url = '/church.jpg'
);

insert into public.gallery_photos (
  album_id,
  image_url,
  sort_order
)
select
  id,
  '/stykkisholmur-panorama.jpg',
  1
from public.gallery_albums
where slug = 'christmas-2026'
and not exists (
  select 1
  from public.gallery_photos
  where album_id = gallery_albums.id
    and image_url = '/stykkisholmur-panorama.jpg'
);


-- Storage bucket

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'gallery-images',
  'gallery-images',
  true,
  12582912,
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

drop policy if exists "Public can view gallery images"
on storage.objects;

create policy "Public can view gallery images"
on storage.objects
for select
using (
  bucket_id = 'gallery-images'
);


drop policy if exists "Admins can upload gallery images"
on storage.objects;

create policy "Admins can upload gallery images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery-images'
  and public.is_active_admin()
);


drop policy if exists "Admins can update gallery images"
on storage.objects;

create policy "Admins can update gallery images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gallery-images'
  and public.is_active_admin()
)
with check (
  bucket_id = 'gallery-images'
  and public.is_active_admin()
);


drop policy if exists "Admins can delete gallery images"
on storage.objects;

create policy "Admins can delete gallery images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gallery-images'
  and public.is_active_admin()
);
