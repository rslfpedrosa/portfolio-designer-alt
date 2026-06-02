'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Monitor, Globe, Users } from 'lucide-react'
import { projectsData } from '@/data/projects'

const SLIDE_IDS = [3, 1, 2]
type LucideIcon = React.ComponentType<{ size?: number }>
const ICONS: Record<number, LucideIcon> = { 1: Globe, 2: Users, 3: Monitor }

const slides = SLIDE_IDS.map(id => ({ ...projectsData[id], Icon: ICONS[id] }))
const TOTAL = slides.length
const SCROLL_PER_SLIDE = 6 // viewports of scroll per slide transition (higher = heavier)

// Scroll layout (outer height = (2 + (TOTAL-1)*SCROLL_PER_SLIDE) × 100svh):
//   0–1 vh          : initial dwell on slide 0
//   1–(1+M) vh      : bottom-up reveal of slide 1 over slide 0
//   (1+M)–(1+2M) vh : bottom-up reveal of slide 2 over slide 1
//   last vh         : dwell on final slide before section unpins

export default function ScrollSlideshow() {
  const outerRef = useRef<HTMLDivElement>(null)

  // Image wrappers — clip-path written directly to the DOM (NOT via React style
  // props) so React re-renders never clobber the values the scroll handler sets.
  const imageRefs = useRef<(HTMLDivElement | null)[]>(Array(TOTAL).fill(null))

  // Text index drives React re-renders for the text opacity swaps.
  const [textIndex, setTextIndex] = useState(0)
  const textIndexRef = useRef(0)

  const [isMobile, setIsMobile] = useState(false)

  // ── Mobile detection ────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handle = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  // ── Initial clip-paths (synchronous, before paint) ──────────────────────────
  // Without this, ALL images are visible on first render until the scroll effect
  // fires. useLayoutEffect runs before the browser paints, so there is no flash.
  useLayoutEffect(() => {
    if (isMobile) return
    imageRefs.current.forEach((wrapper, i) => {
      if (!wrapper) return
      wrapper.style.clipPath = i === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)'
    })
  }, [isMobile])

  // ── Scroll-driven animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return
    const el = outerRef.current
    if (!el) return

    let sectionTop = el.getBoundingClientRect().top + window.scrollY

    const recalcTop = () => {
      sectionTop = el.getBoundingClientRect().top + window.scrollY
    }

    const onScroll = () => {
      const scrolled = window.scrollY - sectionTop
      const vh = window.innerHeight

      // Continuous progress: 0 = start of first transition, TOTAL-1 = end of last.
      // Subtract 1 viewport for the initial dwell, then divide by SCROLL_PER_SLIDE
      // so each full slide reveal requires SCROLL_PER_SLIDE viewports of scroll.
      const rawProgress = (scrolled / vh - 1) / SCROLL_PER_SLIDE
      const progress = Math.max(0, Math.min(TOTAL - 1, rawProgress))

      // Image clip-paths — direct DOM writes, no React reconciler involvement.
      // inset(top% 0 0 0): top=100% hides the image, top=0% fully reveals it.
      // Reducing the top inset exposes the image from its bottom edge upward.
      imageRefs.current.forEach((wrapper, i) => {
        if (!wrapper) return
        if (i === 0) {
          wrapper.style.clipPath = 'inset(0% 0 0 0)'
          return
        }
        const reveal = Math.max(0, Math.min(1, progress - (i - 1)))
        wrapper.style.clipPath = `inset(${(1 - reveal) * 100}% 0 0 0)`
      })

      // Text swap at 50% of each transition: current text stays visible while the
      // next image is less than half revealed, then cuts over cleanly.
      const next = Math.max(0, Math.min(TOTAL - 1, Math.floor(progress + 0.5)))
      if (next !== textIndexRef.current) {
        textIndexRef.current = next
        setTextIndex(next)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', recalcTop)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', recalcTop)
    }
  }, [isMobile])

  // ── Mobile: stacked full-height cards ───────────────────────────────────────
  if (isMobile) {
    return (
      <div>
        {slides.map((slide, i) => (
          <div key={slide.id} style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
            <Image src={slide.heroImage} fill alt="" style={{ objectFit: 'cover' }} priority={i === 0} sizes="100vw" />
            <div style={{
              position: 'absolute', inset: 0,
              background: [
                'linear-gradient(to right, rgba(4,45,43,0.96) 0%, rgba(4,45,43,0.72) 40%, rgba(4,45,43,0.28) 100%)',
                'linear-gradient(to top, rgba(4,45,43,0.82) 0%, transparent 36%)',
              ].join(', '),
            }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', padding: '0 clamp(24px, 5vw, 48px)' }}>
              <div style={{ paddingTop: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.38)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.72)',
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.06em',
                  }}>
                    <slide.Icon size={10} />
                    {slide.category}
                  </span>
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ paddingBottom: 'clamp(64px, 9vw, 100px)' }}>
                <h2 style={{
                  color: '#ffffff', fontSize: 'clamp(26px, 6vw, 42px)',
                  fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em',
                  maxWidth: '15ch', marginBottom: 'clamp(24px, 3vw, 36px)',
                }}>
                  {slide.subtitle}
                </h2>
                <Link href={`/projects/${slide.id}`} >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#d9ee72', color: '#241f21',
                    padding: '11px 20px', borderRadius: 999,
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>
                    See Case Study <ArrowUpRight size={12} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Desktop: pinned scroll-driven slideshow ──────────────────────────────────
  return (
    <div ref={outerRef} style={{ height: `${(2 + (TOTAL - 1) * SCROLL_PER_SLIDE) * 100}svh`, position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100svh', overflow: 'hidden',
        background: '#042d2b',
      }}>

        {/* ── Images ──────────────────────────────────────────────────────────
            IMPORTANT: clipPath is intentionally absent from the style prop.
            React would reset it to its initial value on every re-render (e.g.
            when textIndex changes), clobbering the values written by the scroll
            handler. Instead, clipPath is managed exclusively via:
              • useLayoutEffect  — sets initial values before first paint
              • onScroll         — updates continuously as the user scrolls     */}
        {slides.map((slide, i) => (
          <div
            key={`img-${slide.id}`}
            ref={el => { imageRefs.current[i] = el }}
            aria-hidden
            style={{
              position: 'absolute', inset: 0,
              zIndex: i + 1,        // slide 0=z1, slide 1=z2, slide 2=z3
              willChange: 'clip-path',
            }}
          >
            <Image
              src={slide.heroImage}
              fill alt=""
              style={{ objectFit: 'cover' }}
              priority={i === 0}
              sizes="100vw"
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: [
                'linear-gradient(to right, rgba(4,45,43,0.96) 0%, rgba(4,45,43,0.72) 40%, rgba(4,45,43,0.28) 100%)',
                'linear-gradient(to top, rgba(4,45,43,0.82) 0%, transparent 36%)',
              ].join(', '),
            }} />
          </div>
        ))}

        {/* ── Text content ────────────────────────────────────────────────────
            All layers sit at z=30, permanently above every image (z=1–3).
            Opacity is driven by React state (textIndex), which is fine because
            React correctly re-applies opacity on re-render from that same state.
            The 0.13s transition makes the swap feel like an editorial cut.      */}
        {slides.map((slide, i) => (
          <div
            key={`content-${slide.id}`}
            style={{
              position: 'absolute', inset: 0,
              zIndex: 30,
              opacity: i === textIndex ? 1 : 0,
              transition: 'opacity 0.13s ease',
              pointerEvents: i === textIndex ? 'auto' : 'none',
              display: 'flex', flexDirection: 'column',
              padding: '0 clamp(24px, 5vw, 80px)',
            }}
          >
            <div style={{ paddingTop: 'clamp(96px, 10vw, 130px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  fontSize: 13, fontWeight: 500, letterSpacing: '0.10em',
                  color: 'rgba(255,255,255,0.38)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '6px 14px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.72)',
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
                }}>
                  <slide.Icon size={11} />
                  {slide.category}
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ paddingBottom: 'clamp(80px, 9vw, 120px)' }}>
              <h2 style={{
                color: '#ffffff',
                fontSize: 'clamp(30px, 3.8vw, 58px)',
                fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em',
                maxWidth: '15ch',
                marginBottom: 'clamp(28px, 3vw, 44px)',
              }}>
                {slide.subtitle}
              </h2>
              <Link href={`/projects/${slide.id}`} >
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#d9ee72', color: '#241f21',
                  padding: '12px 22px', borderRadius: 999,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  See Case Study
                  <ArrowUpRight size={13} />
                </span>
              </Link>
            </div>
          </div>
        ))}

        {/* ── Progress bar ─────────────────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute', zIndex: 40, pointerEvents: 'none',
            left: 'clamp(24px, 5vw, 80px)', right: 'clamp(24px, 5vw, 80px)',
            top: 'calc(clamp(96px, 10vw, 130px) + 39px)',
            height: 1,
            background: 'rgba(255,255,255,0.10)',
          }}
        >
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${((textIndex + 1) / TOTAL) * 100}%`,
            background: 'rgba(255,255,255,0.55)',
            transition: 'width 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>

        {/* ── Slide counter ─────────────────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute', bottom: 'clamp(24px, 3vw, 40px)', left: '50%',
            transform: 'translateX(-50%)', zIndex: 40, pointerEvents: 'none',
            fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={textIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
            >
              {String(textIndex + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
