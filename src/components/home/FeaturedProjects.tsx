'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProjects } from '@/data/projects'
import ProjectCard from '@/components/ProjectCard'

export default function FeaturedProjects({
  isDesktop,
  onCardHover
}: {
  isDesktop: boolean
  onCardHover: (cardId: number | null) => void
}) {
  const allProjects = getFeaturedProjects()
  const featuredProjects = allProjects.filter(project => project.id === 1 || project.id === 3)
    .sort((a, b) => {
      const order = { 3: 0, 1: 1 }
      return (order[a.id as keyof typeof order] ?? 999) - (order[b.id as keyof typeof order] ?? 999)
    })

  const dashedLine = {
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)',
    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.10) 50%, transparent 50%)',
    backgroundSize: '8px 1px',
    backgroundRepeat: 'repeat-x' as const,
  }

  return (
    <section className="relative pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {featuredProjects.map((project, index) => (
              <div key={project.id}>
                <div className="w-full h-px pointer-events-none" style={dashedLine} />
                <ProjectCard
                  project={project}
                  index={index}
                  onHoverChange={onCardHover}
                />
                <div className="w-full h-px pointer-events-none" style={dashedLine} />
              </div>
            ))}
          </div>

          {/* View All Projects CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8 lg:mt-10"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#2563eb] text-white px-6 py-3 rounded-full font-medium text-base hover:bg-[#1d4ed8] transition-colors flex items-center space-x-2 mx-auto"
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                <span>View All Projects</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
  )
}
