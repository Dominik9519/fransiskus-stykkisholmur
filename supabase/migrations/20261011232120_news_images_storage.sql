insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'news-images',
  'news-images',
  true,
  8388608,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do nothing;


create policy "Public can view news images"
on storage.objects
for select
using (
  bucket_id = 'news-images'
);


create policy "Admins can upload news images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'news-images'
  and public.is_active_admin()
);


create policy "Admins can update news images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'news-images'
  and public.is_active_admin()
)
with check (
  bucket_id = 'news-images'
  and public.is_active_admin()
);


create policy "Admins can delete news images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'news-images'
  and public.is_active_admin()
);
