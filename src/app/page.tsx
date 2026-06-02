'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import GridBackground from '@/components/GridBackground'

const FIGMA_USERS = [
  { name: 'Lots of Coffee',       color: '#4088F0', left: '8%',  top: 140, delay: 0,   duration: 14, animY: [0, -55, 25, -80, 35, -30, 0], animX: [0, 40, -25, 70, -15, 50, 0] },
  { name: 'Just One Small Change', color: '#D43F9B', left: '68%', top: 310, delay: 1.2, duration: 16, animY: [0, 35, -65, 25, -45, 60, 0],  animX: [0, -50, 30, -75, 35, -20, 0] },
  { name: 'Music Non-Stop',        color: '#3DAA54', left: '22%', top: 450, delay: 0.7, duration: 18, animY: [0, -40, 70, -50, 30, -60, 0], animX: [0, 60, -20, 80, -35, 25, 0] },
  { name: 'This is still WIP',     color: '#E05530', left: '52%', top: 260, delay: 2.1, duration: 13, animY: [0, 60, -40, 75, -25, 50, 0],  animX: [0, -35, 65, -55, 20, -70, 0] },
  { name: 'final_FINAL_v2',        color: '#E8B225', left: '38%', top: 190, delay: 1.8, duration: 17, animY: [0, -70, 30, -45, 65, -20, 0], animX: [0, 30, -55, 45, -65, 25, 0] },
]

function HeroCursor({ name, color, left, top, delay, duration, animY, animX }: typeof FIGMA_USERS[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay + 1.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', left, top, pointerEvents: 'none' }}
    >
      <motion.div
        animate={{ y: animY, x: animX }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay, repeatType: 'loop' }}
        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <svg width="20" height="28" viewBox="0 0 14 20" fill="none" style={{ flexShrink: 0, position: 'relative', top: -30, left: 15 }}>
          <path d="M1 1L13 14L6 14L1 19Z" fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <div style={{ backgroundColor: color, color: 'white', fontSize: 14, fontWeight: 500, padding: '5px 13px', borderRadius: 6, whiteSpace: 'nowrap', lineHeight: 1 }}>
          {name}
        </div>
      </motion.div>
    </motion.div>
  )
}

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
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="min-h-screen bg-[#f2efea] overflow-x-hidden">
      {/* Hero with grid background */}
      <div className="relative overflow-visible">
        <div className="absolute inset-0 z-[1]"><GridBackground /></div>
        <div className="relative z-10">
          <HeroSection isDesktop={isDesktop} />
        </div>
        <div className="absolute inset-0 overflow-visible pointer-events-none z-[30]">
          {FIGMA_USERS.map((user) => <HeroCursor key={user.name} {...user} />)}
        </div>
      </div>

      {/* Scroll-driven case studies — GSAP ScrollTrigger pinned section */}
      <CaseStudiesSection isDesktop={isDesktop} />

      {/* Design Showcase Section */}
      <DesignShowcase isDesktop={isDesktop} />

      {/* Testimonials Section */}
      <TestimonialsSection isDesktop={isDesktop} />

      {/* About Preview Section */}
      <AboutPreview isDesktop={isDesktop} />

      {/* Let's Work Together Section */}
      <CTASection isDesktop={isDesktop} />
    </div>
  )
}

export default HomePage
