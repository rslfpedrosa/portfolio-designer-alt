'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import ShowcaseCard from '@/components/ShowcaseCard'

const designShowcase = [
  {
    id: 1,
    type: 'video',
    media: '/explorations/exploration-1.mp4',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    id: 2,
    type: 'video',
    media: '/explorations/exploration-2.mp4',
    gradient: 'from-pink-400 to-gray-500',
  },
  {
    id: 3,
    type: 'video',
    media: '/explorations/exploration-3.mp4',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 4,
    type: 'video',
    media: '/explorations/exploration-4.mp4',
    gradient: 'from-green-400 to-teal-500',
  },
]

export default function DesignShowcase({ isDesktop, onLabelChange }: { isDesktop: boolean, onLabelChange?: (label: string | null) => void }) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  return (
    <>
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#171717] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="text-sm font-medium tracking-wider text-gray-gray-600 dark:text-gray-gray-400 uppercase">
                Design Showcase
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">
              Product Explorations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explorations in interaction, systems, and visual design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {designShowcase.map((item, index) => (
              <ShowcaseCard
                key={item.id}
                item={item}
                index={index}
                isDesktop={isDesktop}
                onLabelChange={onLabelChange}
                onClick={() => item.type === 'video' && setSelectedVideo(item.media)}
              />
            ))}
          </div>

          {/* See More Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-medium text-base hover:bg-[#1d4ed8] transition-colors flex items-center space-x-2 mx-auto"
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                <span>See More</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close video"
              >
                <X size={24} />
              </button>
              <video
                src={selectedVideo}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={(e) => {
                  const video = e.currentTarget
                  const playPromise = video.play()
                  if (playPromise !== undefined) {
                    playPromise.catch(() => {
                      video.muted = true
                    })
                  }
                }}
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
