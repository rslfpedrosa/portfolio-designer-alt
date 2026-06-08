'use client'

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TRAIL_MEDIA: Array<{ src: string; type: 'video' | 'image' }> = [
  { src: '/explorations/exploration-1.mp4',     type: 'video' },
  { src: '/explorations/hello-Post.webm',       type: 'video' },
  { src: '/explorations/23126508_195.webp',     type: 'image' },
  { src: '/explorations/exploration-2.mp4',     type: 'video' },
  { src: '/explorations/012-2.webp',            type: 'image' },
  { src: '/explorations/exploration-3.mp4',     type: 'video' },
  { src: '/explorations/genes.webm',            type: 'video' },
  { src: '/explorations/exploration-4.mp4',     type: 'video' },
]

// Used only by the mobile horizontal-scroll layout
const MOBILE_CARDS = [
  { rotation: -8, pos: { top: '8%',    left: '6%'  } },
  { rotation: 4,  pos: { top: '7%',    right: '6%' } },
  { rotation: -5, pos: { bottom: '8%', left: '6%'  } },
  { rotation: 7,  pos: { bottom: '7%', right: '6%' } },
]
const MOBILE_MEDIA = TRAIL_MEDIA.slice(0, 4)

interface TrailCard {
  id: number
  x: number
  y: number
  rotation: number
  mediaIndex: number
}

const MAX_TRAIL     = 10    // hard cap during fast sweeps
const MIN_DIST      = 75    // px between spawns
const CARD_LIFETIME = 2000  // ms each card lives before auto-fading
const IDLE_DELAY    = 100   // ms after last move before sequential fade starts
const FADE_STEP     = 60    // ms between each removal when idle


function CentreText({ onButtonEnter, onButtonLeave }: { onButtonEnter?: () => void; onButtonLeave?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        zIndex: 20,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(4.5rem, 8vw, 10rem)',
          fontWeight: 400,
          letterSpacing: '-0.04em',
          color: '#241f21',
          lineHeight: 1,
          marginBottom: '0.25em',
        }}
      >
        Sandbox
      </h2>
      <p
        style={{
          fontSize: '18px',
          fontWeight: 500,
          color: '#241f21',
          letterSpacing: '-0.02em',
          marginBottom: '0.65em',
        }}
      >
        Design, without the brief.
      </p>
      <p
        style={{
          fontSize: '17px',
          color: 'rgba(36,31,33,0.5)',
          lineHeight: 1.55,
          maxWidth: '38ch',
        }}
      >
        UI explorations, interaction studies, motion experiments, and visual concepts.
      </p>
      <Link
        href="/lab"
        data-cursor="take-a-peek"
        style={{ pointerEvents: 'auto', marginTop: '1.5em' }}
        onMouseEnter={onButtonEnter}
        onMouseLeave={onButtonLeave}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '17px',
            fontWeight: 500,
            color: '#241f21',
            background: '#ffffff',
            border: '1px solid rgba(36,31,33,0.35)',
            borderRadius: '999px',
            padding: '10px 24px',
            transition: 'border-color 0.18s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#241f21')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(36,31,33,0.35)')}
        >
          Explore the sandbox
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}

