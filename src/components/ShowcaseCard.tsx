'use client'

import { motion } from 'framer-motion'

interface ShowcaseItem {
  id: number
  type: string
  media: string
}

interface ShowcaseCardProps {
  item: ShowcaseItem
}

export default function ShowcaseCard({ item }: ShowcaseCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden"
      style={{ borderRadius: 0 }}
    >
      {/* Media */}
      <div className="relative overflow-hidden bg-[#e8e4de]" style={{ height: 'clamp(320px, 52svh, 580px)' }}>
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

    </motion.div>
  )
}
