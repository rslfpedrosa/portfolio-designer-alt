'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import GridBackground from '@/components/GridBackground'

type FolderStat = { label: string; value: string }
type FunFact = { text: string; image: string }

const HERO_FOLDERS: Array<{
  src: string; alt: string; left: string; top: string; delay: number; rotate: number; width: number;
  stats?: FolderStat[]
  facts?: FunFact[]
}> = [
  {
    src: '/hero/Folder-final.webp', alt: 'final_FINAL_v3 folder', left: '19%', top: '28vh', delay: 0.5, rotate: -8, width: 90,
    stats: [
      { label: 'Versions before this one', value: '27' },
      { label: 'Coffee consumed', value: '342 cups' },
      { label: 'Times I said "one small change"', value: '89' },
      { label: 'Times it was actually one small change', value: '0' },
    ],
  },
  {
    src: '/hero/Folder-fun.webp', alt: 'Fun facts folder', left: '76%', top: '50vh', delay: 1.3, rotate: 10, width: 90,
    facts: [
      { text: 'Facilitated a design sprint at Stanford University.', image: '/random/stanford.webp' },
      { text: 'Won a dumpling-folding competition. My finest achievement.', image: '/random/dumpling.webp' },
      { text: 'I Collect hobbies faster than I finish them.', image: '/random/hobbies.webp' },
      { text: 'My flower budget is best left undisclosed.', image: '/random/flowers.webp' },
      { text: 'Dog mom first, designer second.', image: '/random/dog-mom.webp' },
    ],
  },
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

function FunFactTooltip({ fact }: { fact: FunFact }) {
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
          overflow: 'hidden',
          width: 240,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}
      >
        <img src={fact.image} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
        <div style={{ padding: '12px 16px 14px', color: '#fff', fontSize: 14, fontWeight: 400, lineHeight: 1.45 }}>
          {fact.text}
        </div>
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

function HeroFolder({ src, alt, left, top, delay, rotate, width, stats, facts }: typeof HERO_FOLDERS[0]) {
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const lastFactIndexRef = useRef(-1)
  const floatY = rotate < 0 ? [-9, 0, -9] : [9, 0, 9]

  const handleHoverStart = () => {
    setHovered(true)
    if (facts && facts.length > 1) {
      const next = lastFactIndexRef.current === -1
        ? Math.floor(Math.random() * facts.length)
        : (lastFactIndexRef.current + 1) % facts.length
      lastFactIndexRef.current = next
      setCurrentFactIndex(next)
    }
  }

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
      data-cursor="drag"
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={() => setHovered(false)}
      onDragStart={() => { setIsDragging(true); setHovered(false); window.dispatchEvent(new Event('cursor:drag:start')) }}
      onDragEnd={() => { setIsDragging(false); window.dispatchEvent(new Event('cursor:drag:end')) }}
      style={{ position: 'absolute', left, top, pointerEvents: 'auto', userSelect: 'none' }}
    >
      <motion.div
        animate={!isDragging ? { y: floatY } : { y: 0 }}
        transition={{ delay: delay + 2.0, duration: 5.0 + delay * 0.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence>{stats && hovered && !isDragging && <FolderTooltip stats={stats} />}</AnimatePresence>
        <AnimatePresence>{facts && hovered && !isDragging && <FunFactTooltip fact={facts[currentFactIndex]} />}</AnimatePresence>
        <img src={src} alt={alt} width={width} draggable={false} style={{ display: 'block' }} />
      </motion.div>
    </motion.div>
  )
}

// Arc: imaginary ellipse cx=46%, cy=45vh, rx=30%, ry=36vh — all 10 floating elements (5 cursors,
// 3 illustrations, 2 folders) are placed on this arc with ~25° spacing to prevent overlaps.
// cx is shifted 4% left of centre to compensate for cursor labels always extending rightward.
// Left arc (θ top→bottom): final_FINAL_v2 232°, folder-final 208°, Lots of Coffee 180°, sticky 152°, Music Non-Stop 118°
// Right arc (θ top→bottom): This is still WIP 308°, wave 335°, folder-fun 8°, Just One Small Change 35°, scribble 60°
interface FigmaCursor {
  name: string; color: string
  left: string; top: string
  delay: number; duration: number
  animY: number[]; animX: number[]
}
const FIGMA_USERS: FigmaCursor[] = [
  { name: 'final_FINAL_v2',        color: '#E8B225', left: '27%', top: '17vh', delay: 1.8, duration: 17, animY: [0, -34, 26, -42, 30, -20, 0], animX: [0, -18, 12, -22, 15, -10, 0] },
  { name: 'Lots of Coffee',        color: '#4088F0', left: '16%', top: '45vh', delay: 0,   duration: 14, animY: [0, -30, 38, -40, 26, -34, 0], animX: [0, -20, 14, -26, 16, -12, 0] },
  { name: 'Music Non-Stop',        color: '#3DAA54', left: '32%', top: '77vh', delay: 0.7, duration: 18, animY: [0, 28, -34, 30, -24, 32,  0], animX: [0, -16, 12, -20, 14, -10, 0] },
  { name: 'This is still WIP',     color: '#E05530', left: '65%', top: '17vh', delay: 2.1, duration: 13, animY: [0, -38, 24, -44, 20, -30, 0], animX: [0, 16, -12, 22, -14, 10,  0] },
  { name: 'Just One Small Change', color: '#D43F9B', left: '71%', top: '66vh', delay: 1.2, duration: 16, animY: [0, 30, -32, 40, -20, 36,  0], animX: [0, 16, -12, 20, -14, 10,  0] },
]

function HeroCursor({ name, color, left, top, delay, duration, animY, animX }: FigmaCursor) {
  const [isDragging, setIsDragging] = useState(false)
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay + 1.5, ease: [0.16, 1, 0.3, 1] }}
      data-cursor="drag"
      style={{ position: 'absolute', left, top, pointerEvents: 'auto', userSelect: 'none' }}
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      onDragStart={() => { setIsDragging(true); window.dispatchEvent(new Event('cursor:drag:start')) }}
      onDragEnd={() => { setIsDragging(false); window.dispatchEvent(new Event('cursor:drag:end')) }}
    >
      <motion.div
        animate={isDragging ? { y: 0, x: 0 } : { y: animY, x: animX }}
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
  loading: () => <div className="min-h-screen bg-white" />,
})

const CaseStudiesSection = dynamic(() => import('@/components/home/CaseStudiesSection'), {
  loading: () => <div style={{ height: '100svh', background: '#ffffff' }} />,
  ssr: false,
})

const DesignShowcase = dynamic(() => import('@/components/home/DesignShowcase'), {
  loading: () => <div className="py-16 bg-white" />,
  ssr: false,
})

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <div className="py-16 bg-white" />,
  ssr: false,
})

const AboutPreview = dynamic(() => import('@/components/home/AboutPreview'), {
  loading: () => <div className="py-16 bg-white" />,
  ssr: false,
})

const CTASection = dynamic(() => import('@/components/home/CTASection'), {
  loading: () => <div className="py-16 bg-white" />,
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
          <div className="hidden md:block">
            {HERO_FOLDERS.map((folder) => <HeroFolder key={folder.src} {...folder} />)}
          </div>
        </div>
      </div>

      {/* Stable wrappers prevent GSAP pin-spacer insertion from breaking React's
          insertBefore calls when sibling dynamic imports resolve later */}
      <div><CaseStudiesSection isDesktop={isDesktop} /></div>
      <div><DesignShowcase /></div>

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
