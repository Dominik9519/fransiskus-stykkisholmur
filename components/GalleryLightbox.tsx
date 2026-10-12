'use client'

import { useEffect, useState } from 'react'
import styles from './GalleryLightbox.module.css'

type Photo = {
  id: string
  image_url: string
  caption: string | null
}

export default function GalleryLightbox({
  photos,
  title,
}: {
  photos: Photo[]
  title: string
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const isOpen = activeIndex !== null
  const activePhoto =
    activeIndex !== null ? photos[activeIndex] : null

  function close() {
    setActiveIndex(null)
  }

  function previous() {
    if (activeIndex === null) return

    setActiveIndex(
      activeIndex === 0
        ? photos.length - 1
        : activeIndex - 1
    )
  }

  function next() {
    if (activeIndex === null) return

    setActiveIndex(
      activeIndex === photos.length - 1
        ? 0
        : activeIndex + 1
    )
  }

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, activeIndex])

  return (
    <>
      <section className="gallery-photos">
        {photos.map((photo, index) => (
          <button
            type="button"
            className={`${styles.photoButton} gallery-photo`}
            key={photo.id}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open ${title} photo ${index + 1}`}
          >
            <img
              src={photo.image_url}
              alt={
                photo.caption ||
                `${title} photo ${index + 1}`
              }
            />

            {photo.caption && (
              <p>{photo.caption}</p>
            )}

            <span className={styles.zoomIcon}>
              ⤢
            </span>
          </button>
        ))}
      </section>

      {isOpen && activePhoto && (
        <div
          className={styles.overlay}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label="Close photo"
          >
            ×
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              onClick={(event) => {
                event.stopPropagation()
                previous()
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          <div
            className={styles.imageContainer}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activePhoto.image_url}
              alt={
                activePhoto.caption ||
                `${title} photo ${(activeIndex ?? 0) + 1}`
              }
            />

            {activePhoto.caption && (
              <p className={styles.caption}>
                {activePhoto.caption}
              </p>
            )}

            <span className={styles.counter}>
              {(activeIndex ?? 0) + 1} / {photos.length}
            </span>
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              onClick={(event) => {
                event.stopPropagation()
                next()
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
