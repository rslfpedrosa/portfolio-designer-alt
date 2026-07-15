'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MEDIA = [
  { src: '/explorations/petunia.webp',          type: 'image' as const },
  { src: '/explorations/exploration-1.mp4',     type: 'video' as const },
  { src: '/explorations/hello-Post.webm',       type: 'video' as const },
  { src: '/explorations/23126508_195.webp',     type: 'image' as const },
  { src: '/explorations/exploration-2.mp4',     type: 'video' as const },
  { src: '/explorations/012-2.webp',            type: 'image' as const },
  { src: '/explorations/exploration-3.mp4',     type: 'video' as const },
  { src: '/explorations/genes.webm',            type: 'video' as const },
  { src: '/explorations/exploration-4.mp4',     type: 'video' as const },
]
const N = MEDIA.length

// Virtual cards: enough to keep the arc always full at 20° spacing (18 × 20° = 360°)
const NUM_VIRTUAL = 18
const ANGLE_STEP = 360 / NUM_VIRTUAL   // 20°
const RADIUS = 750                      // arc radius (px)
const ROTATE_SPEED = 5.5               // degrees per second (display-rate independent)

const CARD_W = 260
const CARD_H = 163

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

// ─── Circular-arc carousel (rAF, direct DOM — zero React re-renders) ─────────
//
// Technique: each card sits on a circle via  rotateY(θ) translateZ(RADIUS).
// All cards share a single anchor div placed at the *bottom centre* of the panel.
// Because the center card (θ≈0) has the highest Z it appears tallest and closest;
// side cards curve back, producing the natural empty arc above them where the
// text lives without needing any extra gradient.
function ArcCarousel() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const globalAngle = useRef(0)
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (now: number) => {
      const dt = lastTimeRef.current === null ? 0 : Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      // Rotate the arc: cards move from right to left
      globalAngle.current = (globalAngle.current + ROTATE_SPEED * dt) % 360

      cardRefs.current.forEach((el, i) => {
        if (!el) return

        // Each card's angle in the arc, accounting for global rotation
        let angle = (i * ANGLE_STEP - globalAngle.current % 360 + 360) % 360
        if (angle > 180) angle -= 360          // normalise to [-180, 180]

        const abs = Math.abs(angle)
        if (abs > 94) { el.style.visibility = 'hidden'; return }

        el.style.visibility = 'visible'
        el.style.transform = `rotateY(${angle}deg) translateZ(${RADIUS}px)`
        el.style.zIndex = String(Math.round(100 - abs))
        // Fade cards as they approach the ±90° edge
        el.style.opacity = abs > 88 ? String(Math.max(0, 1 - (abs - 88) / 6)) : '1'
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame((now) => { lastTimeRef.current = now; rafRef.current = requestAnimationFrame(animate) })
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {/*
        Perspective anchor: a zero-size div at the bottom-center of the panel.
        perspective-origin '0 0' means the vanishing point IS this anchor.
        Cards extend upward (marginTop: -CARD_H) so the arc rises from here.
      */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: `-${CARD_H / 4}px`,
          width: 0,
          height: 0,
          perspective: `${RADIUS * 2.4}px`,
          perspectiveOrigin: '0 0',
        }}
      >
        {Array.from({ length: NUM_VIRTUAL }, (_, i) => {
          const item = MEDIA[i % N]
          return (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H,        // bottom of card sits at anchor → cards hang above
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 24px 72px rgba(0,0,0,0.65)',
                willChange: 'transform, opacity',
                visibility: 'hidden',      // rAF sets this each frame
              }}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  autoPlay muted loop playsInline preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <img
                  src={item.src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  draggable={false}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Side fades into the black panel edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, #000 0%, transparent 5%, transparent 95%, #000 100%)',
        pointerEvents: 'none',
        zIndex: 10,
      }} />
    </div>
  )
}

// ─── Text block — sits above the arc's natural open space ────────────────────
function CentreText() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: `${Math.round(CARD_H * (RADIUS * 2.4) / (RADIUS * 1.4) - CARD_H / 4)}px`,
        textAlign: 'center',
        zIndex: 20,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2 style={{ fontSize: 'clamp(4.5rem, 8vw, 10rem)', fontWeight: 400, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1, marginBottom: '0.25em' }}>
        Sandbox
      </h2>
      <p style={{ fontSize: '18px', fontWeight: 500, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.65em' }}>
        Design, without the brief.
      </p>
      <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, maxWidth: '38ch' }}>
        UI explorations, interaction studies, motion experiments, and visual concepts.
      </p>
      <Link href="/lab" data-cursor="take-a-peek" style={{ pointerEvents: 'auto', marginTop: '1.5em' }}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '17px', fontWeight: 500, color: '#ffffff',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '999px', padding: '10px 24px',
            transition: 'border-color 0.18s ease', whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
        >
          Explore the sandbox
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DesignShowcase() {
  const outerSectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Only one layout is ever actually mounted at a time (matches Tailwind's `lg` breakpoint).
  // Previously both desktop and mobile variants were always in the DOM (just CSS-hidden),
  // which meant every autoplaying video in the carousel was fetched and decoded twice.
  const [isWide, setIsWide] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsWide(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Defer mounting the carousel's videos/images until the section is actually
  // close to the viewport, instead of fetching ~30MB of video the instant this
  // client-only chunk loads (which previously happened immediately on page load,
  // regardless of scroll position).
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = wrapperRef.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '800px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  useEffect(() => {
    const section = outerSectionRef.current
    if (!section || !isWide) return
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=200vh',
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
    })
    ScrollTrigger.refresh()
    return () => st.kill()
  }, [isWide])

  if (isWide === null) {
    return <div ref={wrapperRef} className="py-16 bg-white" />
  }

  return (
    <div ref={wrapperRef}>
    {isWide ? (
      <section
        ref={outerSectionRef}
        className="relative px-4 sm:px-6 lg:px-8"
        style={{
          height: '100svh',
          overflow: 'visible',
          paddingTop: 'clamp(80px, 9vh, 96px)',
          paddingBottom: 'clamp(40px, 5vh, 80px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Page-level dot pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sandbox-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sandbox-dots)" />
          </svg>
        </div>
        {/* Dashed column lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
            <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 8px', backgroundRepeat: 'repeat-y' }} />
            <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 8px', backgroundRepeat: 'repeat-y' }} />
          </div>
        </div>
        {/* Horizontal dashed lines aligned with panel edges */}
        <div aria-hidden style={{ position: 'absolute', top: 'clamp(80px,9vh,96px)', left: 0, right: 0, height: 1, backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: 'clamp(40px,5vh,80px)', left: 0, right: 0, height: 1, backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto" style={{ position: 'relative', height: '100%' }}>
          {/* Figma component label */}
          <div
            aria-hidden
            style={{
              position: 'absolute', bottom: 'calc(100% + 8px)', left: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#9747FF', zIndex: 50, pointerEvents: 'none',
            }}
          >
            <img src="/icons/component.svg" alt="" width={14} height={14} style={{ display: 'block' }} />
            <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1 }}>Sandbox</span>
          </div>

          {/* Black bordered panel */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              border: '1.5px solid #9747FF',
              background: '#000000',
              overflow: 'visible',      // keep for corner pins
            }}
          >
            {/* Dot pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="sandbox-panel-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="6" cy="6" r="0.75" fill="rgba(255,255,255,0.12)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#sandbox-panel-dots)" />
              </svg>
            </div>

            {/* Corner pin squares */}
            {CORNERS.map(corner => (
              <div
                key={corner}
                style={{
                  position: 'absolute', width: 12, height: 12, borderRadius: 2,
                  zIndex: 30, pointerEvents: 'none',
                  backgroundColor: '#ffffff', border: '1px solid #9747FF',
                  top: corner.startsWith('top') ? -6 : undefined,
                  bottom: corner.startsWith('bottom') ? -6 : undefined,
                  left: corner.endsWith('left') ? -6 : undefined,
                  right: corner.endsWith('right') ? -6 : undefined,
                }}
              />
            ))}

            {/* Carousel inside its own clipping div */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {inView && <ArcCarousel />}
            </div>

            {/* Text above the arc */}
            <CentreText />
          </div>
        </div>
      </section>
    ) : (
      /* ── Mobile + Tablet ── */
      <section
        className="relative"
        style={{
          paddingTop: 'clamp(80px, 16vw, 120px)',
          paddingBottom: 'clamp(48px, 10vw, 80px)',
          overflow: 'visible',
        }}
      >
        {/* Page-level dot pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sandbox-dots-m" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sandbox-dots-m)" />
          </svg>
        </div>
        {/* Dashed column lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 max-w-7xl mx-auto">
            <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 8px', backgroundRepeat: 'repeat-y' }} />
            <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 8px', backgroundRepeat: 'repeat-y' }} />
          </div>
        </div>
        {/* Horizontal dashed lines aligned with panel edges */}
        <div aria-hidden style={{ position: 'absolute', top: 'clamp(80px,16vw,120px)', left: 0, right: 0, height: 1, backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: 'clamp(48px,10vw,80px)', left: 0, right: 0, height: 1, backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x', pointerEvents: 'none' }} />

        <div className="px-4 sm:px-6 max-w-7xl mx-auto" style={{ position: 'relative' }}>
          {/* Figma component label */}
          <div
            aria-hidden
            style={{
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#9747FF', pointerEvents: 'none',
            }}
          >
            <img src="/icons/component.svg" alt="" width={14} height={14} style={{ display: 'block' }} />
            <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1 }}>Sandbox</span>
          </div>

          {/* Black bordered panel */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 'min(85svh, 600px)',
              border: '1.5px solid #9747FF',
              background: '#000000',
              overflow: 'visible',
            }}
          >
            {/* Corner pin squares */}
            {CORNERS.map(corner => (
              <div
                key={corner}
                style={{
                  position: 'absolute', width: 12, height: 12, borderRadius: 2,
                  zIndex: 30, pointerEvents: 'none',
                  backgroundColor: '#ffffff', border: '1px solid #9747FF',
                  top: corner.startsWith('top') ? -6 : undefined,
                  bottom: corner.startsWith('bottom') ? -6 : undefined,
                  left: corner.endsWith('left') ? -6 : undefined,
                  right: corner.endsWith('right') ? -6 : undefined,
                }}
              />
            ))}

            {/* Carousel inside its own clipping div */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {inView && <ArcCarousel />}
            </div>

            {/* Text above the arc */}
            <CentreText />
          </div>
        </div>
      </section>
    )}
    </div>
  )
}
