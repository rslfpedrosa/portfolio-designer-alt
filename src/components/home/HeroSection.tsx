'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import HeroHoverImages from '@/components/HeroHoverImages'
import { projectsData } from '@/data/projects'

const HERO_RITA_PHOTOS: [string, string, string] = ['/Me/IMG_0426.webp', '/Me/cefda5d2-eb6d-4e79-8fa6-b484bc03be29.webp', '/projects/Onyx/Stanford.webp']
const HERO_DESIGN_PHOTOS: [string, string, string] = [projectsData[1].heroImage, projectsData[2].heroImage, projectsData[3].heroImage]

const CYCLING_PHRASES = ['I Design.', 'I Simplify.', 'I Explore.', 'I Create.', 'I Prototype.', 'I Question.', 'I Iterate.']

export default function HeroSection() {
  const [isDesktop, setIsDesktop] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const [activeWord, setActiveWord] = useState<'rita' | 'design' | null>(null)
  const [entered, setEntered] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isCycling, setIsCycling] = useState(false)
  const [phraseWidth, setPhraseWidth] = useState(0)
  const measureRef = useRef<HTMLSpanElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const ritaRef = useRef<HTMLAnchorElement>(null)
  const designRef = useRef<HTMLAnchorElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const leftSpanRef = useRef<HTMLSpanElement>(null)
  const rightSpanRef = useRef<HTMLSpanElement>(null)
  
  const [ritaBounds, setRitaBounds] = useState<DOMRect | null>(null)
  const [designBounds, setDesignBounds] = useState<DOMRect | null>(null)
  const [ritaViewport, setRitaViewport] = useState<{ left: number; top: number; width: number; height: number } | null>({ left: -9999, top: -9999, width: 1, height: 1 })
  const [designViewport, setDesignViewport] = useState<{ left: number; top: number; width: number; height: number } | null>({ left: -9999, top: -9999, width: 1, height: 1 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Animation trigger
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

  // Start phrase cycling after entry animation settles
  useEffect(() => {
    if (!entered) return
    let interval: NodeJS.Timeout
    const startDelay = setTimeout(() => {
      setIsCycling(true)
      interval = setInterval(() => {
        setPhraseIndex(i => (i + 1) % CYCLING_PHRASES.length)
      }, 2500)
    }, 1500)
    return () => {
      clearTimeout(startDelay)
      clearInterval(interval)
    }
  }, [entered])

  // Measure the current phrase's natural width for the frame
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (measureRef.current) {
        setPhraseWidth(measureRef.current.getBoundingClientRect().width)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [phraseIndex, entered])

  // Remeasure on resize (font size changes at breakpoints)
  useEffect(() => {
    let t: NodeJS.Timeout
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (measureRef.current) setPhraseWidth(measureRef.current.getBoundingClientRect().width)
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [])

  const updateBoundsRef = useRef<number | null>(null)
  
  const updateBounds = () => {
    // Cancel any pending update
    if (updateBoundsRef.current) {
      cancelAnimationFrame(updateBoundsRef.current)
    }
    
    // Schedule update on next frame
    updateBoundsRef.current = requestAnimationFrame(() => {
      if (ritaRef.current && headlineRef.current) {
        const headlineRect = headlineRef.current.getBoundingClientRect()
        const ritaRect = ritaRef.current.getBoundingClientRect()
        setRitaBounds(new DOMRect(
          ritaRect.left - headlineRect.left,
          ritaRect.top - headlineRect.top,
          ritaRect.width,
          ritaRect.height
        ))
        setRitaViewport({ left: ritaRect.left, top: ritaRect.top, width: ritaRect.width, height: ritaRect.height })
      }
      if (designRef.current && headlineRef.current) {
        const headlineRect = headlineRef.current.getBoundingClientRect()
        const designRect = designRef.current.getBoundingClientRect()
        setDesignBounds(new DOMRect(
          designRect.left - headlineRect.left,
          designRect.top - headlineRect.top,
          designRect.width,
          designRect.height
        ))
        setDesignViewport({ left: designRect.left, top: designRect.top, width: designRect.width, height: designRect.height })
      }
    })
  }

  useEffect(() => {
    // Calculate bounds after entry animation completes (~1.1s) so initial values are accurate
    const timer = setTimeout(updateBounds, 1300)
    
    // Throttled resize handler
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateBounds, 150)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      if (updateBoundsRef.current) {
        cancelAnimationFrame(updateBoundsRef.current)
      }
    }
  }, [])

  const handleRitaHover = (isHovering: boolean) => {
    if (!isDesktop) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    if (isHovering) {
      // Synchronously read current bounds so they're correct in the same render as isVisible=true,
      // preventing the opacity transition from firing off-screen due to stale/animated bounds
      if (ritaRef.current) {
        const rect = ritaRef.current.getBoundingClientRect()
        setRitaViewport({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })
      }
      setActiveWord('rita')
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveWord(null)
      }, 50)
    }
  }

  const handleDesignHover = (isHovering: boolean) => {
    if (!isDesktop) return

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    if (isHovering) {
      // Synchronously read current bounds so they're correct in the same render as isVisible=true
      if (designRef.current) {
        const rect = designRef.current.getBoundingClientRect()
        setDesignViewport({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })
      }
      setActiveWord('design')
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveWord(null)
      }, 50)
    }
  }

  const handleRitaFocus = (isFocused: boolean) => {
    if (isFocused) {
      if (ritaRef.current) {
        const rect = ritaRef.current.getBoundingClientRect()
        setRitaViewport({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })
      }
      setActiveWord('rita')
    } else if (!isFocused && activeWord === 'rita') {
      setActiveWord(null)
    }
  }

  const handleDesignFocus = (isFocused: boolean) => {
    if (isFocused) {
      if (designRef.current) {
        const rect = designRef.current.getBoundingClientRect()
        setDesignViewport({ left: rect.left, top: rect.top, width: rect.width, height: rect.height })
      }
      setActiveWord('design')
    } else if (!isFocused && activeWord === 'design') {
      setActiveWord(null)
    }
  }

  const showRitaFrame = isDesktop && activeWord === 'rita'
  const showDesignFrame = isDesktop && activeWord === 'design'

  useEffect(() => {
    const hideOnScroll = () => {
      // Immediately clear any pending hover transitions
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      
      setActiveWord(null)
    }
    
    window.addEventListener('scroll', hideOnScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', hideOnScroll)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const hDashedLine = {
    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.10) 50%, transparent 50%)',
    backgroundSize: '16px 1px',
    backgroundRepeat: 'repeat-x' as const,
  }

  return (
    <section
      className="relative z-20 flex items-center justify-start"
      style={{
        minHeight: '100svh',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}
    >

      {/* Main Content */}
      <div className="w-full max-w-none text-left relative z-20" style={{ paddingTop: 'clamp(100px, 12vw, 160px)', paddingBottom: 'clamp(80px, 10vw, 120px)' }}>
        {/* Availability badge */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-1.5 h-1.5">
              <div className="status-dot-inner absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              <div className="status-dot-pulse absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
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
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-[#241f21] leading-tight relative flex flex-wrap justify-start items-center gap-0 sm:gap-3 overflow-visible"
          >
            <Link
              ref={ritaRef}
              href="/about"
              onMouseEnter={() => handleRitaHover(true)}
              onMouseLeave={() => handleRitaHover(false)}
              onFocus={() => handleRitaFocus(true)}
              onBlur={() => handleRitaFocus(false)}
              className="inline-block overflow-visible focus:outline-none"
              aria-label="About Me"
            >
              <motion.span
                ref={leftSpanRef}
                id="hero-left"
                className="inline-block overflow-visible pt-1 pb-3"
                initial={shouldReduceMotion ? false : { x: '-100vw', opacity: 0 }}
                animate={entered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                I'm Rita,
              </motion.span>
            </Link>
            <Link
              ref={designRef}
              href="/projects"
              onMouseEnter={() => handleDesignHover(true)}
              onMouseLeave={() => handleDesignHover(false)}
              onFocus={() => handleDesignFocus(true)}
              onBlur={() => handleDesignFocus(false)}
              className="inline-block overflow-visible focus:outline-none"
              aria-label="View Work"
            >
              <motion.span
                ref={rightSpanRef}
                id="hero-right"
                className="inline-block overflow-visible pt-1 pb-3"
                initial={shouldReduceMotion ? false : { x: '100vw', opacity: 0 }}
                animate={entered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <span className="relative inline-block">
                  {/* Layout spacer: widest phrase, keeps container width fixed */}
                  <span className="invisible text-gradient whitespace-nowrap" aria-hidden>I Prototype.</span>

                  {/* Measurement span: current phrase at natural width, off-screen */}
                  <span
                    ref={measureRef}
                    className="absolute top-0 left-0 invisible whitespace-nowrap text-gradient pointer-events-none"
                    aria-hidden
                  >
                    {CYCLING_PHRASES[phraseIndex]}
                  </span>

                  {/* Animated phrase text */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={phraseIndex}
                      className="absolute top-0 left-0 right-0 text-gradient whitespace-nowrap"
                      style={{ bottom: '-0.25em' }}
                      initial={isCycling ? { opacity: 0 } : false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {CYCLING_PHRASES[phraseIndex]}
                    </motion.span>
                  </AnimatePresence>

                  {/* Frame with smoothly animated width */}
                  {phraseWidth > 0 && (
                    <motion.span
                      className="absolute top-0 left-0 h-full pointer-events-none overflow-visible"
                      animate={{ width: phraseWidth, opacity: 1 }}
                      initial={{ width: phraseWidth, opacity: 0 }}
                      transition={{ width: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
                      style={{ border: '1px solid #d9ee72' }}
                    >
                      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(corner => (
                        <span
                          key={corner}
                          className="absolute w-3 h-3 rounded-sm transition-colors duration-300"
                          style={{
                            backgroundColor: showDesignFrame ? '#d9ee72' : '#f2efea',
                            border: '1px solid #d9ee72',
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

          <HeroHoverImages bounds={ritaViewport} isVisible={showRitaFrame} photos={HERO_RITA_PHOTOS} variant="design" />
          <HeroHoverImages
            bounds={designViewport && phraseWidth > 0 ? { ...designViewport, width: phraseWidth } : designViewport}
            isVisible={showDesignFrame}
            photos={HERO_DESIGN_PHOTOS}
            variant="rita"
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
          <motion.p
            style={{
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.7,
              color: 'rgba(36,31,33,0.5)',
              maxWidth: '44ch',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          >
            From AI platforms to healthcare products, I transform complexity into experiences people understand and enjoy using.
          </motion.p>
        </div>

        {/* CTAs — editorial text links */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-start items-start"
          initial={{ opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        >
          <Link href="/projects" className="group flex items-center gap-2">
            <span
              className="font-medium transition-colors duration-300 group-hover:text-[#241f21]"
              style={{
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#241f21',
                borderBottom: '1px solid rgba(36,31,33,0.3)',
                paddingBottom: '2px',
              }}
            >
              View My Work
            </span>
            <ArrowUpRight
              size={13}
              className="transition-all duration-300 group-hover:text-[#241f21] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'rgba(36,31,33,0.5)' }}
              aria-hidden="true"
            />
          </Link>

          <Link href="/contact" className="group flex items-center gap-2">
            <span
              className="font-medium transition-colors duration-300 group-hover:text-[#241f21]"
              style={{
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(36,31,33,0.45)',
                borderBottom: '1px solid rgba(36,31,33,0.15)',
                paddingBottom: '2px',
              }}
            >
              Let&apos;s Connect
            </span>
            <ArrowUpRight
              size={13}
              className="transition-all duration-300 group-hover:text-[#241f21]/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'rgba(36,31,33,0.2)' }}
            />
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
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

    </section>
  )
}
