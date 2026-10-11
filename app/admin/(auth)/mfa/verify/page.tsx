'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../../lib/supabase/client'

export default function MFAVerifyPage() {
  const router = useRouter()
  const supabase = createClient()

  const [factorId, setFactorId] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFactor() {
      const { data, error } = await supabase.auth.mfa.listFactors()

      if (error) {
        setError('Unable to load MFA configuration.')
        setLoading(false)
        return
      }

      const factor = data.totp.find(
        (item) => item.status === 'verified'
      )

      if (!factor) {
        router.replace('/admin/mfa/setup')
        return
      }

      setFactorId(factor.id)
      setLoading(false)
    }

    loadFactor()
  }, [router, supabase])

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    })

    if (error) {
      setError('Incorrect verification code. Please try again.')
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
          <h1>Two-factor authentication</h1>
          <p>Enter the 6-digit code from your authenticator app.</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={verify}>
          <div className="admin-field">
            <label htmlFor="code">Verification code</label>

            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ''))
              }
              autoFocus
              required
            />
          </div>

          <button
            className="admin-button"
            type="submit"
            disabled={loading || code.length !== 6 || !factorId}
          >
            {loading ? 'Checking…' : 'Verify and continue'}
          </button>
        </form>
      </section>
    </main>
  )
}
