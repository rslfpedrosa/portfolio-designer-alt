'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Monitor, Globe, Users } from 'lucide-react'
import { projectsData } from '@/data/projects'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Slide configuration ──────────────────────────────────────────────────────
const SLIDE_IDS = [3, 1, 2]
type LucideIcon = React.ComponentType<{ size?: number }>
const ICONS: Record<number, LucideIcon> = { 1: Globe, 2: Users, 3: Monitor }
const slides = SLIDE_IDS.map(id => ({ ...projectsData[id], Icon: ICONS[id] }))
const TOTAL = slides.length

// ── Per-project gradient overlays ────────────────────────────────────────────
// Order matches SLIDE_IDS: [3=Onyx/blue, 1=Bocca/orange, 2=Cortado/purple]
const GRADIENTS: Record<number, string> = {
  3: [ // Onyx — deep navy blue
    'linear-gradient(to right, rgba(8,14,60,0.94) 0%, rgba(8,14,60,0.68) 38%, rgba(8,14,60,0.18) 100%)',
    'linear-gradient(to top, rgba(8,14,60,0.90) 0%, transparent 42%)',
  ].join(', '),
  1: [ // Bocca — warm burnt orange
    'linear-gradient(to right, rgba(55,22,4,0.94) 0%, rgba(55,22,4,0.68) 38%, rgba(55,22,4,0.18) 100%)',
    'linear-gradient(to top, rgba(55,22,4,0.90) 0%, transparent 42%)',
  ].join(', '),
  2: [ // Cortado — deep violet purple
    'linear-gradient(to right, rgba(38,10,62,0.94) 0%, rgba(38,10,62,0.68) 38%, rgba(38,10,62,0.18) 100%)',
    'linear-gradient(to top, rgba(38,10,62,0.90) 0%, transparent 42%)',
  ].join(', '),
}

// ── Per-project tag colors — vivid pull from each gradient base ───────────────
const TAG_COLORS: Record<number, string> = {
  3: '#3D55D8', // Onyx — bright indigo blue
  1: '#C85518', // Bocca — burnt orange
  2: '#8B28C2', // Cortado — violet purple
}

// ── Scroll geometry ───────────────────────────────────────────────────────────
// GSAP pins this section for (TOTAL * 100vh) of scroll:
//   0 → 1 viewport: dwell on slide 0
//   1 → 2 viewports: slide 1 reveals from the bottom
//   2 → 3 viewports: slide 2 reveals from the bottom
// After 3 viewports the section unpins and normal page scroll resumes.

