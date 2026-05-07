'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ShowcaseItem {
  id: number
  type: string
  media: string
}

interface ShowcaseModalProps {
  items: ShowcaseItem[]
  currentIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

function Thumbnail({ item, active, onClick }: { item: ShowcaseItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-16 h-10 sm:w-20 sm:h-12 rounded overflow-hidden transition-all duration-200 ${
        active ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'
      }`}
    >
      {item.type === 'video' ? (
        <video
          src={item.media}
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => { e.currentTarget.currentTime = 0.1 }}
          className="w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <img src={item.media} alt="" className="w-full h-full object-cover" />
      )}
    </button>
  )
}

export default function ShowcaseModal({ items, currentIndex, onClose, onNavigate }: ShowcaseModalProps) {
  const isOpen = currentIndex !== null
  const item = currentIndex !== null ? items[currentIndex] : null
  const prev = currentIndex !== null ? (currentIndex - 1 + items.length) % items.length : null
  const next = currentIndex !== null ? (currentIndex + 1) % items.length : null

  const [isPortrait, setIsPortrait] = useState(false)
  const touchStartX = useRef(0)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    setIsPortrait(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (currentIndex === null || !stripRef.current) return
    const container = stripRef.current
    const inner = container.firstElementChild as HTMLElement
    const thumbnail = inner?.children[currentIndex] as HTMLElement
    if (!thumbnail) return
    const containerRect = container.getBoundingClientRect()
    const thumbRect = thumbnail.getBoundingClientRect()
    container.scrollTo({
      left: container.scrollLeft + thumbRect.left - containerRect.left - containerRect.width / 2 + thumbRect.width / 2,
      behavior: 'smooth',
    })
  }, [currentIndex])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && prev !== null) onNavigate(prev)
      if (e.key === 'ArrowRight' && next !== null) onNavigate(next)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, prev, next, onClose, onNavigate])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && next !== null) onNavigate(next)
      else if (diff < 0 && prev !== null) onNavigate(prev)
    }
  }

  const arrowBtn = (dir: 'prev' | 'next') => (
    <button
      onClick={() => dir === 'prev' ? prev !== null && onNavigate(prev) : next !== null && onNavigate(next)}
      className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
    >
      {dir === 'prev' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  )

  const thumbnailStrip = (
    <div ref={stripRef} className="overflow-x-auto scrollbar-hide py-1 px-1 w-full">
      <div className="flex gap-2 w-max mx-auto">
        {items.map((t, i) => (
          <Thumbnail
            key={t.id}
            item={t}
            active={i === currentIndex}
            onClick={() => onNavigate(i)}
          />
        ))}
      </div>
    </div>
  )

  const media = item && (
    item.type === 'video' ? (
      <video
        key={item.media}
        src={item.media}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={(e) => {
          e.currentTarget.play().catch(() => { e.currentTarget.muted = true })
        }}
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    ) : (
      <img
        key={item.media}
        src={item.media}
        alt={`Exploration ${item.id}`}
        className="max-w-full max-h-full object-contain rounded-lg"
      />
    )
  )

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close */}
            <div className="flex justify-end pb-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {isPortrait ? (
              /* Portrait: media fills space, arrows inline with thumbnails below */
              <>
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  {media}
                </div>
                <div className="flex items-center gap-2 pt-3 flex-shrink-0">
                  {arrowBtn('prev')}
                  {thumbnailStrip}
                  {arrowBtn('next')}
                </div>
              </>
            ) : (
              /* Landscape / desktop: arrows flank the media, thumbnails centred below */
              <>
                <div className="flex items-center gap-3 flex-1 min-h-0">
                  <div className="flex-shrink-0 w-12 flex justify-center items-center h-full">
                    {arrowBtn('prev')}
                  </div>
                  <div className="flex-1 min-w-0 h-full flex items-center justify-center">
                    {media}
                  </div>
                  <div className="flex-shrink-0 w-12 flex justify-center items-center h-full">
                    {arrowBtn('next')}
                  </div>
                </div>
                <div className="pt-3 flex-shrink-0">
                  {thumbnailStrip}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
