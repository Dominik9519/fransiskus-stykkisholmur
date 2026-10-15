'use client'

import { useEffect } from 'react'

export default function MotionDepth() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    /*
     * Editorial heading reveal.
     * We deliberately skip headings inside cards already animated
     * by the Phase 1 reveal system.
     */
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('main h2')
    ).filter((element) => !element.closest('[data-reveal]'))

    headings.forEach((heading) => {
      heading.classList.add('motion-heading')
    })

    if (reducedMotion) {
      headings.forEach((heading) => heading.classList.add('is-visible'))
      return
    }

    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-visible')
          headingObserver.unobserve(entry.target)
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    headings.forEach((heading) => headingObserver.observe(heading))

    /*
     * Hero depth.
     * Only object-position is changed, so it does not conflict
     * with the Phase 1 entrance transform animation.
     */
    const hero = document.querySelector<HTMLElement>('.hero')
    const heroImage = document.querySelector<HTMLElement>('.hero-image')

    let animationFrame = 0

    const updateHeroDepth = () => {
      animationFrame = 0

      if (!hero || !heroImage) return

      const rect = hero.getBoundingClientRect()
      const viewport = window.innerHeight

      const progress = Math.max(
        0,
        Math.min(
          1,
          (viewport - rect.top) / (viewport + rect.height)
        )
      )

      const offset = (progress - 0.5) * 28

      heroImage.style.setProperty(
        '--hero-depth',
        `${offset.toFixed(2)}px`
      )
    }

    const requestDepthUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateHeroDepth)
    }

    updateHeroDepth()

    window.addEventListener('scroll', requestDepthUpdate, {
      passive: true,
    })

    window.addEventListener('resize', requestDepthUpdate)

    /*
     * Extremely subtle spatial card response.
     * Fine-pointer devices only.
     */
    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('.info-card[data-reveal]')
    )

    const cleanups: Array<() => void> = []

    if (finePointer) {
      cards.forEach((card) => {
        card.classList.add('motion-card-depth')

        const handlePointerMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect()

          const x = (event.clientX - rect.left) / rect.width
          const y = (event.clientY - rect.top) / rect.height

          const rotateY = (x - 0.5) * 1.2
          const rotateX = (0.5 - y) * 1.2

          card.style.setProperty(
            '--card-rx',
            `${rotateX.toFixed(3)}deg`
          )

          card.style.setProperty(
            '--card-ry',
            `${rotateY.toFixed(3)}deg`
          )
        }

        const handlePointerLeave = () => {
          card.style.setProperty('--card-rx', '0deg')
          card.style.setProperty('--card-ry', '0deg')
        }

        card.addEventListener('pointermove', handlePointerMove)
        card.addEventListener('pointerleave', handlePointerLeave)

        cleanups.push(() => {
          card.removeEventListener('pointermove', handlePointerMove)
          card.removeEventListener('pointerleave', handlePointerLeave)
        })
      })
    }

    return () => {
      headingObserver.disconnect()

      window.removeEventListener('scroll', requestDepthUpdate)
      window.removeEventListener('resize', requestDepthUpdate)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }

      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  return null
}
