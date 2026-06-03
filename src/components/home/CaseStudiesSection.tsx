'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Home } from 'lucide-react'
import { projectsData } from '@/data/projects'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Slide configuration ──────────────────────────────────────────────────────
const SLIDE_IDS = [3, 1, 2]
type LucideIcon = React.ComponentType<{ size?: number }>
const ICONS: Record<number, LucideIcon> = { 1: ShoppingBag, 2: Home, 3: Heart }
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

// ── Per-project tag glass tints — rgba pulled from each gradient base ────────
const TAG_GLASS: Record<number, { bg: string; border: string }> = {
  3: { bg: 'rgba(61, 85, 216, 0.28)',  border: 'rgba(100, 130, 255, 0.35)' }, // Onyx — indigo blue
  1: { bg: 'rgba(200, 85, 24, 0.28)',  border: 'rgba(240, 120, 60, 0.35)' },  // Bocca — burnt orange
  2: { bg: 'rgba(139, 40, 194, 0.28)', border: 'rgba(185, 90, 240, 0.35)' },  // Cortado — violet purple
}

// ── Text animation variants ───────────────────────────────────────────────────
// Line reveal: text lives in an overflow:hidden mask and slides up into view.
// This is the editorial "curtain" technique used on sites like floema.com.
const EASE_REVEAL = [0.55, 0, 0.1, 1] as [number, number, number, number]
const EASE_FADE   = [0.22, 1, 0.36, 1] as [number, number, number, number]

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
// Small text (label, number) — quick snap up
const lineRevealSm = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.7, ease: EASE_REVEAL } },
}
// Large title — slower, more weight
const lineRevealLg = {
  hidden: { y: '105%' },
  visible: { y: '0%', transition: { duration: 1.0, ease: EASE_REVEAL } },
}
// Pill tag + button — opacity+lift (clip looks odd on rounded shapes)
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_FADE } },
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
  const innerImageRefs = useRef<(HTMLDivElement | null)[]>(Array(TOTAL).fill(null))

  // Start at -1 so the first slide's content also animates in via AnimatePresence
  const [textIndex, setTextIndex] = useState(-1)
  const textIndexRef = useRef(-1)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [hoveredButton, setHoveredButton] = useState<number | null>(null)

  // ── Set initial clip-paths before first paint ────────────────────────────────
  useLayoutEffect(() => {
    imageRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { clipPath: i === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' })
    })
    innerImageRefs.current.forEach(el => {
      if (el) gsap.set(el, { y: 20 })
    })
  }, [])

  // ── GSAP ScrollTrigger ───────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const parallaxSetters = innerImageRefs.current.map(el =>
        el ? gsap.quickSetter(el, 'y', 'px') : null
      )

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
        onEnter() {
          // Trigger the enter animation for the first slide
          if (textIndexRef.current === -1) {
            textIndexRef.current = 0
            setTextIndex(0)
          }
        },
        onUpdate(self) {
          const p = self.progress

          // Drive progress bar width directly — no React state, no CSS transition
          if (progressBarRef.current) {
            const w = ((1 + (TOTAL - 1) * p) / TOTAL) * 100
            progressBarRef.current.style.width = `${w}%`
          }

          // Text swap at the midpoint of each image transition:
          //   Transition 1 midpoint: t=0.5 → progress = 0.5/2 = 0.25
          //   Transition 2 midpoint: t=1.5 → progress = 1.5/2 = 0.75
          let next = 0
          if (p >= 0.25) next = 1
          if (p >= 0.75) next = 2
          if (next !== textIndexRef.current) {
            textIndexRef.current = next
            setTextIndex(next)
          }

          // Parallax: images drift upward as scroll progresses
          const py = (0.5 - p) * 40
          parallaxSetters.forEach(setter => setter && setter(py))
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: '#042d2b' }}
    >
      {/* SVG goo filter — makes the icon box and pill merge like cells on hover */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden>
        <defs>
          <filter id="cs-cell-merge" x="-30%" y="-50%" width="160%" height="200%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 38 -17" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
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
            overflow: 'hidden',
          }}
        >
          <div
            ref={el => { innerImageRefs.current[i] = el }}
            style={{
              position: 'absolute',
              inset: '-8% 0',   // extra headroom for parallax travel
              willChange: 'transform',
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
        </div>
      ))}

      {/* ── Text layers ───────────────────────────────────────────────────────
          Stagger order (DOM = visual stagger sequence):
            1. number  2. "Case Study" label  3. tag  4. title  5. button
          Text elements use a line-mask reveal (overflow:hidden + translateY).
          display:flex on the clipping div removes the CSS baseline gap that
          would otherwise push the number away from its bottom anchor.
          Pill/button use opacity+lift — clip looks wrong on rounded shapes.  */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
        <AnimatePresence mode="wait">
          {slides.map((slide, i) => i !== textIndex ? null : (
            <motion.div
              key={`content-${slide.id}`}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              style={{ position: 'absolute', inset: 0 }}
            >
              {/* 1. Slide number — above line, left column */}
              <div style={{
                position: 'absolute',
                left: 'clamp(24px, 5vw, 80px)',
                bottom: 'calc(50% + 18px)',
                overflow: 'hidden',
                display: 'flex',  // eliminates inline baseline gap
              }}>
                <motion.span
                  variants={lineRevealSm}
                  style={{
                    fontSize: 36, fontWeight: 500, letterSpacing: '0.12em',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>
              </div>

              {/* 2. "Case Study" label — below line, left column (desktop) */}
              {isDesktop && (
                <div style={{
                  position: 'absolute',
                  left: 'clamp(24px, 5vw, 80px)',
                  top: 'calc(50% + 12px)',
                  overflow: 'hidden',
                  display: 'flex',
                }}>
                  <motion.p
                    variants={lineRevealSm}
                    style={{
                      fontSize: 11, fontWeight: 500, letterSpacing: '0.13em',
                      textTransform: 'uppercase', color: '#ffffff',
                      margin: 0, lineHeight: 1,
                    }}
                  >
                    Case Study
                  </motion.p>
                </div>
              )}

              {/* 3. Category tag — above line, right column */}
              <div style={{
                position: 'absolute',
                left: isDesktop ? 'clamp(90px, 28vw, 380px)' : 'clamp(60px, 18vw, 380px)',
                bottom: 'calc(50% + 18px)',
                display: 'flex',
              }}>
                <motion.span
                  variants={fadeUp}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '6px 16px', borderRadius: 999,
                    background: TAG_GLASS[slide.id].bg,
                    border: `1px solid ${TAG_GLASS[slide.id].border}`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: '#ffffff',
                    fontSize: 13, fontWeight: 600, letterSpacing: '0.07em',
                  }}
                >
                  <slide.Icon size={13} />
                  {slide.category}
                </motion.span>
              </div>

              {/* 4 + 5. Title then button — below line, right column */}
              <div style={{
                position: 'absolute',
                top: 'calc(50% + clamp(22px, 3vh, 38px))',
                left: isDesktop ? 'clamp(90px, 28vw, 380px)' : 'clamp(60px, 18vw, 380px)',
                right: 'clamp(24px, 5vw, 80px)',
              }}>
                {/* 4. Title */}
                <div style={{ overflow: 'hidden', marginBottom: 'clamp(28px, 3vw, 44px)' }}>
                  <motion.h2
                    variants={lineRevealLg}
                    style={{
                      color: '#ffffff',
                      fontSize: isDesktop ? 'clamp(30px, 3.8vw, 58px)' : 'clamp(28px, 7.5vw, 48px)',
                      fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em',
                      maxWidth: '22ch',
                      margin: 0,
                    }}
                  >
                    {slide.subtitle}
                  </motion.h2>
                </div>

                {/* 5. Button */}
                <motion.div variants={fadeUp}>
                  <Link href={`/projects/${slide.id}`} style={isDesktop ? { cursor: 'none' } : {}}>
                    <div
                      onMouseEnter={() => setHoveredButton(i)}
                      onMouseLeave={() => setHoveredButton(null)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        filter: 'url(#cs-cell-merge)',
                        padding: '8px 12px 8px 2px',
                      }}
                    >
                      <div style={{
                        width: 46, height: 46,
                        background: 'white', borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        marginRight: hoveredButton === i ? 4 : -10,
                        transition: 'margin-right 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative', zIndex: 1,
                      }}>
                        <img src="/icons/arrow.svg" alt="" width={14} height={14} style={{ display: 'block' }} />
                      </div>
                      <div style={{
                        height: 46, background: 'white', borderRadius: 16,
                        display: 'flex', alignItems: 'center',
                        padding: '0 22px 0 24px',
                        fontSize: 14, fontWeight: 500,
                        textTransform: 'uppercase', color: '#241f21',
                        WebkitTextStroke: '0.2px #241f21',
                        whiteSpace: 'nowrap',
                      }}>
                        See Case Study
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Progress track ─────────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', zIndex: 40, pointerEvents: 'none',
          left: 0, right: 0,
          top: '50%', transform: 'translateY(-50%)',
          height: 1,
          background: 'rgba(255,255,255,0.10)',
        }}
      >
        <div ref={progressBarRef} style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${(1 / TOTAL) * 100}%`,
          background: 'rgba(255,255,255,0.55)',
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
          {textIndex >= 0 && (
            <motion.span
              key={textIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
            >
              {String(textIndex + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
