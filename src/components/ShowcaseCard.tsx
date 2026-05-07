'use client'

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
  return (
    <div
      className="group cursor-pointer relative overflow-visible"
      onClick={onClick}
      onMouseEnter={e => {
        if (isDesktop) onLabelChange?.('EXPAND')
        e.currentTarget.style.outline = '2px solid #0f8be8'
      }}
      onMouseLeave={e => {
        if (isDesktop) onLabelChange?.(null)
        e.currentTarget.style.outline = ''
      }}
      style={isDesktop ? { cursor: 'none' } : {}}
    >
      {/* Corner Squares */}
      <div className="absolute -top-[5px] -left-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
      <div className="absolute -top-[5px] -right-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
      <div className="absolute -bottom-[5px] -left-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
      <div className="absolute -bottom-[5px] -right-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="relative bg-[#1e1e1e] backdrop-blur-sm hover:shadow-xl hover:scale-[1.05] transition-all duration-500 ease-out overflow-hidden rounded-2xl lg:rounded-none"
      >
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
      </motion.div>
    </div>
  )
}
