'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'

export default function VerifyResetPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('passwordResetEmail')

    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (!email) {
      setError('Please start the password reset process again.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'recovery',
    })

    if (error) {
      setError('The verification code is incorrect or has expired.')
      setLoading(false)
      return
    }

    sessionStorage.removeItem('passwordResetEmail')

    router.replace('/admin/reset-password')
    router.refresh()
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/fransiskus-logo.webp" alt="St. Francis of Assisi" />
          <h1>Enter verification code</h1>
          <p>Check your email for the password reset code.</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

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

 <form onSubmit={handleVerify}>
          <div className="admin-field">
            <label htmlFor="code">Verification code</label>

            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </div>

          <button className="admin-button" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify code'}
          </button>
        </form>

        <a className="admin-forgot" href="/admin/forgot-password">
          Send a new code
        </a>
      </section>
    </main>
  )
}
