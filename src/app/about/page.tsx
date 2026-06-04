'use client'

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
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
  mobileTop,
  mobileLeft,
}: {
  message: string
  timeAgo: string
  top: string
  left: string
  mobileTop?: string
  mobileLeft?: string
}) => {
  const [hovered, setHovered] = useState(false)
  const [expandedHeight, setExpandedHeight] = useState(80)
  const [isMobile, setIsMobile] = useState(false)
  const measureRef = useRef<HTMLDivElement>(null)
  const ease = [0.25, 0.1, 0.25, 1] as const

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Pre-measure real content height at full expanded width — avoids the framer-motion
  // "height: auto" glitch where it measures at the collapsed narrow width first
  useEffect(() => {
    if (measureRef.current) setExpandedHeight(measureRef.current.offsetHeight)
  }, [message, isMobile])

  const resolvedTop = isMobile && mobileTop ? mobileTop : top
  const resolvedLeft = isMobile && mobileLeft ? mobileLeft : left

  return (
    <div
      className="absolute z-20 cursor-default select-none"
      style={{ top: resolvedTop, left: resolvedLeft, width: 0, height: 0 }}
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
          width: isMobile ? 180 : CARD_W,
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
          width: hovered ? (isMobile ? 180 : CARD_W) : 42,
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
            background: '#ff00c3',
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
            <span style={{ fontSize: 14, fontWeight: 600, color: '#241f21' }}>Rita Pedrosa</span>
            <span style={{ fontSize: 12, color: '#999' }}>{timeAgo}</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.4, marginTop: 4, color: '#241f21' }}>{message}</p>
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
  const [isMobile, setIsMobile] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile || !isHovered) return
    const handleOutsideTap = (e: TouchEvent | MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsHovered(false)
      }
    }
    document.addEventListener('touchstart', handleOutsideTap)
    document.addEventListener('mousedown', handleOutsideTap)
    return () => {
      document.removeEventListener('touchstart', handleOutsideTap)
      document.removeEventListener('mousedown', handleOutsideTap)
    }
  }, [isMobile, isHovered])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => { if (!isMobile) setIsHovered(true) }}
      onMouseLeave={() => { if (!isMobile) setIsHovered(false) }}
      onClick={() => { if (isMobile) setIsHovered(h => !h) }}
      className="relative transition-all overflow-visible"
    >
      {/* Floating photos on hover/tap */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Photo 1 — desktop: floats left/up; mobile: spreads within card */}
        <motion.div
          initial={{ x: -50, y: -25, rotate: -15, scale: 0, opacity: 0 }}
          animate={isHovered ? {
            x: isMobile ? 20 : -150,
            y: isMobile ? -70 : -80,
            rotate: -12,
            scale: 1,
            opacity: 1,
          } : {
            x: isMobile ? 10 : -50,
            y: isMobile ? -10 : -25,
            rotate: -15,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute top-1/4 left-0 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10 ${isMobile ? 'w-40 h-40' : 'w-48 h-48'}`}
        >
          <img src={conference.photos[0]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>

        {/* Photo 2 — desktop: floats right/down; mobile: stays within card */}
        <motion.div
          initial={{ x: 50, y: 50, rotate: 15, scale: 0, opacity: 0 }}
          animate={isHovered ? {
            x: isMobile ? -30 : 150,
            y: isMobile ? 70 : 150,
            rotate: 12,
            scale: 1,
            opacity: 1,
          } : {
            x: isMobile ? -10 : 50,
            y: isMobile ? 10 : 50,
            rotate: 15,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className={`absolute bottom-1/4 right-0 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10 ${isMobile ? 'w-40 h-40' : 'w-48 h-48'}`}
        >
          <img src={conference.photos[1]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>

        {/* Photo 3 — desktop: floats above; mobile: spreads within card */}
        <motion.div
          initial={{ y: -40, rotate: 8, scale: 0, opacity: 0 }}
          animate={isHovered ? {
            x: isMobile ? -40 : 0,
            y: isMobile ? 130 : -120,
            rotate: 5,
            scale: 1,
            opacity: 1,
          } : {
            x: isMobile ? -20 : 0,
            y: isMobile ? 40 : -40,
            rotate: 8,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className={`absolute top-0 right-1/4 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10 ${isMobile ? 'w-36 h-36' : 'w-44 h-44'}`}
        >
          <img src={conference.photos[2]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Masked card body (photos sit outside this) */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: conference.cardBg,
          WebkitMaskImage: 'radial-gradient(circle 12px at 0px 41%, transparent 12px, black 12px), radial-gradient(circle 12px at 100% 41%, transparent 12px, black 12px)',
          maskImage: 'radial-gradient(circle 12px at 0px 41%, transparent 12px, black 12px), radial-gradient(circle 12px at 100% 41%, transparent 12px, black 12px)',
          WebkitMaskComposite: 'destination-in',
          maskComposite: 'intersect',
        }}
      >
      {/* Ticket-style design */}
      <div className="relative overflow-hidden rounded-2xl">
        <motion.div
          animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`${conference.gradient} p-8 text-white relative z-0`}
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

          <div className="border-t border-dashed border-white/30 pt-4">
            <h3 className="text-2xl font-medium mb-2">{conference.name} '{conference.year}</h3>
          </div>
        </motion.div>
      </div>

      <div className="p-6 relative z-0">
        <p className="leading-relaxed text-white/80">
          {conference.description}
        </p>
      </div>
      </div>{/* end masked card body */}
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

// [top-left, top-right, mid-left, mid-right, bottom-center]
const POLAROID_POSITIONS = [
  { rotation: -9, pos: { top: '5%',  left:  '2%'  } },
  { rotation: 6,  pos: { top: '5%',  right: '2%'  } },
  { rotation: -6, pos: { top: '42%', left:  '2%'  } },
  { rotation: 8,  pos: { top: '50%', right: '2%'  } },
  { rotation: -3, pos: { top: '68%', left: 'calc(50% - 140px)' } },
]

const PolaroidCard = ({
  joy,
  rotation,
  pos,
  index,
}: {
  joy: typeof JOYS[0]
  rotation: number
  pos: React.CSSProperties
  index: number
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const didDrag = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.3 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      initial={{ opacity: 0, y: 24, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ rotate: rotation }}
      whileHover={{ rotate: rotation * 0.35 }}
      whileDrag={{ scale: 1.04 }}
      transition={{
        opacity: { duration: 0.9, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] },
        y:       { duration: 0.9, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] },
        rotate:  { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        scale:   { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
      }}
      viewport={{ once: true }}
      onDragStart={() => { didDrag.current = true; setIsDragging(true); window.dispatchEvent(new CustomEvent('cursor:drag:start')) }}
      onDragEnd={() => { setIsDragging(false); setTimeout(() => { didDrag.current = false }, 100); window.dispatchEvent(new CustomEvent('cursor:drag:end')) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="drag"
      style={{
        position: 'absolute',
        width: 'clamp(200px, 27%, 280px)',
        ...pos,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 30 : isHovered ? 25 : 10,
        backgroundColor: '#ffffff',
        padding: '10px 10px 0 10px',
        boxShadow: isDragging
          ? '0 30px 80px rgba(36,31,33,0.28)'
          : isHovered
            ? '0 20px 60px rgba(36,31,33,0.20)'
            : '0 6px 24px rgba(36,31,33,0.14)',
        transition: 'box-shadow 0.45s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Photo area */}
      <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src={joy.video}
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            pointerEvents: 'none',
          }}
        />
      </div>
      {/* Polaroid label strip */}
      <div style={{ padding: '10px 4px 20px 4px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: textDark, lineHeight: 1.3, marginBottom: '2px' }}>
          {joy.title}
        </p>
        <p style={{ fontSize: '12px', color: textMuted, lineHeight: 1.4 }}>
          {joy.description}
        </p>
      </div>
    </motion.div>
  )
}

const MOBILE_ROTATIONS = [-6, 5, -4, 7, -3]

const MobilePolaroidCard = ({ joy, rotation }: { joy: typeof JOYS[0]; rotation: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.3 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      style={{
        flexShrink: 0,
        width: '72vw',
        maxWidth: '300px',
        scrollSnapAlign: 'center',
        transform: `rotate(${rotation}deg)`,
        backgroundColor: '#ffffff',
        padding: '10px 10px 0 10px',
        boxShadow: '0 8px 32px rgba(36,31,33,0.16)',
      }}
    >
      <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src={joy.video}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{ padding: '10px 4px 20px 4px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: textDark, lineHeight: 1.3, marginBottom: '2px' }}>
          {joy.title}
        </p>
        <p style={{ fontSize: '12px', color: textMuted, lineHeight: 1.4 }}>
          {joy.description}
        </p>
      </div>
    </div>
  )
}

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
                  className="relative min-h-[320px] border-b lg:border-b-0 lg:border-r overflow-visible"
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
                    top="88%"
                    left="calc(52% + 30px)"
                    mobileTop="88%"
                    mobileLeft="52%"
                  />
                  <FigmaCommentPin
                    message="This is me 👋 Nice to meet you!"
                    timeAgo="5 min. ago"
                    top="72%"
                    left="8%"
                    mobileLeft="8%"
                  />
                </div>

                {/* Right: Single section with internal dividers */}
                <div className="relative flex flex-col justify-center p-8 lg:px-12 lg:pb-10 lg:pt-20">

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
                  className="hidden sm:inline-flex items-center text-xs text-white px-1.5 py-1 rounded whitespace-nowrap leading-none"
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
                  className="inline-flex items-center text-xs text-white px-2 py-1 rounded whitespace-nowrap leading-none"
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
                  onDragStart={() => { setDraggingPostIt(index); window.dispatchEvent(new CustomEvent('cursor:drag:start')) }}
                  onDragEnd={() => { setDraggingPostIt(null); window.dispatchEvent(new CustomEvent('cursor:drag:end')) }}
                  onHoverStart={() => setHoveredPostIt(index)}
                  onHoverEnd={() => setHoveredPostIt(null)}
                  whileDrag={{
                    scale: 1.04,
                    boxShadow: '0 28px 60px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.12)',
                    rotate: value.rotation * 0.5,
                  }}
                  data-cursor="drag"
                  className={`flex flex-col p-5 sm:p-10 flex-shrink-0 w-[260px] sm:w-[380px] min-h-[240px] sm:min-h-[340px] ${index === 0 ? 'md:-mr-[30px]' : ''} ${index === 2 ? 'md:-ml-[30px]' : ''}`}
                  style={{
                    backgroundColor: value.color,
                    borderRadius: '2px',
                    rotate: `${value.rotation}deg`,
                    boxShadow: '0 10px 36px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.08)',
                    outline: (hoveredPostIt === index || draggingPostIt === index) ? '2px solid #0a99ff' : '2px solid transparent',
                    cursor: draggingPostIt === index ? 'grabbing' : 'grab',
                    zIndex: draggingPostIt === index ? 50 : stackZ,
                    position: 'relative',
                    userSelect: 'none',
                    touchAction: 'none',
                  }}
                >
                  {(hoveredPostIt === index || draggingPostIt === index) && cornerSquares(
                    ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
                    true
                  )}
                  <div className="mb-4 sm:mb-6">
                    <img src={value.illustration} alt="" className="w-14 h-14 sm:w-20 sm:h-20 object-contain" style={{ filter: 'brightness(0) invert(1) brightness(0.14)' }} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3" style={{ color: '#241f21' }}>
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(36,31,33,0.6)' }}>
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
            className="text-left mb-4 sm:mb-8"
          >
            <h2 className="text-3xl sm:text-[4rem] font-semibold mb-2 leading-none flex items-center justify-start gap-3" style={{ color: textDark }}>
              My Journey
              <img src="/Me/Arrow.svg" alt="" className="w-14 h-14 sm:w-20 sm:h-20 inline-block flex-shrink-0" style={{ filter: 'brightness(0)' }} />
            </h2>
          </motion.div>

          <div className="relative">
            <div className="flex flex-col">
              {timeline.map((item, index) => (
                <React.Fragment key={item.year + item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* "Current" Figma frame label on the first card */}
                    {index === 0 && (
                      <div
                        className="hidden sm:flex"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          transform: 'translateX(-100%)',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: '#0a99ff',
                          color: 'white',
                          fontSize: 15,
                          fontWeight: 500,
                          lineHeight: 1,
                          padding: '6px 10px',
                          borderRadius: '4px 0 0 4px',
                          zIndex: 10,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center' }}>Current</span>
                        <img src="/icons/square-play.svg" alt="" style={{ width: 18, height: 18, display: 'block' }} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative overflow-visible">
                      {cornerSquares(['top-left', 'top-right', 'bottom-left', 'bottom-right'])}
                      <div
                        className="p-8 h-full"
                        style={{ backgroundColor: '#ffffff', outline: `1px solid ${borderColor}`, outlineOffset: '0px' }}
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
                                    style={{ color: '#241f21' }}
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
                        <p className="text-[1rem] leading-relaxed mb-4" style={{ color: textDark }}>
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

                  {/* Figma prototype connector between cards */}
                  {index < timeline.length - 1 && (
                    <div style={{ position: 'relative', height: '52px', zIndex: 1 }}>
                      <img
                        src={index % 2 === 0 ? '/icons/arrow-left.svg' : '/icons/arrow-right.svg'}
                        alt=""
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: 90,
                          height: 56,
                          left: 'calc(50% - 45px)',
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Small Joys Section — Desktop */}
      <section
        className="relative hidden md:block z-10"
        style={{ minHeight: 'max(780px, 90svh)', marginTop: '0' }}
      >
        {/* Center text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{
            position: 'absolute',
            top: '44%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            textAlign: 'center',
            zIndex: 20,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 5.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: '#241f21',
              lineHeight: 1,
              marginBottom: '0.15em',
            }}
          >
            Small Joys
          </h2>
          <p
            style={{
              fontSize: 'clamp(3.5rem, 7vw, 8rem)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: '#241f21',
              lineHeight: 1,
              marginBottom: '0.2em',
            }}
          >
            Big Inspiration
          </p>
          <p
            style={{
              fontSize: '17px',
              color: 'rgba(36,31,33,0.5)',
              lineHeight: 1.55,
              maxWidth: '38ch',
            }}
          >
            These are the little things that refill my creative energy.
          </p>
        </motion.div>

        {/* Polaroid cards */}
        {JOYS.map((joy, index) => {
          const { rotation, pos } = POLAROID_POSITIONS[index]
          return (
            <PolaroidCard key={joy.title} joy={joy} rotation={rotation} pos={pos} index={index} />
          )
        })}
      </section>

      {/* Small Joys Section — Mobile */}
      <section
        className="relative md:hidden z-10"
        style={{
          padding: 'clamp(48px, 10vw, 80px) clamp(20px, 5vw, 32px)',
          paddingTop: 'clamp(80px, 16vw, 120px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'clamp(8px, 2vw, 16px)', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 8vw, 3rem)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: '#241f21',
              lineHeight: 1,
              marginBottom: '0.15em',
              whiteSpace: 'nowrap',
            }}
          >
            Small Joys
          </h2>
          <p
            style={{
              fontSize: 'clamp(2rem, 12vw, 5rem)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: '#241f21',
              lineHeight: 1,
              marginBottom: '0.5em',
              whiteSpace: 'nowrap',
            }}
          >
            Big Inspiration
          </p>
          <p style={{ fontSize: '16px', color: 'rgba(36,31,33,0.5)', lineHeight: 1.55 }}>
            These are the little things<br />that refill my creative energy.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            gap: '28px',
            marginLeft: 'calc(-1 * clamp(20px, 5vw, 32px))',
            marginRight: 'calc(-1 * clamp(20px, 5vw, 32px))',
            paddingLeft: '14vw',
            paddingRight: '14vw',
            paddingTop: '32px',
            paddingBottom: '40px',
            position: 'relative',
            zIndex: 1,
          }}
          className="scrollbar-hide"
        >
          {JOYS.map((joy, index) => (
            <MobilePolaroidCard key={joy.title} joy={joy} rotation={MOBILE_ROTATIONS[index]} />
          ))}
        </div>
      </section>

      {/* Design Conferences Section */}
      <section className="relative z-10 pt-12 sm:pt-24 pb-16 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-left mb-8 sm:mb-12 px-6 sm:pl-8 sm:pr-0 md:max-w-5xl md:mx-auto md:px-0"
          >
            <img src="/Me/Airplane.svg" alt="" className="w-28 h-28 mb-1 sm:mb-4" style={{ filter: 'brightness(0)' }} />
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
                gradient: 'bg-[#3372D6]',
                cardBg: '#3372D6',
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
                gradient: 'bg-[#FE7747]',
                cardBg: '#FE7747',
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
