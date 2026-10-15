'use client'
import { refreshHomepageCache } from '../../lib/actions/cache'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image_url: string | null
  published_at: string
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

export default function NewsManager({
  initialNews,
}: {
  initialNews: NewsItem[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<NewsItem | null>(null)

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [published, setPublished] = useState(true)
  const [showOnHomepage, setShowOnHomepage] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function openNew() {
    setEditing(null)
    setTitle('')
    setExcerpt('')
    setContent('')
    setImageUrl('')
    setImageFile(null)
    setImagePreview('')
    setPublishedAt(new Date().toISOString().slice(0, 10))
    setPublished(true)
    setShowOnHomepage(false)
    setError('')
    setOpen(true)
  }

  function openEdit(item: NewsItem) {
    setEditing(item)
    setTitle(item.title)
    setExcerpt(item.excerpt)
    setContent(item.content)
    setImageUrl(item.image_url || '')
    setImageFile(null)
    setImagePreview(item.image_url || '')
    setPublishedAt(item.published_at)
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
      .from('news-images')
      .upload(fileName, imageFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: imageFile.type,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  async function saveNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const uploadedImageUrl = await uploadImage()
      const slug = editing?.slug || makeSlug(title)

      const payload = {
        slug,
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        image_url: uploadedImageUrl,
        published_at: publishedAt,
        published,
        show_on_homepage: showOnHomepage,
      }

      const result = editing
        ? await supabase
            .from('news')
            .update(payload)
            .eq('id', editing.id)
        : await supabase
            .from('news')
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
          : 'Unable to save news article.'
      )
      setLoading(false)
    }
  }

  async function deleteNews(item: NewsItem) {
    if (!confirm(`Delete "${item.title}"?`)) return

    const { error } = await supabase
      .from('news')
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
          <strong>{initialNews.length}</strong>
          <span>
            {' '}
            news item{initialNews.length === 1 ? '' : 's'}
          </span>
        </div>

        <button
          className="admin-button admin-button-auto"
          type="button"
          onClick={openNew}
        >
          Add News
        </button>
      </div>

      <div className="admin-news-list">
        {initialNews.map((item) => (
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
              <span>{item.published_at}</span>
              <p>{item.excerpt}</p>
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
                onClick={() => deleteNews(item)}
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
            <h2>{editing ? 'Edit News' : 'Add News'}</h2>

            <p>
              {editing
                ? 'Update this parish news article.'
                : 'Create a new parish news article.'}
            </p>

            {error && <div className="admin-error">{error}</div>}

            <form onSubmit={saveNews}>
              <div className="admin-field">
                <label htmlFor="news-title">Title</label>
                <input
                  id="news-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="news-date">Date</label>
                <input
                  id="news-date"
                  type="date"
                  value={publishedAt}
                  onChange={(event) =>
                    setPublishedAt(event.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="news-excerpt">
                  Short description
                </label>

                <textarea
                  id="news-excerpt"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="news-content">Article</label>

                <textarea
                  id="news-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={10}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="news-image">Article image</label>

                <input
                  id="news-image"
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
                    alt="Article preview"
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
                      : 'Add News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
