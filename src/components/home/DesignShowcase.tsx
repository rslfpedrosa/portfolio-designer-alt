'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import ShowcaseCard from '@/components/ShowcaseCard'
import ShowcaseModal from '@/components/ShowcaseModal'

const designShowcase = [
  { id: 1, type: 'video', media: '/explorations/exploration-1.mp4', gradient: 'from-cyan-400 to-blue-500' },
  { id: 2, type: 'video', media: '/explorations/exploration-2.mp4', gradient: 'from-pink-400 to-gray-500' },
  { id: 3, type: 'video', media: '/explorations/exploration-3.mp4', gradient: 'from-orange-400 to-red-500' },
  { id: 4, type: 'video', media: '/explorations/exploration-4.mp4', gradient: 'from-green-400 to-teal-500' },
]

export default function DesignShowcase() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <section
        className="relative bg-[#f2efea]"
        style={{
          borderTop: '1px solid rgba(36,31,33,0.08)',
          borderBottom: '1px solid rgba(36,31,33,0.08)',
        }}
      >
        {/* Section header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'clamp(20px, 2.5vw, 32px) clamp(24px, 5vw, 80px)',
            borderBottom: '1px solid rgba(36,31,33,0.08)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <span className="section-label">Product Explorations</span>
            <span
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: 'rgba(217,238,114,0.5)',
                flexShrink: 0,
              }}
            />
            <span className="section-label" style={{ opacity: 0.35 }}>
              Interaction · Systems · Visual
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <Link href="/projects">
              <motion.span
                whileHover={{ x: 3 }}
                transition={{ duration: 0.25 }}
                className="link-editorial"
              >
                See More
                <ArrowUpRight size={11} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Description row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{
            padding: 'clamp(28px, 3.5vw, 48px) clamp(24px, 5vw, 80px)',
            borderBottom: '1px solid rgba(36,31,33,0.08)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 4rem)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#241f21',
              maxWidth: '18ch',
            }}
          >
            Explorations in interaction, systems, and visual design.
          </h2>
        </motion.div>

        {/* Grid — 2×2, no padding (edge-to-edge within container) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ borderTop: '1px solid rgba(36,31,33,0.08)' }}
        >
          {designShowcase.map((item, index) => (
            <div
              key={item.id}
              style={{
                borderRight: index % 2 === 0 ? '1px solid rgba(36,31,33,0.08)' : 'none',
                borderBottom: index < 2 ? '1px solid rgba(36,31,33,0.08)' : 'none',
              }}
            >
              <ShowcaseCard
                item={item}
                index={index}
                onClick={() => setSelectedIndex(index)}
              />
            </div>
          ))}
        </div>
      </section>

      <ShowcaseModal
        items={designShowcase}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    </>
  )
}
