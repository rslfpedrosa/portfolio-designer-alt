'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Project } from '@/data/projects'

const cardGradients: Record<number, string> = {
  1: 'rgba(150, 85, 52, 0.18)',
  2: 'rgba(160, 116, 250, 0.18)',
  3: 'rgba(67, 106, 255, 0.18)',
}

const cardGlows: Record<number, string> = {
  1: 'rgba(150, 85, 52, 0.18)',
  2: 'rgba(160, 116, 250, 0.18)',
  3: 'rgba(67, 106, 255, 0.18)',
}

interface ProjectCardProps {
  project: Project
  index: number
  isDesktop: boolean
  onHoverChange: (id: number | null) => void
}

export default function ProjectCard({ project, index, isDesktop, onHoverChange }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    if (!isDesktop) return
    setIsHovered(true)
    onHoverChange(project.id)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHoverChange(null)
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={isDesktop && isHovered ? { cursor: 'none' } : {}}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="relative overflow-visible group cursor-pointer z-10"
      >
        <div
          className="relative bg-[#151414] transition-all duration-300 ease-out overflow-visible rounded-none"
          style={isHovered ? {
            outline: '2px solid #0f8be8',
            outlineOffset: '0px',
            boxShadow: `0 0 70px 0 ${cardGlows[project.id] ?? 'rgba(15,139,232,0.18)'}`,
          } : {
            outline: '1px solid #0f8be8',
            outlineOffset: '0px',
          }}
        >
          {/* Corner squares — always visible, blue on hover */}
          {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
            <div
              key={corner}
              className="absolute w-3 h-3 z-20 rounded-sm transition-colors duration-300"
              style={{
                backgroundColor: isHovered ? '#0f8be8' : '#151414',
                border: isHovered ? '2px solid #0f8be8' : '1px solid #0f8be8',
                top: corner.startsWith('top') ? '-6px' : undefined,
                bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                left: corner.endsWith('left') ? '-6px' : undefined,
                right: corner.endsWith('right') ? '-6px' : undefined,
              }}
            />
          ))}
          <div
            className="absolute inset-0 pointer-events-none z-0 rounded-2xl lg:rounded-none"
            style={{
              background: `radial-gradient(circle at 0% 50%, ${cardGradients[project.id] ?? 'transparent'} 0%, transparent 35%)`,
            }}
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-none">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center space-y-5 sm:space-y-6 z-10 p-8 sm:p-10 lg:p-14">
              <div className="mb-2">
                {project.id === 1 ? (
                  <Image src="/Logos/Logo.svg" alt="Bocca Moments Logo" width={200} height={45} className="h-7 w-auto brightness-0 invert" />
                ) : project.id === 3 ? (
                  <Image src="/Logos/Onyx.svg" alt="Onyx Logo" width={473} height={169} className="h-7 w-auto brightness-0 invert" />
                ) : project.id === 2 ? (
                  <Image src="/Logos/Cortado.svg" alt="Cortado Logo" width={132} height={44} className="h-7 w-auto brightness-0 invert" />
                ) : (
                  <span className="text-2xl font-bold text-white tracking-tight">
                    {project.title.split(' ')[0].toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tight text-balance">
                {project.subtitle}
              </h3>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
                {project.tagline ?? project.description}
              </p>
              <div className="hidden lg:flex flex-wrap items-center gap-4 pt-2">
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
  )
}
