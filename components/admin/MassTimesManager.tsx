'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type MassTime = {
  id: string
  day_of_week: number
  day_name: string
  time: string
  church: string
  location: string
  language: string
  published: boolean
  sort_order: number
}

const days = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

export default function MassTimesManager({
  initialMasses,
}: {
  initialMasses: MassTime[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MassTime | null>(null)
  const [dayOfWeek, setDayOfWeek] = useState(0)
  const [time, setTime] = useState('11:00')
  const [church, setChurch] = useState('St. Francis of Assisi')
  const [location, setLocation] = useState('Stykkishólmur')
  const [language, setLanguage] = useState('Icelandic')
  const [published, setPublished] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function openNew() {
    setEditing(null)
    setDayOfWeek(0)
    setTime('11:00')
    setChurch('St. Francis of Assisi')
    setLocation('Stykkishólmur')
    setLanguage('Icelandic')
    setPublished(true)
    setError('')
    setOpen(true)
  }

  function openEdit(mass: MassTime) {
    setEditing(mass)
    setDayOfWeek(mass.day_of_week)
    setTime(mass.time.slice(0, 5))
    setChurch(mass.church)
    setLocation(mass.location)
    setLanguage(mass.language)
    setPublished(mass.published)
    setError('')
    setOpen(true)
  }

  async function saveMass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const dayName =
      days.find((day) => day.value === dayOfWeek)?.label || 'Sunday'

    const payload = {
      day_of_week: dayOfWeek,
      day_name: dayName,
      time,
      church: church.trim(),
      location: location.trim(),
      language: language.trim(),
      published,
      sort_order: dayOfWeek,
    }

    const result = editing
      ? await supabase
          .from('mass_times')
          .update(payload)
          .eq('id', editing.id)
      : await supabase
          .from('mass_times')
          .insert(payload)

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
      return
    }

    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  async function deleteMass(mass: MassTime) {
    if (
      !confirm(
        `Delete ${mass.day_name} Mass at ${mass.time.slice(0, 5)}?`
      )
    ) {
      return
    }

    const { error } = await supabase
      .from('mass_times')
      .delete()
      .eq('id', mass.id)

    if (error) {
      alert(error.message)
      return
    }

    router.refresh()
  }

  return (
    <>
      <div className="admin-users-toolbar">
        <div>
          <strong>{initialMasses.length}</strong>
          <span> Mass time{initialMasses.length === 1 ? '' : 's'}</span>
        </div>

        <button
          className="admin-button admin-button-auto"
          type="button"
          onClick={openNew}
        >
          Add Mass
        </button>
      </div>

      <div className="admin-mass-list">
        {initialMasses.map((mass) => (
          <div className="admin-mass-card" key={mass.id}>
            <div className="admin-mass-day">
              <strong>{mass.day_name}</strong>
              <span>{mass.time.slice(0, 5)}</span>
            </div>

            <div className="admin-mass-info">
              <strong>{mass.church}</strong>
              <span>
                {mass.location} · {mass.language}
              </span>
            </div>

            <div className="admin-mass-status">
              <span
                className={
                  mass.published
                    ? 'admin-user-status admin-user-active'
                    : 'admin-user-status admin-user-disabled'
                }
              >
                {mass.published ? 'Published' : 'Hidden'}
              </span>

              <button
                type="button"
                className="admin-user-action"
                onClick={() => openEdit(mass)}
              >
                Edit
              </button>

              <button
                type="button"
                className="admin-user-action admin-user-action-remove"
                onClick={() => deleteMass(mass)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h2>{editing ? 'Edit Mass' : 'Add Mass'}</h2>
            <p>
              {editing
                ? 'Update this Mass schedule entry.'
                : 'Add a new Mass to the parish schedule.'}
            </p>

            {error && <div className="admin-error">{error}</div>}

            <form onSubmit={saveMass}>
              <div className="admin-field">
                <label htmlFor="mass-day">Day</label>

                <select
                  id="mass-day"
                  value={dayOfWeek}
                  onChange={(event) =>
                    setDayOfWeek(Number(event.target.value))
                  }
                >
                  {days.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label htmlFor="mass-time">Time</label>

                <input
                  id="mass-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="mass-church">Church</label>

                <input
                  id="mass-church"
                  value={church}
                  onChange={(event) => setChurch(event.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="mass-location">Location</label>

                <input
                  id="mass-location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="mass-language">Language</label>

                <input
                  id="mass-language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  required
                />
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(event.target.checked)
                  }
                />

                <span>Published on website</span>
              </label>

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
                    ? 'Saving…'
                    : editing
                      ? 'Save changes'
                      : 'Add Mass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
