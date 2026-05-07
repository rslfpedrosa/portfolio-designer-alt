'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { getFeaturedProjects } from '@/data/projects'

export default function FeaturedProjects({ 
  isDesktop,
  onCardHover 
}: { 
  isDesktop: boolean
  onCardHover: (cardId: number | null) => void
}) {
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null)

  const allProjects = getFeaturedProjects()
  const featuredProjects = allProjects.filter(project => project.id === 1 || project.id === 3)
    .sort((a, b) => {
      const order = { 3: 0, 1: 1 }
      return (order[a.id as keyof typeof order] ?? 999) - (order[b.id as keyof typeof order] ?? 999)
    })

  const handleCardHover = (projectId: number | null) => {
    setHoveredCardId(projectId)
    onCardHover(projectId)
  }

  return (
    <section className="relative py-8 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {featuredProjects.map((project, index) => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`} 
                className="block group"
                onMouseEnter={() => isDesktop && handleCardHover(project.id)}
                onMouseLeave={() => handleCardHover(null)}
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="relative overflow-visible transition-all duration-300 ease-out cursor-pointer"
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
                    {/* Corner Squares */}
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
                      <div className="flex flex-col justify-center space-y-5 sm:space-y-6 z-10 p-8 sm:p-10 lg:p-14">
                        <div className="mb-2">
                          {project.id === 1 ? (
                            <Image
                              src="/Logos/Logo.svg"
                              alt="Bocca Moments Logo"
                              width={200}
                              height={45}
                              className="h-7 w-auto brightness-0 invert"
                            />
                          ) : project.id === 3 ? (
                            <Image
                              src="/Logos/Onyx.svg"
                              alt="Onyx Logo"
                              width={473}
                              height={169}
                              className="h-7 w-auto brightness-0 invert"
                            />
                          ) : project.id === 2 ? (
                            <Image
                              src="/Logos/Cortado.svg"
                              alt="Cortado Logo"
                              width={132}
                              height={44}
                              className="h-7 w-auto brightness-0 invert"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                              {project.title.split(' ')[0].toUpperCase()}
                            </span>
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
                        </div>
                      </div>
                      {/* Right Column - Hero image */}
                      <div className="relative h-48 sm:h-64 lg:h-full lg:min-h-[400px] overflow-hidden z-10">
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
                className="group bg-white text-gray-900 px-6 py-3 rounded-2xl font-medium text-base hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
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