export default function DesignShowcase() {
  const [trailCards, setTrailCards] = useState<TrailCard[]>([])
  const sectionRef      = useRef<HTMLElement>(null)
  const lastPosRef      = useRef<{ x: number; y: number } | null>(null)
  const idRef           = useRef(0)
  const mediaRef        = useRef(0)
  const idleTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cardTimersRef   = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())
  const isButtonHoveredRef = useRef(false)

  const removeCard = useCallback((cardId: number) => {
    setTrailCards(prev => prev.filter(c => c.id !== cardId))
    cardTimersRef.current.delete(cardId)
  }, [])

  // Shared spawn logic used by both the real cursor and the auto-demo
  const spawnCardAt = useCallback((x: number, y: number) => {
    const cardId = idRef.current++
    const card: TrailCard = {
      id:         cardId,
      x, y,
      rotation:   (Math.random() - 0.5) * 22,
      mediaIndex: mediaRef.current++ % TRAIL_MEDIA.length,
    }
    setTrailCards(prev => {
      const next = [...prev, card]
      if (next.length > MAX_TRAIL) {
        next.slice(0, next.length - MAX_TRAIL).forEach(c => {
          const t = cardTimersRef.current.get(c.id)
          if (t) { clearTimeout(t); cardTimersRef.current.delete(c.id) }
        })
        return next.slice(next.length - MAX_TRAIL)
      }
      return next
    })
    const timer = setTimeout(() => removeCard(cardId), CARD_LIFETIME)
    cardTimersRef.current.set(cardId, timer)
  }, [removeCard])

  const stopFade = useCallback(() => {
    if (idleTimerRef.current)    { clearTimeout(idleTimerRef.current);    idleTimerRef.current    = null }
    if (fadeIntervalRef.current) { clearInterval(fadeIntervalRef.current); fadeIntervalRef.current = null }
  }, [])

  const startFade = useCallback(() => {
    if (fadeIntervalRef.current) return
    fadeIntervalRef.current = setInterval(() => {
      setTrailCards(prev => {
        if (prev.length === 0) {
          clearInterval(fadeIntervalRef.current!)
          fadeIntervalRef.current = null
          return prev
        }
        // Clear lifetime timer for the card being sequentially removed
        const t = cardTimersRef.current.get(prev[0].id)
        if (t) { clearTimeout(t); cardTimersRef.current.delete(prev[0].id) }
        return prev.slice(1)
      })
    }, FADE_STEP)
  }, [])

  const scheduleFade = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(startFade, IDLE_DELAY)
  }, [startFade])

  // Use a window-level listener so the trail fires regardless of which tool overlay
  // (pen canvas portalled to body, sticky fixed overlay) is on top of the section.
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return

      const inSection =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom

      if (!inSection) {
        if (lastPosRef.current !== null) {
          lastPosRef.current = null
          scheduleFade()
        }
        return
      }

      if (isButtonHoveredRef.current) return
      stopFade()

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const last = lastPosRef.current
      if (last) {
        const dx = x - last.x
        const dy = y - last.y
        if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) {
          scheduleFade()
          return
        }
      }
      lastPosRef.current = { x, y }
      spawnCardAt(x, y)
      scheduleFade()
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [stopFade, scheduleFade, spawnCardAt])

  // Clean up all timers on unmount
  useEffect(() => () => {
    stopFade()
    cardTimersRef.current.forEach(t => clearTimeout(t))
  }, [stopFade])

  // Pin the desktop section for 100vh of scroll so the cursor animation is visible
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100vh',
        pin: true,
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* ── Desktop: cursor-trail layout ── */}
      <section
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ minHeight: '100vh' }}
      >
        {/* Dot pattern */}
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
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
            <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
            <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          </div>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        </div>

        <CentreText
          onButtonEnter={() => { isButtonHoveredRef.current = true; lastPosRef.current = null; startFade() }}
          onButtonLeave={() => { isButtonHoveredRef.current = false; stopFade() }}
        />

        {/* Hint label — disappears once the first card appears */}
        <AnimatePresence>
          {trailCards.length === 0 && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                position: 'absolute',
                bottom: '9%',
                left: '50%',
                translateX: '-50%',
                fontSize: 13,
                color: 'rgba(36,31,33,0.38)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
                zIndex: 5,
                whiteSpace: 'nowrap',
              }}
            >
              Move your cursor to explore
            </motion.p>
          )}
        </AnimatePresence>

        {/* Trail cards — newest (i = length-1) at full size, oldest (i = 0) smallest */}
        <AnimatePresence>
          {trailCards.map((card, i) => {
            const item = TRAIL_MEDIA[card.mediaIndex]
            const total = trailCards.length
            // i=0 oldest → 0.62 scale, i=total-1 newest → 1.0 scale
            const scaleTarget = total === 1 ? 1 : 0.62 + (i / (total - 1)) * 0.38
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.42, y: 14, rotate: card.rotation - 5 }}
                animate={{ opacity: 1, scale: scaleTarget, y: 0, rotate: card.rotation }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
                transition={{
                  opacity: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                  scale:   { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  y:       { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                  rotate:  { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                }}
                style={{
                  position: 'absolute',
                  left: card.x,
                  top:  card.y,
                  translateX: '-50%',
                  translateY: '-50%',
                  width: 'clamp(180px, 21vw, 300px)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: '0 12px 48px rgba(36,31,33,0.22)',
                  zIndex: i + 1,
                  pointerEvents: 'none',
                }}
              >
                <div style={{ aspectRatio: '16/10' }}>
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      autoPlay muted loop playsInline preload="auto"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </section>

      {/* ── Mobile + Tablet: horizontal scroll layout ── */}
      <section
        className="relative lg:hidden"
        style={{
          paddingTop: 'clamp(80px, 16vw, 120px)',
          paddingBottom: 'clamp(48px, 10vw, 80px)',
          overflow: 'hidden',
        }}
      >
        {/* Dot pattern */}
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
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
            <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
            <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          </div>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        </div>

        <div className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto" style={{ textAlign: 'center', marginBottom: 'clamp(28px, 7vw, 48px)', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: 'clamp(3.5rem, 18vw, 5.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: '#241f21',
              lineHeight: 1,
              marginBottom: '0.1em',
            }}
          >
            Sandbox
          </h2>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#241f21',
              letterSpacing: '-0.02em',
              marginBottom: '0.5em',
            }}
          >
            Design, without the brief.
          </p>
          <p
            style={{
              fontSize: '17px',
              color: 'rgba(36,31,33,0.5)',
              lineHeight: 1.55,
              marginBottom: '1.25em',
            }}
          >
            UI explorations, interaction studies, motion experiments, and visual concepts.
          </p>
          <Link href="/lab" data-cursor="take-a-peek">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '17px',
                fontWeight: 500,
                color: '#241f21',
                background: '#ffffff',
                border: '1px solid rgba(36,31,33,0.35)',
                borderRadius: '999px',
                padding: '10px 24px',
                whiteSpace: 'nowrap',
              }}
            >
              Explore the sandbox
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>
        </div>

        <div
          style={{
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            gap: '28px',
            paddingLeft: '14vw',
            paddingRight: '14vw',
            paddingTop: '32px',
            paddingBottom: '40px',
            position: 'relative',
            zIndex: 1,
          }}
          className="scrollbar-hide"
        >
          {MOBILE_MEDIA.map((item, index) => (
            <div
              key={item.src}
              style={{
                flexShrink: 0,
                width: '85vw',
                maxWidth: '520px',
                scrollSnapAlign: 'center',
                transform: `rotate(${MOBILE_CARDS[index].rotation}deg)`,
                borderRadius: '5px',
                overflow: 'hidden',
                boxShadow: '0 6px 28px rgba(36,31,33,0.13)',
              }}
            >
              <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
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
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
