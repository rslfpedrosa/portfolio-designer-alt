'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SelectionFramePortal from '@/components/SelectionFramePortal'
import HeroHoverImages from '@/components/HeroHoverImages'
import { projectsData } from '@/data/projects'

const HERO_RITA_PHOTOS: [string, string, string] = ['/Me/IMG_0426.webp', '/conferences/dm-group.webp', '/projects/Onyx/Stanford.webp']
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
  const [ritaViewport, setRitaViewport] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const [designViewport, setDesignViewport] = useState<{ left: number; top: number; width: number; height: number } | null>(null)

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
    // Initial bounds calculation
    const timer = setTimeout(updateBounds, 100)
    
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
    
    // Clear any pending transitions
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    
    if (isHovering) {
      // Immediate transition
      setActiveWord('rita')
      onLabelChange('ABOUT ME')
      if (ritaRef.current) ritaRef.current.style.cursor = 'none'
      // Only update bounds if switching from another word or entering fresh
      if (activeWord !== 'rita') {
        updateBounds()
      }
    } else {
      // Small delay before hiding to prevent flicker during transitions
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveWord(null)
        onLabelChange(null)
        if (ritaRef.current) ritaRef.current.style.cursor = ''
      }, 50)
    }
  }

  const handleDesignHover = (isHovering: boolean) => {
    if (!isDesktop) return
    
    // Clear any pending transitions
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    
    if (isHovering) {
      // Immediate transition
      setActiveWord('design')
      onLabelChange('MY WORK')
      if (designRef.current) designRef.current.style.cursor = 'none'
      // Only update bounds if switching from another word or entering fresh
      if (activeWord !== 'design') {
        updateBounds()
      }
    } else {
      // Small delay before hiding to prevent flicker during transitions
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveWord(null)
        onLabelChange(null)
        if (designRef.current) designRef.current.style.cursor = ''
      }, 50)
    }
  }

  const handleRitaFocus = (isFocused: boolean) => {
    if (isFocused && activeWord !== 'rita') {
      setActiveWord('rita')
      updateBounds()
    } else if (!isFocused && activeWord === 'rita') {
      setActiveWord(null)
    }
  }

  const handleDesignFocus = (isFocused: boolean) => {
    if (isFocused && activeWord !== 'design') {
      setActiveWord('design')
      updateBounds()
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

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={entered ? { scale: 1 } : { scale: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <div className="status-badge inline-flex items-center space-x-2 rounded-full px-4 py-2">
            <div className="relative flex items-center justify-center">
              <div className="status-dot-inner w-2 h-2 rounded-full bg-green-500"></div>
              {!shouldReduceMotion && (
                <div className="status-dot-pulse absolute w-2 h-2 rounded-full bg-green-500"></div>
              )}
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
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-gray-900 dark:text-white leading-tight relative flex flex-wrap justify-center items-center gap-0 sm:gap-3 overflow-visible"
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
                className="inline-block overflow-visible py-1"
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
                className="inline-block text-gradient overflow-visible py-1"
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
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed"
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
              className="group bg-gray-gray-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-gray-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-gray-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
              className="group bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-gray-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              style={isDesktop ? { cursor: 'none' } : {}}
            >
              Let's Connect
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.5, duration: 0.6 }}
        className="block absolute bottom-24 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
          transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 12, 0] }}
            transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
