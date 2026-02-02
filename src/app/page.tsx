'use client'

import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
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
  const finalCursorLabel = cursorLabel || (hoveredCardId !== null ? 'VIEW CASE STUDY' : null)

  return (
    <div className="min-h-screen">
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

      {/* Design Showcase Section */}
      <DesignShowcase isDesktop={isDesktop} />

      {/* Testimonials Section */}
      <TestimonialsSection />

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
