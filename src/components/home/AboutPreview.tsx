'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function AboutPreview({ isDesktop }: { isDesktop: boolean }) {
  return (
    <section className="py-16 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Photo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
              <Image
                src="/Me/IMG_0426.webp"
                alt="Rita Pedrosa"
                fill
                className="object-cover"
                sizes="128px"
                loading="lazy"
              />
            </div>
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
                className="group text-indigo-600 dark:text-indigo-400 font-medium text-lg hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center space-x-2 mx-auto"
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
