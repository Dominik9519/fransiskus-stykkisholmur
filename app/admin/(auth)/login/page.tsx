'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

async function handleLogin(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setError('')
  setLoading(true)

  const { error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (loginError) {
    setError('Incorrect email address or password.')
    setLoading(false)
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    await supabase.auth.signOut()
    setError('Unable to verify your account.')
    setLoading(false)
    return
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', user.id)
    .single()

  if (
    !profile ||
    !profile.active ||
    !['admin', 'superadmin'].includes(profile.role)
  ) {
    await supabase.auth.signOut()
    setError('This account does not have access to the administration panel.')
    setLoading(false)
    return
  }

  router.replace('/admin')
  router.refresh()
}

async function handlePasskeyLogin() {
  setError('')
  setLoading(true)

  const { error } = await supabase.auth.signInWithPasskey()

  if (error) {
    setError('Passkey sign-in was cancelled or failed.')
    setLoading(false)
    return
  }

  router.replace('/admin')
  router.refresh()
}

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/fransiskus-logo.webp" alt="St. Francis of Assisi" />
          <h1>Parish Administration</h1>
          <p>St. Francis of Assisi · Stykkishólmur</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

<button
  className="admin-button"
  type="button"
  onClick={handlePasskeyLogin}
  disabled={loading}
  style={{ marginBottom: '22px' }}
>
  🔑 Sign in with Passkey
</button>

        <form onSubmit={handleLogin}>
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button className="admin-button" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <a className="admin-forgot" href="/admin/forgot-password">
  Forgot password?
</a>
      </section>
    </main>
  )
}
