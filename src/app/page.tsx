'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import GridBackground from '@/components/GridBackground'

type FolderStat = { label: string; value: string }

const HERO_FOLDERS: Array<{
  src: string; alt: string; left: string; top: number; delay: number; rotate: number; width: number;
  stats?: FolderStat[]
}> = [
  {
    src: '/hero/Folder-final.svg', alt: 'final_FINAL_v3 folder', left: '23%', top: 210, delay: 0.5, rotate: -8, width: 90,
    stats: [
      { label: 'Versions before this one', value: '27' },
      { label: 'Coffee consumed', value: '342 cups' },
      { label: 'Times I said "one small change"', value: '89' },
      { label: 'Times it was actually one small change', value: '0' },
    ],
  },
  { src: '/hero/Folder-fun.svg', alt: 'Fun facts folder', left: '70%', top: 470, delay: 1.3, rotate: 10, width: 90 },
]

function FolderTooltip({ stats }: { stats: FolderStat[] }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(100% + 18px)',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      zIndex: 100,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#1c1c1e',
          borderRadius: 18,
          padding: '14px 18px',
          minWidth: 300,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 400, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
              {s.label}: <span style={{ fontWeight: 500 }}>{s.value}</span>
            </div>
            {i < stats.length - 1 && (
              <div style={{ height: 1, background: 'rgba(255,255,255,0.18)', margin: '7px 0' }} />
            )}
          </div>
        ))}
        {/* speech bubble caret */}
        <div style={{
          position: 'absolute',
          bottom: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 20,
          height: 10,
          overflow: 'hidden',
        }}>
          <div style={{
            width: 14,
            height: 14,
            background: '#1c1c1e',
            transform: 'rotate(45deg)',
            position: 'absolute',
            top: -7,
            left: '50%',
            marginLeft: -7,
            borderRadius: 2,
          }} />
        </div>
      </motion.div>
    </div>
  )
}

function HeroFolder({ src, alt, left, top, delay, rotate, width, stats }: typeof HERO_FOLDERS[0]) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.7, rotate }}
      animate={{ opacity: 1, scale: 1, rotate: hovered ? 0 : rotate }}
      transition={{
        opacity: { duration: 0.5, delay: delay + 1.5, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.5, delay: delay + 1.5, ease: [0.16, 1, 0.3, 1] },
        rotate: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }}
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: 'absolute', left, top, pointerEvents: 'auto', cursor: 'grab', userSelect: 'none' }}
    >
      <AnimatePresence>{stats && hovered && <FolderTooltip stats={stats} />}</AnimatePresence>
      <img src={src} alt={alt} width={width} draggable={false} style={{ display: 'block' }} />
    </motion.div>
  )
}

// Arc positions: imaginary ellipse around center content (cx=50%, cy=45vh, rx=30%, ry=36vh)
// rx/ry ratio ≈ viewport aspect ratio so the arc looks circular on screen
// Left arc at θ=130°/180°/220° — arrow flipped rightward, label extends left (away from content)
// Right arc at θ=40°/320°   — standard arrow, label extends right
interface FigmaCursor {
  name: string; color: string
  left: string; top: string
  delay: number; duration: number
  animY: number[]; animX: number[]
}
const FIGMA_USERS: FigmaCursor[] = [
  { name: 'final_FINAL_v2',        color: '#E8B225', left: '33%', top: '17vh', delay: 1.8, duration: 17, animY: [0, -18, 14, -24, 16, -10, 0], animX: [0, -8,  5, -11, 7,  -5, 0] },
  { name: 'Lots of Coffee',        color: '#4088F0', left: '20%', top: '45vh', delay: 0,   duration: 14, animY: [0, -16, 20, -22, 14, -18, 0], animX: [0, -10, 6, -13, 8,  -6, 0] },
  { name: 'Music Non-Stop',        color: '#3DAA54', left: '28%', top: '69vh', delay: 0.7, duration: 18, animY: [0, 14, -18, 16, -12, 17,  0], animX: [0, -8,  5, -10, 7,  -5, 0] },
  { name: 'This is still WIP',     color: '#E05530', left: '68%', top: '20vh', delay: 2.1, duration: 13, animY: [0, -20, 12, -24, 10, -16, 0], animX: [0, 8,  -5, 11, -7,  5,  0] },
  { name: 'Just One Small Change', color: '#D43F9B', left: '68%', top: '69vh', delay: 1.2, duration: 16, animY: [0, 15, -16, 21, -10, 18,  0], animX: [0, 8,  -5, 10, -7,  5,  0] },
]

function HeroCursor({ name, color, left, top, delay, duration, animY, animX }: FigmaCursor) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay + 1.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', left, top, pointerEvents: 'none' }}
    >
      <motion.div
        animate={{ y: animY, x: animX }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay, repeatType: 'loop' }}
        style={{ position: 'relative', display: 'inline-block', width: 22 }}
      >
        <svg width="22" height="30" viewBox="0 0 14 20" fill="none" style={{ display: 'block' }}>
          <path d="M1 1L13 14L6 14L1 19Z" fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <div style={{
          position: 'absolute',
          top: 30,
          left: 10,
          backgroundColor: color,
          color: 'white',
          fontSize: 13,
          fontWeight: 500,
          padding: '5px 12px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          lineHeight: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero with grid background */}
      <div className="relative overflow-visible">
        <div className="relative z-10">
          <HeroSection />
        </div>
        <div className="absolute inset-0 overflow-visible pointer-events-none z-[30]">
          <div className="hidden lg:block">
            {FIGMA_USERS.map((user) => <HeroCursor key={user.name} {...user} />)}
          </div>
          {HERO_FOLDERS.map((folder) => <HeroFolder key={folder.src} {...folder} />)}
        </div>
      </div>

      {/* Scroll-driven case studies — GSAP ScrollTrigger pinned section */}
      <CaseStudiesSection isDesktop={isDesktop} />

      {/* Design Showcase Section */}
      <DesignShowcase />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* About Preview Section */}
      <AboutPreview />

      {/* Let's Work Together Section */}
      <CTASection />
    </div>
  )
}

export default HomePage
