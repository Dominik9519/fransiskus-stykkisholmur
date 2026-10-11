'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RemoveUserButton({
  userId,
  name,
}: {
  userId: string
  name: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function removeUser() {
    const confirmed = confirm(
      `Permanently remove ${name} from Parish Administration?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setLoading(true)
    setError('')

    const response = await fetch('/api/admin/users/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result.error || 'Unable to remove administrator.')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="admin-remove-user">
      <button
        type="button"
        className="admin-user-action admin-user-action-remove"
        onClick={removeUser}
        disabled={loading}
      >
        {loading ? 'Removing…' : 'Remove'}
      </button>

      {error && (
        <span className="admin-user-action-error">
          {error}
        </span>
      )}
    </div>
  )
}
