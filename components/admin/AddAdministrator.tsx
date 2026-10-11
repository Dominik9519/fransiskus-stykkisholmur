'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddAdministrator() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    const response = await fetch('/api/admin/users/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      setError(result.error || 'Unable to add administrator.')
      setLoading(false)
      return
    }

    setOpen(false)
    setFullName('')
    setEmail('')
    setLoading(false)

    router.refresh()
  }

  return (
    <>
      <button
        className="admin-button admin-button-auto"
        type="button"
        onClick={() => setOpen(true)}
      >
        Add administrator
      </button>

      {open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h2>Add administrator</h2>

            <p>
              The administrator will receive an invitation by email.
            </p>

            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="admin-field">
                <label htmlFor="admin-name">
                  Name
                </label>

                <input
                  id="admin-name"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Rev. Krzysztof Sliwa"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="admin-email">
                  Email
                </label>

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="priest@example.com"
                  required
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-button admin-button-auto"
                  disabled={loading}
                >
                  {loading
                    ? 'Sending invitation…'
                    : 'Send invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
