'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function AboutPreview({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="relative pt-12 sm:pt-20 lg:pt-24 pb-0 px-4 sm:px-6 lg:px-8 bg-[#151414]">
      <div className="max-w-7xl mx-auto pb-12 sm:pb-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center">

          {/* Left: Stacked photos */}
          <div className="flex justify-center lg:justify-start">
            <Link href="/about" style={isDesktop ? { cursor: 'none' } : {}}>
              <motion.div
                className="relative w-[380px] max-w-[calc(100vw-2rem)] h-[300px] sm:w-[500px] sm:h-[380px] lg:w-[560px] lg:h-[420px]"
                initial="rest"
                whileHover="hover"
                animate="rest"
                style={{ cursor: 'pointer' }}
              >
                {/* Back left card */}
                <motion.div
                  className="absolute top-4 left-0 w-52 h-64 sm:w-64 sm:h-80 lg:w-72 lg:h-96 rounded-3xl overflow-hidden shadow-2xl z-0"
                  variants={{
                    rest: { x: 0, y: 0, rotate: -8 },
                    hover: { x: -30, y: -10, rotate: -12 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Image
                    src="/conferences/offf-group.jpg"
                    alt="Rita with group at OFFF conference"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 192px, 224px"
                    loading="lazy"
                  />
                </motion.div>

                {/* Back right card */}
                <motion.div
                  className="absolute top-4 right-0 w-52 h-64 sm:w-64 sm:h-80 lg:w-72 lg:h-96 rounded-3xl overflow-hidden shadow-2xl z-0"
                  variants={{
                    rest: { x: 0, y: 0, rotate: 8 },
                    hover: { x: 30, y: -10, rotate: 12 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Image
                    src="/conferences/dm-group.jpg"
                    alt="Rita with group at Design Matters conference"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 192px, 224px"
                    loading="lazy"
                  />
                </motion.div>

                {/* Front center card */}
                <motion.div
                  className="absolute top-0 left-1/2 w-56 h-72 sm:w-68 sm:h-96 lg:w-80 lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl z-10"
                  style={{ x: '-50%' }}
                  variants={{
                    rest: { scale: 1, y: 0 },
                    hover: { scale: 1.05, y: -5 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Image
                    src="/Me/IMG_0426.webp"
                    alt="Rita Pedrosa"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 208px, 240px"
                    loading="lazy"
                  />
                </motion.div>
              </motion.div>
            </Link>
          </div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 text-left"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-white">
              Design is about <span className="text-gradient">connection</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              I believe great design starts with deeply understanding the people behind the product.
              It's about creating experiences that feel intuitive, meaningful, and genuinely useful in real life.
            </p>
            <div className="pt-2">
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group text-gray-400 font-medium text-lg hover:text-white transition-colors flex items-center space-x-2"
                  style={isDesktop ? { cursor: 'none' } : {}}
                >
                  <span>How I approach design</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
      <div
        className="h-px pointer-events-none"
        style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.10) 50%, transparent 50%)',
          backgroundSize: '16px 1px',
          backgroundRepeat: 'repeat-x',
        }}
      />
    </section>
  )
}
