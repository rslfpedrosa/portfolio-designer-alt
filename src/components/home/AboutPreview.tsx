'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function AboutPreview({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#171717]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Three Stacked Photos */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <motion.div 
              className="relative w-[350px] h-[240px] sm:w-[450px] sm:h-[300px]"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              {/* Purple gradient blob behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-gray-500/30 to-gray-gray-500/30 rounded-full blur-3xl -z-10" />
              
              {/* Back card - tilted left */}
              <motion.div 
                className="absolute top-4 left-0 w-44 h-56 sm:w-56 sm:h-72 rounded-3xl overflow-hidden shadow-2xl z-0"
                variants={{
                  rest: { x: 0, y: 0, rotate: -8 },
                  hover: { x: -30, y: -10, rotate: -12 }
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Image
                  src="/conferences/offf-group.jpg"
                  alt="Rita with group at OFFF conference"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 192px, 240px"
                  loading="lazy"
                />
              </motion.div>
              
              {/* Back right card - tilted right */}
              <motion.div 
                className="absolute top-4 right-0 w-44 h-56 sm:w-56 sm:h-72 rounded-3xl overflow-hidden shadow-2xl z-0"
                variants={{
                  rest: { x: 0, y: 0, rotate: 8 },
                  hover: { x: 30, y: -10, rotate: 12 }
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Image
                  src="/conferences/dm-group.jpg"
                  alt="Rita with group at Design Matters conference"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 192px, 240px"
                  loading="lazy"
                />
              </motion.div>
              
              {/* Front card - centered */}
              <motion.div 
                className="absolute top-0 left-1/2 w-48 h-64 sm:w-60 sm:h-80 rounded-3xl overflow-hidden shadow-2xl z-10"
                style={{ x: '-50%' }}
                variants={{
                  rest: { scale: 1, y: 0 },
                  hover: { scale: 1.05, y: -5 }
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Image
                  src="/Me/IMG_0426.webp"
                  alt="Rita Pedrosa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 208px, 256px"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
            Design is about <span className="text-gradient">connection</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            I believe great design starts with deeply understanding the people behind the product.
            It's about creating experiences that feel intuitive, meaningful, and genuinely useful in real life.
          </p>
          <div className="pt-4">
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group text-gray-gray-600 dark:text-gray-gray-400 font-medium text-lg hover:text-gray-gray-700 dark:hover:text-gray-gray-300 transition-colors flex items-center space-x-2 mx-auto"
                style={isDesktop ? { cursor: 'none' } : {}}
              >
                <span>How I approach design</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
