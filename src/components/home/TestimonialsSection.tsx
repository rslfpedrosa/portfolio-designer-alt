'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ana Marković',
    role: 'Lead Product Designer at Loka',
    content: 'Rita\'s an exceptional designer who brings clarity, direction, and a high bar for quality to everything she touches. Her product thinking is sharp, her execution is fast and thoughtful, and her presence uplifts the entire team. She plays a key role in shaping both the work and how we work together.',
    avatar: 'AM',
  },
  {
    id: 2,
    name: 'Ana Vilar',
    role: 'Product Designer at Loka',
    content: 'Working with Rita was an absolute pleasure. She was incredibly supportive, always attentive to the project\'s progress and the well-being of her teammates. Her communication skills are great, and she consistently brings a positive and collaborative energy to the team. She has a keen eye for detail and a perfectionist mindset that elevates the quality of any work she touches.',
    avatar: 'AV',
  },
  {
    id: 3,
    name: 'Mariana Elias',
    role: 'Senior Product Designer at Loka',
    content: 'Rita is an exceptionally talented product designer. In the past three years that we\'ve worked together, I\'ve seen first-hand how quickly and effectively she identifies technical solutions to design challenges, often simplifying complex problems into beautiful and functional products. Any team would be lucky to have her!',
    avatar: 'ME',
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const previousTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  useEffect(() => {
    // Only auto-advance when visible and on desktop
    if (!isVisible) return
    
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return
    
    const interval = setInterval(() => {
      nextTestimonial()
    }, 6000)
    return () => clearInterval(interval)
  }, [isAnimating, isVisible])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    const section = document.getElementById('testimonials-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="testimonials-section" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-sm font-medium tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3 sm:mb-4 block">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">
            What my peers say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Feedback from colleagues and collaborators I've worked closely with.
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="relative max-w-2xl mx-auto overflow-visible">
          {/* Desktop: Single card carousel with arrows */}
          <div className="hidden md:block relative h-[450px] px-12 lg:px-16">
            {/* Left Arrow */}
            <button
              onClick={previousTestimonial}
              disabled={isAnimating}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextTestimonial}
              disabled={isAnimating}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="cursor-pointer absolute inset-0 px-12 lg:px-16"
                onClick={nextTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                }}
              >
                <div className="bg-gray-900 dark:bg-black rounded-2xl p-8 shadow-2xl border border-gray-800 dark:border-gray-700 flex flex-col h-full">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" className="text-gray-700">
                      <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                      <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-300 dark:text-gray-400 leading-relaxed mb-6 text-lg">
                    "{testimonials[currentIndex].content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-4 pt-4 mt-auto border-t border-gray-800 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">{testimonials[currentIndex].avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-base font-medium text-gray-500">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile: Horizontal scrollable cards */}
          <div className="md:hidden overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 sm:-mx-6">
            <div className="flex gap-4 px-4 sm:px-6" style={{ width: 'max-content' }}>
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-900 dark:bg-black rounded-2xl p-6 shadow-2xl border border-gray-800 dark:border-gray-700 flex flex-col w-[85vw] max-w-sm flex-shrink-0 snap-start"
                >
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" className="text-gray-700">
                      <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                      <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-300 dark:text-gray-400 leading-relaxed mb-6 text-lg">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-4 pt-4 mt-auto border-t border-gray-800 dark:border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-base font-medium text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicator Dots - Desktop only */}
          <div className="hidden md:flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentIndex(index)
                    setTimeout(() => setIsAnimating(false), 600)
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-indigo-600'
                    : 'w-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
