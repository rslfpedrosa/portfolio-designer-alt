'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getAllProjects } from '@/data/projects'
import FigmaCursor from '@/components/FigmaCursor'
import CTASection from '@/components/home/CTASection'
import ProjectCard from '@/components/ProjectCard'
import ShowcaseCard from '@/components/ShowcaseCard'
import ShowcaseModal from '@/components/ShowcaseModal'

const ProjectsPage = () => {
  const allProjects = getAllProjects()
  const projects = allProjects.sort((a, b) => {
    // Order: Onyx (3) > Bocca (1) > Cortado (2) > others
    const order = { 3: 0, 1: 1, 2: 2 }
    return (order[a.id as keyof typeof order] ?? 999) - (order[b.id as keyof typeof order] ?? 999)
  })
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
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
    <div className="min-h-screen pt-16 bg-[#151414] relative overflow-x-hidden">
      {/* Grid background — matches about page */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1600px]">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="work-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="#312f2e" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#work-dots)" />
          </svg>
        </div>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl" style={{ backgroundColor: '#151414' }} />
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1600px]">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>
      {/* Hero Section */}
      <section className="pt-14 sm:pt-24 pb-6 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-medium text-white mb-3 sm:mb-6">
              My <span className="text-gradient">Work</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Selected work across healthcare, AI, and digital experiences, focused on bringing clarity to complex products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects List */}
      <section className="pb-12 sm:pb-24 pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-8 lg:gap-12">
            {projects.map((project, index) => (
              <div key={project.id}>
                <div className="relative h-px pointer-events-none mb-0">
                  <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
                </div>
                <ProjectCard
                  project={project}
                  index={index}
                  isDesktop={isDesktop}
                  onHoverChange={(id) => setHoveredCardId(id)}
                />
                <div className="relative h-px pointer-events-none mt-0">
                  <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Showcase Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#151414]">
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
              <span className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                Design Showcase
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              Product Explorations
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
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
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <ShowcaseModal
        items={designShowcase}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />

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
