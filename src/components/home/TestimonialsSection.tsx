'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ana Marković',
    role: 'Lead Product Designer, Loka',
    content: 'Rita brings clarity, direction, and a high bar for quality to everything she touches. Her product thinking is sharp, her execution fast and thoughtful.',
    fullContent: 'Rita\'s an exceptional designer who brings clarity, direction, and a high bar for quality to everything she touches. Her product thinking is sharp, her execution is fast and thoughtful, and her presence uplifts the entire team. She plays a key role in shaping both the work and how we work together.',
    avatar: 'AM',
  },
  {
    id: 2,
    name: 'Ana Vilar',
    role: 'Product Designer, Loka',
    content: 'Rita consistently brings positive, collaborative energy to the team. She has a keen eye for detail that elevates the quality of any work she touches.',
    fullContent: 'Working with Rita was an absolute pleasure. She was incredibly supportive, always attentive to the project\'s progress and the well-being of her teammates. Her communication skills are great, and she consistently brings a positive and collaborative energy to the team. She has a keen eye for detail and a perfectionist mindset that elevates the quality of any work she touches.',
    avatar: 'AV',
  },
  {
    id: 3,
    name: 'Mariana Elias',
    role: 'Senior Product Designer, Loka',
    content: 'Rita quickly identifies technical solutions to design challenges, simplifying complex problems into beautiful and functional products. Any team would be lucky to have her.',
    fullContent: 'Rita is an exceptionally talented product designer. In the past three years that we\'ve worked together, I\'ve seen first-hand how quickly and effectively she identifies technical solutions to design challenges, often simplifying complex problems into beautiful and functional products. Any team would be lucky to have her!',
    avatar: 'ME',
  },
]

export default function TestimonialsSection({ isDesktop, onLabelChange }: { isDesktop?: boolean, onLabelChange?: (label: string | null) => void } = {}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (expandedTestimonial !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [expandedTestimonial])

  const nextModalTestimonial = () => {
    if (expandedTestimonial !== null) {
      setSlideDirection('right')
      const currentIdx = testimonials.findIndex(t => t.id === expandedTestimonial)
      const nextIdx = (currentIdx + 1) % testimonials.length
      setExpandedTestimonial(testimonials[nextIdx].id)
    }
  }

  const prevModalTestimonial = () => {
    if (expandedTestimonial !== null) {
      setSlideDirection('left')
      const currentIdx = testimonials.findIndex(t => t.id === expandedTestimonial)
      const prevIdx = (currentIdx - 1 + testimonials.length) % testimonials.length
      setExpandedTestimonial(testimonials[prevIdx].id)
    }
  }

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
    <>
    <section id="testimonials-section" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-animated-grid" />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/60 to-purple-400/60 rounded-full blur-3xl pointer-events-none"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: [0, 150, -50, 0],
          y: [0, -120, 80, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/60 to-pink-400/60 rounded-full blur-3xl pointer-events-none"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: [0, -100, 120, 0],
          y: [0, 100, -80, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "loop",
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-sm font-medium tracking-wider text-indigo-400 uppercase mb-3 sm:mb-4 block">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl sm:text-5xl font-medium text-white mb-4 sm:mb-6">
            What my peers say
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Feedback from colleagues and collaborators I've worked closely with.
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="relative max-w-4xl mx-auto overflow-visible">
          {/* Desktop: Single card carousel */}
          <div className="hidden md:block relative h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="absolute inset-0 group"
                onClick={() => setExpandedTestimonial(testimonials[currentIndex].id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                }}
              >
                <div
                  className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-10 lg:px-12 py-8 lg:py-10 shadow-2xl shadow-black/50 flex flex-col h-full justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none cursor-pointer"
                  onMouseEnter={() => isDesktop && onLabelChange?.('READ FULL REVIEW')}
                  onMouseLeave={() => isDesktop && onLabelChange?.(null)}
                >
                  
                  {/* Quote Icon */}
                  <div className="mb-6 relative z-10">
                    <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="text-indigo-400/40">
                      <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                      <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-white leading-relaxed mb-8 text-2xl lg:text-3xl font-medium relative z-10">
                    "{testimonials[currentIndex].content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-between pt-6 mt-auto border-t border-white/10 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-base">{testimonials[currentIndex].avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-base text-gray-400">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                    
                    {/* Read More Indicator - Aligned with author */}
                    <div className="text-indigo-400 text-sm font-medium flex items-center gap-2 flex-shrink-0">
                      <span className="hidden lg:inline">Click to read full review</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
                  onClick={() => setExpandedTestimonial(testimonial.id)}
                  onMouseEnter={() => isDesktop && onLabelChange?.('READ FULL REVIEW')}
                  onMouseLeave={() => isDesktop && onLabelChange?.(null)}
                  className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-8 py-6 shadow-2xl shadow-black/50 flex flex-col w-[85vw] max-w-sm flex-shrink-0 snap-start justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none cursor-pointer group"
                >
                  {/* Quote Icon */}
                  <div className="mb-4 relative z-10">
                    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" className="text-indigo-400/40">
                      <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                      <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-white leading-relaxed mb-8 text-xl font-medium relative z-10">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-between pt-6 mt-auto border-t border-white/10 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-base">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-base text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    
                    {/* Read More Indicator - Aligned with author */}
                    <div className="text-indigo-400 text-sm font-medium flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline">Tap to read full review</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
    
    {/* Expanded Testimonial Modal - Rendered at body level via portal */}
    {isMounted && createPortal(
      <AnimatePresence>
        {expandedTestimonial !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 lg:p-8"
            onClick={() => setExpandedTestimonial(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
          >
            {/* Navigation Arrows - Outside the card */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevModalTestimonial()
              }}
              className="absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextModalTestimonial()
              }}
              className="absolute right-4 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 md:p-12 lg:p-16 max-w-4xl w-full shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setExpandedTestimonial(null)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Animated Content */}
              <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
                <motion.div
                  key={expandedTestimonial}
                  custom={slideDirection}
                  variants={{
                    enter: (direction: string) => ({
                      x: direction === 'right' ? 100 : -100,
                      opacity: 0
                    }),
                    center: {
                      x: 0,
                      opacity: 1
                    },
                    exit: (direction: string) => ({
                      x: direction === 'right' ? -100 : 100,
                      opacity: 0
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: 'easeInOut'
                  }}
                >
                  {/* Quote Icon */}
                  <div className="mb-6 relative z-10">
                    <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="text-indigo-400/40">
                      <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                      <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                    </svg>
                  </div>

                  {/* Full Testimonial Text */}
                  <p className="text-white leading-relaxed mb-8 text-xl md:text-2xl lg:text-3xl font-medium relative z-10">
                    "{testimonials.find(t => t.id === expandedTestimonial)?.fullContent}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4 pt-6 border-t border-white/10 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-base">
                        {testimonials.find(t => t.id === expandedTestimonial)?.avatar}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        {testimonials.find(t => t.id === expandedTestimonial)?.name}
                      </h4>
                      <p className="text-base text-gray-400">
                        {testimonials.find(t => t.id === expandedTestimonial)?.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}
