'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ShowcaseCard from '@/components/ShowcaseCard'
import ShowcaseModal from '@/components/ShowcaseModal'

const designShowcase = [
  {
    id: 1,
    type: 'video',
    media: '/explorations/exploration-1.mp4',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    id: 2,
    type: 'video',
    media: '/explorations/exploration-2.mp4',
    gradient: 'from-pink-400 to-gray-500',
  },
  {
    id: 3,
    type: 'video',
    media: '/explorations/exploration-3.mp4',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 4,
    type: 'video',
    media: '/explorations/exploration-4.mp4',
    gradient: 'from-green-400 to-teal-500',
  },
]

export default function DesignShowcase({ isDesktop, onLabelChange }: { isDesktop: boolean, onLabelChange?: (label: string | null) => void }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#171717] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="text-sm font-medium tracking-wider text-gray-gray-600 dark:text-gray-gray-400 uppercase">
                Design Showcase
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">
              Product Explorations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                onLabelChange={onLabelChange}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>

          {/* See More Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-medium text-base hover:bg-[#1d4ed8] transition-colors flex items-center space-x-2 mx-auto"
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                <span>See More</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
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
