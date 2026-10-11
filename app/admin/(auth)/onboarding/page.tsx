'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'

export default function AdminOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<1 | 2>(1)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/admin/login')
        return
      }

      setEmail(user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      setName(profile?.full_name || '')
      setLoading(false)
    }

    loadUser()
  }, [router, supabase])

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 10) {
      setError('Password must contain at least 10 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError('Unable to save password.')
      setLoading(false)
      return
    }

    setPassword('')
    setConfirmPassword('')
    setStep(2)
    setLoading(false)
  }

  async function addPasskey() {
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.registerPasskey()

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  if (loading && !email) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <p style={{ textAlign: 'center' }}>Loading…</p>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <img
            src="/fransiskus-logo.webp"
            alt="St. Francis of Assisi"
          />

          <h1>
            {step === 1
              ? 'Welcome to Parish Administration'
              : 'Secure your account'}
          </h1>

          <p>
            {name ? `${name} · ` : ''}
            St. Francis of Assisi
          </p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {step === 1 && (
          <>
            <p
              style={{
                color: '#687386',
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              Your administrator account has been created for {email}.
              First, create an emergency password for your account.
            </p>

            <form onSubmit={savePassword}>
              <div className="admin-field">
                <label htmlFor="password">Create password</label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="confirmPassword">
                  Repeat password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                />
              </div>

              <button
                className="admin-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Saving…'
                  : 'Continue'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p
              style={{
                color: '#687386',
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              Add a passkey for quick and secure sign in.
              You can use Face ID, Touch ID, Android fingerprint,
              Windows Hello or your phone.
            </p>

            <button
              className="admin-button"
              type="button"
              onClick={addPasskey}
              disabled={loading}
            >
              {loading
                ? 'Preparing passkey…'
                : '🔑 Add Passkey'}
            </button>

            <p
              style={{
                marginTop: 18,
                textAlign: 'center',
                color: '#7a8492',
                fontSize: '.82rem',
                lineHeight: 1.5,
              }}
            >
              Your password remains available as an emergency
              recovery method.
            </p>
          </>
        )}
      </section>
    </main>
  )
}
