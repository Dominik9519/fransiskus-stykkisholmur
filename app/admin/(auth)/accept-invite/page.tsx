'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client'

export default function AcceptInvitePage() {
  const router = useRouter()
  const supabase = createClient()

  const [tokenHash, setTokenHash] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token_hash')

    if (token) {
      setTokenHash(token)
    } else {
      setError('This invitation link is invalid.')
    }
  }, [])

  async function acceptInvite() {
    if (!tokenHash) return

    setError('')
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'invite',
    })

    if (error) {
      setError('This invitation is invalid or has expired.')
      setLoading(false)
      return
    }

    router.replace('/admin/onboarding')
    router.refresh()
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/fransiskus-logo.webp" alt="St. Francis of Assisi" />
          <h1>Administrator invitation</h1>
          <p>St. Francis of Assisi · Stykkishólmur</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {!error && (
          <>
            <p
              style={{
                color: '#687386',
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              You have been invited to manage the parish website.
              Continue to set up your account.
            </p>

            <button
              className="admin-button"
              type="button"
              onClick={acceptInvite}
              disabled={loading || !tokenHash}
            >
              {loading ? 'Accepting invitation…' : 'Accept invitation'}
            </button>
          </>
        )}
      </section>
    </main>
  )
}
