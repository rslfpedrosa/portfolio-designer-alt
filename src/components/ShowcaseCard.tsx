'use client'

import { motion } from 'framer-motion'

// Uses parent variant propagation — parent row triggers "hidden" → "visible"
// custom prop sets the delay so the card appears after the box lines finish drawing
const cardVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' as const, delay },
  }),
}

interface ShowcaseItem {
  id: number
  type: string
  media: string
}

interface ShowcaseCardProps {
  item: ShowcaseItem
  delay?: number
}

export default function ShowcaseCard({ item, delay = 1.2 }: ShowcaseCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden"
      style={{ borderRadius: 0 }}
      variants={cardVariants}
      custom={delay}
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
