'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import Image from 'next/image'
import { getFeaturedProjects } from '@/data/projects'

interface SelectionFrameProps {
  bounds: DOMRect | null
  isVisible: boolean
  shouldReduceMotion: boolean
}

const SelectionFrame = ({ bounds, isVisible, shouldReduceMotion }: SelectionFrameProps) => {
  if (!bounds || !isVisible) return null

  const animationDuration = shouldReduceMotion ? 0 : 0.2

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: animationDuration, ease: [0.4, 0, 0.2, 1] }}
      className="pointer-events-none absolute z-40"
      style={{
        left: `${bounds.left}px`,
        top: `${bounds.top}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
      }}
    >
      {/* Selection Frame Outline */}
      <div className="absolute inset-0 border-2 border-indigo-500 dark:border-indigo-400" />
      
      {/* Corner Handles */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400" />
    </motion.div>
  )
}

interface CustomCursorProps {
  label: string
  isCursorActive: boolean
  shouldReduceMotion: boolean
}

const CustomCursor = ({ label, isCursorActive, shouldReduceMotion }: CustomCursorProps) => {
  const [hasMousePosition, setHasMousePosition] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCursorActive) {
      setHasMousePosition(false)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = 12
      const offsetY = 14
      const newMouseX = e.clientX + offsetX
      const newMouseY = e.clientY + offsetY

      if (!hasMousePosition) {
        // First mousemove: initialize cursor to mouse position immediately
        setMouse({ x: newMouseX, y: newMouseY })
        setCursor({ x: newMouseX, y: newMouseY })
        setHasMousePosition(true)
      } else {
        // Subsequent moves: update mouse, apply smoothing if needed
        setMouse({ x: newMouseX, y: newMouseY })
        if (shouldReduceMotion) {
          setCursor({ x: newMouseX, y: newMouseY })
        } else {
          // Smooth lerp (optional)
          setCursor(prev => ({
            x: prev.x + (newMouseX - prev.x) * 0.3,
            y: prev.y + (newMouseY - prev.y) * 0.3,
          }))
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isCursorActive, hasMousePosition, shouldReduceMotion])

  // Update transform on cursor position change
  useEffect(() => {
    if (cursorRef.current && hasMousePosition) {
      cursorRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`
    }
  }, [cursor, hasMousePosition])

  // Only render when both conditions are met
  if (!isCursorActive || !hasMousePosition) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
      style={{
        transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
      }}
    >
      <div className="flex items-center gap-2">
        {/* Figma-like arrow cursor */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <path
            d="M2 2L14 14M14 2L2 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
          {label}
        </span>
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

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 4000)
    return () => clearInterval(interval)
  }, [isAnimating])

  return (
    <>
      <div className="relative h-[500px] md:h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="cursor-pointer absolute inset-0"
            onClick={nextTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-gray-900 dark:bg-black rounded-2xl p-8 shadow-2xl border border-gray-800 dark:border-gray-700 flex flex-col">
              {/* Quote Icon */}
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="text-gray-700">
                  <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                  <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                </svg>
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-300 dark:text-gray-400 leading-relaxed mb-6 text-base">
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
                  <p className="text-sm text-gray-500">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-2 mt-8">
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

const HomeV2 = () => {
  const shouldReduceMotion = useReducedMotion()
  const [hoveredWord, setHoveredWord] = useState<'rita' | 'design' | null>(null)
  const [focusedWord, setFocusedWord] = useState<'rita' | 'design' | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [entered, setEntered] = useState(false)
  
  const ritaRef = useRef<HTMLAnchorElement>(null)
  const designRef = useRef<HTMLAnchorElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const leftSpanRef = useRef<HTMLSpanElement>(null)
  const rightSpanRef = useRef<HTMLSpanElement>(null)
  
  const [ritaBounds, setRitaBounds] = useState<DOMRect | null>(null)
  const [designBounds, setDesignBounds] = useState<DOMRect | null>(null)

  const featuredProjects = getFeaturedProjects()

  const testimonials = [
    {
      id: 1,
      name: 'Ana Marković',
      role: 'Lead Product Designer',
      content: 'Rita\'s an exceptional designer who brings clarity, direction, and a high bar for quality to everything she touches. Her product thinking is sharp, her execution is fast and thoughtful, and her presence uplifts the entire team. She plays a key role in shaping both the work and how we work together.',
      avatar: 'AM',
    },
    {
      id: 2,
      name: 'Ana Vilar',
      role: 'Product Designer',
      content: 'Working with Rita was an absolute pleasure. She was incredibly supportive, always attentive to the project\'s progress and the well-being of her teammates. Her communication skills are great, and she consistently brings a positive and collaborative energy to the team. She has a keen eye for detail and a perfectionist mindset that elevates the quality of any work she touches. She\'s extremely responsive, approachable, and works seamlessly with cross-functional teams. Beyond her design skills, what stood out to me the most was how much she genuinely cares, both about the quality of the work and the people she works with.',
      avatar: 'AV',
    },
    {
      id: 3,
      name: 'Mariana Elias',
      role: 'Senior Product Designer',
      content: 'Rita is an exceptionally talented product designer. In the past three years that we\'ve worked together, I\'ve seen first-hand how quickly and effectively she identifies technical solutions to design challenges, often simplifying complex problems into beautiful and functional products. Beyond her individual skills, Rita\'s has a remarkable ability to build trust and cohesion within the team, always ready to lend a hand, whether professionally or personally, she creates an environment where everyone can do their best work. Any team would be lucky to have her!',
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
      type: 'image',
      media: '/explorations/23126508_195.webp',
      gradient: 'from-pink-400 to-purple-500',
    },
    {
      id: 3,
      type: 'video',
      media: '/explorations/exploration-2.mp4',
      gradient: 'from-orange-400 to-red-500',
    },
    {
      id: 4,
      type: 'image',
      media: '/explorations/23126508_195.webp',
      gradient: 'from-green-400 to-teal-500',
    },
    {
      id: 5,
      type: 'video',
      media: '/explorations/exploration-3.mp4',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      id: 6,
      type: 'image',
      media: '/explorations/23126508_195.webp',
      gradient: 'from-pink-400 to-purple-500',
    },
    {
      id: 7,
      type: 'video',
      media: '/explorations/exploration-4.mp4',
      gradient: 'from-orange-400 to-red-500',
    },
    {
      id: 8,
      type: 'image',
      media: '/explorations/23126508_195.webp',
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
    }
  }

  useEffect(() => {
    updateBounds()
    window.addEventListener('resize', updateBounds)
    window.addEventListener('scroll', updateBounds)
    return () => {
      window.removeEventListener('resize', updateBounds)
      window.removeEventListener('scroll', updateBounds)
    }
  }, [])

  const handleRitaHover = (isHovering: boolean) => {
    if (isDesktop) {
      setHoveredWord(isHovering ? 'rita' : null)
      if (isHovering) {
        updateBounds()
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
        updateBounds()
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
    if (isFocused) updateBounds()
  }

  const handleDesignFocus = (isFocused: boolean) => {
    setFocusedWord(isFocused ? 'design' : null)
    if (isFocused) updateBounds()
  }

  const showRitaFrame = isDesktop && (hoveredWord === 'rita' || focusedWord === 'rita')
  const showDesignFrame = isDesktop && (hoveredWord === 'design' || focusedWord === 'design')
  const isRitaCursorActive = isDesktop && hoveredWord === 'rita'
  const isDesignCursorActive = isDesktop && hoveredWord === 'design'

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      if (ritaRef.current) ritaRef.current.style.cursor = ''
      if (designRef.current) designRef.current.style.cursor = ''
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section - V2 */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-slate-950">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        
        {/* Animated Orbs - Same as V1 */}
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
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-gray-900 dark:text-white leading-tight relative flex flex-wrap justify-center items-center gap-2 sm:gap-3"
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
              <span className="inline-block text-gray-900 dark:text-white"> </span>
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

            {/* Selection Frames Overlay */}
            {headlineRef.current && (
              <>
                <SelectionFrame
                  bounds={ritaBounds}
                  isVisible={showRitaFrame}
                  shouldReduceMotion={shouldReduceMotion || false}
                />
                <SelectionFrame
                  bounds={designBounds}
                  isVisible={showDesignFrame}
                  shouldReduceMotion={shouldReduceMotion || false}
                />
              </>
            )}
          </div>

          {/* Subtitle and Description */}
          <div className="mb-12 lg:mb-16 space-y-4">
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 30 }}
              animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.7 }}
            >
              Product Designer focused on clarity and usability
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.9 }}
            >
              My work focuses on usability, systems thinking, and close collaboration to ship products that work in real-world constraints.
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
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
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

        {/* Custom Cursor */}
        <CustomCursor
          label="ABOUT ME"
          isCursorActive={isRitaCursorActive}
          shouldReduceMotion={shouldReduceMotion || false}
        />
        <CustomCursor
          label="MY WORK"
          isCursorActive={isDesignCursorActive}
          shouldReduceMotion={shouldReduceMotion || false}
        />
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Featured Work
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              Selected Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A selection of projects that showcase my approach to design and problem-solving
            </p>
          </motion.div>

          <div className="space-y-0 border-t border-gray-200 dark:border-gray-700 mb-16">
            {featuredProjects.map((project, index) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-10 lg:py-14 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors duration-200">
                    {/* Project Name - Left */}
                    <div className="lg:col-span-3 flex items-start pt-1">
                      <h3 className="text-4xl lg:text-5xl font-medium text-gray-900 dark:text-white leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    {/* Description - Middle */}
                    <div className="lg:col-span-5 flex items-center">
                      <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Image - Right */}
                    <div className="lg:col-span-3 flex items-center justify-end">
                      <div className="relative w-full lg:w-auto h-56 lg:h-72 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        {project.cardImage ? (
                          <>
                            <Image
                              src={project.cardImage}
                              alt={`${project.title} preview`}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                              sizes="(min-width: 1024px) 25vw, 100vw"
                              priority={index < 3}
                            />
                          </>
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                            <div className="text-white text-center">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Sparkles size={24} />
                              </div>
                              <p className="text-sm opacity-90">Project Preview</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA Buttons - Far Right */}
                    <div className="lg:col-span-1 flex items-center justify-end lg:justify-start">
                      <div className="flex flex-col gap-2 w-full lg:w-auto">
                        <span className="text-xs font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1.5 text-center whitespace-nowrap">
                          {project.category}
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1.5 text-center whitespace-nowrap group-hover:border-gray-900 dark:group-hover:border-gray-100 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          See Case Study →
                        </span>
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
            className="text-center"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>View All Projects</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Design Showcase Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Design Showcase
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
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
              >
                <span>See More</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-4 block">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              Words From My Peers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Feedback from colleagues and collaborators I've had the privilege of designing alongside.
            </p>
          </motion.div>

          {/* Cards Container */}
          <div className="relative max-w-2xl mx-auto">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
              Design is about <span className="text-gradient">connection</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I believe great design happens when we truly understand the people we're designing for. 
              It's about creating experiences that feel intuitive, meaningful, and delightful—whether 
              you're managing your energy consumption or finding your inner peace.
            </p>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group text-indigo-600 dark:text-indigo-400 font-medium text-lg hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>Learn more about my approach</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Let's Work Together Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 overflow-hidden">
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
              Let's Work Together
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm always excited to collaborate on meaningful projects. Whether you need help with 
              product strategy, design systems, or creating beautiful user experiences, I'd love to hear from you.
            </p>
            <div className="flex justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
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

export default HomeV2
