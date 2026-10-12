'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type ParishSection = {
  id: string
  page_id: string
  heading: string
  text: string
  sort_order: number
}

type ParishPage = {
  id: string
  slug: string
  title: string
  eyebrow: string | null
  intro: string | null
  published: boolean
  parish_page_sections: ParishSection[]
}

export default function ParishPagesManager({
  initialPages,
}: {
  initialPages: ParishPage[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [selectedPageId, setSelectedPageId] = useState(
    initialPages[0]?.id || ''
  )

  const selectedPage =
    initialPages.find((page) => page.id === selectedPageId) ||
    initialPages[0] ||
    null

  const [title, setTitle] = useState('')
  const [eyebrow, setEyebrow] = useState('')
  const [intro, setIntro] = useState('')
  const [published, setPublished] = useState(true)

  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSection, setEditingSection] =
    useState<ParishSection | null>(null)

  const [sectionHeading, setSectionHeading] = useState('')
  const [sectionText, setSectionText] = useState('')

  const [loading, setLoading] = useState(false)
  const [sectionLoading, setSectionLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedPage) return

    setTitle(selectedPage.title)
    setEyebrow(selectedPage.eyebrow || '')
    setIntro(selectedPage.intro || '')
    setPublished(selectedPage.published)
    setSaved(false)
    setError('')
  }, [selectedPage])

  const sections = selectedPage
    ? [...(selectedPage.parish_page_sections || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      )
    : []

  async function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedPage) return

    setLoading(true)
    setSaved(false)
    setError('')

    try {
      const { error } = await supabase
        .from('parish_pages')
        .update({
          title: title.trim(),
          eyebrow: eyebrow.trim() || null,
          intro: intro.trim() || null,
          published,
        })
        .eq('id', selectedPage.id)

      if (error) throw error

      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save parish page.'
      )
    } finally {
      setLoading(false)
    }
  }

  function openNewSection() {
    setEditingSection(null)
    setSectionHeading('')
    setSectionText('')
    setError('')
    setSectionModalOpen(true)
  }

  function openEditSection(section: ParishSection) {
    setEditingSection(section)
    setSectionHeading(section.heading)
    setSectionText(section.text)
    setError('')
    setSectionModalOpen(true)
  }

  async function saveSection(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!selectedPage) return

    setSectionLoading(true)
    setError('')

    try {
      if (editingSection) {
        const { error } = await supabase
          .from('parish_page_sections')
          .update({
            heading: sectionHeading.trim(),
            text: sectionText.trim(),
          })
          .eq('id', editingSection.id)

        if (error) throw error
      } else {
        const nextSortOrder =
          sections.length > 0
            ? Math.max(...sections.map((s) => s.sort_order)) + 1
            : 0

        const { error } = await supabase
          .from('parish_page_sections')
          .insert({
            page_id: selectedPage.id,
            heading: sectionHeading.trim(),
            text: sectionText.trim(),
            sort_order: nextSortOrder,
          })

        if (error) throw error
      }

      setSectionModalOpen(false)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save section.'
      )
    } finally {
      setSectionLoading(false)
    }
  }

  async function deleteSection(section: ParishSection) {
    if (!confirm(`Delete section "${section.heading}"?`)) {
      return
    }

    const { error } = await supabase
      .from('parish_page_sections')
      .delete()
      .eq('id', section.id)

    if (error) {
      setError(error.message)
      return
    }

    router.refresh()
  }

  async function moveSection(
    section: ParishSection,
    direction: 'up' | 'down'
  ) {
    const index = sections.findIndex(
      (item) => item.id === section.id
    )

    const targetIndex =
      direction === 'up' ? index - 1 : index + 1

    if (
      index < 0 ||
      targetIndex < 0 ||
      targetIndex >= sections.length
    ) {
      return
    }

    const target = sections[targetIndex]

    const currentOrder = section.sort_order
    const targetOrder = target.sort_order

    const first = await supabase
      .from('parish_page_sections')
      .update({ sort_order: targetOrder })
      .eq('id', section.id)

    if (first.error) {
      setError(first.error.message)
      return
    }

    const second = await supabase
      .from('parish_page_sections')
      .update({ sort_order: currentOrder })
      .eq('id', target.id)

    if (second.error) {
      setError(second.error.message)
      return
    }

    router.refresh()
  }

  if (!selectedPage) {
    return (
      <div className="admin-empty-state">
        No parish pages found.
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="admin-error">{error}</div>
      )}

      <div className="admin-parish-layout">
        <aside className="admin-parish-page-list">
          {initialPages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={
                page.id === selectedPage.id
                  ? 'admin-parish-page-button active'
                  : 'admin-parish-page-button'
              }
              onClick={() => setSelectedPageId(page.id)}
            >
              <strong>{page.title}</strong>
              <span>/parish/{page.slug}</span>
            </button>
          ))}
        </aside>

        <div className="admin-parish-editor">
          <form onSubmit={savePage}>
            <div className="admin-field">
              <label>URL</label>
              <input
                value={`/parish/${selectedPage.slug}`}
                disabled
              />
            </div>

            <div className="admin-field">
              <label htmlFor="parish-title">Page title</label>
              <input
                id="parish-title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="parish-eyebrow">
                Small heading
              </label>
              <input
                id="parish-eyebrow"
                value={eyebrow}
                onChange={(event) =>
                  setEyebrow(event.target.value)
                }
                placeholder="Our community"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="parish-intro">
                Introduction
              </label>
              <textarea
                id="parish-intro"
                rows={4}
                value={intro}
                onChange={(event) =>
                  setIntro(event.target.value)
                }
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
              <span>Published</span>
            </label>

            <div className="admin-parish-save-row">
              <button
                type="submit"
                className="admin-button admin-button-auto"
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Save Page'}
              </button>

              {saved && (
                <span className="admin-user-status admin-user-active">
                  Saved
                </span>
              )}
            </div>
          </form>

          <div className="admin-parish-sections-heading">
            <div>
              <p className="admin-eyebrow">Page content</p>
              <h2>Sections</h2>
            </div>

            <button
              type="button"
              className="admin-button admin-button-auto"
              onClick={openNewSection}
            >
              Add Section
            </button>
          </div>

          <div className="admin-parish-sections">
            {sections.map((section, index) => (
              <div
                className="admin-parish-section-card"
                key={section.id}
              >
                <div className="admin-parish-section-content">
                  <strong>{section.heading}</strong>
                  <p>{section.text}</p>
                </div>

                <div className="admin-parish-section-actions">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      moveSection(section, 'up')
                    }
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={index === sections.length - 1}
                    onClick={() =>
                      moveSection(section, 'down')
                    }
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openEditSection(section)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-gallery-delete-photo"
                    onClick={() =>
                      deleteSection(section)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {sections.length === 0 && (
              <div className="admin-empty-state">
                No sections on this page yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {sectionModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h2>
              {editingSection
                ? 'Edit Section'
                : 'Add Section'}
            </h2>

            <form onSubmit={saveSection}>
              <div className="admin-field">
                <label htmlFor="section-heading">
                  Heading
                </label>
                <input
                  id="section-heading"
                  value={sectionHeading}
                  onChange={(event) =>
                    setSectionHeading(event.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="section-text">
                  Text
                </label>
                <textarea
                  id="section-text"
                  rows={7}
                  value={sectionText}
                  onChange={(event) =>
                    setSectionText(event.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() =>
                    setSectionModalOpen(false)
                  }
                  disabled={sectionLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-button admin-button-auto"
                  disabled={sectionLoading}
                >
                  {sectionLoading
                    ? 'Saving…'
                    : editingSection
                      ? 'Save changes'
                      : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
