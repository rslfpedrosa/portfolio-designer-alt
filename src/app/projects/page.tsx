'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, X, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { getAllProjects } from '@/data/projects'

// Unified Figma Cursor System
interface FigmaCursorProps {
  label: string | null
  showPill: boolean
  shouldReduceMotion: boolean
  isDesktop: boolean
}

const FigmaCursor = ({ label, showPill, shouldReduceMotion, isDesktop }: FigmaCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const mouseXRef = useRef<number>(0)
  const mouseYRef = useRef<number>(0)
  const cursorXRef = useRef<number>(0)
  const cursorYRef = useRef<number>(0)
  const hasMousePositionRef = useRef<boolean>(false)
  const rafIdRef = useRef<number | null>(null)
  const offsetX = 0
  const offsetY = 0

  useEffect(() => {
    if (!isDesktop) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX + offsetX
      mouseYRef.current = e.clientY + offsetY

      if (!hasMousePositionRef.current) {
        cursorXRef.current = mouseXRef.current
        cursorYRef.current = mouseYRef.current
        hasMousePositionRef.current = true
        if (cursorRef.current) {
          cursorRef.current.style.display = 'block'
          cursorRef.current.style.transform = `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`
        }
      }
    }

    const animate = () => {
      if (!cursorRef.current || !hasMousePositionRef.current) {
        rafIdRef.current = requestAnimationFrame(animate)
        return
      }

      if (shouldReduceMotion) {
        cursorXRef.current = mouseXRef.current
        cursorYRef.current = mouseYRef.current
      } else {
        const lerp = 0.3
        cursorXRef.current += (mouseXRef.current - cursorXRef.current) * lerp
        cursorYRef.current += (mouseYRef.current - cursorYRef.current) * lerp
      }

      cursorRef.current.style.transform = `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`
      rafIdRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [isDesktop, shouldReduceMotion])

  useEffect(() => {
    if (!pillRef.current || !label) return

    if (showPill && label) {
      pillRef.current.style.opacity = '1'
      pillRef.current.style.transform = 'scale(1) translateY(0)'
    } else {
      pillRef.current.style.opacity = '0'
      pillRef.current.style.transform = 'scale(0.8) translateY(-4px)'
    }
  }, [showPill, label, shouldReduceMotion])

  if (!isDesktop) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[10002] will-change-transform"
      style={{
        display: hasMousePositionRef.current ? 'block' : 'none',
        transform: `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`,
      }}
    >
      <div className="relative" style={{ transform: 'translate(2px, 2px)' }}>
        <svg 
          width="16" 
          height="18" 
          viewBox="0 0 144 159" 
          fill="none" 
          className="absolute -top-3 -left-1.5 text-indigo-600 dark:text-indigo-400 opacity-90"
        >
          <path
            d="M32.1753 150.405C21.3357 104.423 6.46159 40.2274 0.218053 9.72129C-1.32121 2.20039 5.56282 -2.44979 12.2294 1.35683L138.377 73.3872C146.115 77.8056 144.646 89.3743 136.049 91.7188L86.8595 105.134C84.6005 105.75 82.6292 107.14 81.2894 109.06L50.0785 153.796C45.1371 160.878 34.1568 158.811 32.1753 150.405Z"
            fill="currentColor"
          />
        </svg>
        {label && (
          <span 
            ref={pillRef}
            className="bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-md inline-block mt-1 ml-2"
            style={{
              opacity: 0,
              transform: 'scale(0.8) translateY(-4px)',
              transition: shouldReduceMotion ? 'none' : 'opacity 200ms ease-out, transform 200ms ease-out',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

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
      gradient: 'from-pink-400 to-purple-500',
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
    <div className="min-h-screen pt-16">
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
                  className="relative overflow-visible transition-all duration-200 ease-out group cursor-pointer"
                >
                  {/* Card content – neutral background */}
                  <div className={`relative bg-white dark:bg-slate-800 transition-all duration-300 ${
                    hoveredCardId === project.id 
                      ? 'border-2 border-indigo-500 dark:border-indigo-400 scale-[1.03]' 
                      : 'border border-gray-200 dark:border-slate-700'
                  }`}>
                    {/* Corner Squares - centered on edges */}
                    {hoveredCardId === project.id && (
                      <>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 z-20" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 z-20" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 z-20" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 z-20" />
                      </>
                    )}
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                      {/* Left Column - Content */}
                      <div className="flex flex-col justify-center space-y-6 z-10 p-8 lg:p-12">
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
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 dark:text-white leading-tight mb-6">
                          {project.id === 1 ? 'Crafting a Sensory Brand Experience' : project.id === 2 ? (<>Scaling Rental Management<br />with GenAI</>) : project.id === 3 ? (<>Designing Human-Centered<br />CPPS Care</>) : project.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {project.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-full px-4 py-2 whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div>
                          <span className="text-base text-gray-500 dark:text-gray-400">
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
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
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
              <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {designShowcase.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedMedia({ type: item.type as 'video' | 'image', src: item.media })}
              >
                <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-large transition-all duration-300">
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
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.media}
                        alt={`Exploration ${item.id}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                </div>
                </motion.div>
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

      {/* Let's Build Something Together Section */}
      <section className="relative py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 overflow-hidden">
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -120, 80, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, -180, 60, 0],
            y: [0, 120, -40, 0],
            scale: [1, 0.7, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 220, -80, 0],
            y: [0, -80, 100, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-animated-grid" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
              Let's Build Something <span className="text-gradient">Together</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm always open to collaborating on thoughtful projects, from early product strategy to polished, production ready experiences.
            </p>
            <div className="flex justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                  style={isDesktop ? { cursor: 'none' } : {}}
                >
                  <span>Get In Touch</span>
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

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
