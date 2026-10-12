import { createClient } from '../supabase/server'

export type PublicGalleryPhoto = {
  id: string
  image_url: string
  caption: string | null
  sort_order: number
}

export type PublicGalleryAlbum = {
  id: string
  slug: string
  title: string
  album_date: string
  cover_image_url: string | null
  gallery_photos: {
    id: string
  }[]
}

export async function getPublishedGalleryAlbums(): Promise<
  PublicGalleryAlbum[]
> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('gallery_albums')
    .select(`
      id,
      slug,
      title,
      album_date,
      cover_image_url,
      gallery_photos (
        id
      )
    `)
    .eq('published', true)
    .order('album_date', { ascending: false })

  if (error) {
    throw new Error(`Unable to load gallery: ${error.message}`)
  }

  return data ?? []
}

export async function getPublishedGalleryAlbumBySlug(
  slug: string
) {
  const supabase = await createClient()

  const { data: album, error: albumError } = await supabase
    .from('gallery_albums')
    .select(`
      id,
      slug,
      title,
      album_date,
      cover_image_url
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (albumError) {
    throw new Error(
      `Unable to load gallery album: ${albumError.message}`
    )
  }

  if (!album) {
    return null
  }

  const { data: photos, error: photosError } = await supabase
    .from('gallery_photos')
    .select(`
      id,
      image_url,
      caption,
      sort_order
    `)
    .eq('album_id', album.id)
    .order('sort_order', { ascending: true })

  if (photosError) {
    throw new Error(
      `Unable to load gallery photos: ${photosError.message}`
    )
  }

  return {
    ...album,
    photos: photos ?? [],
  }
}

export function formatGalleryDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
