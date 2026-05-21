'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SelectionFramePortal from '@/components/SelectionFramePortal'
import HeroHoverImages from '@/components/HeroHoverImages'
import { projectsData } from '@/data/projects'

const HERO_RITA_PHOTOS: [string, string, string] = ['/Me/IMG_0426.webp', '/Me/cefda5d2-eb6d-4e79-8fa6-b484bc03be29.webp', '/projects/Onyx/Stanford.webp']
const HERO_DESIGN_PHOTOS: [string, string, string] = [projectsData[1].heroImage, projectsData[2].heroImage, projectsData[3].heroImage]

export default function HeroSection({ 
  isDesktop, 
  cursorLabel, 
  showCursorPill,
  onLabelChange 
}: { 
  isDesktop: boolean
  cursorLabel: string | null
  showCursorPill: boolean
  onLabelChange: (label: string | null) => void
}) {
  const shouldReduceMotion = useReducedMotion()
  const [activeWord, setActiveWord] = useState<'rita' | 'design' | null>(null)
  const [entered, setEntered] = useState(false)
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
      onLabelChange('ABOUT ME')
      if (ritaRef.current) ritaRef.current.style.cursor = 'none'
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveWord(null)
        onLabelChange(null)
        if (ritaRef.current) ritaRef.current.style.cursor = ''
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
      onLabelChange('MY WORK')
      if (designRef.current) designRef.current.style.cursor = 'none'
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveWord(null)
        onLabelChange(null)
        if (designRef.current) designRef.current.style.cursor = ''
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
      
      // Hide the hover effect immediately on scroll
      setActiveWord(null)
      onLabelChange(null)
      
      // Reset cursor styles for both elements
      if (ritaRef.current) ritaRef.current.style.cursor = ''
      if (designRef.current) designRef.current.style.cursor = ''
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
    <section className="relative z-20 min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Horizontal rule just below the navbar */}
      <div className="absolute top-16 left-0 w-full h-px pointer-events-none" style={hDashedLine} />
      {/* Horizontal rule at the bottom of the hero */}
      <div className="absolute bottom-0 left-0 w-full h-px pointer-events-none" style={hDashedLine} />

      {/* Animated blobs */}
      {!shouldReduceMotion && <>
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2), rgba(96,165,250,0.2))' }}
          animate={{ x: [0, 150, -50, 0], y: [0, -120, 80, 0], scale: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2), rgba(59,130,246,0.2))' }}
          animate={{ x: [0, -180, 60, 0], y: [0, 120, -40, 0], scale: [1, 0.7, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.2), rgba(37,99,235,0.2))' }}
          animate={{ x: [0, 220, -80, 0], y: [0, -80, 100, 0], scale: [1, 1.15, 0.85, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        />
      </>}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto text-center relative z-20">
        {/* Badge */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={entered ? { scale: 1 } : { scale: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <div className="status-badge inline-flex items-center space-x-2 rounded-full px-4 py-2">
            <div className="relative flex items-center justify-center w-2 h-2">
              <div className="status-dot-inner absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              <div className="status-dot-pulse absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available for new projects
            </span>
          </div>
        </motion.div>

        {/* Headline with selection frames */}
        <div className="relative mb-8 lg:mb-10 overflow-visible">
          <h1
            ref={headlineRef}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-white leading-tight relative flex flex-wrap justify-center items-center gap-0 sm:gap-3 overflow-visible"
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
              style={isDesktop ? { cursor: 'none' } : {}}
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
              style={isDesktop ? { cursor: 'none' } : {}}
            >
              <motion.span
                ref={rightSpanRef}
                id="hero-right"
                className="inline-block text-gradient overflow-visible pt-1 pb-3"
                initial={shouldReduceMotion ? false : { x: '100vw', opacity: 0 }}
                animate={entered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                I Design.
              </motion.span>
            </Link>
          </h1>

          <SelectionFramePortal bounds={ritaViewport} isVisible={showRitaFrame} />
          <SelectionFramePortal bounds={designViewport} isVisible={showDesignFrame} />
          <HeroHoverImages bounds={ritaViewport} isVisible={showRitaFrame} photos={HERO_RITA_PHOTOS} variant="design" />
          <HeroHoverImages bounds={designViewport} isVisible={showDesignFrame} photos={HERO_DESIGN_PHOTOS} variant="rita" />
        </div>

        {/* Subtitle and Description */}
        <div className="mb-12 lg:mb-16 space-y-4">
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.7 }}
          >
            I design products that turn complexity into clarity.
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.9 }}
          >
            I work closely with teams to research, design, and ship thoughtful, human-centered products.
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 w-full sm:w-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 1.1 }}
        >
          <Link href="/projects" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-[#2563eb] text-white px-6 py-3 rounded-full font-medium text-base hover:bg-[#1d4ed8] transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto focus:outline-none"
              style={isDesktop ? { cursor: 'none' } : {}}
            >
              <span>View My Work</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </motion.button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white/15 text-white px-6 py-3 rounded-full font-medium text-base hover:bg-white/25 transition-colors w-full sm:w-auto focus:outline-none"
              style={isDesktop ? { cursor: 'none' } : {}}
            >
              Let's Connect
            </motion.button>
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
