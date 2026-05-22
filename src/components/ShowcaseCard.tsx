'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ShowcaseItem {
  id: number
  type: string
  media: string
}

interface ShowcaseCardProps {
  item: ShowcaseItem
  index: number
  isDesktop?: boolean
  onLabelChange?: (label: string | null) => void
  onClick: () => void
}

export default function ShowcaseCard({ item, index, isDesktop, onLabelChange, onClick }: ShowcaseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (isDesktop) onLabelChange?.('EXPAND')
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (isDesktop) onLabelChange?.(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer relative overflow-visible"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...(isDesktop ? { cursor: 'none' } : {}),
      }}
    >
      <div
        className="relative bg-[#1e1e1e] transition-all duration-300 ease-out overflow-visible"
        style={isHovered ? {
          outline: '2px solid #0f8be8',
          outlineOffset: '0px',
          boxShadow: '0 0 70px 0 rgba(15,139,232,0.18)',
        } : {
          outline: '1px solid #0f8be8',
          outlineOffset: '0px',
        }}
      >
        {/* Corner squares */}
        {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
          <div
            key={corner}
            className="absolute w-3 h-3 z-20 rounded-sm transition-colors duration-300"
            style={{
              backgroundColor: isHovered ? '#0f8be8' : '#1e1e1e',
              border: isHovered ? '2px solid #0f8be8' : '1px solid #0f8be8',
              top: corner.startsWith('top') ? '-6px' : undefined,
              bottom: corner.startsWith('bottom') ? '-6px' : undefined,
              left: corner.endsWith('left') ? '-6px' : undefined,
              right: corner.endsWith('right') ? '-6px' : undefined,
            }}
          />
        ))}

        <div className="aspect-video relative overflow-hidden bg-gray-800">
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
                const playPromise = video.play()
                if (playPromise !== undefined) {
                  playPromise.catch(() => { video.muted = true })
                }
              }}
              onEnded={(e) => {
                e.currentTarget.currentTime = 0
                e.currentTarget.play().catch(() => {})
              }}
              onError={() => console.warn('Video failed to load:', item.media)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <img
              src={item.media}
              alt={`Exploration ${item.id}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}
