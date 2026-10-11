'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../../lib/supabase/client'
import { useRouter } from 'next/navigation'


export default function ForgotPasswordPage() {
  const supabase = createClient()

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    const redirectTo = `${window.location.origin}/auth/callback?next=/admin/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
  setError('Unable to send password reset email. Please try again later.')
  setLoading(false)
  return
}

    sessionStorage.setItem('passwordResetEmail', email)

router.push('/admin/verify-reset')
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/fransiskus-logo.webp" alt="St. Francis of Assisi" />
          <h1>Reset password</h1>
          <p>St. Francis of Assisi · Stykkishólmur</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {message && (
          <div
            style={{
              background: '#eef8f0',
              color: '#246437',
              border: '1px solid #cce7d3',
              padding: '11px 13px',
              borderRadius: '9px',
              marginBottom: '16px',
              fontSize: '.9rem',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleReset}>
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

          <button className="admin-button" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <Link className="admin-forgot" href="/admin/login">
          Back to sign in
        </Link>
      </section>
    </main>
  )
}
