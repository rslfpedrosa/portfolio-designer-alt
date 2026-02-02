'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="relative py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none"
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
        className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none"
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
        className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl pointer-events-none"
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
      <div className="absolute inset-0 bg-animated-grid" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8"
        >
          <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
            Let's Build Something <span className="text-gradient">Together</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            I'm always open to collaborating on thoughtful projects, from early product strategy to polished, production ready experiences.
          </p>
          <div className="flex justify-center">
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
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
