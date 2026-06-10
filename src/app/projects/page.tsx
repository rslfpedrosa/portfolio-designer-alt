'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Home } from 'lucide-react'
import { projectsData } from '@/data/projects'
import CTASection from '@/components/home/CTASection'
import GridBackground from '@/components/GridBackground'

// ── Slide config (mirrors CaseStudiesSection) ─────────────────────────────────
const SLIDE_IDS = [3, 1, 2]
type LucideIcon = React.ComponentType<{ size?: number }>
const ICONS: Record<number, LucideIcon> = { 1: ShoppingBag, 2: Home, 3: Heart }
const slides = SLIDE_IDS.map(id => ({ ...projectsData[id], Icon: ICONS[id] }))

const GRADIENTS: Record<number, string> = {
  3: [
    'linear-gradient(to right, rgba(8,14,60,0.94) 0%, rgba(8,14,60,0.68) 38%, rgba(8,14,60,0.18) 100%)',
    'linear-gradient(to top, rgba(8,14,60,0.90) 0%, transparent 42%)',
  ].join(', '),
  1: [
    'linear-gradient(to right, rgba(55,22,4,0.94) 0%, rgba(55,22,4,0.68) 38%, rgba(55,22,4,0.18) 100%)',
    'linear-gradient(to top, rgba(55,22,4,0.90) 0%, transparent 42%)',
  ].join(', '),
  2: [
    'linear-gradient(to right, rgba(38,10,62,0.94) 0%, rgba(38,10,62,0.68) 38%, rgba(38,10,62,0.18) 100%)',
    'linear-gradient(to top, rgba(38,10,62,0.90) 0%, transparent 42%)',
  ].join(', '),
}

const TAG_GLASS: Record<number, { bg: string; border: string }> = {
  3: { bg: 'rgba(61,85,216,0.28)',  border: 'rgba(100,130,255,0.35)' },
  1: { bg: 'rgba(200,85,24,0.28)',  border: 'rgba(240,120,60,0.35)'  },
  2: { bg: 'rgba(139,40,194,0.28)', border: 'rgba(185,90,240,0.35)'  },
}

const EASE_REVEAL = [0.55, 0, 0.1, 1] as [number, number, number, number]
const EASE_FADE   = [0.22, 1, 0.36, 1] as [number, number, number, number]

// ── Card content animation variants ───────────────────────────────────────────
const cardContentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
}
const tagVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_FADE } },
}
const titleVariant = {
  hidden: { y: '108%' },
  visible: { y: '0%', transition: { duration: 1.05, ease: EASE_REVEAL } },
}
const descVariant = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_FADE } },
}

const dashedH = {
  backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)',
  backgroundSize: '16px 1px',
  backgroundRepeat: 'repeat-x',
}

// ─────────────────────────────────────────────────────────────────────────────

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

const ProjectsPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className="min-h-screen pt-16 relative overflow-x-hidden" style={{ backgroundColor: '#ffffff' }}>

      <GridBackground />

      {/* Vertical dashed column lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>

      {/* ── Hero heading ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-14 sm:pt-24 pb-2 sm:pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left pl-6 sm:pl-8 lg:pl-16"
          >
            <h1
              className="font-medium leading-none mb-4"
              style={{ fontSize: 'clamp(56px, 10vw, 120px)', color: '#241f21' }}
            >
              My Work
            </h1>
            <p className="text-xl max-w-2xl" style={{ color: 'rgba(36,31,33,0.5)' }}>
              Selected work, not all the work.<br /> Feel free to get in touch if you'd like to see more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Case study slides ─────────────────────────────────────────────────── */}
      <section className="relative z-10 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col">
          {slides.map((slide, i) => (
            <div key={slide.id} className={i > 0 ? 'mt-6 sm:mt-0' : ''}>
              {/* Figma component label — above the top line */}
              <div
                aria-hidden
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: '#9747FF',
                  pointerEvents: 'none',
                  paddingTop: 'clamp(12px, 1.5vw, 20px)',
                  paddingBottom: 8,
                  paddingLeft: 'clamp(6px, 0.75vw, 12px)',
                }}
              >
                <img src="/icons/component-2.svg" alt="" width={14} height={14} style={{ display: 'block' }} />
                <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1 }}>
                  Case Study {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Horizontal dashed line above frame */}
              <div className="relative h-px pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={dashedH} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 },
                  y: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 },
                }}
                viewport={{ once: true, margin: '-80px' }}
                style={{
                  position: 'relative', width: '100%',
                  boxShadow: hoveredId === slide.id ? '0 24px 60px rgba(36,31,33,0.18)' : '0 0px 0px rgba(36,31,33,0)',
                  transition: 'box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* Corner squares — hidden by default, white on hover */}
                {CORNERS.map(corner => (
                  <div
                    key={corner}
                    style={{
                      position: 'absolute',
                      width: 12, height: 12,
                      borderRadius: 2,
                      zIndex: 20,
                      pointerEvents: 'none',
                      backgroundColor: '#ffffff',
                      border: '1px solid #9747FF',
                      opacity: hoveredId === slide.id ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      top: corner.startsWith('top') ? -6 : undefined,
                      bottom: corner.startsWith('bottom') ? -6 : undefined,
                      left: corner.endsWith('left') ? -6 : undefined,
                      right: corner.endsWith('right') ? -6 : undefined,
                    }}
                  />
                ))}

                {/* Bordered frame */}
                <Link
                  href={`/projects/${slide.id}`}
                  style={{ display: 'block' }}
                  onMouseEnter={() => setHoveredId(slide.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: 'clamp(320px, 52svh, 580px)',
                    border: '1.5px solid #9747FF',
                    overflow: 'hidden',
                    background: '#042d2b',
                    cursor: 'pointer',
                  }}
                >
                  <Image
                    src={slide.heroImage}
                    fill
                    alt={slide.title}
                    style={{
                      objectFit: 'cover',
                      transform: hoveredId === slide.id ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    priority={i === 0}
                    sizes="(min-width: 1280px) 1280px, 100vw"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: GRADIENTS[slide.id] }} />

                  {/* Card content — stagger-orchestrated by parent */}
                  <motion.div
                    variants={cardContentVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    style={{
                      position: 'absolute',
                      left: 'clamp(26px, 5vw, 64px)',
                      right: 'clamp(22px, 5vw, 80px)',
                      bottom: 'clamp(26px, 5vw, 64px)',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'clamp(16px, 2vw, 28px)',
                    }}
                  >
                    {/* 1. Category tag */}
                    <motion.div variants={tagVariant}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '6px 16px', borderRadius: 999,
                        background: TAG_GLASS[slide.id].bg,
                        border: `1px solid ${TAG_GLASS[slide.id].border}`,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        color: '#ffffff',
                        fontSize: 13, fontWeight: 600, letterSpacing: '0.07em',
                      }}>
                        <slide.Icon size={13} />
                        {slide.category}
                      </span>
                    </motion.div>

                    {/* 2. Title — curtain reveal */}
                    <div style={{ overflow: 'hidden' }}>
                      <motion.h2
                        variants={titleVariant}
                        style={{
                          color: '#ffffff',
                          fontSize: 'clamp(30px, 3vw, 46px)',
                          fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em',
                          maxWidth: i === 0 && isDesktop ? 'none' : '22ch',
                          margin: 0,
                        }}
                      >
                        {i === 0 && isDesktop
                          ? <>Rethinking Care Management<br />for CPPS Treatment</>
                          : slide.subtitle}
                      </motion.h2>
                    </div>

                    {/* 3. Description */}
                    <motion.p
                      variants={descVariant}
                      style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '18px',
                        fontWeight: 400, lineHeight: 1.7, maxWidth: i === 0 && isDesktop ? 'none' : '44ch',
                        margin: 0,
                      }}
                    >
                      {i === 0 && isDesktop
                        ? <>Making it easier for physical therapists to track progress,<br />make decisions, and adapt care with confidence.</>
                        : slide.tagline ?? slide.description}
                    </motion.p>
                  </motion.div>
                </div>
                </Link>
              </motion.div>

              {/* Horizontal dashed line below frame */}
              <div className="relative h-px pointer-events-none" style={{ marginBottom: 8 }}>
                <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={dashedH} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  )
}

export default ProjectsPage
