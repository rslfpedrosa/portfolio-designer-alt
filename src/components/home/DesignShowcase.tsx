'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const designShowcase = [
  { id: 1, type: 'video', media: '/explorations/exploration-1.mp4', gradient: 'from-cyan-400 to-blue-500' },
  { id: 2, type: 'video', media: '/explorations/exploration-2.mp4', gradient: 'from-pink-400 to-gray-500' },
  { id: 3, type: 'video', media: '/explorations/exploration-3.mp4', gradient: 'from-orange-400 to-red-500' },
  { id: 4, type: 'video', media: '/explorations/exploration-4.mp4', gradient: 'from-green-400 to-teal-500' },
]

// [top-left, top-right, bottom-left, bottom-right]
const CARDS = [
  { rotation: -8, pos: { top: '8%',    left: '6%'  } },
  { rotation: 4,  pos: { top: '7%',    right: '6%' } },
  { rotation: -5, pos: { bottom: '8%', left: '6%'  } },
  { rotation: 7,  pos: { bottom: '7%', right: '6%' } },
]

function CentreText() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      style={{
        position: 'absolute',
        top: '50%',
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
          fontSize: 'clamp(4.5rem, 8vw, 10rem)',
          fontWeight: 400,
          letterSpacing: '-0.04em',
          color: '#241f21',
          lineHeight: 1,
          marginBottom: '0.25em',
        }}
      >
        Sandbox
      </h2>
      <p
        style={{
          fontSize: '18px',
          fontWeight: 500,
          color: '#241f21',
          letterSpacing: '-0.02em',
          marginBottom: '0.65em',
        }}
      >
        Design, without the brief.
      </p>
      <p
        style={{
          fontSize: '17px',
          color: 'rgba(36,31,33,0.5)',
          lineHeight: 1.55,
          maxWidth: '38ch',
        }}
      >
        UI explorations, interaction studies, motion experiments, and visual concepts.
      </p>
      <Link href="/lab" data-cursor="take-a-peek" style={{ pointerEvents: 'auto', marginTop: '1.5em' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '17px',
            fontWeight: 500,
            color: '#241f21',
            background: 'transparent',
            border: '1px solid rgba(36,31,33,0.35)',
            borderRadius: '999px',
            padding: '10px 24px',
            transition: 'border-color 0.18s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#241f21')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(36,31,33,0.35)')}
        >
          Explore the sandbox
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}

export default function DesignShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const didDrag = useRef(false)

  return (
    <>
      {/* ── Desktop: scattered layout ── */}
      <section
        className="relative hidden lg:block"
        style={{
          minHeight: 'max(780px, 90svh)',
          marginTop: '6rem',
        }}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sandbox-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sandbox-dots)" />
          </svg>
        </div>

        <CentreText />

        {/* Draggable scattered cards */}
        {designShowcase.map((item, index) => {
          const card = CARDS[index]
          const isHovered = hoveredIndex === index
          const isDragging = draggingIndex === index

          return (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              dragElastic={0.05}
              data-cursor="drag"
              initial={{ opacity: 0, y: 24, rotate: card.rotation }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{ rotate: card.rotation }}
              whileHover={{ rotate: card.rotation * 0.35 }}
              whileDrag={{ scale: 1.04 }}
              transition={{
                opacity: { duration: 0.9, delay: 0.1 + index * 0.09, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 0.9, delay: 0.1 + index * 0.09, ease: [0.16, 1, 0.3, 1] },
                rotate: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
              }}
              viewport={{ once: true }}
              onDragStart={() => {
                didDrag.current = true
                setDraggingIndex(index)
                window.dispatchEvent(new CustomEvent('cursor:drag:start'))
              }}
              onDragEnd={() => {
                setDraggingIndex(null)
                setTimeout(() => { didDrag.current = false }, 100)
                window.dispatchEvent(new CustomEvent('cursor:drag:end'))
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'absolute',
                width: 'clamp(180px, 30%, 430px)',
                ...card.pos,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isDragging ? 30 : isHovered ? 25 : 10,
                borderRadius: '5px',
                overflow: 'hidden',
                boxShadow: isDragging
                  ? '0 30px 80px rgba(36,31,33,0.28)'
                  : isHovered
                    ? '0 20px 60px rgba(36,31,33,0.22)'
                    : '0 6px 28px rgba(36,31,33,0.13)',
                transition: 'box-shadow 0.45s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                <video
                  src={item.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={(e) => {
                    const v = e.currentTarget
                    v.play().catch(() => { v.muted = true })
                  }}
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
            </motion.div>
          )
        })}
      </section>

      {/* ── Mobile + Tablet: horizontal scroll layout ── */}
      <section
        className="relative lg:hidden"
        style={{
          padding: 'clamp(48px, 10vw, 80px) clamp(20px, 5vw, 32px)',
          paddingTop: 'clamp(80px, 16vw, 120px)',
          overflow: 'hidden',
        }}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sandbox-dots-m" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sandbox-dots-m)" />
          </svg>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 7vw, 48px)', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: 'clamp(3.5rem, 18vw, 5.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: '#241f21',
              lineHeight: 1,
              marginBottom: '0.1em',
            }}
          >
            Sandbox
          </h2>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#241f21',
              letterSpacing: '-0.02em',
              marginBottom: '0.5em',
            }}
          >
            Design, without the brief.
          </p>
          <p
            style={{
              fontSize: '17px',
              color: 'rgba(36,31,33,0.5)',
              lineHeight: 1.55,
              marginBottom: '1.25em',
            }}
          >
            UI explorations, interaction studies, motion experiments, and visual concepts.
          </p>
          <Link href="/lab" data-cursor="take-a-peek">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '17px',
                fontWeight: 500,
                color: '#241f21',
                background: 'transparent',
                border: '1px solid rgba(36,31,33,0.35)',
                borderRadius: '999px',
                padding: '10px 24px',
                whiteSpace: 'nowrap',
              }}
            >
              Explore the sandbox
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
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
          {designShowcase.map((item, index) => (
            <div
              key={item.id}
                style={{
                flexShrink: 0,
                width: '85vw',
                maxWidth: '520px',
                scrollSnapAlign: 'center',
                transform: `rotate(${CARDS[index].rotation}deg)`,
                borderRadius: '5px',
                overflow: 'hidden',
                boxShadow: '0 6px 28px rgba(36,31,33,0.13)',
              }}
            >
              <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                <video
                  src={item.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

    </>
  )
}