export default function CaseStudiesSection({ isDesktop }: { isDesktop: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)

  // Clip-path is written exclusively via GSAP (never via React style prop)
  // so React re-renders caused by textIndex changes never clobber GSAP's values.
  const imageRefs = useRef<(HTMLDivElement | null)[]>(Array(TOTAL).fill(null))

  const [textIndex, setTextIndex] = useState(0)
  const textIndexRef = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  // ── Mobile detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handle = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  // ── Set initial clip-paths before first paint ────────────────────────────────
  useLayoutEffect(() => {
    if (isMobile) return
    imageRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { clipPath: i === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' })
    })
  }, [isMobile])

  // ── GSAP ScrollTrigger ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Timeline: 3 equal units of duration (ratios are all that matter with scrub)
      //   t 0–1: nothing (dwell on slide 0)
      //   t 1–2: slide 1 clip-path reveals bottom-up
      //   t 2–3: slide 2 clip-path reveals bottom-up
      const tl = gsap.timeline()

      if (imageRefs.current[1]) {
        tl.fromTo(
          imageRefs.current[1],
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 1 },
          0 // ← starts immediately, no initial dwell
        )
      }

      if (imageRefs.current[2]) {
        tl.fromTo(
          imageRefs.current[2],
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 1 },
          1 // ← starts after slide 1 finishes
        )
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${(TOTAL - 1) * 1000}vh`,
        pin: true,
        scrub: 3,
        animation: tl,
        onUpdate(self) {
          // self.progress: 0→1 maps to t: 0→2 in the timeline
          //
          // Text swap at the midpoint of each image transition:
          //   Transition 1 midpoint: t=0.5 → progress = 0.5/2 = 0.25
          //   Transition 2 midpoint: t=1.5 → progress = 1.5/2 = 0.75
          const p = self.progress
          let next = 0
          if (p >= 0.25) next = 1
          if (p >= 0.75) next = 2
          if (next !== textIndexRef.current) {
            textIndexRef.current = next
            setTextIndex(next)
          }
        },
      })
    }, section)

    return () => ctx.revert()
  }, [isMobile])

  // ── Mobile: stacked full-height slides ──────────────────────────────────────
  if (isMobile) {
    return (
      <div>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}
          >
            <Image
              src={slide.heroImage}
              fill
              alt=""
              style={{ objectFit: 'cover' }}
              priority={i === 0}
              sizes="100vw"
            />
            <div style={{ position: 'absolute', inset: 0, background: GRADIENTS[slide.id] }} />

            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', flexDirection: 'column',
                padding: '0 clamp(24px, 5vw, 48px)',
              }}
            >
              {/* Top meta */}
              <div style={{ paddingTop: 'clamp(80px, 10vw, 120px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 500, letterSpacing: '0.10em',
                    color: 'rgba(255,255,255,0.38)',
                  }}>
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

              {/* Bottom content */}
              <div style={{ paddingBottom: 'clamp(64px, 9vw, 100px)' }}>
                <h2 style={{
                  color: '#ffffff', fontSize: 'clamp(26px, 6vw, 42px)',
                  fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em',
                  maxWidth: '15ch', marginBottom: 'clamp(24px, 3vw, 36px)',
                }}>
                  {slide.subtitle}
                </h2>
                <Link href={`/projects/${slide.id}`}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#d9ee72', color: '#042d2b',
                    padding: '11px 20px', borderRadius: 999,
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase',
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

  // ── Desktop: GSAP-pinned scroll-driven storytelling ──────────────────────────
  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: '#042d2b' }}
    >
      {/* ── Image layers ──────────────────────────────────────────────────────
          clipPath is NOT in the style prop — GSAP owns that property entirely.
          Each image sits above the previous one in z-order; the clip-path mask
          grows from the bottom, physically revealing the next project image.   */}
      {slides.map((slide, i) => (
        <div
          key={`img-${slide.id}`}
          ref={el => { imageRefs.current[i] = el }}
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            zIndex: i + 1,       // slide 0=z1, slide 1=z2, slide 2=z3
            willChange: 'clip-path',
          }}
        >
          <Image
            src={slide.heroImage}
            fill
            alt=""
            style={{ objectFit: 'cover' }}
            priority={i === 0}
            sizes="100vw"
          />
          <div style={{ position: 'absolute', inset: 0, background: GRADIENTS[slide.id] }} />
        </div>
      ))}

      {/* ── Text layers ───────────────────────────────────────────────────────
          All text layers live above every image (z=30). Only one is visible at
          a time; the switch happens at the 50% mark of each image transition.
          The cut is instant (0.13 s) — never a fade, never two texts visible.
          Layout anchors to the center progress line (top: 50%):
            · slide number   → just above the line
            · coloured tag   → straddling the line (vertically centered)
            · content block  → just below the line                          */}
      {slides.map((slide, i) => (
        <div
          key={`content-${slide.id}`}
          style={{
            position: 'absolute', inset: 0,
            zIndex: 30,
            opacity: i === textIndex ? 1 : 0,
            transition: 'opacity 0.13s ease',
            pointerEvents: i === textIndex ? 'auto' : 'none',
          }}
        >
          {/* ── Left column: slide number — above the line ── */}
          <div style={{
            position: 'absolute',
            left: 'clamp(24px, 5vw, 80px)',
            bottom: 'calc(50% + 10px)',
          }}>
            <span style={{
              fontSize: 13, fontWeight: 500, letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.35)',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>

          {/* ── Left column: "Case Study" label — below the line ── */}
          <div style={{
            position: 'absolute',
            left: 'clamp(24px, 5vw, 80px)',
            top: 'calc(50% + 12px)',
          }}>
            <p style={{
              fontSize: 11, fontWeight: 500, letterSpacing: '0.13em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)',
              margin: 0,
            }}>
              Case Study
            </p>
          </div>

          {/* ── Right column: category tag — above the line ── */}
          <div style={{
            position: 'absolute',
            left: 'clamp(140px, 18vw, 260px)',
            bottom: 'calc(50% + 8px)',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 16px', borderRadius: 999,
              background: TAG_COLORS[slide.id],
              color: '#ffffff',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
            }}>
              <slide.Icon size={11} />
              {slide.category}
            </span>
          </div>

          {/* ── Right column: title + button — below the line ── */}
          <div style={{
            position: 'absolute',
            top: 'calc(50% + clamp(22px, 3vh, 38px))',
            left: 'clamp(140px, 18vw, 260px)',
            right: 'clamp(24px, 5vw, 80px)',
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: 'clamp(30px, 3.8vw, 58px)',
              fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em',
              maxWidth: '15ch',
              marginBottom: 'clamp(28px, 3vw, 44px)',
            }}>
              {slide.subtitle}
            </h2>
            <Link href={`/projects/${slide.id}`} style={isDesktop ? { cursor: 'none' } : {}}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#d9ee72', color: '#042d2b',
                padding: '12px 22px', borderRadius: 999,
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                See Case Study
                <ArrowUpRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      ))}

      {/* ── Progress track ─────────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', zIndex: 40, pointerEvents: 'none',
          left: 'clamp(24px, 5vw, 80px)', right: 'clamp(24px, 5vw, 80px)',
          top: '50%', transform: 'translateY(-50%)',
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

      {/* ── Slide counter ──────────────────────────────────────────────────── */}
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
    </section>
  )
}
