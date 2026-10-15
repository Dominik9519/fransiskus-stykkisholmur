import { createPublicClient } from '../supabase/public'

export type MassService = {
  time: string
  church: string
  location: string
  language: string
}

export type MassDay = {
  day: string
  services: MassService[]
}

export async function getPublishedMassTimes(): Promise<MassDay[]> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('mass_times')
    .select(
      'day_of_week, day_name, time, church, location, language, sort_order'
    )
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('time', { ascending: true })

  if (error) {
    throw new Error(`Unable to load Mass Times: ${error.message}`)
  }

  const grouped = new Map<string, MassDay>()

  for (const mass of data ?? []) {
    if (!grouped.has(mass.day_name)) {
      grouped.set(mass.day_name, {
        day: mass.day_name,
        services: [],
      })
    }

    grouped.get(mass.day_name)!.services.push({
      time: mass.time.slice(0, 5),
      church: mass.church,
      location: mass.location,
      language: mass.language,
    })
  }

  return Array.from(grouped.values())
}
