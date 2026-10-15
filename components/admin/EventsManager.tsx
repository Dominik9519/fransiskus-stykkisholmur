'use client'
import { refreshHomepageCache } from '../../lib/actions/cache'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type EventItem = {
  id: string
  slug: string
  title: string
  event_date: string
  event_time: string | null
  location: string | null
  type: string | null
  excerpt: string | null
  content: string | null
  image_url: string | null
  published: boolean
  show_on_homepage: boolean
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (
    extension &&
    ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
  ) {
    return extension
  }

  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'

  return 'jpg'
}

export default function EventsManager({
  initialEvents,
}: {
  initialEvents: EventItem[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<EventItem | null>(null)

  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  const [published, setPublished] = useState(true)
  const [showOnHomepage, setShowOnHomepage] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function openNew() {
    setEditing(null)
    setTitle('')
    setEventDate(new Date().toISOString().slice(0, 10))
    setEventTime('')
    setLocation('')
    setType('')
    setExcerpt('')
    setContent('')
    setImageUrl('')
    setImageFile(null)
    setImagePreview('')
    setPublished(true)
    setShowOnHomepage(false)
    setError('')
    setOpen(true)
  }

  function openEdit(item: EventItem) {
    setEditing(item)
    setTitle(item.title)
    setEventDate(item.event_date)
    setEventTime(item.event_time?.slice(0, 5) || '')
    setLocation(item.location || '')
    setType(item.type || '')
    setExcerpt(item.excerpt || '')
    setContent(item.content || '')
    setImageUrl(item.image_url || '')
    setImageFile(null)
    setImagePreview(item.image_url || '')
    setPublished(item.published)
    setShowOnHomepage(item.show_on_homepage)
    setError('')
    setOpen(true)
  }

  function handleImageChange(file: File | null) {
    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError('Please choose a JPG, PNG or WEBP image.')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be smaller than 8 MB.')
      return
    }

    setError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImageUrl('')
    setImagePreview('')
  }

  async function uploadImage() {
    if (!imageFile) {
      return imageUrl || null
    }

    const extension = getExtension(imageFile)

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: imageFile.type,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const uploadedImageUrl = await uploadImage()

      const payload = {
        slug: editing?.slug || makeSlug(title),
        title: title.trim(),
        event_date: eventDate,
        event_time: eventTime || null,
        location: location.trim() || null,
        type: type.trim() || null,
        excerpt: excerpt.trim() || null,
        content: content.trim() || null,
        image_url: uploadedImageUrl,
        published,
        show_on_homepage: showOnHomepage,
      }

      const result = editing
        ? await supabase
            .from('events')
            .update(payload)
            .eq('id', editing.id)
        : await supabase
            .from('events')
            .insert(payload)

      if (result.error) {
        throw result.error
      }

      try {
        await refreshHomepageCache()
      } catch (cacheError) {
        console.error('Homepage cache refresh failed:', cacheError)
      }
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save event.'
      )
      setLoading(false)
    }
  }

  async function deleteEvent(item: EventItem) {
    if (!confirm(`Delete "${item.title}"?`)) return

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', item.id)

    if (error) {
      alert(error.message)
      return
    }

    try {
      await refreshHomepageCache()
    } catch (cacheError) {
      console.error('Homepage cache refresh failed:', cacheError)
    }
    router.refresh()
  }

  return (
    <>
      <div className="admin-users-toolbar">
        <div>
          <strong>{initialEvents.length}</strong>
          <span>
            {' '}
            event{initialEvents.length === 1 ? '' : 's'}
          </span>
        </div>

        <button
          className="admin-button admin-button-auto"
          type="button"
          onClick={openNew}
        >
          Add Event
        </button>
      </div>

      <div className="admin-news-list">
        {initialEvents.map((item) => (
          <div className="admin-news-card" key={item.id}>
            {item.image_url && (
              <img
                className="admin-news-thumbnail"
                src={item.image_url}
                alt=""
              />
            )}

            <div className="admin-news-main">
              <strong>{item.title}</strong>

              <span>
                {item.event_date}
                {item.event_time
                  ? ` · ${item.event_time.slice(0, 5)}`
                  : ''}
              </span>

              <p>
                {item.type || 'Event'}
                {item.location ? ` · ${item.location}` : ''}
              </p>
            </div>

            <div className="admin-news-actions">
              <span
                className={
                  item.published
                    ? 'admin-user-status admin-user-active'
                    : 'admin-user-status admin-user-disabled'
                }
              >
                {item.published ? 'Published' : 'Draft'}
              </span>

              {item.show_on_homepage && (
                <span className="admin-user-role admin-user-role-super">
                  Homepage
                </span>
              )}

              <button
                type="button"
                className="admin-user-action"
                onClick={() => openEdit(item)}
              >
                Edit
              </button>

              <button
                type="button"
                className="admin-user-action admin-user-action-remove"
                onClick={() => deleteEvent(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal admin-modal-large">
            <h2>{editing ? 'Edit Event' : 'Add Event'}</h2>

            <p>
              {editing
                ? 'Update this parish event.'
                : 'Create a new parish event.'}
            </p>

            {error && <div className="admin-error">{error}</div>}

            <form onSubmit={saveEvent}>
              <div className="admin-field">
                <label htmlFor="event-title">Title</label>

                <input
                  id="event-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="event-type">Event type</label>

                <input
                  id="event-type"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  placeholder="Feast, Community, Parish life..."
                />
              </div>

              <div className="admin-field">
                <label htmlFor="event-date">Date</label>

                <input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(event) =>
                    setEventDate(event.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="event-time">Time</label>

                <input
                  id="event-time"
                  type="time"
                  value={eventTime}
                  onChange={(event) =>
                    setEventTime(event.target.value)
                  }
                />
              </div>

              <div className="admin-field">
                <label htmlFor="event-location">Location</label>

                <input
                  id="event-location"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                />
              </div>

              <div className="admin-field">
                <label htmlFor="event-excerpt">
                  Short description
                </label>

                <textarea
                  id="event-excerpt"
                  value={excerpt}
                  onChange={(event) =>
                    setExcerpt(event.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="event-content">
                  Event description
                </label>

                <textarea
                  id="event-content"
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  rows={10}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="event-image">
                  Event image
                </label>

                <input
                  id="event-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    handleImageChange(
                      event.target.files?.[0] || null
                    )
                  }
                />
              </div>

              {imagePreview && (
                <div className="admin-image-preview">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                  />

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={removeImage}
                  >
                    Remove image
                  </button>
                </div>
              )}

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(event.target.checked)
                  }
                />

                <span>Published</span>
              </label>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={showOnHomepage}
                  onChange={(event) =>
                    setShowOnHomepage(event.target.checked)
                  }
                />

                <span>Show on homepage</span>
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
                    ? 'Saving & uploading…'
                    : editing
                      ? 'Save changes'
                      : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
