'use client'

import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import FigmaCursor from '@/components/FigmaCursor'
import { registerCursorSetter, unregisterCursorSetter } from '@/lib/cursorBridge'
import GridBackground from '@/components/GridBackground'

// Dynamically import heavy components with loading states
const HeroSection = dynamic(() => import('@/components/home/HeroSection'), {
  loading: () => <div className="min-h-screen bg-[#f2efea]" />,
})

const CaseStudiesSection = dynamic(() => import('@/components/home/CaseStudiesSection'), {
  loading: () => <div style={{ height: '100svh', background: '#f2efea' }} />,
  ssr: false,
})

const DesignShowcase = dynamic(() => import('@/components/home/DesignShowcase'), {
  loading: () => <div className="py-16 bg-[#f2efea]" />,
  ssr: false,
})

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <div className="py-16 bg-[#f2efea]" />,
  ssr: false,
})

const AboutPreview = dynamic(() => import('@/components/home/AboutPreview'), {
  loading: () => <div className="py-16 bg-[#f2efea]" />,
  ssr: false,
})

const CTASection = dynamic(() => import('@/components/home/CTASection'), {
  loading: () => <div className="py-16 bg-[#f2efea]" />,
  ssr: false,
})

const HomePage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const [cursorLabel, setCursorLabel] = useState<string | null>(null)
  const [cursorBlue, setCursorBlue] = useState(false)

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

  useEffect(() => {
    registerCursorSetter(setCursorLabel)
    return () => unregisterCursorSetter()
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element
      const isInteractive = !!target.closest('a, button, [role="button"]')
      setCursorBlue(prev => prev === isInteractive ? prev : isInteractive)
    }
    document.addEventListener('mouseover', handleOver)
    return () => document.removeEventListener('mouseover', handleOver)
  }, [isDesktop])

  const showCursorPill = cursorLabel !== null

  return (
    <div className="min-h-screen bg-[#f2efea] overflow-x-hidden">
      {/* Hero with grid background */}
      <div className="relative overflow-visible">
        <div className="absolute inset-0 z-[1]"><GridBackground /></div>
        <div className="relative z-10">
          <HeroSection
            isDesktop={isDesktop}
            cursorLabel={cursorLabel}
            showCursorPill={showCursorPill}
            onLabelChange={setCursorLabel}
          />
        </div>
      </div>

      {/* Scroll-driven case studies — GSAP ScrollTrigger pinned section */}
      <CaseStudiesSection isDesktop={isDesktop} />

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
        label={cursorLabel}
        showPill={showCursorPill}
        forceBlue={cursorBlue}
        shouldReduceMotion={shouldReduceMotion || false}
        isDesktop={isDesktop}
      />
    </div>
  )
}

export default HomePage
