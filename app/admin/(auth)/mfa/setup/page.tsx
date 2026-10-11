'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../../lib/supabase/client'

export default function MFASetupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [factorId, setFactorId] = useState('')
  const [qr, setQr] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function startSetup() {
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'St Francis Admin',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setFactorId(data.id)
    setQr(data.totp.qr_code)
    setSecret(data.totp.secret)
    setLoading(false)
  }

  async function verifyMFA(event: FormEvent<HTMLFormElement>) {
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
          <h1>Secure your account</h1>
          <p>Enable two-factor authentication for the administration panel.</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {!factorId ? (
          <>
            <p style={{ lineHeight: 1.6, color: '#687386' }}>
              Use Apple Passwords, Google Authenticator, Microsoft Authenticator
              or another authenticator app.
            </p>

            <button
              className="admin-button"
              type="button"
              onClick={startSetup}
              disabled={loading}
            >
              {loading ? 'Preparing…' : 'Set up MFA'}
            </button>
          </>
        ) : (
          <>
            <div className="admin-mfa-qr">
              <img src={qr} alt="MFA QR code" />
            </div>

            <p className="admin-mfa-help">
              Scan this QR code with your authenticator app.
            </p>

            <details className="admin-mfa-secret">
              <summary>Cannot scan the QR code?</summary>
              <p>Enter this setup key manually:</p>
              <code>{secret}</code>
            </details>

            <form onSubmit={verifyMFA}>
              <div className="admin-field">
                <label htmlFor="code">6-digit verification code</label>
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
                  required
                />
              </div>

              <button
                className="admin-button"
                type="submit"
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Verifying…' : 'Enable MFA'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  )
}
