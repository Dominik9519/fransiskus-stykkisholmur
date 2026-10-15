'use client'

import { useEffect } from 'react'

export default function MotionPolish() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    /*
     * HEADER
     * Becomes slightly more compact and glass-like after leaving the top.
     */
    const header = document.querySelector<HTMLElement>('header')

    let headerFrame = 0

    const updateHeader = () => {
      headerFrame = 0

      if (!header) return

      header.classList.toggle(
        'motion-header-scrolled',
        window.scrollY > 24
      )
    }

    const requestHeaderUpdate = () => {
      if (headerFrame) return
      headerFrame = window.requestAnimationFrame(updateHeader)
    }

    if (header) {
      header.classList.add('motion-site-header')
      updateHeader()

      window.addEventListener('scroll', requestHeaderUpdate, {
        passive: true,
      })
    }

    /*
     * CINEMATIC MEDIA REVEAL
     * Applies only to homepage images other than the hero.
     */
    const media = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main img:not(.hero-image)'
      )
    )

    media.forEach((element) => {
      element.classList.add('motion-media')
    })

    let mediaObserver: IntersectionObserver | null = null

    if (reducedMotion) {
      media.forEach((element) => {
        element.classList.add('is-visible')
      })
    } else {
      mediaObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            entry.target.classList.add('is-visible')
            mediaObserver?.unobserve(entry.target)
          })
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -5% 0px',
        }
      )

      media.forEach((element) => {
        mediaObserver?.observe(element)
      })
    }

    /*
     * SUBTLE MAGNETIC CTA
     * Maximum movement is intentionally tiny.
     */
    const buttons = Array.from(
      document.querySelectorAll<HTMLElement>('.button')
    )

    const cleanups: Array<() => void> = []

    if (finePointer && !reducedMotion) {
      buttons.forEach((button) => {
        button.classList.add('motion-magnetic')

        const handlePointerMove = (event: PointerEvent) => {
          const rect = button.getBoundingClientRect()

          const x =
            (event.clientX - rect.left) / rect.width - 0.5

          const y =
            (event.clientY - rect.top) / rect.height - 0.5

          button.style.setProperty(
            '--magnetic-x',
            `${(x * 3).toFixed(2)}px`
          )

          button.style.setProperty(
            '--magnetic-y',
            `${(y * 2).toFixed(2)}px`
          )
        }

        const handlePointerLeave = () => {
          button.style.setProperty('--magnetic-x', '0px')
          button.style.setProperty('--magnetic-y', '0px')
        }

        button.addEventListener('pointermove', handlePointerMove)
        button.addEventListener('pointerleave', handlePointerLeave)

        cleanups.push(() => {
          button.removeEventListener(
            'pointermove',
            handlePointerMove
          )

          button.removeEventListener(
            'pointerleave',
            handlePointerLeave
          )
        })
      })
    }

    return () => {
      mediaObserver?.disconnect()

      window.removeEventListener(
        'scroll',
        requestHeaderUpdate
      )

      if (headerFrame) {
        window.cancelAnimationFrame(headerFrame)
      }

      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  return null
}
