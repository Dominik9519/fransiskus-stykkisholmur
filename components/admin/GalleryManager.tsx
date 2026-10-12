'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type GalleryPhoto = {
  id: string
  album_id: string
  image_url: string
  caption: string | null
  sort_order: number
  created_at: string
}

type GalleryAlbum = {
  id: string
  slug: string
  title: string
  album_date: string
  cover_image_url: string | null
  published: boolean
  gallery_photos: GalleryPhoto[]
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

function getStoragePath(url: string) {
  const marker = '/gallery-images/'
  const index = url.indexOf(marker)

  if (index === -1) return null

  return decodeURIComponent(
    url.slice(index + marker.length)
  )
}

export default function GalleryManager({
  initialAlbums,
}: {
  initialAlbums: GalleryAlbum[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [selectedAlbumId, setSelectedAlbumId] =
    useState<string | null>(null)

  const [albumModalOpen, setAlbumModalOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] =
    useState<GalleryAlbum | null>(null)

  const [title, setTitle] = useState('')
  const [albumDate, setAlbumDate] = useState('')
  const [published, setPublished] = useState(true)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const selectedAlbum =
    initialAlbums.find(
      (album) => album.id === selectedAlbumId
    ) || null

  const selectedPhotos = selectedAlbum
    ? [...(selectedAlbum.gallery_photos || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      )
    : []

  function openNewAlbum() {
    setEditingAlbum(null)
    setTitle('')
    setAlbumDate(new Date().toISOString().slice(0, 10))
    setPublished(true)
    setError('')
    setAlbumModalOpen(true)
  }

  function openEditAlbum(album: GalleryAlbum) {
    setEditingAlbum(album)
    setTitle(album.title)
    setAlbumDate(album.album_date)
    setPublished(album.published)
    setError('')
    setAlbumModalOpen(true)
  }

  async function saveAlbum(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const payload = {
        slug: editingAlbum?.slug || makeSlug(title),
        title: title.trim(),
        album_date: albumDate,
        published,
      }

      if (editingAlbum) {
        const { error } = await supabase
          .from('gallery_albums')
          .update(payload)
          .eq('id', editingAlbum.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('gallery_albums')
          .insert(payload)
          .select('id')
          .single()

        if (error) throw error

        setSelectedAlbumId(data.id)
      }

      setAlbumModalOpen(false)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save album.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function deleteAlbum(album: GalleryAlbum) {
    if (
      !confirm(
        `Delete album "${album.title}" and all its photos?`
      )
    ) {
      return
    }

    setError('')

    const paths = (album.gallery_photos || [])
      .map((photo) => getStoragePath(photo.image_url))
      .filter((path): path is string => Boolean(path))

    if (paths.length > 0) {
      await supabase.storage
        .from('gallery-images')
        .remove(paths)
    }

    const { error } = await supabase
      .from('gallery_albums')
      .delete()
      .eq('id', album.id)

    if (error) {
      setError(error.message)
      return
    }

    if (selectedAlbumId === album.id) {
      setSelectedAlbumId(null)
    }

    router.refresh()
  }

  async function uploadPhotos(files: FileList | null) {
    if (!selectedAlbum || !files || files.length === 0) {
      return
    }

    setUploading(true)
    setError('')

    try {
      const selectedFiles = Array.from(files)

      for (const file of selectedFiles) {
        if (
          ![
            'image/jpeg',
            'image/png',
            'image/webp',
          ].includes(file.type)
        ) {
          throw new Error(
            'Only JPG, PNG and WEBP images are allowed.'
          )
        }

        if (file.size > 12 * 1024 * 1024) {
          throw new Error(
            `${file.name} is larger than 12 MB.`
          )
        }
      }

      const currentMax =
        selectedPhotos.length > 0
          ? Math.max(
              ...selectedPhotos.map(
                (photo) => photo.sort_order
              )
            )
          : -1

      const rows: {
        album_id: string
        image_url: string
        sort_order: number
      }[] = []

      for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index]
        const extension = getExtension(file)

        const fileName =
          `${selectedAlbum.id}/` +
          `${Date.now()}-${crypto.randomUUID()}.${extension}`

        const { error: uploadError } =
          await supabase.storage
            .from('gallery-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type,
            })

        if (uploadError) {
          throw uploadError
        }

        const { data } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName)

        rows.push({
          album_id: selectedAlbum.id,
          image_url: data.publicUrl,
          sort_order: currentMax + index + 1,
        })
      }

      const { error: insertError } = await supabase
        .from('gallery_photos')
        .insert(rows)

      if (insertError) {
        throw insertError
      }

      if (
        !selectedAlbum.cover_image_url &&
        rows.length > 0
      ) {
        const { error: coverError } = await supabase
          .from('gallery_albums')
          .update({
            cover_image_url: rows[0].image_url,
          })
          .eq('id', selectedAlbum.id)

        if (coverError) {
          throw coverError
        }
      }

      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to upload photos.'
      )
    } finally {
      setUploading(false)
    }
  }

  async function setCover(photo: GalleryPhoto) {
    if (!selectedAlbum) return

    const { error } = await supabase
      .from('gallery_albums')
      .update({
        cover_image_url: photo.image_url,
      })
      .eq('id', selectedAlbum.id)

    if (error) {
      setError(error.message)
      return
    }

    router.refresh()
  }

  async function deletePhoto(photo: GalleryPhoto) {
    if (!selectedAlbum) return

    if (!confirm('Delete this photo?')) return

    setError('')

    const storagePath = getStoragePath(photo.image_url)

    if (storagePath) {
      await supabase.storage
        .from('gallery-images')
        .remove([storagePath])
    }

    const { error } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', photo.id)

    if (error) {
      setError(error.message)
      return
    }

    if (
      selectedAlbum.cover_image_url === photo.image_url
    ) {
      const replacement = selectedPhotos.find(
        (item) => item.id !== photo.id
      )

      await supabase
        .from('gallery_albums')
        .update({
          cover_image_url:
            replacement?.image_url || null,
        })
        .eq('id', selectedAlbum.id)
    }

    router.refresh()
  }

  return (
    <>
      {error && (
        <div className="admin-error">{error}</div>
      )}

      <div className="admin-users-toolbar">
        <div>
          <strong>{initialAlbums.length}</strong>
          <span>
            {' '}
            album{initialAlbums.length === 1 ? '' : 's'}
          </span>
        </div>

        <button
          type="button"
          className="admin-button admin-button-auto"
          onClick={openNewAlbum}
        >
          Add Album
        </button>
      </div>

      <div className="admin-gallery-albums">
        {initialAlbums.map((album) => {
          const photoCount =
            album.gallery_photos?.length || 0

          return (
            <div
              className="admin-gallery-album-card"
              key={album.id}
            >
              <button
                type="button"
                className="admin-gallery-cover-button"
                onClick={() =>
                  setSelectedAlbumId(album.id)
                }
              >
                {album.cover_image_url ? (
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                  />
                ) : (
                  <div className="admin-gallery-no-cover">
                    No cover
                  </div>
                )}
              </button>

              <div className="admin-gallery-album-info">
                <strong>{album.title}</strong>

                <span>{album.album_date}</span>

                <p>
                  {photoCount}{' '}
                  {photoCount === 1
                    ? 'photo'
                    : 'photos'}
                </p>
              </div>

              <div className="admin-news-actions">
                <span
                  className={
                    album.published
                      ? 'admin-user-status admin-user-active'
                      : 'admin-user-status admin-user-disabled'
                  }
                >
                  {album.published
                    ? 'Published'
                    : 'Draft'}
                </span>

                <button
                  type="button"
                  className="admin-user-action"
                  onClick={() =>
                    setSelectedAlbumId(album.id)
                  }
                >
                  Photos
                </button>

                <button
                  type="button"
                  className="admin-user-action"
                  onClick={() =>
                    openEditAlbum(album)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-user-action admin-user-action-remove"
                  onClick={() =>
                    deleteAlbum(album)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selectedAlbum && (
        <section className="admin-gallery-photo-manager">
          <div className="admin-gallery-photo-header">
            <div>
              <p className="admin-eyebrow">
                Album photos
              </p>

              <h2>{selectedAlbum.title}</h2>

              <p>
                Upload multiple photos and choose the
                album cover.
              </p>
            </div>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={() =>
                setSelectedAlbumId(null)
              }
            >
              Close
            </button>
          </div>

          <label className="admin-gallery-upload">
            <span>
              {uploading
                ? 'Uploading photos…'
                : 'Add photos'}
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading}
              onChange={async (event) => {
                const input = event.currentTarget

                await uploadPhotos(input.files)

                input.value = ''
              }}
            />
          </label>

          <div className="admin-gallery-photo-grid">
            {selectedPhotos.map((photo) => (
              <div
                className="admin-gallery-photo-card"
                key={photo.id}
              >
                <img
                  src={photo.image_url}
                  alt=""
                />

                {selectedAlbum.cover_image_url ===
                  photo.image_url && (
                  <span className="admin-gallery-cover-badge">
                    Cover
                  </span>
                )}

                <div className="admin-gallery-photo-actions">
                  {selectedAlbum.cover_image_url !==
                    photo.image_url && (
                    <button
                      type="button"
                      onClick={() =>
                        setCover(photo)
                      }
                    >
                      Set as cover
                    </button>
                  )}

                  <button
                    type="button"
                    className="admin-gallery-delete-photo"
                    onClick={() =>
                      deletePhoto(photo)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedPhotos.length === 0 && (
            <div className="admin-empty-state">
              No photos in this album yet.
            </div>
          )}
        </section>
      )}

      {albumModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h2>
              {editingAlbum
                ? 'Edit Album'
                : 'Add Album'}
            </h2>

            <p>
              Create a gallery album for parish
              photos.
            </p>

            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}

            <form onSubmit={saveAlbum}>
              <div className="admin-field">
                <label htmlFor="album-title">
                  Album title
                </label>

                <input
                  id="album-title"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="album-date">
                  Album date
                </label>

                <input
                  id="album-date"
                  type="date"
                  value={albumDate}
                  onChange={(event) =>
                    setAlbumDate(event.target.value)
                  }
                  required
                />
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(
                      event.target.checked
                    )
                  }
                />

                <span>Published</span>
              </label>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() =>
                    setAlbumModalOpen(false)
                  }
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
                    : editingAlbum
                      ? 'Save changes'
                      : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
