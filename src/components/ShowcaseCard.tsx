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
}

export default function ShowcaseCard({ item, index }: ShowcaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-40px' }}
      className="group relative overflow-hidden"
      style={{ borderRadius: 0 }}
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
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.media}
            alt={`Exploration ${item.id}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ backgroundColor: 'rgba(36,31,33,0.08)' }}
      />
    </motion.div>
  )
}
