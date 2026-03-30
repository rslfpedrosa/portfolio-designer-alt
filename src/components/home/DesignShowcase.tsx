'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'

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
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#171717]">
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
              Explorations & UI Work
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A collection of interface explorations, component designs, and visual experiments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {designShowcase.map((item, index) => (
              <div
                key={item.id}
                className="group cursor-pointer relative overflow-visible"
                onClick={() => item.type === 'video' && setSelectedVideo(item.media)}
                onMouseEnter={e => { if (isDesktop) onLabelChange?.('EXPAND'); e.currentTarget.style.outline = '2px solid #18a0fb' }}
                onMouseLeave={e => { if (isDesktop) onLabelChange?.(null); e.currentTarget.style.outline = '' }}
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                {/* Corner Squares */}
                <div className="absolute -top-[5px] -left-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#18a0fb' }} />
                <div className="absolute -top-[5px] -right-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#18a0fb' }} />
                <div className="absolute -bottom-[5px] -left-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#18a0fb' }} />
                <div className="absolute -bottom-[5px] -right-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#18a0fb' }} />
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-[#1e1e1e] backdrop-blur-sm hover:shadow-xl hover:scale-[1.05] transition-all duration-500 ease-out overflow-hidden"
                >
                  
                  <div className="aspect-video relative overflow-hidden bg-gray-200 dark:bg-gray-800">
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
                            playPromise.catch(() => {
                              video.muted = true
                            })
                          }
                        }}
                        onEnded={(e) => {
                          e.currentTarget.currentTime = 0
                          e.currentTarget.play().catch(() => {})
                        }}
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
                className="group bg-gray-gray-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-gray-700 transition-colors flex items-center space-x-2 mx-auto"
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
