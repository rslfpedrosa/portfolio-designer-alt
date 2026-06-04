'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

export default function AboutPreview() {
  return (
    <section
      className="relative bg-[#f2efea]"
      style={{
      }}
    >
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-dots)" />
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'clamp(480px, 55vw, 700px)' }}>

        {/* Left — large portrait */}
        <div className="relative order-2 lg:order-1 overflow-hidden" style={{ minHeight: 'clamp(360px, 40vw, 560px)' }}>
          <Link
            href="/about"
            className="block absolute inset-0 group"
            aria-label="About Me"
          >
            <Image
              src="/Me/IMG_0426.webp"
              alt="Rita Pedrosa"
              fill
              className="object-cover object-top"
              style={{
                transform: 'scale(1)',
                transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              sizes="(min-width: 1024px) 50vw, 100vw"
              loading="lazy"
            />
            {/* Bottom gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(242,239,234,0.5) 0%, transparent 50%)' }}
            />
            {/* Hover label */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between group-hover:opacity-100 opacity-0 transition-opacity duration-400"
              style={{ padding: 'clamp(20px, 3vw, 32px)' }}
            >
              <span className="section-label">About Me</span>
              <ArrowUpRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
          </Link>
          {/* Right border */}
          <div
            className="absolute top-0 right-0 h-full w-px pointer-events-none lg:block hidden"
            style={{ backgroundColor: 'rgba(36,31,33,0.08)' }}
          />
        </div>

        {/* Right — editorial text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="order-1 lg:order-2 flex flex-col justify-center"
          style={{ padding: 'clamp(48px, 6vw, 96px) clamp(28px, 5vw, 80px)' }}
        >
          <p className="section-label" style={{ marginBottom: '24px' }}>About</p>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 4.5rem)',
              fontWeight: 500,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              color: '#241f21',
              marginBottom: 'clamp(20px, 2.5vw, 32px)',
            }}
          >
            Design is about{' '}
            <span className="text-gradient">connection</span>
          </h2>

          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.8,
              color: 'rgba(36,31,33,0.5)',
              maxWidth: '44ch',
              marginBottom: 'clamp(28px, 3.5vw, 48px)',
            }}
          >
            I believe great design starts with deeply understanding the people behind the product.
            It&apos;s about creating experiences that feel intuitive, meaningful, and genuinely useful in real life.
          </p>

          {/* Stats row */}
          <div
            className="flex items-start gap-8 lg:gap-12"
            style={{
              paddingTop: 'clamp(20px, 2.5vw, 32px)',
              marginBottom: 'clamp(28px, 3.5vw, 48px)',
              borderTop: '1px solid rgba(36,31,33,0.08)',
            }}
          >
            {[
              { value: '4+', label: 'Years designing\ndigital products' },
              { value: '3', label: 'Industry verticals\nhealthcare, AI, fintech' },
            ].map(stat => (
              <div key={stat.value}>
                <div
                  style={{
                    fontSize: 'clamp(1.75rem, 3vw, 3rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    color: '#241f21',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    color: 'rgba(36,31,33,0.4)',
                    lineHeight: 1.5,
                    textTransform: 'uppercase',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="group inline-flex items-center gap-2"
          >
            <span
              className="font-medium transition-colors duration-300 group-hover:text-[#241f21]"
              style={{
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(36,31,33,0.5)',
                borderBottom: '1px solid rgba(36,31,33,0.15)',
                paddingBottom: '2px',
              }}
            >
              How I approach design
            </span>
            <ArrowUpRight
              size={13}
              className="transition-all duration-300 group-hover:text-[#241f21] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: 'rgba(36,31,33,0.3)' }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
