import { createPublicClient } from '../supabase/public'

export type PublicNewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image_url: string | null
  published_at: string
  show_on_homepage: boolean
}

export async function getPublishedNews(): Promise<PublicNewsItem[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('news')
    .select(
      'id, slug, title, excerpt, content, image_url, published_at, show_on_homepage'
    )
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    throw new Error(`Unable to load news: ${error.message}`)
  }

  return data ?? []
}

export async function getPublishedNewsBySlug(
  slug: string
): Promise<PublicNewsItem | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('news')
    .select(
      'id, slug, title, excerpt, content, image_url, published_at, show_on_homepage'
    )
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load news article: ${error.message}`)
  }

  return data
}

export async function getHomepageNews(): Promise<PublicNewsItem | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('news')
    .select(
      'id, slug, title, excerpt, content, image_url, published_at, show_on_homepage'
    )
    .eq('published', true)
    .eq('show_on_homepage', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load homepage news: ${error.message}`)
  }

  return data
}

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
