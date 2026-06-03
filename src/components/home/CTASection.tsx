'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import Link from 'next/link'
import PhysicsPills from './PhysicsPills'

const CYCLING_PHRASES = ["Let's Talk.", "Let's Connect.", "Let's Collaborate.", "Let's Create."]

export default function CTASection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-5%' })

  // Typewriter state
  const [entered, setEntered] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [phraseWidth, setPhraseWidth] = useState(0)
  const displayTextRef = useRef('')
  const animTimeoutsRef = useRef<NodeJS.Timeout[]>([])
  const measureRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (shouldReduceMotion) { setEntered(true); return }
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
  }, [shouldReduceMotion])

  useEffect(() => {
    if (!entered) return
    let interval: NodeJS.Timeout
    const startDelay = setTimeout(() => {
      interval = setInterval(() => {
        setPhraseIndex(i => (i + 1) % CYCLING_PHRASES.length)
      }, 5500)
    }, 1200)
    return () => { clearTimeout(startDelay); clearInterval(interval) }
  }, [entered])

  useEffect(() => {
    if (!entered) return
    animTimeoutsRef.current.forEach(clearTimeout)
    animTimeoutsRef.current = []

    const target = CYCLING_PHRASES[phraseIndex]
    const current = displayTextRef.current
    const ERASE_SPEED = 80
    const TYPE_SPEED = 120

    for (let i = current.length - 1; i >= 0; i--) {
      const erased = current.slice(0, i)
      const delay = (current.length - 1 - i) * ERASE_SPEED
      const t = setTimeout(() => { displayTextRef.current = erased; setDisplayText(erased) }, delay)
      animTimeoutsRef.current.push(t)
    }

    const offset = current.length * ERASE_SPEED
    for (let i = 1; i <= target.length; i++) {
      const typed = target.slice(0, i)
      const t = setTimeout(() => { displayTextRef.current = typed; setDisplayText(typed) }, offset + i * TYPE_SPEED)
      animTimeoutsRef.current.push(t)
    }

    return () => { animTimeoutsRef.current.forEach(clearTimeout) }
  }, [phraseIndex, entered])

  useLayoutEffect(() => {
    if (measureRef.current) setPhraseWidth(measureRef.current.getBoundingClientRect().width + 16)
  }, [displayText, entered])

  useEffect(() => {
    let t: NodeJS.Timeout
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (measureRef.current) setPhraseWidth(measureRef.current.getBoundingClientRect().width + 16)
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black flex flex-col"
      style={{
        paddingTop: 'clamp(64px, 8vw, 120px)',
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(255,255,255,0.12)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(217,238,114,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-none text-center" style={{ pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center"
        >
          {/* Large headline with typewriter + Figma selection frame */}
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 8.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#ffffff',
              marginBottom: 'clamp(20px, 2.5vw, 36px)',
            }}
          >
            <span className="relative inline-block">
              <span className="invisible whitespace-nowrap" aria-hidden>Let&apos;s Collaborate.</span>

              <span
                ref={measureRef}
                className="absolute top-0 left-0 invisible whitespace-nowrap pointer-events-none"
                aria-hidden
              >
                {displayText}
                {entered && <span style={{ display: 'inline-block', width: '2px', height: '0.8em', marginLeft: '2px', verticalAlign: 'middle' }} />}
              </span>

              <span className="absolute top-0 left-0 right-0 whitespace-nowrap" style={{ textAlign: 'center' }}>
                <span style={{ color: '#ffffff' }}>{displayText}</span>
                {entered && (
                  <span
                    className="typewriter-cursor"
                    aria-hidden
                    style={{ display: 'inline-block', width: '2px', height: '0.8em', backgroundColor: '#ffffff', marginLeft: '2px', verticalAlign: 'middle' }}
                  />
                )}
              </span>

              {phraseWidth > 0 && (
                <motion.span
                  className="absolute top-0 bottom-[0.13em] pointer-events-none overflow-visible"
                  animate={{ width: phraseWidth, opacity: 1 }}
                  initial={{ width: phraseWidth, opacity: 0 }}
                  transition={{ width: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
                  style={{ border: '1px solid #0d99ff', left: '50%', x: '-50%' } as React.CSSProperties}
                >
                  {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(corner => (
                    <span
                      key={corner}
                      className="absolute w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: '#000000',
                        border: '1px solid #0d99ff',
                        top:    corner.startsWith('top')    ? -6 : undefined,
                        bottom: corner.startsWith('bottom') ? -6 : undefined,
                        left:   corner.endsWith('left')     ? -6 : undefined,
                        right:  corner.endsWith('right')    ? -6 : undefined,
                      }}
                    />
                  ))}
                </motion.span>
              )}
            </span>
          </h2>

          {/* Body */}
          <p
            style={{
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '48ch',
              margin: '0 auto',
              marginBottom: 'clamp(20px, 2.5vw, 36px)',
            }}
          >
            I&apos;m always open to collaborating on thoughtful, impactful products, from early ideas to refined experiences.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4" style={{ pointerEvents: 'auto' }}>
            <Link href="/projects">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '17px',
                  fontWeight: 500,
                  color: '#ffffff',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: '999px',
                  padding: '12px 28px',
                  transition: 'border-color 0.18s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
              >
                View My Work
              </div>
            </Link>

            <Link href="/contact">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '17px',
                  fontWeight: 500,
                  color: '#ffffff',
                  background: '#0a99ff',
                  border: '1px solid #0a99ff',
                  borderRadius: '999px',
                  padding: '12px 28px',
                  transition: 'opacity 0.18s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Get In Touch
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>

        </motion.div>
      </div>

      {/* Row 2: Physics pills */}
      <div
        className="block relative z-10 flex-1"
        style={{ minHeight: '280px', marginTop: 'clamp(12px, 1.5vw, 20px)' }}
      >
        <PhysicsPills isInView={isInView} />
      </div>

    </section>
  )
}
