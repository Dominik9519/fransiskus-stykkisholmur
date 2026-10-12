import { createClient } from '../supabase/server'

export type ContactSettings = {
  id: number
  parish_name: string
  address: string
  postal_code: string
  priest: string
  phone: string
  email: string
  facebook_url: string | null
  maps_url: string | null
}

export async function getContactSettings(): Promise<ContactSettings> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contact_settings')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    throw new Error(
      `Unable to load contact settings: ${error.message}`
    )
  }

  return data
}
