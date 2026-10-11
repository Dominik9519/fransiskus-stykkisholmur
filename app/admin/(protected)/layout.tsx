import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import LogoutButton from '../../../components/admin/LogoutButton'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, active')
    .eq('id', user.id)
    .single()

  if (
    !profile ||
    !profile.active ||
    !['admin', 'superadmin'].includes(profile.role)
  ) {
    redirect('/admin/login')
  }

if (profile.role === 'superadmin') {
  const { data: aal, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  if (aalError || !aal) {
    redirect('/admin/login')
  }

  if (aal.nextLevel === 'aal1') {
    redirect('/admin/mfa/setup')
  }

  if (aal.currentLevel !== 'aal2') {
    redirect('/admin/mfa/verify')
  }
}

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <strong>St. Francis Admin</strong>
          <span>STYKKISHÓLMUR</span>
        </div>

<nav className="admin-nav">
  <a href="/admin">Dashboard</a>
  <a href="/admin/mass-times">Mass Times</a>
  <a href="/admin/news">News</a>
  <a href="/admin/events">Events</a>
  <a href="/admin/live">Live Mass</a>
  <a href="/admin/gallery">Gallery</a>
  <a href="/admin/parish">Parish Pages</a>
  <a href="/admin/contact">Contact</a>

  <a href="/admin/security">Security</a>

  {profile.role === 'superadmin' && (
    <a href="/admin/users">Users & Access</a>
  )}
</nav>

        <LogoutButton />
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  )
}
