'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { getFeaturedProjects, projectsData } from '@/data/projects'
import SelectionFramePortal from '@/components/SelectionFramePortal'
import CardHoverFramePortal from '@/components/CardHoverFramePortal'
import HeroHoverImages from '@/components/HeroHoverImages'

const HERO_RITA_PHOTOS: [string, string, string] = ['/Me/IMG_0426.webp', '/conferences/dm-group.webp', '/projects/Onyx/Stanford.webp']
const HERO_DESIGN_PHOTOS: [string, string, string] = [projectsData[1].heroImage, projectsData[2].heroImage, projectsData[3].heroImage]

// Unified Figma Cursor System
interface FigmaCursorProps {
  label: string | null
  showPill: boolean
  shouldReduceMotion: boolean
  isDesktop: boolean
}

const FigmaCursor = ({ label, showPill, shouldReduceMotion, isDesktop }: FigmaCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const mouseXRef = useRef<number>(0)
  const mouseYRef = useRef<number>(0)
  const cursorXRef = useRef<number>(0)
  const cursorYRef = useRef<number>(0)
  const hasMousePositionRef = useRef<boolean>(false)
  const rafIdRef = useRef<number | null>(null)
  // No offset - cursor tip aligns with mouse at (0,0)
  const offsetX = 0
  const offsetY = 0

  useEffect(() => {
    if (!isDesktop) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX + offsetX
      mouseYRef.current = e.clientY + offsetY

      if (!hasMousePositionRef.current) {
        // First mousemove: initialize cursor position immediately
        cursorXRef.current = mouseXRef.current
        cursorYRef.current = mouseYRef.current
        hasMousePositionRef.current = true
        if (cursorRef.current) {
          cursorRef.current.style.display = 'block'
          cursorRef.current.style.transform = `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`
        }
      }
    }

    // Animation loop using requestAnimationFrame
    const animate = () => {
      if (!cursorRef.current || !hasMousePositionRef.current) {
        rafIdRef.current = requestAnimationFrame(animate)
        return
      }

      if (shouldReduceMotion) {
        cursorXRef.current = mouseXRef.current
        cursorYRef.current = mouseYRef.current
      } else {
        // Smooth lerp
        const lerp = 0.3
        cursorXRef.current += (mouseXRef.current - cursorXRef.current) * lerp
        cursorYRef.current += (mouseYRef.current - cursorYRef.current) * lerp
      }

      cursorRef.current.style.transform = `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`
      rafIdRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [isDesktop, shouldReduceMotion])

  // Animate pill appearance
  useEffect(() => {
    if (!pillRef.current || !label) return

    if (showPill && label) {
      pillRef.current.style.opacity = '1'
      pillRef.current.style.transform = 'scale(1) translateY(0)'
    } else {
      pillRef.current.style.opacity = '0'
      pillRef.current.style.transform = 'scale(0.8) translateY(-4px)'
    }
  }, [showPill, label, shouldReduceMotion])

  // Only render on desktop
  if (!isDesktop) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[10002] will-change-transform"
      style={{
        display: hasMousePositionRef.current ? 'block' : 'none',
        transform: `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`,
      }}
    >
      <div className="relative" style={{ transform: 'translate(2px, 2px)' }}>
        {/* Figma cursor arrow - always visible, lighter */}
        <svg 
          width="16" 
          height="18" 
          viewBox="0 0 144 159" 
          fill="none" 
          className="absolute -top-3 -left-1.5 text-indigo-600 dark:text-indigo-400 opacity-90"
        >
          <path
            d="M32.1753 150.405C21.3357 104.423 6.46159 40.2274 0.218053 9.72129C-1.32121 2.20039 5.56282 -2.44979 12.2294 1.35683L138.377 73.3872C146.115 77.8056 144.646 89.3743 136.049 91.7188L86.8595 105.134C84.6005 105.75 82.6292 107.14 81.2894 109.06L50.0785 153.796C45.1371 160.878 34.1568 158.811 32.1753 150.405Z"
            fill="currentColor"
          />
        </svg>
        {/* Pill label - appears with smooth animation, closer to arrow, bigger text */}
        {label && (
          <span 
            ref={pillRef}
            className="bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-md inline-block mt-1 ml-2"
            style={{
              opacity: 0,
              transform: 'scale(0.8) translateY(-4px)',
              transition: shouldReduceMotion ? 'none' : 'opacity 200ms ease-out, transform 200ms ease-out',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

const TestimonialsCarousel = ({ testimonials }: { testimonials: Array<{ id: number; name: string; role: string; content: string; avatar: string }> }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const previousTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  useEffect(() => {
    // Only auto-advance on desktop (md and up)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return
    
    const interval = setInterval(() => {
      nextTestimonial()
    }, 6000)
    return () => clearInterval(interval)
  }, [isAnimating])

  return (
    <>
      {/* Desktop: Single card carousel with arrows */}
      <div className="hidden md:block relative h-[450px] px-12 lg:px-16">
        {/* Left Arrow */}
        <button
          onClick={previousTestimonial}
          disabled={isAnimating}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextTestimonial}
          disabled={isAnimating}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="cursor-pointer absolute inset-0 px-12 lg:px-16"
            onClick={nextTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-gray-900 dark:bg-black rounded-2xl p-8 shadow-2xl border border-gray-800 dark:border-gray-700 flex flex-col h-full">
              {/* Quote Icon */}
              <div className="mb-4">
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" className="text-gray-700">
                  <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                  <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                </svg>
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-300 dark:text-gray-400 leading-relaxed mb-6 text-lg">
                "{testimonials[currentIndex].content}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center space-x-4 pt-4 mt-auto border-t border-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">{testimonials[currentIndex].avatar}</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-base font-medium text-gray-500">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: Horizontal scrollable cards */}
      <div className="md:hidden overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 sm:-mx-6">
        <div className="flex gap-4 px-4 sm:px-6" style={{ width: 'max-content' }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-gray-900 dark:bg-black rounded-2xl p-6 shadow-2xl border border-gray-800 dark:border-gray-700 flex flex-col w-[85vw] max-w-sm flex-shrink-0 snap-start"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" className="text-gray-700">
                  <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                  <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                </svg>
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-300 dark:text-gray-400 leading-relaxed mb-6 text-lg">
                "{testimonial.content}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center space-x-4 pt-4 mt-auto border-t border-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-base font-medium text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Dots - Desktop only */}
      <div className="hidden md:flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true)
                setCurrentIndex(index)
                setTimeout(() => setIsAnimating(false), 600)
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-indigo-600'
                : 'w-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
}

const HomePage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [hoveredWord, setHoveredWord] = useState<'rita' | 'design' | null>(null)
  const [focusedWord, setFocusedWord] = useState<'rita' | 'design' | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [entered, setEntered] = useState(false)
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)
  const [hoveredCardBounds, setHoveredCardBounds] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const cardRefs = useRef<Map<number, HTMLDivElement | null>>(new Map())
  
  const ritaRef = useRef<HTMLAnchorElement>(null)
  const designRef = useRef<HTMLAnchorElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const leftSpanRef = useRef<HTMLSpanElement>(null)
  const rightSpanRef = useRef<HTMLSpanElement>(null)
  
  const [ritaBounds, setRitaBounds] = useState<DOMRect | null>(null)
  const [designBounds, setDesignBounds] = useState<DOMRect | null>(null)
  /** Viewport coords for selection frame portal (so all 4 corner squares show) */
  const [ritaViewport, setRitaViewport] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const [designViewport, setDesignViewport] = useState<{ left: number; top: number; width: number; height: number } | null>(null)

  const allProjects = getFeaturedProjects()
  const featuredProjects = allProjects.filter(project => project.id === 1 || project.id === 3)
    .sort((a, b) => {
      // Order: Onyx (3) > Bocca (1)
      const order = { 3: 0, 1: 1 }
      return (order[a.id as keyof typeof order] ?? 999) - (order[b.id as keyof typeof order] ?? 999)
    })

  const testimonials = [
    {
      id: 1,
      name: 'Ana Marković',
      role: 'Lead Product Designer at Loka',
      content: 'Rita\'s an exceptional designer who brings clarity, direction, and a high bar for quality to everything she touches. Her product thinking is sharp, her execution is fast and thoughtful, and her presence uplifts the entire team. She plays a key role in shaping both the work and how we work together.',
      avatar: 'AM',
    },
    {
      id: 2,
      name: 'Ana Vilar',
      role: 'Product Designer at Loka',
      content: 'Working with Rita was an absolute pleasure. She was incredibly supportive, always attentive to the project\'s progress and the well-being of her teammates. Her communication skills are great, and she consistently brings a positive and collaborative energy to the team. She has a keen eye for detail and a perfectionist mindset that elevates the quality of any work she touches.',
      avatar: 'AV',
    },
    {
      id: 3,
      name: 'Mariana Elias',
      role: 'Senior Product Designer at Loka',
      content: 'Rita is an exceptionally talented product designer. In the past three years that we\'ve worked together, I\'ve seen first-hand how quickly and effectively she identifies technical solutions to design challenges, often simplifying complex problems into beautiful and functional products. Any team would be lucky to have her!',
      avatar: 'ME',
    },
  ]

  const designShowcase = [
    {
      id: 1,
      type: 'video',
      media: '/explorations/exploration-1.mp4',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      id: 2,
      type: 'video',
      media: '/explorations/exploration-2.mp4',
      gradient: 'from-pink-400 to-purple-500',
    },
    {
      id: 3,
      type: 'video',
      media: '/explorations/exploration-3.mp4',
      gradient: 'from-orange-400 to-red-500',
    },
    {
      id: 4,
      type: 'video',
      media: '/explorations/exploration-4.mp4',
      gradient: 'from-green-400 to-teal-500',
    },
  ]

  // Animation trigger - reliable frame-based approach
  useEffect(() => {
    // Client-side only
    if (shouldReduceMotion) {
      setEntered(true)
      return
    }

    const sessionAnimated = sessionStorage.getItem('homeV2Animated')
    if (sessionAnimated === '1') {
      setEntered(true)
      return
    }

    // Initial state is set via CSS classes (entered=false)
    // Next frame: trigger entered state to start transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true)
        sessionStorage.setItem('homeV2Animated', '1')
      })
    })
  }, [shouldReduceMotion])

  useEffect(() => {
    // Check if device supports hover (desktop with fine pointer)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Hide default cursor globally on desktop
  useEffect(() => {
    if (isDesktop) {
      document.body.style.cursor = 'none'
      return () => {
        document.body.style.cursor = ''
      }
    }
  }, [isDesktop])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null)
      }
    }
    if (selectedVideo) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedVideo])

  const updateBounds = () => {
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
  }

  // Hero frame bounds: only on mount and resize (not scroll – we hide on scroll, so no need to update)
  useEffect(() => {
    updateBounds()
    window.addEventListener('resize', updateBounds)
    return () => window.removeEventListener('resize', updateBounds)
  }, [])

  const handleRitaHover = (isHovering: boolean) => {
    if (isDesktop) {
      setHoveredWord(isHovering ? 'rita' : null)
      if (isHovering) {
        requestAnimationFrame(updateBounds)
        if (ritaRef.current) {
          ritaRef.current.style.cursor = 'none'
        }
      } else {
        if (ritaRef.current) {
          ritaRef.current.style.cursor = ''
        }
      }
    }
  }

  const handleDesignHover = (isHovering: boolean) => {
    if (isDesktop) {
      setHoveredWord(isHovering ? 'design' : null)
      if (isHovering) {
        requestAnimationFrame(updateBounds)
        if (designRef.current) {
          designRef.current.style.cursor = 'none'
        }
      } else {
        if (designRef.current) {
          designRef.current.style.cursor = ''
        }
      }
    }
  }

  const handleRitaFocus = (isFocused: boolean) => {
    setFocusedWord(isFocused ? 'rita' : null)
    if (isFocused) requestAnimationFrame(updateBounds)
  }

  const handleDesignFocus = (isFocused: boolean) => {
    setFocusedWord(isFocused ? 'design' : null)
    if (isFocused) requestAnimationFrame(updateBounds)
  }

  const showRitaFrame = isDesktop && (hoveredWord === 'rita' || focusedWord === 'rita')
  const showDesignFrame = isDesktop && (hoveredWord === 'design' || focusedWord === 'design')

  // Hide hero hover effect (frame + images) on scroll so it doesn't move with the page
  useEffect(() => {
    const hideOnScroll = () => {
      setHoveredWord(null)
    }
    window.addEventListener('scroll', hideOnScroll, { passive: true })
    return () => window.removeEventListener('scroll', hideOnScroll)
  }, [])

  // Card hover frame portal – update bounds when hovered card changes and on scroll/resize
  useEffect(() => {
    if (hoveredCardId === null) {
      setHoveredCardBounds(null)
      return
    }
    const updateCardBounds = () => {
      const el = cardRefs.current.get(hoveredCardId!)
      if (el) {
        const r = el.getBoundingClientRect()
        setHoveredCardBounds({ left: r.left, top: r.top, width: r.width, height: r.height })
      }
    }
    const raf = requestAnimationFrame(updateCardBounds)
    let ticking = false
    const throttledUpdate = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        updateCardBounds()
        ticking = false
      })
    }
    window.addEventListener('resize', throttledUpdate)
    window.addEventListener('scroll', throttledUpdate, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', throttledUpdate)
      window.removeEventListener('scroll', throttledUpdate)
    }
  }, [hoveredCardId])
  
  // Determine which cursor label to show
  const cursorLabel = 
    hoveredWord === 'rita' ? 'ABOUT ME' :
    hoveredWord === 'design' ? 'MY WORK' :
    hoveredCardId !== null ? 'VIEW CASE STUDY' :
    null
  const showCursorPill = cursorLabel !== null

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      if (ritaRef.current) ritaRef.current.style.cursor = ''
      if (designRef.current) designRef.current.style.cursor = ''
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Card hover frame – portal so all 4 corner squares show above next card */}
      {isDesktop && (
        <CardHoverFramePortal bounds={hoveredCardBounds} isVisible={hoveredCardId !== null} />
      )}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-end sm:items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-slate-950 pb-20 sm:pb-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-animated-grid" />
        
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/60 to-purple-400/60 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -120, 80, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/60 to-pink-400/60 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, -180, 60, 0],
            y: [0, 120, -40, 0],
            scale: [1, 0.7, 1.2, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/60 to-indigo-400/60 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 220, -80, 0],
            y: [0, -80, 100, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />

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
          <div className="relative mb-8 lg:mb-10">
              <h1 
                ref={headlineRef}
                className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-gray-900 dark:text-white leading-none sm:leading-tight relative flex flex-wrap justify-center items-center gap-0 sm:gap-3"
              >
              {/* "I'm Rita," - Interactive span, slides from LEFT */}
              <Link
                ref={ritaRef}
                href="/about"
                onMouseEnter={() => handleRitaHover(true)}
                onMouseLeave={() => handleRitaHover(false)}
                onFocus={() => handleRitaFocus(true)}
                onBlur={() => handleRitaFocus(false)}
                className="inline-block focus:outline-none"
                aria-label="About Me"
              >
                <span
                  ref={leftSpanRef}
                  id="hero-left"
                  className={`inline-block ${entered ? 'h-enter' : 'h-init'}`}
                >
                  I'm Rita,
                </span>
              </Link>
              {/* "I Design." - Interactive span, slides from RIGHT, always purple */}
              <Link
                ref={designRef}
                href="/projects"
                onMouseEnter={() => handleDesignHover(true)}
                onMouseLeave={() => handleDesignHover(false)}
                onFocus={() => handleDesignFocus(true)}
                onBlur={() => handleDesignFocus(false)}
                className="inline-block focus:outline-none"
                aria-label="View Work"
              >
                <span
                  ref={rightSpanRef}
                  id="hero-right"
                  className={`inline-block text-gradient ${entered ? 'h-enter-r' : 'h-init-r'}`}
                >
                  I Design.
                </span>
              </Link>
              </h1>

            {/* Selection frames – portal so all 4 corner squares show above hero overflow */}
            <SelectionFramePortal bounds={ritaViewport} isVisible={showRitaFrame} />
            <SelectionFramePortal bounds={designViewport} isVisible={showDesignFrame} />
            {/* 3 floating images on hover (Rita = about photos, Design = case study heroes) */}
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

          {/* CTAs - Always visible */}
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
                className="group bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
                className="group bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium text-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
          className="hidden sm:block absolute bottom-24 left-1/2 transform -translate-x-1/2"
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

        {/* Unified Figma Cursor - Arrow always visible, pill appears on hover */}
        <FigmaCursor
          label={cursorLabel}
          showPill={showCursorPill}
          shouldReduceMotion={shouldReduceMotion || false}
          isDesktop={isDesktop}
        />
      </section>

      {/* Featured Projects Section */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Featured Work
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">
              Case Studies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Selected projects focused on complex, real-world problems.
            </p>
          </motion.div>

          <div className="space-y-8 lg:space-y-12">
            {featuredProjects.map((project, index) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`} 
                className="block group"
                onMouseEnter={() => isDesktop && setHoveredCardId(project.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onFocus={() => {}}
                onBlur={() => {}}
                style={isDesktop && hoveredCardId === project.id ? { cursor: 'none' } : {}}
              >
                <motion.div
                  ref={(el) => {
                    if (el) cardRefs.current.set(project.id, el as HTMLDivElement)
                    else cardRefs.current.delete(project.id)
                  }}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="relative overflow-visible transition-all duration-200 ease-out cursor-pointer"
                >
                  {/* Card content – neutral background, no colored fill */}
                  <div className="relative overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Left Column - Content */}
                      <div className="flex flex-col justify-center space-y-4 sm:space-y-6 z-10 p-6 sm:p-8 lg:p-12">
                        {/* Brand/Logo */}
                        <div className="mb-2">
                          {project.id === 1 ? (
                            <Image
                              src="/Logos/Logo.svg"
                              alt="Bocca Moments Logo"
                              width={200}
                              height={45}
                              className="h-7 w-auto brightness-0 invert"
                            />
                          ) : project.id === 3 ? (
                            <Image
                              src="/Logos/Onyx.svg"
                              alt="Onyx Logo"
                              width={473}
                              height={169}
                              className="h-7 w-auto brightness-0 invert"
                            />
                          ) : project.id === 2 ? (
                            <Image
                              src="/Logos/Cortado.svg"
                              alt="Cortado Logo"
                              width={132}
                              height={44}
                              className="h-7 w-auto brightness-0 invert"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                              {project.title.split(' ')[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        {/* Project Title */}
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6">
                          {project.id === 1 
                            ? 'Crafting a Sensory Brand Experience' 
                            : project.id === 2 
                            ? (<>Scaling Rental Management<br />with GenAI</>)
                            : project.id === 3
                            ? (<>Designing Human-Centered<br />CPPS Care</>)
                            : project.title}
                        </h3>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {project.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-full px-4 py-2 whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div>
                          <span className="text-base text-gray-500 dark:text-gray-400">
                            {project.id === 1 ? '2025' : project.id === 3 ? '2025' : project.id === 2 ? '2023' : '2024'}
                          </span>
                        </div>
                      </div>
                      {/* Right Column - Hero image */}
                      <div className="relative h-48 sm:h-64 lg:h-full lg:min-h-[400px] overflow-hidden z-10">
                        <Image
                          src={project.heroImage.replace(',', '%2C')}
                          alt={`${project.title} preview`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          priority={index < 2}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* View All Projects CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8 lg:mt-10"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors flex items-center space-x-2 mx-auto"
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                <span>View All Projects</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Design Showcase Section */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Design Showcase
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">
              Explorations & UI Work
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A collection of interface explorations, component designs, and visual experiments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {designShowcase.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => item.type === 'video' && setSelectedVideo(item.media)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-large transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {item.type === 'video' ? (
                      <video
                        src={item.media}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onLoadedData={(e) => {
                          const video = e.currentTarget
                          const playPromise = video.play()
                          if (playPromise !== undefined) {
                            playPromise.catch(() => {
                              video.muted = true
                          })
                          }
                        }}
                        onEnded={(e) => {
                          e.currentTarget.currentTime = 0
                          e.currentTarget.play().catch(() => {})
                        }}
                        onError={(e) => {
                          console.warn('Video failed to load:', item.media)
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.media}
                        alt={`Exploration ${item.id}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* See More Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                <span>See More</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3 sm:mb-4 block">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">
              What my peers say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Feedback from colleagues and collaborators I've worked closely with.
            </p>
          </motion.div>

          {/* Cards Container */}
          <div className="relative max-w-2xl mx-auto overflow-visible">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Photo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <Image
                  src="/Me/IMG_0426.webp"
                  alt="Rita Pedrosa"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
              Design is about <span className="text-gradient">connection</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I believe great design starts with deeply understanding the people behind the product.
              It's about creating experiences that feel intuitive, meaningful, and genuinely useful in real life.
            </p>
            <div className="pt-4">
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group text-indigo-600 dark:text-indigo-400 font-medium text-lg hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center space-x-2 mx-auto"
                  style={isDesktop ? { cursor: 'none' } : {}}
              >
                  <span>How I approach design</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Let's Work Together Section */}
      <section className="relative py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 overflow-hidden">
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -120, 80, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, -180, 60, 0],
            y: [0, 120, -40, 0],
            scale: [1, 0.7, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 220, -80, 0],
            y: [0, -80, 100, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-animated-grid" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
              Let's Build Something <span className="text-gradient">Together</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm always open to collaborating on thoughtful projects, from early product strategy to polished, production ready experiences.
            </p>
            <div className="flex justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  style={isDesktop ? { cursor: 'none' } : {}}
                >
                  <span>Get In Touch</span>
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close video"
              >
                <X size={24} />
              </button>
              <video
                src={selectedVideo}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={(e) => {
                  const video = e.currentTarget
                  const playPromise = video.play()
                  if (playPromise !== undefined) {
                    playPromise.catch(() => {
                      video.muted = true
                    })
                  }
                }}
                onError={(e) => {
                  console.warn('Video failed to load:', selectedVideo)
                }}
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePage
