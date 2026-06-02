'use client'

import { motion, useReducedMotion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Plane } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import CTASection from '@/components/home/CTASection'
import GridBackground from '@/components/GridBackground'

const CARD_W = 264
const CARD_PAD_X = 12
const CARD_PAD_Y = 10

const FigmaCommentPin = ({
  message,
  timeAgo,
  top,
  left,
}: {
  message: string
  timeAgo: string
  top: string
  left: string
}) => {
  const [hovered, setHovered] = useState(false)
  const [expandedHeight, setExpandedHeight] = useState(80)
  const measureRef = useRef<HTMLDivElement>(null)
  const ease = [0.25, 0.1, 0.25, 1] as const

  // Pre-measure real content height at full expanded width — avoids the framer-motion
  // "height: auto" glitch where it measures at the collapsed narrow width first
  useEffect(() => {
    if (measureRef.current) setExpandedHeight(measureRef.current.offsetHeight)
  }, [message])

  return (
    <div
      className="absolute z-20 cursor-default select-none"
      style={{ top, left, width: 0, height: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hidden mirror at full expanded dimensions — measurement only */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: CARD_W,
          padding: `${CARD_PAD_Y}px ${CARD_PAD_X}px`,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ width: 28, height: 28, flexShrink: 0 }} />
        <div style={{ marginLeft: 10, paddingTop: 1, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Rita Pedrosa</span>
            <span style={{ fontSize: 12 }}>{timeAgo}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.4, marginTop: 4 }}>{message}</p>
        </div>
      </div>

      {/* Card — grows up from the bottom-left anchor */}
      <motion.div
        initial={{
          opacity: 0,
          width: 42,
          height: 42,
          borderRadius: '50% 50% 50% 0',
          paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5,
        }}
        animate={{
          opacity: 1,
          width: hovered ? CARD_W : 42,
          height: hovered ? expandedHeight : 42,
          borderRadius: hovered ? '14px 14px 14px 0' : '50% 50% 50% 0',
          paddingTop: hovered ? CARD_PAD_Y : 5,
          paddingBottom: hovered ? CARD_PAD_Y : 5,
          paddingLeft: hovered ? CARD_PAD_X : 5,
          paddingRight: hovered ? CARD_PAD_X : 5,
        }}
        transition={{ duration: 0.24, ease }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ width: hovered ? 28 : 32, height: hovered ? 28 : 32 }}
          transition={{ duration: 0.24, ease }}
          style={{
            borderRadius: '50%',
            background: '#E91E8C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'white', fontWeight: 600, fontSize: 13, lineHeight: 1 }}>R</span>
        </motion.div>

        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.14, delay: hovered ? 0.12 : 0, ease }}
          style={{ marginLeft: 10, paddingTop: 1, flex: 1, minWidth: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Rita Pedrosa</span>
            <span style={{ fontSize: 12, color: '#999' }}>{timeAgo}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.4, marginTop: 4, color: '#222' }}>{message}</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

const borderColor = 'rgba(36,31,33,0.13)'
const bg = '#f2efea'
const textDark = '#241f21'
const textMuted = 'rgba(36,31,33,0.55)'
const textFaint = 'rgba(36,31,33,0.40)'

// Conference Card Component with floating photos on hover
const ConferenceCard = ({
  conference,
  index
}: {
  conference: {
    name: string
    year: string
    location: string
    destination: string
    code: string
    destCode: string
    description: string
    gradient: string
    cardBg: string
    photos: string[]
  }
  index: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl shadow-soft hover:shadow-large transition-all overflow-visible"
      style={{ background: conference.cardBg }}
    >
      {/* Floating photos on hover */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <motion.div
          initial={{ x: -50, y: -25, rotate: -15, scale: 0, opacity: 0 }}
          animate={isHovered ? {
            x: -150,
            y: -80,
            rotate: -12,
            scale: 1,
            opacity: 1
          } : {
            x: -50,
            y: -25,
            rotate: -15,
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-1/4 left-0 w-48 h-48 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10"
        >
          <img src={conference.photos[0]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ x: 50, y: 50, rotate: 15, scale: 0, opacity: 0 }}
          animate={isHovered ? {
            x: 150,
            y: 150,
            rotate: 12,
            scale: 1,
            opacity: 1
          } : {
            x: 50,
            y: 50,
            rotate: 15,
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="absolute bottom-1/4 right-0 w-48 h-48 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10"
        >
          <img src={conference.photos[1]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ y: -40, rotate: 8, scale: 0, opacity: 0 }}
          animate={isHovered ? {
            y: -120,
            rotate: 5,
            scale: 1,
            opacity: 1
          } : {
            y: -40,
            rotate: 8,
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-0 right-1/4 w-44 h-44 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10"
        >
          <img src={conference.photos[2]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Ticket-style design */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Perforated edge effect */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full -ml-2 z-10" style={{ backgroundColor: bg }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full -mr-2 z-10" style={{ backgroundColor: bg }} />

        <motion.div
          animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-br ${conference.gradient} p-8 text-white relative z-0`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm opacity-90 mb-1">{conference.location}</p>
              <div className="text-5xl font-medium">{conference.code}</div>
            </div>
            <motion.div
              animate={isHovered ? { x: 8 } : { x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Plane className="w-6 h-6 opacity-70" />
            </motion.div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">{conference.destination}</p>
              <div className="text-5xl font-medium">{conference.destCode}</div>
            </div>
          </div>

          <div className="border-t border-white/30 pt-4">
            <h3 className="text-2xl font-medium mb-2">{conference.name} '{conference.year}</h3>
          </div>
        </motion.div>
      </div>

      <div className="p-6 relative z-0">
        <p className="leading-relaxed" style={{ color: textMuted }}>
          {conference.description}
        </p>
      </div>
    </motion.div>
  )
}

// Bento joy cell with auto-play video
const BentoJoyCell = ({ joy, index }: { joy: { title: string; description: string; video: string }; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      className="relative overflow-visible"
    >
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
        <div
          key={corner}
          className="absolute w-3 h-3 z-20 rounded-sm"
          style={{
            backgroundColor: bg,
            border: `1px solid ${borderColor}`,
            top: corner.startsWith('top') ? '-6px' : undefined,
            bottom: corner.startsWith('bottom') ? '-6px' : undefined,
            left: corner.endsWith('left') ? '-6px' : undefined,
            right: corner.endsWith('right') ? '-6px' : undefined,
          }}
        />
      ))}
      <div
        className="relative h-full flex flex-col"
        style={{ backgroundColor: bg, outline: `1px solid ${borderColor}`, outlineOffset: '0px' }}
      >
        <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: '320px', backgroundColor: bg }}>
          <video
            ref={videoRef}
            src={joy.video}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
        <div className="p-5 flex-1" style={{ borderTop: `1px solid ${borderColor}` }}>
          <h3 className="text-base font-medium mb-1" style={{ color: textDark }}>{joy.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: textMuted }}>{joy.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

const JOYS = [
  { title: 'Beautiful, Overpriced Coffees', description: '€5 for vibes and foam art? Worth it.', video: '/videos/coffee.mp4' },
  { title: 'Falling in Love with Every Dog I Meet', description: 'Dogs are my weakness.', video: '/videos/dogs.mp4' },
  { title: 'Design Shop Wandering', description: 'My favorite kind of field trip.', video: '/videos/design-shop.mp4' },
  { title: "Nature's Biggest Fan", description: 'Trees, fresh air, no emails. Perfect.', video: '/videos/nature.mp4' },
  { title: 'Learning by Leaving', description: 'New cities. New ways of seeing.', video: '/videos/travel.mp4' },
]

const cornerSquares = (
  corners: readonly ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right')[],
  active = false
) =>
  corners.map((corner) => (
    <div
      key={corner}
      className="absolute w-3 h-3 z-20 rounded-sm"
      style={{
        backgroundColor: active ? '#ffffff' : bg,
        border: `1px solid ${active ? '#0a99ff' : borderColor}`,
        top: corner.startsWith('top') ? '-6px' : undefined,
        bottom: corner.startsWith('bottom') ? '-6px' : undefined,
        left: corner.endsWith('left') ? '-6px' : undefined,
        right: corner.endsWith('right') ? '-6px' : undefined,
      }}
    />
  ))

const CORNER_HANDLES = [
  { key: 'top-left',     signX:  1, signY:  1 },
  { key: 'top-right',    signX: -1, signY:  1 },
  { key: 'bottom-left',  signX:  1, signY: -1 },
  { key: 'bottom-right', signX: -1, signY: -1 },
] as const

const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start end', 'end end'] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 })

  const [cardRadius, setCardRadius] = useState(0)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const [draggingPostIt, setDraggingPostIt] = useState<number | null>(null)
  const [hoveredPostIt, setHoveredPostIt] = useState<number | null>(null)

  useEffect(() => {
    const measure = () => {
      if (!cardRef.current) return
      const { width, height } = cardRef.current.getBoundingClientRect()
      setCardDimensions({ width: Math.round(width), height: Math.round(height) })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const makeCornerDragHandler = (signX: 1 | -1, signY: 1 | -1) => (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    const startX = e.clientX
    const startY = e.clientY
    const startRadius = cardRadius

    const onMouseMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) * signX
      const dy = (ev.clientY - startY) * signY
      setCardRadius(Math.max(0, Math.min(120, startRadius + (dx + dy) / 2)))
    }

    const onMouseUp = (ev: MouseEvent) => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        if (ev.clientX < rect.left || ev.clientX > rect.right || ev.clientY < rect.top || ev.clientY > rect.bottom) {
          setIsCardHovered(false)
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const timeline = [
    {
      year: '2024',
      period: '2024 – Present',
      location: 'Remote',
      title: 'Senior Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Leading end-to-end design for complex digital products, with a focus on healthcare and emerging technologies.',
      bullets: [
        'Facilitated design sprints and discovery workshops',
        'Designed scalable systems and end-to-end flows',
        'Bridged design, product, and engineering teams',
      ],
    },
    {
      year: '2022',
      period: '2022 – 2024',
      location: 'Remote',
      title: 'Mid Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Owned key product areas, contributing from early concepts to high-fidelity delivery.',
      bullets: [
        'Translated complex requirements into clear experiences',
        'Collaborated closely with engineers to ensure feasibility',
        'Improved usability across core product journeys',
      ],
    },
    {
      year: '2022',
      period: '2022',
      location: 'Remote',
      title: 'Junior Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Built a strong foundation in UX and UI across multiple projects and industries.',
      bullets: [
        'Supported user research',
        'Designed interfaces and interaction patterns',
        'Balanced user needs with business goals',
      ],
    },
    {
      year: '2020',
      period: '2020 – 2021',
      location: 'Lisbon, Portugal',
      title: 'UX & UI Specialization',
      company: 'Edit.',
      companyUrl: 'https://edit.com.pt',
      description: 'An intensive course focused on human-centered design, usability, and digital product strategy. I developed skills in user research, journey mapping, wireframing, and prototyping using modern tools and practices. As part of the final project, I collaborated with a team to redesign a real e-commerce experience for Fnac.pt, addressing key UX pain points and proposing data-informed improvements.',
    },
    {
      year: '2019',
      period: '2019',
      location: 'Coimbra, Portugal',
      title: 'Summer Internship',
      company: 'Whitesmith',
      companyUrl: 'https://whitesmith.co',
      description: 'During this internship, I took on the role of Product Owner for a self-initiated product idea. I led early-stage product discovery by conducting market research, user interviews, and questionnaires to validate the concept. This experience gave me a full view of the business side of product development, from identifying user pain points to shaping value propositions. It was a foundational moment that sparked my transition into product design.',
    },
    {
      year: '2017',
      period: '2017 – 2020',
      location: 'Coimbra, Portugal',
      title: 'Bachelor\'s in Design and Multimedia',
      company: 'University of Coimbra',
      companyUrl: 'https://www.uc.pt',
      description: 'A multidisciplinary design program with a strong digital focus. I explored everything from web development and interactive installations to motion graphics and game design. This broad foundation gave me both creative range and technical adaptability.',
    },
  ]

  const values = [
    {
      illustration: '/Me/Light bulb.svg',
      title: 'Clarity over complexity',
      description: 'I aim to make complex systems feel understandable and usable.',
      color: '#F9E08C',
      rotation: -4,
    },
    {
      illustration: '/Me/Scribble.svg',
      title: 'Human-centered thinking',
      description: 'Decisions start with real user needs, not assumptions.',
      color: '#A8CDED',
      rotation: 0,
    },
    {
      illustration: '/Me/Wave.svg',
      title: 'Collaboration by default',
      description: 'The best outcomes come from working closely with engineers and stakeholders.',
      color: '#F5C5A3',
      rotation: 4,
    },
  ]

  return (
    <div className="min-h-screen pt-16 relative overflow-x-hidden" style={{ backgroundColor: bg }}>
      <GridBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-10 pb-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section labels */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-md"
              style={{ backgroundColor: bg, border: `1px solid ${borderColor}`, color: textDark }}
            >
              Section 1
            </span>
            <span
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md"
              style={{ backgroundColor: '#16a34a', color: '#fff' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 4L1 6L3.5 8M8.5 4L11 6L8.5 8M7 2.5L5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ready for dev
            </span>
          </div>

          {/* Bordered card — Figma-like hover interaction */}
          <div
            className="relative"
            style={{ isolation: 'isolate' }}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => { if (!isDraggingRef.current) setIsCardHovered(false) }}
          >
            {/* Corner squares on outer wrapper — never clipped by card overflow */}
            {cornerSquares(['top-left', 'top-right', 'bottom-left', 'bottom-right'], isCardHovered)}

            {/* Card: ref + overflow here so photo clips to border-radius */}
            <div
              ref={cardRef}
              className="relative"
              style={{
                backgroundColor: '#ffffff',
                boxShadow: `0 0 0 1px ${isCardHovered ? '#0a99ff' : borderColor}`,
                borderRadius: `${cardRadius}px`,
                overflow: cardRadius > 0 ? 'hidden' : 'visible',
              }}
            >

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                {/* Left: Photo — full bleed */}
                <div
                  className="relative min-h-[280px] border-b lg:border-b-0 lg:border-r overflow-visible"
                  style={{ borderColor }}
                >
                  <img
                    src="/Me/IMG_0426.webp"
                    alt="Rita Pedrosa"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <FigmaCommentPin
                    message="This is Chico 🐶 Head of morale and snack supervision 🍗"
                    timeAgo="3 min. ago"
                    top="32%"
                    left="calc(52% + 30px)"
                  />
                  <FigmaCommentPin
                    message="This is me 👋 Nice to meet you!"
                    timeAgo="5 min. ago"
                    top="72%"
                    left="8%"
                  />
                </div>

                {/* Right: Single section with internal dividers */}
                <div className="relative flex flex-col justify-center p-8 lg:px-10 lg:pb-10 lg:pt-20">

                {/* Group 1: Name + subtitle */}
                <div className="pb-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-5xl sm:text-8xl font-medium flex items-center gap-1 whitespace-nowrap"
                    style={{ color: textDark }}
                  >
                    Hi, I&apos;m Rita
                    <img src="/Me/Sparkle.svg" alt="" className="w-14 h-14 sm:w-20 sm:h-20 inline-block rotate-45 flex-shrink-0" style={{ filter: 'brightness(0)' }} />
                  </motion.h1>
                </div>

                {/* Group 2: Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="pb-6 pt-2 text-base sm:text-lg leading-relaxed"
                  style={{ color: textMuted }}
                >
                  Over the past few years, I&apos;ve worked on end-to-end product experiences, from early discovery to final implementation, collaborating closely with cross-functional teams to turn ideas into meaningful, usable solutions.
                </motion.p>

                <div className="w-full h-px" style={{ backgroundColor: borderColor }} />

                {/* Group 3: Highlights */}
                <ul className="text-base sm:text-lg divide-y pt-2" style={{ color: textDark, borderColor }}>
                  {['4+ years designing complex digital products', 'Led design sprints with cross-functional teams', 'Focused on healthcare and AI-driven experiences'].map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                      className="py-3"
                      style={{ borderColor }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
                </div>
              </div>
            </div>

            {/* Straight bounding-box lines — outward box-shadow, photo can never overlap */}
            {cardRadius > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: `0 0 0 1px ${isCardHovered ? '#0a99ff' : borderColor}` }}
              />
            )}

            {/* Corner radius handles */}
            {isCardHovered && CORNER_HANDLES.map(({ key, signX, signY }) => {
              const inset = Math.max(20, Math.min(cardRadius, 60))
              return (
                <div
                  key={key}
                  onMouseDown={makeCornerDragHandler(signX, signY)}
                  style={{
                    position: 'absolute',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    border: '1.5px solid #0a99ff',
                    cursor: 'crosshair',
                    zIndex: 30,
                    userSelect: 'none',
                    ...(key.startsWith('top') ? { top: inset } : { bottom: inset }),
                    ...(key.endsWith('left') ? { left: inset } : { right: inset }),
                  }}
                />
              )
            })}

            {/* Radius label — shows near top-left handle */}
            {isCardHovered && (
              <div
                className="absolute pointer-events-none z-40"
                style={{
                  top: Math.max(20, Math.min(cardRadius, 60)) - 22,
                  left: Math.max(20, Math.min(cardRadius, 60)),
                }}
              >
                <span
                  className="text-xs text-white px-1.5 py-0.5 rounded-sm whitespace-nowrap"
                  style={{ backgroundColor: '#0a99ff' }}
                >
                  Radius {Math.round(cardRadius)}
                </span>
              </div>
            )}

            {/* Dimension chip below card */}
            {isCardHovered && (
              <div
                className="absolute left-1/2 pointer-events-none z-40"
                style={{ bottom: -28, transform: 'translateX(-50%)' }}
              >
                <span
                  className="text-xs text-white px-2 py-1 rounded-sm whitespace-nowrap"
                  style={{ backgroundColor: '#0a99ff' }}
                >
                  {cardDimensions.width} × {cardDimensions.height}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="relative z-10 py-8 lg:pt-8 lg:pb-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center mb-4 sm:mb-6"
          >
            <h2 className="text-3xl sm:text-[4rem] font-semibold leading-none" style={{ color: textDark }}>
              My Design Philosophy
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center py-6 md:py-10">
            {values.map((value, index) => {
              const overlapMargin = 30
              const stackZ = [1, 3, 2][index]
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  viewport={{ once: true }}
                  drag
                  dragMomentum={false}
                  onDragStart={() => setDraggingPostIt(index)}
                  onDragEnd={() => setDraggingPostIt(null)}
                  onHoverStart={() => setHoveredPostIt(index)}
                  onHoverEnd={() => setHoveredPostIt(null)}
                  whileDrag={{
                    scale: 1.04,
                    boxShadow: '0 28px 60px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.12)',
                    rotate: value.rotation * 0.5,
                  }}
                  className="flex flex-col p-10 flex-shrink-0"
                  style={{
                    backgroundColor: value.color,
                    borderRadius: '2px',
                    rotate: `${value.rotation}deg`,
                    boxShadow: '0 10px 36px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.08)',
                    outline: (hoveredPostIt === index || draggingPostIt === index) ? '2px solid #0a99ff' : '2px solid transparent',
                    width: '380px',
                    minHeight: '340px',
                    cursor: draggingPostIt === index ? 'grabbing' : 'grab',
                    zIndex: draggingPostIt === index ? 50 : stackZ,
                    position: 'relative',
                    userSelect: 'none',
                    touchAction: 'none',
                    marginRight: index === 0 ? -overlapMargin : undefined,
                    marginLeft: index === 2 ? -overlapMargin : undefined,
                  }}
                >
                  {(hoveredPostIt === index || draggingPostIt === index) && cornerSquares(
                    ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                    true
                  )}
                  <div className="mb-6">
                    <img src={value.illustration} alt="" className="w-20 h-20 object-contain" style={{ filter: 'brightness(0) opacity(0.5)' }} />
                  </div>
                  <h3 className="text-2xl font-medium mb-3" style={{ color: 'rgba(36,31,33,0.85)' }}>
                    {value.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: 'rgba(36,31,33,0.6)' }}>
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative z-10 py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-left mb-8 sm:mb-16 px-6 sm:pl-8 sm:pr-0 lg:pl-16"
          >
            <h2 className="text-3xl sm:text-[4rem] font-semibold mb-2 leading-none flex items-center justify-start gap-3" style={{ color: textDark }}>
              My Journey
              <img src="/Me/Arrow.svg" alt="" className="w-14 h-14 sm:w-20 sm:h-20 inline-block flex-shrink-0" style={{ filter: 'brightness(0)' }} />
            </h2>
            <p className="text-xl" style={{ color: textMuted }}>
              A path shaped by curiosity, ownership, and continuous learning
            </p>
          </motion.div>

          <div className="relative" ref={timelineRef}>
            {/* Timeline Line background */}
            <div className="absolute left-[9px] top-0 bottom-0 w-0.5" style={{ backgroundColor: 'rgba(36,31,33,0.10)' }} />
            {/* Timeline Line fill */}
            <motion.div
              className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-[#0a99ff] origin-top"
              style={{ scaleY: lineProgress }}
            />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year + item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  viewport={{ once: true }}
                  className="relative flex items-center gap-8"
                >
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 w-5 flex justify-center items-center">
                    <motion.div
                      className="w-[10px] h-[10px] rounded-full relative z-10"
                      initial={{ backgroundColor: 'rgba(36,31,33,0.15)', boxShadow: '0 0 0 3px rgba(10,153,255,0)' }}
                      whileInView={{ backgroundColor: '#0a99ff', boxShadow: '0 0 0 3px rgba(10,153,255,0.25)' }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 relative overflow-visible">
                    {cornerSquares(['top-left', 'top-right', 'bottom-left', 'bottom-right'])}
                    <div
                      className="p-8 h-full"
                      style={{ backgroundColor: bg, outline: `1px solid ${borderColor}`, outlineOffset: '0px' }}
                    >
                      <div className="mb-3">
                        <p className="text-sm mb-1" style={{ color: textFaint }}>
                          {item.period}{item.location && <span className="ml-3">·<span className="ml-3">{item.location}</span></span>}
                        </p>
                        <h3 className="text-xl font-medium mb-1" style={{ color: textDark }}>
                          {item.title}
                          {item.company && (
                            <>
                              {' at '}
                              {item.companyUrl ? (
                                <a
                                  href={item.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline underline-offset-2 transition-colors"
                                  style={{ color: '#042d2b' }}
                                >
                                  {item.company}
                                </a>
                              ) : (
                                item.company
                              )}
                            </>
                          )}
                        </h3>
                      </div>
                      <p className="text-[1rem] leading-relaxed mb-4" style={{ color: textMuted }}>
                        {item.description}
                      </p>
                      {'bullets' in item && item.bullets && item.bullets.length > 0 && (
                        <ul className="mb-4 space-y-1">
                          {item.bullets.map((bullet: string) => (
                            <li key={bullet} className="text-[1rem] flex items-start gap-2" style={{ color: textMuted }}>
                              <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: textFaint }} />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Small Joys Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Header cell */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true }}
              className="relative overflow-visible"
            >
              {cornerSquares(['top-left', 'top-right', 'bottom-left', 'bottom-right'])}
              <div
                className="relative p-8 lg:p-10 h-full flex flex-col justify-center"
                style={{ backgroundColor: bg, outline: `1px solid ${borderColor}`, outlineOffset: '0px' }}
              >
                <img src="/Me/Vinyl.svg" alt="" className="w-14 h-14 mb-6" style={{ filter: 'brightness(0)' }} />
                <h2 className="text-4xl lg:text-5xl font-semibold mb-4 leading-none" style={{ color: textDark }}>
                  Small Joys, Big Inspiration
                </h2>
                <p className="text-base lg:text-lg leading-relaxed" style={{ color: textMuted }}>
                  These are the little things that refill my creative energy.
                </p>
              </div>
            </motion.div>

            {/* Joy cells */}
            {JOYS.map((joy, index) => (
              <BentoJoyCell key={joy.title} joy={joy} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Design Conferences Section */}
      <section className="relative z-10 pt-12 sm:pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-left mb-8 sm:mb-12 px-6 sm:pl-8 sm:pr-0 md:max-w-5xl md:mx-auto md:px-0"
          >
            <img src="/Me/Airplane.svg" alt="" className="w-28 h-28 mb-4" style={{ filter: 'brightness(0)' }} />
            <h2 className="text-3xl sm:text-[4rem] font-semibold mb-4 leading-none" style={{ color: textDark }}>
              Favourite Conferences I&apos;ve Attended
            </h2>
            <p className="text-xl sm:max-w-3xl mb-2" style={{ color: textMuted }}>
              Design Conferences are one of my favourite ways of being inspired and to learn from
              other companies and Designers. A great place for networking and become a better professional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'OFFF',
                year: '23',
                location: 'Lisbon, Portugal',
                destination: 'Barcelona, Spain',
                code: 'LIS',
                destCode: 'BCN',
                description: 'Drew inspiration from top creatives across motion, branding, and interactive design.',
                gradient: 'from-[#3372D6] to-[#1a3a8a]',
                cardBg: 'linear-gradient(to bottom right, #3372D6, #1a3a8a)',
                photos: [
                    '/conferences/offf-group.jpg',
                    '/conferences/offf-stage.jpg',
                    '/conferences/offf-badge.jpg'
                ]
              },
              {
                name: 'Design Matters',
                year: '24',
                location: 'Lisbon, Portugal',
                destination: 'Copenhagen, Denmark',
                code: 'LIS',
                destCode: 'CPH',
                description: 'Gained new perspectives on AI in product design, and learned from real-world case studies.',
                gradient: 'from-[#FE7747] to-[#c2410c]',
                cardBg: 'linear-gradient(to bottom right, #FE7747, #c2410c)',
                photos: [
                    '/conferences/dm-coffee.jpg',
                    '/conferences/dm-group.jpg',
                    '/conferences/dm-venue.jpg'
                ]
              },
            ].map((conference, index) => (
              <ConferenceCard key={conference.name} conference={conference} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}

export default AboutPage
