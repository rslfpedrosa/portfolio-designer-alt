'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, PenTool, Layers, Sparkles, Target, Globe, Lightbulb, Layout, Code2 } from 'lucide-react'

const FLOATING_ICONS = [
  { Icon: PenTool,   top: '14%', left: '7%',   rotate: -14 },
  { Icon: Layers,    top: '52%', left: '4%',   rotate:   8 },
  { Icon: Layout,    top: '22%', left: '22%',  rotate:  -5 },
  { Icon: Sparkles,  top: '10%', right: '20%', rotate:  12 },
  { Icon: Globe,     top: '8%',  right: '7%',  rotate:  -8 },
  { Icon: Target,    top: '50%', right: '5%',  rotate:   6 },
  { Icon: Lightbulb, top: '68%', left: '11%',  rotate: -10 },
  { Icon: Code2,     top: '65%', right: '13%', rotate:   9 },
]

export default function CTASection({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#151414' }}>
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(140deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)' }}
        >
          {/* Dot pattern on card */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="rgba(255,255,255,0.15)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-dots)" />
          </svg>

          {/* Bottom radial glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.22) 0%, transparent 70%)' }}
          />

          {/* Floating icon cards */}
          {FLOATING_ICONS.map(({ Icon, top, left, right, rotate }, i) => (
            <motion.div
              key={i}
              className="absolute w-14 h-14 rounded-xl flex items-center justify-center pointer-events-none"
              style={{
                top, left, right,
                rotate,
                border: '1.5px dashed rgba(255,255,255,0.35)',
                backgroundColor: 'rgba(255,255,255,0.10)',
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Icon size={20} className="text-white/80" strokeWidth={1.5} />
            </motion.div>
          ))}

          {/* Content */}
          <div className="relative z-10 py-20 sm:py-28 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white max-w-2xl mx-auto leading-tight">
                Have a product challenge?
              </h2>
              <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-lg mx-auto">
                I'm always open to collaborating on thoughtful, impactful products — from early ideas to refined experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#1e3a8a] px-6 py-3 rounded-full font-semibold text-base hover:bg-white/90 transition-colors flex items-center gap-2"
                    style={isDesktop ? { cursor: 'none' } : {}}
                  >
                    <span>Get In Touch</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white/85 px-6 py-3 rounded-full font-medium text-base hover:text-white transition-colors"
                    style={isDesktop ? { cursor: 'none' } : {}}
                  >
                    View My Work
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
