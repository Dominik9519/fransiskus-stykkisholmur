import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'
import AddAdministrator from '../../../../components/admin/AddAdministrator'
import UserStatusButton from '../../../../components/admin/UserStatusButton'
import RemoveUserButton from '../../../../components/admin/RemoveUserButton'
import PasswordResetButton from '../../../../components/admin/PasswordResetButton'

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
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
    redirect('/admin')
  }

  const { data: aal } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  if (!aal || aal.currentLevel !== 'aal2') {
    redirect('/admin/mfa/verify')
  }

  const {
    data: { users },
    error: usersError,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  })

  if (usersError) {
    throw new Error(usersError.message)
  }

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, full_name, role, active, created_at')

  if (profilesError) {
    throw new Error(profilesError.message)
  }

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile])
  )

  return (
    <>
      <div className="admin-heading">
        <h1>Users & Access</h1>
        <p>Manage administrators who have access to the parish website.</p>
      </div>

      <div className="admin-users-toolbar">
        <div>
          <strong>{users.length}</strong>
          <span> administrator account{users.length === 1 ? '' : 's'}</span>
        </div>

       <AddAdministrator />
     </div>

      <div className="admin-users-list">
        {users.map((authUser) => {
          const profile = profileMap.get(authUser.id)

          return (
            <div className="admin-user-card" key={authUser.id}>
              <div className="admin-user-main">
                <div className="admin-user-avatar">
                  {(profile?.full_name || authUser.email || '?')
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {profile?.full_name || 'Administrator'}
                  </strong>

                  <span>{authUser.email}</span>
                </div>
              </div>

              <div className="admin-user-meta">
                <span
                  className={`admin-user-role ${
                    profile?.role === 'superadmin'
                      ? 'admin-user-role-super'
                      : ''
                  }`}
                >
                  {profile?.role === 'superadmin'
                    ? 'SUPERADMIN'
                    : 'ADMIN'}
                </span>

                <span
                  className={`admin-user-status ${
                    profile?.active
                      ? 'admin-user-active'
                      : 'admin-user-disabled'
                  }`}
                >
                  {profile?.active ? 'Active' : 'Disabled'}
                </span>
              </div>

<div className="admin-user-details">
  <span>
    Last sign in:{' '}
    {authUser.last_sign_in_at
      ? new Date(authUser.last_sign_in_at).toLocaleString()
      : 'Never'}
  </span>

{profile?.role !== 'superadmin' && (
<div className="admin-user-action-group">
  <PasswordResetButton userId={authUser.id} />

  <UserStatusButton
    userId={authUser.id}
    active={profile?.active ?? false}
  />

  <RemoveUserButton
    userId={authUser.id}
    name={profile?.full_name || authUser.email || 'this administrator'}
  />
</div>
)}

</div>
            </div>
          )
        })}
      </div>
    </>
  )
}
