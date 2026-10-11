'use client'

import { useState } from 'react'

export default function PasswordResetButton({
  userId,
}: {
  userId: string
}) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function sendReset() {
    if (
      !confirm(
        'Send a password reset code to this administrator?'
      )
    ) {
      return
    }

    setLoading(true)
    setError('')
    setSent(false)

    const response = await fetch(
      '/api/admin/users/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      setError(result.error || 'Unable to send password reset.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="admin-reset-user">
      <button
        type="button"
        className="admin-user-action"
        onClick={sendReset}
        disabled={loading}
      >
        {loading
          ? 'Sending…'
          : sent
            ? 'Reset sent ✓'
            : 'Send password reset'}
      </button>

      {error && (
        <span className="admin-user-action-error">
          {error}
        </span>
      )}
    </div>
  )
}
