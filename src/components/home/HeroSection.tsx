'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

const CYCLING_PHRASES = ["Hi, I'm Rita.", 'I Design.', 'I Simplify.', 'I Explore.', 'I Create.', 'I Prototype.', 'I Question.', 'I Iterate.']

interface HeroSectionProps {
  cursorLabel?: string | null
  showCursorPill?: boolean
  onLabelChange?: (label: string | null) => void
}

export default function HeroSection(_props: HeroSectionProps = {}) {
  const shouldReduceMotion = useReducedMotion()
  const [entered, setEntered] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isCycling, setIsCycling] = useState(false)
  const [phraseWidth, setPhraseWidth] = useState(0)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState('')
  const displayTextRef = useRef('')
  const animTimeoutsRef = useRef<NodeJS.Timeout[]>([])
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (shouldReduceMotion) {
      setEntered(true)
      return
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true)
      })
    })
  }, [shouldReduceMotion])

  useEffect(() => {
    if (!entered) return
    let interval: NodeJS.Timeout
    const startDelay = setTimeout(() => {
      setIsCycling(true)
      interval = setInterval(() => {
        setPhraseIndex(i => (i + 1) % CYCLING_PHRASES.length)
      }, 5000)
    }, 1500)
    return () => {
      clearTimeout(startDelay)
      clearInterval(interval)
    }
  }, [entered])

  useLayoutEffect(() => {
    if (measureRef.current) {
      setPhraseWidth(measureRef.current.getBoundingClientRect().width + 16)
    }
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

  useEffect(() => {
    if (!entered) return

    animTimeoutsRef.current.forEach(clearTimeout)
    animTimeoutsRef.current = []

    const target = CYCLING_PHRASES[phraseIndex]
    const current = displayTextRef.current
    const ERASE_SPEED = 110
    const TYPE_SPEED = 210
    let offset = 0

    for (let i = current.length - 1; i >= 0; i--) {
      const erased = current.slice(0, i)
      const delay = (current.length - 1 - i) * ERASE_SPEED
      const t = setTimeout(() => {
        displayTextRef.current = erased
        setDisplayText(erased)
      }, delay)
      animTimeoutsRef.current.push(t)
    }

    offset = current.length * ERASE_SPEED

    for (let i = 1; i <= target.length; i++) {
      const typed = target.slice(0, i)
      const t = setTimeout(() => {
        displayTextRef.current = typed
        setDisplayText(typed)
      }, offset + i * TYPE_SPEED)
      animTimeoutsRef.current.push(t)
    }

    return () => {
      animTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [phraseIndex, entered])

  return (
    <section
      data-cursor="hi-there"
      className="relative z-20 flex items-center justify-center"
      style={{
        minHeight: '100svh',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}
    >
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-none text-center relative z-20" style={{ paddingTop: 'clamp(100px, 12vw, 160px)', paddingBottom: 'clamp(80px, 10vw, 120px)' }}>
        {/* Availability badge */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-1.5 h-1.5">
              <div className="status-dot-inner absolute inset-0 rounded-full" style={{ backgroundColor: '#D4F05C' }} />
              <div className="status-dot-pulse absolute inset-0 rounded-full" style={{ backgroundColor: '#D4F05C' }} />
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(36,31,33,0.45)',
              }}
            >
              Available for new projects
            </span>
          </div>
        </motion.div>

        {/* Headline with selection frames */}
        <div className="relative mb-8 lg:mb-10 overflow-visible">
          <h1
            ref={headlineRef}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-[#241f21] leading-tight relative flex flex-wrap justify-center items-center gap-0 sm:gap-3 overflow-visible"
          >
            <Link
              href="/projects"
              className="inline-block overflow-visible focus:outline-none"
              aria-label="View Work"
            >
              <motion.span
                id="hero-right"
                className="inline-block overflow-visible pt-1 pb-3"
                initial={shouldReduceMotion ? false : { x: '100vw', opacity: 0 }}
                animate={entered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{ display: 'inline-block' }}
              >
                <span className="relative inline-block">
                  {/* Layout spacer: widest phrase, keeps container width fixed */}
                  <span className="invisible text-gradient whitespace-nowrap" aria-hidden>I Prototype.</span>

                  {/* Measurement span: currently typed text + cursor, used for frame width */}
                  <span
                    ref={measureRef}
                    className="absolute top-0 left-0 invisible whitespace-nowrap text-gradient pointer-events-none"
                    aria-hidden
                  >
                    {displayText}
                    {entered && (
                      <span style={{ display: 'inline-block', width: '2px', height: '0.8em', marginLeft: '2px', verticalAlign: 'middle' }} />
                    )}
                  </span>

                  {/* Animated phrase text */}
                  <span
                    className="absolute top-0 left-0 right-0 whitespace-nowrap text-center"
                    style={{ bottom: '-0.25em' }}
                  >
                    <span className="text-gradient">{displayText}</span>
                    {entered && (
                      <span
                        className="typewriter-cursor"
                        aria-hidden
                        style={{
                          display: 'inline-block',
                          width: '2px',
                          height: '0.8em',
                          backgroundColor: '#042d2b',
                          marginLeft: '2px',
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                  </span>

                  {/* Frame with smoothly animated width */}
                  {phraseWidth > 0 && (
                    <motion.span
                      className="absolute top-0 h-full pointer-events-none overflow-visible"
                      animate={{ width: phraseWidth, opacity: 1 }}
                      initial={{ width: phraseWidth, opacity: 0 }}
                      transition={{ width: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
                      style={{ border: '1px solid #0d99ff', left: '50%', translateX: '-50%' }}
                    >
                      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(corner => (
                        <span
                          key={corner}
                          className="absolute w-3 h-3 rounded-sm transition-colors duration-300"
                          style={{
                            backgroundColor: '#f2efea',
                            border: '1px solid #0d99ff',
                            top: corner.startsWith('top') ? -6 : undefined,
                            bottom: corner.startsWith('bottom') ? -6 : undefined,
                            left: corner.endsWith('left') ? -6 : undefined,
                            right: corner.endsWith('right') ? -6 : undefined,
                          }}
                        />
                      ))}
                    </motion.span>
                  )}
                </span>
              </motion.span>
            </Link>
          </h1>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
          <motion.p
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'rgba(36,31,33,0.5)',
              maxWidth: '44ch',
              margin: '0 auto',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          >
            From AI platforms to healthcare products, I transform complexity into experiences people understand and enjoy using.
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        >
          <Link href="/projects">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '17px',
                fontWeight: 500,
                color: '#241f21',
                background: 'transparent',
                border: '1px solid rgba(36,31,33,0.35)',
                borderRadius: '999px',
                padding: '10px 24px',
                transition: 'border-color 0.18s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#241f21')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(36,31,33,0.35)')}
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
                padding: '10px 24px',
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
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : { opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 2.2, duration: 1.2, ease: 'easeOut' }}
          aria-hidden
        >
          <span
            style={{
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(36,31,33,0.3)',
            }}
          >
            Scroll
          </span>
          <div
            className="scroll-bob"
            style={{ width: '1px', height: '28px', backgroundColor: 'rgba(36,31,33,0.2)' }}
          />
        </motion.div>
      </div>

    </section>
  )
}
