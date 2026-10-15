'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '../supabase/server'

export async function refreshHomepageCache() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', user.id)
    .single()

  if (
    error ||
    !profile?.active ||
    !['admin', 'superadmin'].includes(profile.role)
  ) {
    throw new Error('Forbidden')
  }

  updateTag('homepage-data')
  revalidatePath('/')
}
