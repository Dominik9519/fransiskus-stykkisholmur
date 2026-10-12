import { createClient } from '../supabase/server'

export type LiveStreamSettings = {
  id: number
  title: string
  description: string
  youtube_url: string | null
  live_now: boolean
  scheduled_at: string | null
}

export async function getLiveStreamSettings(): Promise<LiveStreamSettings> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('live_stream_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    throw new Error(
      `Unable to load live stream settings: ${error.message}`
    )
  }

  return data
}

export function getYouTubeId(url: string | null) {
  if (!url) return null

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] || null
    }

    if (parsed.pathname.startsWith('/watch')) {
      return parsed.searchParams.get('v')
    }

    if (parsed.pathname.startsWith('/live/')) {
      return parsed.pathname.split('/live/')[1]?.split('/')[0] || null
    }

    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('/')[0] || null
    }

    return null
  } catch {
    return null
  }
}

export function formatLiveSchedule(value: string | null) {
  if (!value) return null

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Atlantic/Reykjavik',
  }).format(new Date(value))
}
