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

      // Timeline: dwell(0.5) + transition(1) + transition(1) = 2.5 units total
      //   t 0–0.5:   dwell on slide 0 (nothing moves)
      //   t 0.5–1.5: slide 1 clip-path reveals bottom-up
      //   t 1.5–2.5: slide 2 clip-path reveals bottom-up
      const DWELL = 0.5
      const TRANS = 1
      const TOTAL_TL = DWELL + TRANS * (TOTAL - 1) // 2.5
      const dwellP = DWELL / TOTAL_TL              // 0.2
      const transP = TRANS / TOTAL_TL              // 0.4
      const tl = gsap.timeline()

      if (imageRefs.current[1]) {
        tl.fromTo(
          imageRefs.current[1],
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: TRANS },
          DWELL
        )
      }

      if (imageRefs.current[2]) {
        tl.fromTo(
          imageRefs.current[2],
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: TRANS },
          DWELL + TRANS
        )
      }

      // Fire first-slide text reveal early — before the section pins
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter() {
          if (textIndexRef.current === -1) {
            textIndexRef.current = 0
            setTextIndex(0)
          }
        },
      })

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${(TOTAL - 1) * 1000}vh`,
        pin: true,
        scrub: 3,
        animation: tl,
        onUpdate(self) {
          const p = self.progress

          // Drive progress bar width directly — no React state, no CSS transition
          // 0→1/3 during dwell, 1/3→2/3 during transition 1, 2/3→1 during transition 2
          if (progressBarRef.current) {
            let segIdx: number, segStart: number, segLen: number
            if (p < dwellP) {
              segIdx = 0; segStart = 0; segLen = dwellP
            } else if (p < dwellP + transP) {
              segIdx = 1; segStart = dwellP; segLen = transP
            } else {
              segIdx = 2; segStart = dwellP + transP; segLen = transP
            }
            const barW = (segIdx + (p - segStart) / segLen) / TOTAL
            progressBarRef.current.style.width = `${barW * 100}%`
          }

          // Text swap at the midpoint of each image transition:
          //   Transition 1 midpoint: t=1.0 → progress = 1.0/2.5 = 0.40
          //   Transition 2 midpoint: t=2.0 → progress = 2.0/2.5 = 0.80
          let next = 0
          if (p >= 0.40) next = 1
          if (p >= 0.80) next = 2
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

  const displayIndex = textIndex >= 0 ? textIndex : 0

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8"
      style={{
        position: 'relative',
        zIndex: 30,
        height: '100svh',
        background: '#ffffff',
        paddingTop: isDesktop ? 'clamp(80px,9vh,96px)' : 'clamp(96px,12vh,120px)',
        paddingBottom: 'clamp(40px,5vh,80px)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cs-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cs-dots)" />
        </svg>
      </div>

      {/* Vertical dashed lines — same container as other sections */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>

      {/* Horizontal dashed lines above and below card */}
      <div aria-hidden style={{ position: 'absolute', top: isDesktop ? 'clamp(80px,9vh,96px)' : 'clamp(96px,12vh,120px)', left: 0, right: 0, height: 1, backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 'clamp(40px,5vh,80px)', left: 0, right: 0, height: 1, backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x', pointerEvents: 'none' }} />

      {/* ── Bordered slideshow frame ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto h-full" style={{ position: 'relative' }}>

        {/* ── Figma component label ──────────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#9747FF',
            zIndex: 50, pointerEvents: 'none',
          }}
        >
          <img src="/icons/component.svg" alt="" width={14} height={14} style={{ display: 'block' }} />
          <AnimatePresence mode="wait">
            <motion.span
              key={displayIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1 }}
            >
              Case Study {String(displayIndex + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        border: '1.5px solid #9747FF',
        overflow: 'hidden',
        background: '#042d2b',
      }}>
        {/* ── Image layers ────────────────────────────────────────────────────
            clipPath is NOT in the style prop — GSAP owns that property entirely.
            Each image sits above the previous one in z-order; the clip-path mask
            grows from the bottom, physically revealing the next project image.  */}
        {slides.map((slide, i) => (
          <div
            key={`img-${slide.id}`}
            ref={el => { imageRefs.current[i] = el }}
            aria-hidden
            style={{
              position: 'absolute', inset: 0,
              zIndex: i + 1,
              willChange: 'clip-path',
              overflow: 'hidden',
            }}
          >
            <div
              ref={el => { innerImageRefs.current[i] = el }}
              style={{
                position: 'absolute',
                inset: '-8% 0',
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

        {/* ── Text layers ─────────────────────────────────────────────────────
            Stagger order (DOM = visual stagger sequence):
              1. number  2. "Case Study" label  3. tag  4. title  5. button
            Text elements use a line-mask reveal (overflow:hidden + translateY).
            display:flex on the clipping div removes the CSS baseline gap that
            would otherwise push the number away from its bottom anchor.
            Pill/button use opacity+lift — clip looks wrong on rounded shapes. */}
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
                {/* 3. Category tag — above line */}
                <div style={{
                  position: 'absolute',
                  left: 'clamp(24px, 5vw, 80px)',
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

                {/* 4 + 5. Title then button — below line */}
                <div style={{
                  position: 'absolute',
                  top: 'calc(50% + clamp(22px, 3vh, 38px))',
                  left: 'clamp(24px, 5vw, 80px)',
                  right: 'clamp(24px, 5vw, 80px)',
                }}>
                  {/* 4. Title */}
                  <div style={{ overflow: 'hidden', marginBottom: 'clamp(12px, 1.5vw, 20px)' }}>
                    <motion.h2
                      variants={lineRevealLg}
                      style={{
                        color: '#ffffff',
                        fontSize: isDesktop ? 'clamp(36px, 4.8vw, 58px)' : 'clamp(28px, 7.5vw, 48px)',
                        fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em',
                        maxWidth: i === 0 ? 'none' : '22ch',
                        margin: 0,
                      }}
                    >
                      {i === 0 && isDesktop
                        ? <>Rethinking Care Management<br />for CPPS Treatment</>
                        : slide.subtitle}
                    </motion.h2>
                  </div>

                  {/* 4.5 Description */}
                  <motion.p
                    variants={fadeUp}
                    style={{
                      color: 'rgba(255,255,255,0.60)',
                      fontSize: isDesktop ? 'clamp(16px, 1.8vw, 20px)' : 'clamp(15px, 4vw, 18px)',
                      lineHeight: 1.65,
                      maxWidth: i === 0 ? 'none' : '38ch',
                      margin: 0,
                      marginBottom: 'clamp(20px, 2.5vw, 36px)',
                    }}
                  >
                    {i === 0 && isDesktop
                      ? <>Making it easier for physical therapists to track progress,<br />make decisions, and adapt care with confidence.</>
                      : slide.tagline ?? slide.description}
                  </motion.p>

                  {/* 5. Button */}
                  <motion.div variants={fadeUp}>
                    <Link href={`/projects/${slide.id}`} style={isDesktop ? { cursor: 'none' } : {}}>
                      <div
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 17,
                          fontWeight: 500,
                          color: '#241f21',
                          background: '#ffffff',
                          border: '1px solid #ffffff',
                          borderRadius: 999,
                          padding: '10px 24px',
                          transition: 'opacity 0.18s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        See Case Study
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Progress track ───────────────────────────────────────────────── */}
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
            width: '0%',
            background: 'rgba(255,255,255,0.55)',
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
      </div>
      </div>
    </section>
  )
}
