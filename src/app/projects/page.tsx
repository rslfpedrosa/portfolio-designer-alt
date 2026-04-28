'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getAllProjects } from '@/data/projects'
import FigmaCursor from '@/components/FigmaCursor'
import CTASection from '@/components/home/CTASection'

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

  const cursorLabel = hoveredCardId !== null ? 'VIEW CASE STUDY' : null
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="min-h-screen pt-16 bg-[#171717]">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-medium text-gray-900 dark:text-white mb-6">
              My <span className="text-gradient">Work</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A collection of projects that showcase my approach to design, from initial concept 
              to final implementation. Each project tells a story of problem-solving, user empathy, 
              and creative thinking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects List */}
      <section className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block group"
                onMouseEnter={() => isDesktop && setHoveredCardId(project.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onFocus={() => {}}
                onBlur={() => {}}
                style={isDesktop && hoveredCardId === project.id ? { cursor: 'none' } : {}}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative overflow-visible transition-all duration-300 ease-out group cursor-pointer"
                >
                  <div
                    className="relative bg-[#1e1e1e] backdrop-blur-sm transition-all duration-300 ease-out overflow-visible"
                    style={hoveredCardId === project.id ? {
                      outline: '2px solid #0f8be8',
                      outlineOffset: '0px',
                    } : {
                      outline: '1px solid rgba(255,255,255,0.08)',
                      outlineOffset: '0px',
                    }}
                  >
                    {hoveredCardId === project.id && (
                      <>
                        <div className="absolute -top-[5px] -left-[5px] w-2 h-2 z-20" style={{ backgroundColor: '#0f8be8' }} />
                        <div className="absolute -top-[5px] -right-[5px] w-2 h-2 z-20" style={{ backgroundColor: '#0f8be8' }} />
                        <div className="absolute -bottom-[5px] -left-[5px] w-2 h-2 z-20" style={{ backgroundColor: '#0f8be8' }} />
                        <div className="absolute -bottom-[5px] -right-[5px] w-2 h-2 z-20" style={{ backgroundColor: '#0f8be8' }} />
                      </>
                    )}
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                      {/* Left Column - Content */}
                      <div className="flex flex-col justify-center space-y-5 z-10 p-8 sm:p-10 lg:p-14">
                        <div className="mb-2">
                          {project.id === 1 ? (
                            <Image src="/Logos/Logo.svg" alt="Bocca Moments Logo" width={200} height={45} className="h-7 w-auto brightness-0 invert" />
                          ) : project.id === 3 ? (
                            <Image src="/Logos/Onyx.svg" alt="Onyx Logo" width={473} height={169} className="h-7 w-auto brightness-0 invert" />
                          ) : project.id === 2 ? (
                            <Image src="/Logos/Cortado.svg" alt="Cortado Logo" width={132} height={44} className="h-7 w-auto brightness-0 invert" />
                          ) : (
                            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{project.title.split(' ')[0].toUpperCase()}</span>
                          )}
                        </div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white leading-tight tracking-tight text-balance">
                          {project.subtitle}
                        </h3>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                          {project.tagline ?? project.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2.5 py-1 rounded-full border border-gray-700 text-sm text-gray-300 whitespace-nowrap"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-400 dark:text-gray-500">
                            {project.id === 1 ? '2025' : project.id === 3 ? '2025' : project.id === 2 ? '2023' : '2024'}
                          </span>
                        </div>
                      </div>
                      {/* Right Column - Hero image */}
                      <div className="relative h-64 lg:h-full min-h-[400px] overflow-hidden z-10">
                        <Image
                          src={project.heroImage.replace(',', '%2C')}
                          alt={`${project.title} preview`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          priority={index < 2}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Design Showcase Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#171717]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
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
                onClick={() => setSelectedMedia({ type: item.type as 'video' | 'image', src: item.media })}
                onMouseEnter={e => (e.currentTarget.style.outline = '2px solid #0f8be8')}
                onMouseLeave={e => (e.currentTarget.style.outline = '')}
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
                  className="relative bg-white dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.05] transition-all duration-500 ease-out overflow-hidden"
                >
                  
                  <div className="aspect-video relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {item.type === 'video' ? (
                      <video
                        src={item.media}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
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
                          e.currentTarget.play().catch(() => {
                            // Ignore play errors
                          })
                        }}
                        onError={(e) => {
                          console.warn('Video failed to load:', item.media)
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <img
                        src={item.media}
                        alt={`Exploration ${item.id}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
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
