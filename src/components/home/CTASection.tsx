'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden bg-black"
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 120%, rgba(217,238,114,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Label */}
          <p className="section-label" style={{ marginBottom: 'clamp(20px, 2.5vw, 32px)', color: 'rgba(255,255,255,0.4)' }}>
            Let&apos;s work together
          </p>

          {/* Large headline */}
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 8.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: '#ffffff',
              maxWidth: '14ch',
              marginBottom: 'clamp(32px, 4vw, 56px)',
            }}
          >
            Have a product challenge?
          </h2>

          {/* Body */}
          <p
            style={{
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.5)',
              maxWidth: '48ch',
              marginBottom: 'clamp(36px, 5vw, 64px)',
            }}
          >
            I&apos;m always open to collaborating on thoughtful, impactful products, from early ideas to refined experiences.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <Link href="/contact" className="group flex items-center gap-2">
              <motion.span
                whileHover={{ letterSpacing: '0.18em' }}
                transition={{ duration: 0.3 }}
                className="font-medium"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#d9ee72',
                  borderBottom: '1px solid rgba(217,238,114,0.4)',
                  paddingBottom: '2px',
                }}
              >
                Get In Touch
              </motion.span>
              <ArrowUpRight
                size={13}
                className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: 'rgba(217,238,114,0.6)' }}
              />
            </Link>

            <Link href="/projects" className="group flex items-center gap-2">
              <span
                className="font-medium transition-colors duration-300 group-hover:text-white"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  paddingBottom: '2px',
                }}
              >
                View My Work
              </span>
              <ArrowUpRight
                size={13}
                className="transition-all duration-300 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative large background number */}
      <div
        className="absolute right-0 bottom-0 pointer-events-none select-none hidden lg:block"
        aria-hidden
        style={{
          fontSize: 'clamp(160px, 20vw, 280px)',
          fontWeight: 300,
          letterSpacing: '-0.06em',
          lineHeight: 0.85,
          color: 'rgba(255, 255, 255, 0.05)',
          userSelect: 'none',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}
      >
        RP
      </div>
    </section>
  )
}
