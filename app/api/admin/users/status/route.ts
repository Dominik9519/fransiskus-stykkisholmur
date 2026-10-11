import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../../lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', user.id)
    .single()

  if (
    !currentProfile ||
    !currentProfile.active ||
    currentProfile.role !== 'superadmin'
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: aal } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  if (!aal || aal.currentLevel !== 'aal2') {
    return NextResponse.json(
      { error: 'MFA required' },
      { status: 403 }
    )
  }

  const body = await request.json()

  const userId = String(body.userId || '')
  const active = body.active === true

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required.' },
      { status: 400 }
    )
  }

  if (userId === user.id) {
    return NextResponse.json(
      { error: 'You cannot disable your own superadmin account.' },
      { status: 400 }
    )
  }

  const { data: targetProfile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (!targetProfile) {
    return NextResponse.json(
      { error: 'Administrator not found.' },
      { status: 404 }
    )
  }

  if (targetProfile.role === 'superadmin') {
    return NextResponse.json(
      { error: 'Superadmin accounts cannot be disabled here.' },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
