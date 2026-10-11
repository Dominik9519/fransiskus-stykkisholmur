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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', user.id)
    .single()

  if (
    !profile ||
    !profile.active ||
    profile.role !== 'superadmin'
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

  const fullName = String(body.fullName || '').trim()
  const email = String(body.email || '').trim().toLowerCase()

  if (!fullName || !email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'Name and valid email are required.' },
      { status: 400 }
    )
  }

  const { data, error } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
      },
      redirectTo: `${request.nextUrl.origin}/admin/accept-invite`,
    })

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || 'Unable to create administrator.' },
      { status: 400 }
    )
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      full_name: fullName,
      role: 'admin',
      active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.user.id)

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
  })
}
