'use client'

import { useState, useEffect } from 'react'
import { useReducedMotion, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import FigmaCursor from '@/components/FigmaCursor'

// Dynamically import heavy components with loading states
const HeroSection = dynamic(() => import('@/components/home/HeroSection'), {
  loading: () => <div className="min-h-screen bg-white dark:bg-slate-950" />,
})

const FeaturedProjects = dynamic(() => import('@/components/home/FeaturedProjects'), {
  loading: () => <div className="py-16 bg-white dark:bg-slate-950" />,
  ssr: false,
})

const DesignShowcase = dynamic(() => import('@/components/home/DesignShowcase'), {
  loading: () => <div className="py-16 bg-gray-50 dark:bg-gray-900" />,
  ssr: false,
})

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <div className="py-16 bg-slate-50 dark:bg-slate-900" />,
  ssr: false,
})

const AboutPreview = dynamic(() => import('@/components/home/AboutPreview'), {
  loading: () => <div className="py-16 bg-gray-50 dark:bg-gray-900" />,
  ssr: false,
})

const CTASection = dynamic(() => import('@/components/home/CTASection'), {
  loading: () => <div className="py-16 bg-white dark:bg-slate-950" />,
  ssr: false,
})

const HomePage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const [cursorLabel, setCursorLabel] = useState<string | null>(null)
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)

  useEffect(() => {
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

  // Determine cursor label
  const showCursorPill = cursorLabel !== null || hoveredCardId !== null
  const finalCursorLabel = cursorLabel || (hoveredCardId !== null ? 'OPEN CASE STUDY' : null)

  return (
    <div className="min-h-screen">
      {/* Hero + Featured Projects - Unified Background */}
      <div className="relative bg-white dark:bg-slate-950 overflow-hidden">
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
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/60 to-indigo-400/60 rounded-full blur-3xl pointer-events-none"
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

        {/* Hero Section */}
        <HeroSection 
          isDesktop={isDesktop}
          cursorLabel={finalCursorLabel}
          showCursorPill={showCursorPill}
          onLabelChange={setCursorLabel}
        />

        {/* Featured Projects Section */}
        <FeaturedProjects 
          isDesktop={isDesktop}
          onCardHover={setHoveredCardId}
        />
      </div>

      {/* Design Showcase Section */}
      <DesignShowcase isDesktop={isDesktop} onLabelChange={setCursorLabel} />

      {/* Testimonials Section */}
      <TestimonialsSection isDesktop={isDesktop} onLabelChange={setCursorLabel} />

      {/* About Preview Section */}
      <AboutPreview isDesktop={isDesktop} />

      {/* Let's Work Together Section */}
      <CTASection isDesktop={isDesktop} />

      {/* Unified Figma Cursor */}
      <FigmaCursor
        label={finalCursorLabel}
        showPill={showCursorPill}
        shouldReduceMotion={shouldReduceMotion || false}
        isDesktop={isDesktop}
      />
    </div>
  )
}

export default HomePage
