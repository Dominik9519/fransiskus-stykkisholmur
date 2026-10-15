import { createPublicClient } from '../supabase/public'

export type PublicEventItem = {
  id: string
  slug: string
  title: string
  event_date: string
  event_time: string | null
  location: string | null
  type: string | null
  excerpt: string | null
  content: string | null
  image_url: string | null
  show_on_homepage: boolean
}

export async function getPublishedEvents(): Promise<PublicEventItem[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('events')
    .select(
      'id, slug, title, event_date, event_time, location, type, excerpt, content, image_url, show_on_homepage'
    )
    .eq('published', true)
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true })

  if (error) {
    throw new Error(`Unable to load events: ${error.message}`)
  }

  return data ?? []
}

export async function getPublishedEventBySlug(
  slug: string
): Promise<PublicEventItem | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('events')
    .select(
      'id, slug, title, event_date, event_time, location, type, excerpt, content, image_url, show_on_homepage'
    )
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load event: ${error.message}`)
  }

  return data
}

export async function getHomepageEvents(): Promise<PublicEventItem[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('events')
    .select(
      'id, slug, title, event_date, event_time, location, type, excerpt, content, image_url, show_on_homepage'
    )
    .eq('published', true)
    .eq('show_on_homepage', true)
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true })
    .limit(3)

  if (error) {
    throw new Error(`Unable to load homepage events: ${error.message}`)
  }

  return data ?? []
}

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function formatEventTime(time: string | null) {
  if (!time) return ''
  return time.slice(0, 5)
}
