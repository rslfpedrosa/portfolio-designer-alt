'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Expand } from 'lucide-react'

interface ShowcaseItem {
  id: number
  type: string
  media: string
}

interface ShowcaseCardProps {
  item: ShowcaseItem
  index: number
  onClick: () => void
}

export default function ShowcaseCard({ item, index, onClick }: ShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-40px' }}
      className="group relative overflow-hidden"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: 'pointer',
        borderRadius: 0,
      }}
    >
      {/* Media */}
      <div className="aspect-video relative overflow-hidden bg-[#e8e4de]">
        {item.type === 'video' ? (
          <video
            src={item.media}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={(e) => {
              const video = e.currentTarget
              const p = video.play()
              if (p !== undefined) p.catch(() => { video.muted = true })
            }}
            onEnded={(e) => {
              e.currentTarget.currentTime = 0
              e.currentTarget.play().catch(() => {})
            }}
            onError={() => console.warn('Video failed to load:', item.media)}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)' }}
          />
        ) : (
          <img
            src={item.media}
            alt={`Exploration ${item.id}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)' }}
            loading="lazy"
          />
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-400"
          style={{
            backgroundColor: 'rgba(4, 45, 43, 0.5)',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div
            className="flex items-center gap-2 transition-transform duration-400"
            style={{
              transform: isHovered ? 'scale(1)' : 'scale(0.8)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 14px',
              borderRadius: 2,
            }}
          >
            <Expand size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              View
            </span>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          backgroundColor: isHovered ? 'rgba(217, 238, 114, 0.5)' : 'rgba(36,31,33,0.08)',
          transition: 'background-color 0.35s ease',
        }}
      />
    </motion.div>
  )
}
