'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import GridBackground from '@/components/GridBackground'

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

function TestimonialCard({ expandedTestimonial, slideDirection, testimonials }: {
  expandedTestimonial: number
  slideDirection: 'left' | 'right'
  testimonials: { id: number; name: string; role: string; fullContent: string; avatar: string }[]
}) {
  const t = testimonials.find(t => t.id === expandedTestimonial)
  return (
    <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
      <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
        <motion.div
          key={expandedTestimonial}
          custom={slideDirection}
          variants={{
            enter: (direction: string) => ({ x: direction === 'right' ? 100 : -100, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (direction: string) => ({ x: direction === 'right' ? -100 : 100, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="mb-6 relative z-10">
            <svg width="56" height="56" viewBox="0 0 40 40" fill="none" style={{ color: 'rgba(59,130,246,0.7)' }}>
              <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
              <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-white leading-relaxed mb-8 text-xl md:text-2xl font-medium relative z-10">
            "{t?.fullContent}"
          </p>
          <div className="pt-6 border-t border-white/10 relative z-10">
            <h4 className="font-semibold text-white text-lg">{t?.name}</h4>
            <p className="text-base text-gray-400">{t?.role}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function TestimonialsSection({ isDesktop, onLabelChange }: { isDesktop?: boolean, onLabelChange?: (label: string | null) => void } = {}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [isPortrait, setIsPortrait] = useState(false)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  const scrollMobileToIndex = (index: number) => {
    const el = mobileScrollRef.current
    if (!el) return
    const card = el.querySelector('[data-idx="0"]') as HTMLElement
    if (!card) return
    el.scrollTo({ left: index * (card.offsetWidth + 16), behavior: 'smooth' })
  }

  useEffect(() => {
    setIsMounted(true)
    const mq = window.matchMedia('(orientation: portrait)')
    setIsPortrait(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Lock body scroll, hide header, and handle keyboard when modal is open
  useEffect(() => {
    if (expandedTestimonial !== null) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setExpandedTestimonial(null)
        if (e.key === 'ArrowLeft') prevModalTestimonial()
        if (e.key === 'ArrowRight') nextModalTestimonial()
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = 'unset'
        document.body.classList.remove('modal-open')
        document.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
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
      const next = (currentIndex + 1) % testimonials.length
      setCurrentIndex(next)
      scrollMobileToIndex(next)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const previousTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      const prev = (currentIndex - 1 + testimonials.length) % testimonials.length
      setCurrentIndex(prev)
      scrollMobileToIndex(prev)
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

  useEffect(() => {
    const el = mobileScrollRef.current
    if (!el) return
    const handleScroll = () => {
      const card = el.querySelector('[data-idx="0"]') as HTMLElement
      if (!card) return
      const index = Math.round(el.scrollLeft / (card.offsetWidth + 16))
      setCurrentIndex(Math.max(0, Math.min(index, testimonials.length - 1)))
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <section id="testimonials-section" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-[#171717]">
      <GridBackground />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25), rgba(96,165,250,0.2))' }}
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
        className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25), rgba(59,130,246,0.2))' }}
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
          <span className="text-sm font-medium tracking-wider text-gray-gray-400 uppercase mb-3 sm:mb-4 block">
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
          {/* Desktop: Single card carousel with flanking arrows */}
          <div
            className="hidden md:flex items-center gap-3"
            onMouseEnter={() => isDesktop && onLabelChange?.('READ FULL REVIEW')}
            onMouseLeave={() => isDesktop && onLabelChange?.(null)}
          >
            {/* Prev arrow */}
            <div className="flex-shrink-0 w-12 flex justify-center items-center h-[400px]">
              <button
                onClick={previousTestimonial}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                style={isDesktop ? { cursor: 'none' } : {}}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={22} />
              </button>
            </div>

            {/* Card */}
            <div
              className="flex-1 relative h-[400px]"
              style={isDesktop ? { cursor: 'none' } : { cursor: 'pointer' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="absolute inset-0"
                  onClick={() => setExpandedTestimonial(testimonials[currentIndex].id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-10 lg:px-12 py-8 lg:py-10 shadow-2xl shadow-black/50 flex flex-col h-full justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
                    {/* Quote Icon */}
                    <div className="mb-6 relative z-10">
                      <svg width="56" height="56" viewBox="0 0 40 40" fill="none" style={{ color: 'rgba(59,130,246,0.7)' }}>
                        <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                        <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                      </svg>
                    </div>
                    {/* Testimonial Text */}
                    <p className="text-white leading-relaxed mb-8 text-2xl lg:text-3xl font-medium relative z-10">
                      "{testimonials[currentIndex].content}"
                    </p>
                    {/* Author Info */}
                    <div className="flex items-center pt-6 mt-auto border-t border-white/10 relative z-10">
                      <div>
                        <h4 className="font-semibold text-white text-lg">{testimonials[currentIndex].name}</h4>
                        <p className="text-base text-gray-400">{testimonials[currentIndex].role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next arrow */}
            <div className="flex-shrink-0 w-12 flex justify-center items-center h-[400px]">
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                style={isDesktop ? { cursor: 'none' } : {}}
                aria-label="Next testimonial"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* Mobile: cards + arrows in one full-width block with matching bg so the gap doesn't reveal orbs */}
          <div className="md:hidden -mx-4 sm:-mx-6">
            <div ref={mobileScrollRef} className="overflow-x-auto snap-x snap-mandatory scroll-pl-6 scrollbar-hide">
              <div className="flex gap-4 pl-6 pr-4 pb-2" style={{ width: 'max-content' }}>
                {testimonials.map((testimonial, idx) => (
                  <div
                    key={testimonial.id}
                    data-idx={idx}
                    onClick={() => setExpandedTestimonial(testimonial.id)}
                    onMouseEnter={() => isDesktop && onLabelChange?.('READ FULL REVIEW')}
                    onMouseLeave={() => isDesktop && onLabelChange?.(null)}
                    className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-8 py-6 shadow-2xl shadow-black/50 flex flex-col w-[85vw] max-w-sm flex-shrink-0 snap-start justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none group"
                    style={isDesktop ? { cursor: 'none' } : { cursor: 'pointer' }}
                  >
                    {/* Quote Icon */}
                    <div className="mb-4 relative z-10">
                      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" style={{ color: 'rgba(59,130,246,0.7)' }}>
                        <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                        <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                      </svg>
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-white leading-relaxed mb-8 text-xl font-medium relative z-10">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="pt-6 mt-auto border-t border-white/10 relative z-10">
                      <h4 className="font-semibold text-white text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-base text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows + dots */}
            <div className="flex items-center justify-center gap-3 pt-3 pb-6">
              <button
                onClick={previousTestimonial}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true)
                        setCurrentIndex(index)
                        scrollMobileToIndex(index)
                        setTimeout(() => setIsAnimating(false), 600)
                      }
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
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
                    ? 'w-8 bg-white'
                    : 'w-2 bg-gray-600 hover:bg-gray-400'
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
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-4xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <div className="flex justify-end pb-3 flex-shrink-0">
                <button
                  onClick={() => setExpandedTestimonial(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Dot indicators (always visible below card / below arrow row) */}
              {(() => {
                const dots = (
                  <div className="flex items-center justify-center gap-2 pt-3 flex-shrink-0">
                    {testimonials.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          const currentIdx = testimonials.findIndex(x => x.id === expandedTestimonial)
                          const targetIdx = testimonials.findIndex(x => x.id === t.id)
                          setSlideDirection(targetIdx > currentIdx ? 'right' : 'left')
                          setExpandedTestimonial(t.id)
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          t.id === expandedTestimonial ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to testimonial ${t.id}`}
                      />
                    ))}
                  </div>
                )

                const arrowBtn = (dir: 'prev' | 'next') => (
                  <button
                    onClick={dir === 'prev' ? prevModalTestimonial : nextModalTestimonial}
                    className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label={dir === 'prev' ? 'Previous testimonial' : 'Next testimonial'}
                  >
                    {dir === 'prev' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
                  </button>
                )

                return isPortrait ? (
                  /* Portrait: card above, arrows flanking dots below */
                  <>
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <TestimonialCard
                        expandedTestimonial={expandedTestimonial}
                        slideDirection={slideDirection}
                        testimonials={testimonials}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-3 flex-shrink-0">
                      {arrowBtn('prev')}
                      <div className="flex flex-1 items-center justify-center gap-2">
                        {testimonials.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              const currentIdx = testimonials.findIndex(x => x.id === expandedTestimonial)
                              const targetIdx = testimonials.findIndex(x => x.id === t.id)
                              setSlideDirection(targetIdx > currentIdx ? 'right' : 'left')
                              setExpandedTestimonial(t.id)
                            }}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              t.id === expandedTestimonial ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to testimonial ${t.id}`}
                          />
                        ))}
                      </div>
                      {arrowBtn('next')}
                    </div>
                  </>
                ) : (
                  /* Landscape / desktop: arrows flank the card, dots centred below */
                  <>
                    <div className="flex items-center gap-3 flex-1 min-h-0">
                      <div className="flex-shrink-0 w-12 flex justify-center">
                        {arrowBtn('prev')}
                      </div>
                      <div className="flex-1 min-w-0 overflow-y-auto">
                        <TestimonialCard
                          expandedTestimonial={expandedTestimonial}
                          slideDirection={slideDirection}
                          testimonials={testimonials}
                        />
                      </div>
                      <div className="flex-shrink-0 w-12 flex justify-center">
                        {arrowBtn('next')}
                      </div>
                    </div>
                    {dots}
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}
