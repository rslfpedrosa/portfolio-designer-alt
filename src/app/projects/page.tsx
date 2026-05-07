'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getAllProjects } from '@/data/projects'
import FigmaCursor from '@/components/FigmaCursor'
import CTASection from '@/components/home/CTASection'
import ProjectCard from '@/components/ProjectCard'
import ShowcaseCard from '@/components/ShowcaseCard'

const ProjectsPage = () => {
  const allProjects = getAllProjects()
  const projects = allProjects.sort((a, b) => {
    // Order: Onyx (3) > Bocca (1) > Cortado (2) > others
    const order = { 3: 0, 1: 1, 2: 2 }
    return (order[a.id as keyof typeof order] ?? 999) - (order[b.id as keyof typeof order] ?? 999)
  })
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'video' | 'image'; src: string } | null>(null)
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Global cursor hiding
  useEffect(() => {
    if (isDesktop && hoveredCardId !== null) {
      document.body.style.cursor = 'none'
    } else {
      document.body.style.cursor = 'default'
    }
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [isDesktop, hoveredCardId])

  const cursorLabel = hoveredCardId !== null ? 'READ CASE STUDY' : null
  const showCursorPill = cursorLabel !== null

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null)
      }
    }
    if (selectedMedia) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedMedia])

  const designShowcase = [
    {
      id: 1,
      type: 'video',
      media: '/explorations/exploration-1.mp4',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      id: 2,
      type: 'image',
      media: '/explorations/23126508_195.webp',
      gradient: 'from-pink-400 to-gray-500',
    },
    {
      id: 3,
      type: 'image',
      media: '/explorations/012-2.webp',
      gradient: 'from-orange-400 to-red-500',
    },
    {
      id: 4,
      type: 'video',
      media: '/explorations/exploration-2.mp4',
      gradient: 'from-green-400 to-teal-500',
    },
    {
      id: 5,
      type: 'video',
      media: '/explorations/exploration-3.mp4',
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      id: 6,
      type: 'video',
      media: '/explorations/exploration-4.mp4',
      gradient: 'from-green-400 to-teal-500',
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-[#171717]">
      {/* Hero Section */}
      <section className="pt-14 sm:pt-24 pb-6 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-medium text-gray-900 dark:text-white mb-3 sm:mb-6">
              My <span className="text-gradient">Work</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Selected work across healthcare, AI, and digital experiences, focused on bringing clarity to complex products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects List */}
      <section className="pb-12 sm:pb-24 pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isDesktop={isDesktop}
                onHoverChange={(id) => setHoveredCardId(id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Design Showcase Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#171717]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="text-sm font-medium tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                Design Showcase
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
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
                onClick={() => setSelectedMedia({ type: item.type as 'video' | 'image', src: item.media })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Video / Image Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
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
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.src}
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
                  onError={(e) => {
                    console.warn('Video failed to load:', selectedMedia.src)
                  }}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <img
                  src={selectedMedia.src}
                  alt="Exploration full screen"
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection isDesktop={isDesktop} />

      {/* Unified Figma Cursor */}
      <FigmaCursor
        label={cursorLabel}
        showPill={showCursorPill}
        shouldReduceMotion={shouldReduceMotion || false}
        isDesktop={isDesktop}
      />
    </div>
  )
}

export default ProjectsPage
