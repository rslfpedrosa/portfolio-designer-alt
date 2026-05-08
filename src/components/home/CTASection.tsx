'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import GridBackground from '@/components/GridBackground'

export default function CTASection({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="relative py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#171717] overflow-hidden">
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25), rgba(96,165,250,0.25))' }}
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
        className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25), rgba(59,130,246,0.25))' }}
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
        className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.25), rgba(37,99,235,0.25))' }}
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
      <GridBackground />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8"
        >
          <h2 className="text-4xl sm:text-5xl font-medium text-white">
            Have a product challenge?<br />
            <span className="text-gradient">Let's solve it together.</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-xl mx-auto">
            I'm always open to collaborating on thoughtful, impactful products, from early ideas to refined experiences.
          </p>
          <div className="flex justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-medium text-base hover:bg-[#1d4ed8] transition-colors flex items-center space-x-2"
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
  )
}
