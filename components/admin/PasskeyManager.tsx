'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'

type Passkey = {
  id: string
  friendly_name?: string
  created_at: string
  last_used_at?: string
}

export default function PasskeyManager() {
  const supabase = createClient()

  const [passkeys, setPasskeys] = useState<Passkey[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadPasskeys() {
    const { data, error } = await supabase.auth.passkey.list()

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setPasskeys(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadPasskeys()
  }, [])

  async function addPasskey() {
    setError('')
    setMessage('')

    const { data, error } = await supabase.auth.registerPasskey()

    if (error) {
      setError(error.message)
      return
    }

    setMessage(`Passkey added: ${data.friendly_name || 'New passkey'}`)
    await loadPasskeys()
  }

  async function removePasskey(id: string) {
    if (!confirm('Remove this passkey?')) return

    const { error } = await supabase.auth.passkey.delete({
      passkeyId: id,
    })

    if (error) {
      setError(error.message)
      return
    }

    await loadPasskeys()
  }

  return (
    <div style={{ marginTop: 28, maxWidth: 700 }}>
      <div className="admin-dashboard-card">
        <strong>Passkeys</strong>
        <span>
          Sign in using Face ID, Touch ID, Windows Hello or your phone.
        </span>

        {error && <div className="admin-error" style={{ marginTop: 18 }}>{error}</div>}

        {message && (
          <div style={{
            marginTop: 18,
            padding: 12,
            borderRadius: 9,
            background: '#eef8f0',
            color: '#246437'
          }}>
            {message}
          </div>
        )}

        <button
          className="admin-button"
          type="button"
          onClick={addPasskey}
          style={{ marginTop: 20 }}
        >
          Add passkey
        </button>
      </div>

      {!loading && passkeys.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {passkeys.map((passkey) => (
            <div
              key={passkey.id}
              className="admin-dashboard-card"
              style={{ marginBottom: 12 }}
            >
              <strong>{passkey.friendly_name || 'Passkey'}</strong>

              <span>
                Added {new Date(passkey.created_at).toLocaleDateString()}
              </span>

              <button
                type="button"
                onClick={() => removePasskey(passkey.id)}
                style={{
                  marginTop: 14,
                  border: '1px solid #d8dde3',
                  background: 'white',
                  borderRadius: 8,
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
