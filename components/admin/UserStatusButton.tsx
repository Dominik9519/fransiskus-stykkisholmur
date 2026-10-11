'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UserStatusButton({
  userId,
  active,
}: {
  userId: string
  active: boolean
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function changeStatus() {
    const action = active ? 'disable' : 'enable'

    if (
      !confirm(
        `Are you sure you want to ${action} this administrator?`
      )
    ) {
      return
    }

    setLoading(true)
    setError('')

    const response = await fetch('/api/admin/users/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        active: !active,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result.error || 'Unable to change account status.')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="admin-user-actions">
      <button
        type="button"
        className={
          active
            ? 'admin-user-action admin-user-action-danger'
            : 'admin-user-action admin-user-action-enable'
        }
        onClick={changeStatus}
        disabled={loading}
      >
        {loading
          ? 'Saving…'
          : active
            ? 'Disable account'
            : 'Enable account'}
      </button>

      {error && (
        <span className="admin-user-action-error">
          {error}
        </span>
      )}
    </div>
  )
}
