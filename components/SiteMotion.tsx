'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SiteMotion() {
  const pathname = usePathname()

  useEffect(() => {
    /*
     * Homepage has its own dedicated motion system.
     * Admin must remain clean and functional.
     */
    if (
      !pathname ||
      pathname === '/' ||
      pathname.startsWith('/admin')
    ) {
      return
    }

    const main = document.querySelector<HTMLElement>('main')

    if (!main) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const registered = new Set<HTMLElement>()

    const observer = reducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return

              entry.target.classList.add('site-motion-visible')
              observer?.unobserve(entry.target)
            })
          },
          {
            threshold: 0.12,
            rootMargin: '0px 0px -6% 0px',
          }
        )

    const register = (
      element: HTMLElement,
      type: 'heading' | 'card' | 'media',
      delay = 0
    ) => {
      if (registered.has(element)) return

      registered.add(element)

      element.classList.add(
        'site-motion-target',
        `site-motion-${type}`
      )

      element.style.setProperty(
        '--site-motion-delay',
        `${delay}ms`
      )

      if (reducedMotion) {
        element.classList.add('site-motion-visible')
      } else {
        observer?.observe(element)
      }
    }

    /*
     * Detect card-like semantic structures.
     * News/events lists normally contain multiple article elements.
     * Gallery commonly uses figures.
     */
    const cardCandidates = Array.from(
      main.querySelectorAll<HTMLElement>('article, figure')
    ).filter((element) => {
      return !element.parentElement?.closest('article, figure')
    })

    const isGallery = pathname.startsWith('/gallery')

    const multiCardPage =
      cardCandidates.length > 1 && !isGallery

    /*
     * Editorial headings.
     * Avoid separately animating headings contained in cards,
     * because the complete card already has its own reveal.
     */
    const headings = Array.from(
      main.querySelectorAll<HTMLElement>('h1, h2')
    ).filter((heading) => {
      if (!multiCardPage) return true

      return !heading.closest('article, figure')
    })

    headings.forEach((heading, index) => {
      register(
        heading,
        'heading',
        Math.min(index * 45, 135)
      )
    })

    /*
     * Lists of content cards.
     */
    if (multiCardPage) {
      cardCandidates.forEach((card, index) => {
        register(
          card,
          'card',
          Math.min(index * 55, 275)
        )
      })
    }

    /*
     * Images and embedded media.
     *
     * On list pages the whole card moves as one object.
     * On detail pages images receive their own cinematic reveal.
     * Gallery images are deliberately revealed individually.
     */
    const media = Array.from(
      main.querySelectorAll<HTMLElement>(
        'img, iframe, video'
      )
    ).filter((element) => {
      if (isGallery) return true

      if (!multiCardPage) return true

      return !element.closest('article, figure')
    })

    media.forEach((element, index) => {
      register(
        element,
        'media',
        Math.min(index * 55, 275)
      )
    })

    return () => {
      observer?.disconnect()

      registered.forEach((element) => {
        element.classList.remove(
          'site-motion-target',
          'site-motion-heading',
          'site-motion-card',
          'site-motion-media',
          'site-motion-visible'
        )

        element.style.removeProperty(
          '--site-motion-delay'
        )
      })
    }
  }, [pathname])

  return null
}
