'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  onHoverChange: (id: number | null) => void
  theme?: 'dark' | 'light'
}

export default function ProjectCard({ project, index, onHoverChange, theme = 'dark' }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isFlipped = index % 2 === 1

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHoverChange(project.id)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHoverChange(null)
  }

  const num = String(index + 1).padStart(2, '0')
  const isLight = theme === 'light'

  const contentBorder = isLight
    ? '1px solid rgba(36,31,33,0.1)'
    : '1px solid rgba(255,255,255,0.06)'
  const titleColor = isLight ? 'rgba(36,31,33,0.9)' : '#ffffff'
  const descColor = isLight ? 'rgba(36,31,33,0.5)' : 'rgba(255,255,255,0.42)'
  const ctaDefault = isLight ? 'rgba(36,31,33,0.4)' : 'rgba(255,255,255,0.35)'
  const ctaHover = isLight ? '#042d2b' : '#d9ee72'
  const vignetteBase = isLight ? '242,239,234' : '4,45,43'

  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block group"
      data-cursor="view-project"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.article
        initial={{ opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        animate={{ scale: isHovered ? 1.018 : 1 }}
        transition={{
          opacity: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 },
          y: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 },
          scale: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        }}
        viewport={{ once: true, margin: '-60px' }}
        className="relative grid grid-cols-1 lg:grid-cols-2"
        style={{ minHeight: 'clamp(320px, 42vw, 520px)' }}
      >
        {/* Corner squares — white on hover */}
        {corners.map((corner) => (
          <div
            key={corner}
            className="absolute w-3 h-3 z-20 pointer-events-none"
            style={{
              backgroundColor: '#ffffff',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              top: corner.startsWith('top') ? '-6px' : undefined,
              bottom: corner.startsWith('bottom') ? '-6px' : undefined,
              left: corner.endsWith('left') ? '-6px' : undefined,
              right: corner.endsWith('right') ? '-6px' : undefined,
            }}
          />
        ))}
        {/* ── Content column ── */}
        <div
          className={`flex flex-col justify-between relative ${isFlipped ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}`}
          style={{
            padding: 'clamp(32px, 4vw, 64px)',
            borderRight: !isFlipped ? contentBorder : 'none',
            borderLeft: isFlipped ? contentBorder : 'none',
          }}
        >
          {/* Centre — number + logo + title + desc */}
          <div className="flex-1 flex flex-col justify-center" style={{ paddingTop: 'clamp(24px, 3vw, 48px)', paddingBottom: 'clamp(24px, 3vw, 48px)' }}>
            {/* Ghost number */}
            <div aria-hidden className={`${isLight ? 'editorial-num-light' : 'editorial-num'} leading-none select-none mb-2`}>
              {num}
            </div>

            {/* Logo */}
            <div className="mb-5 h-6">
              {project.id === 1 ? (
                <Image src="/Logos/Logo.svg" alt="Bocca Moments Logo" width={200} height={45} className={`h-6 w-auto brightness-0 opacity-60 ${isLight ? '' : 'invert'}`} />
              ) : project.id === 3 ? (
                <Image src="/Logos/Onyx.svg" alt="Onyx Logo" width={473} height={169} className={`h-6 w-auto brightness-0 opacity-60 ${isLight ? '' : 'invert'}`} />
              ) : project.id === 2 ? (
                <Image src="/Logos/Cortado.svg" alt="Cortado Logo" width={132} height={44} className={`h-6 w-auto brightness-0 opacity-60 ${isLight ? '' : 'invert'}`} />
              ) : null}
            </div>

            <h3
              style={{
                fontSize: 'clamp(22px, 2.8vw, 42px)',
                fontWeight: 500,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: titleColor,
                marginBottom: '1rem',
              }}
            >
              {project.subtitle}
            </h3>

            <p
              style={{
                fontSize: 'clamp(14px, 1.1vw, 15px)',
                lineHeight: 1.75,
                color: descColor,
                maxWidth: '38ch',
              }}
            >
              {project.tagline ?? project.description}
            </p>
          </div>

          {/* Bottom — cta */}
          <div className="flex items-end justify-end gap-4">
            <motion.div
              animate={{ x: isHovered ? 3 : 0, color: isHovered ? ctaHover : ctaDefault }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 flex-shrink-0"
              style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <span>Case Study</span>
              <ArrowUpRight size={13} />
            </motion.div>
          </div>
        </div>

        {/* ── Image column ── */}
        <div
          className={`relative overflow-hidden ${isFlipped ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}`}
          style={{ minHeight: 'clamp(280px, 35vw, 500px)' }}
        >
          <Image
            src={project.heroImage.replace(',', '%2C')}
            alt={`${project.title} preview`}
            fill
            className="object-cover"
            style={{
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={index < 2}
          />
          {/* Gradient vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isFlipped
                ? `linear-gradient(to right, rgba(${vignetteBase},0.25) 0%, transparent 40%)`
                : `linear-gradient(to left, rgba(${vignetteBase},0.25) 0%, transparent 40%)`,
              opacity: isHovered ? 1 : 0.4,
              transition: 'opacity 0.5s ease',
            }}
          />
        </div>
      </motion.article>
    </Link>
  )
}
