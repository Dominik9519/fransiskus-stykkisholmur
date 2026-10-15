'use client'
import { refreshHomepageCache } from '../../lib/actions/cache'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type LiveSettings = {
  id: number
  title: string
  description: string
  youtube_url: string | null
  live_now: boolean
  scheduled_at: string | null
}

function toLocalDateTime(value: string | null) {
  if (!value) return ''

  const date = new Date(value)

  const pad = (number: number) =>
    String(number).padStart(2, '0')

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

export default function LiveStreamManager({
  initialSettings,
}: {
  initialSettings: LiveSettings
}) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(
    initialSettings.title
  )

  const [description, setDescription] = useState(
    initialSettings.description
  )

  const [youtubeUrl, setYoutubeUrl] = useState(
    initialSettings.youtube_url || ''
  )

  const [liveNow, setLiveNow] = useState(
    initialSettings.live_now
  )

  const [scheduledAt, setScheduledAt] = useState(
    toLocalDateTime(initialSettings.scheduled_at)
  )

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function save(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setSaved(false)
    setError('')

    try {
      const { error } = await supabase
        .from('live_stream_settings')
        .update({
          title: title.trim(),
          description: description.trim(),
          youtube_url:
            youtubeUrl.trim() || null,
          live_now: liveNow,
          scheduled_at: scheduledAt
            ? new Date(scheduledAt).toISOString()
            : null,
        })
        .eq('id', 1)

      if (error) {
        throw error
      }

      try {
        await refreshHomepageCache()
      } catch (cacheError) {
        console.error('Homepage cache refresh failed:', cacheError)
      }
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save live stream settings.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="admin-live-form"
      onSubmit={save}
    >
      {error && (
        <div className="admin-error">{error}</div>
      )}

      {saved && (
        <div className="admin-success">
          Live stream settings saved.
        </div>
      )}

      <div className="admin-field">
        <label htmlFor="live-title">
          Stream title
        </label>

        <input
          id="live-title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="live-description">
          Description
        </label>

        <textarea
          id="live-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={4}
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="live-youtube">
          YouTube link
        </label>

        <input
          id="live-youtube"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(event) =>
            setYoutubeUrl(event.target.value)
          }
        />

        <small>
          Paste the normal YouTube video or live stream link.
        </small>
      </div>

      <div className="admin-field">
        <label htmlFor="live-scheduled">
          Scheduled broadcast
        </label>

        <input
          id="live-scheduled"
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) =>
            setScheduledAt(event.target.value)
          }
        />
      </div>

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={liveNow}
          onChange={(event) =>
            setLiveNow(event.target.checked)
          }
        />

        <span>Live now</span>
      </label>

      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <button
          type="submit"
          className="admin-button admin-button-auto"
          disabled={loading}
        >
          {loading
            ? 'Saving…'
            : 'Save Live Stream'}
        </button>

        {liveNow && (
          <span className="admin-user-status admin-user-active">
            ● LIVE
          </span>
        )}
      </div>
    </form>
  )
}
