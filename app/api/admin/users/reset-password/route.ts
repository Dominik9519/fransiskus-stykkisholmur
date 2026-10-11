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

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required.' },
      { status: 400 }
    )
  }

  const { data: targetProfile, error: profileError } =
    await supabaseAdmin
      .from('profiles')
      .select('email, role')
      .eq('id', userId)
      .single()

  if (profileError || !targetProfile?.email) {
    return NextResponse.json(
      { error: 'Administrator not found.' },
      { status: 404 }
    )
  }

  if (targetProfile.role === 'superadmin') {
    return NextResponse.json(
      { error: 'Superadmin password recovery is managed separately.' },
      { status: 400 }
    )
  }

  const { error: resetError } =
    await supabaseAdmin.auth.resetPasswordForEmail(
      targetProfile.email
    )

  if (resetError) {
    return NextResponse.json(
      { error: resetError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
