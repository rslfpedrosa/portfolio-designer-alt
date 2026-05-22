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

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

const cornerStyle = (corner: typeof CORNERS[number]) => ({
  backgroundColor: '#151414',
  border: '1px solid #312f2e',
  top: corner.startsWith('top') ? '-6px' : undefined,
  bottom: corner.startsWith('bottom') ? '-6px' : undefined,
  left: corner.endsWith('left') ? '-6px' : undefined,
  right: corner.endsWith('right') ? '-6px' : undefined,
})

function ModalCard({ expandedTestimonial, slideDirection }: {
  expandedTestimonial: number
  slideDirection: 'left' | 'right'
}) {
  const t = testimonials.find(t => t.id === expandedTestimonial)
  return (
    <div className="bg-[#151414] p-8 md:p-12 relative overflow-visible" style={{ outline: '2px solid #0f8be8', boxShadow: '0 0 70px 0 rgba(15,139,232,0.18)' }}>
      <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
        <motion.div
          key={expandedTestimonial}
          custom={slideDirection}
          variants={{
            enter: (d: string) => ({ x: d === 'right' ? 100 : -100, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d: string) => ({ x: d === 'right' ? -100 : 100, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="mb-6">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" style={{ color: 'rgba(59,130,246,0.7)' }}>
              <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
              <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-white leading-relaxed mb-8 text-xl md:text-2xl font-medium">
            "{t?.fullContent}"
          </p>
          <div className="pt-6 border-t border-[#312f2e]">
            <h4 className="font-semibold text-white text-lg">{t?.name}</h4>
            <p className="text-base text-gray-400">{t?.role}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function TestimonialsSection({ isDesktop, onLabelChange }: { isDesktop?: boolean, onLabelChange?: (label: string | null) => void } = {}) {
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [isMounted, setIsMounted] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  // Mobile scroll
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
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

  useEffect(() => {
    if (expandedTestimonial !== null) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setExpandedTestimonial(null)
        if (e.key === 'ArrowLeft') prevModal()
        if (e.key === 'ArrowRight') nextModal()
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

  const nextModal = () => {
    if (expandedTestimonial === null) return
    setSlideDirection('right')
    const idx = testimonials.findIndex(t => t.id === expandedTestimonial)
    setExpandedTestimonial(testimonials[(idx + 1) % testimonials.length].id)
  }

  const prevModal = () => {
    if (expandedTestimonial === null) return
    setSlideDirection('left')
    const idx = testimonials.findIndex(t => t.id === expandedTestimonial)
    setExpandedTestimonial(testimonials[(idx - 1 + testimonials.length) % testimonials.length].id)
  }

  const prevMobile = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const prev = (currentIndex - 1 + testimonials.length) % testimonials.length
    setCurrentIndex(prev)
    scrollMobileToIndex(prev)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const nextMobile = () => {
    if (isAnimating) return
    setIsAnimating(true)
    const next = (currentIndex + 1) % testimonials.length
    setCurrentIndex(next)
    scrollMobileToIndex(next)
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <>
      <section id="testimonials-section" className="relative py-16 px-4 sm:px-6 lg:px-8 bg-[#151414]">
        <GridBackground />
        {/* Dashed rules */}
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        <div className="absolute bottom-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-left mb-12 pl-6 sm:pl-8 lg:pl-16"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-white mb-4">
              What my peers say
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Feedback from colleagues and collaborators I've worked closely with.
            </p>
          </motion.div>

          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid grid-cols-3 gap-0">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true }}
                className="relative overflow-visible"
                onClick={() => setExpandedTestimonial(t.id)}
                onMouseEnter={() => { setHoveredId(t.id); isDesktop && onLabelChange?.('READ FULL REVIEW') }}
                onMouseLeave={() => { setHoveredId(null); isDesktop && onLabelChange?.(null) }}
                style={{ ...(isDesktop ? { cursor: 'none' } : { cursor: 'pointer' }), zIndex: hoveredId === t.id ? 10 : 1 }}
              >
                {CORNERS.map(corner => (
                  <div
                    key={corner}
                    className="absolute w-3 h-3 z-20 rounded-sm pointer-events-none"
                    style={{
                      ...cornerStyle(corner),
                      backgroundColor: hoveredId === t.id ? '#0f8be8' : '#151414',
                      border: hoveredId === t.id ? '2px solid #0f8be8' : '1px solid #312f2e',
                      transition: 'background-color 200ms, border-color 200ms',
                    }}
                  />
                ))}
                <div
                  className="relative bg-[#151414] p-8 lg:p-10 h-full flex flex-col"
                  style={{
                    outline: hoveredId === t.id ? '2px solid #0f8be8' : '1px solid #312f2e',
                    outlineOffset: '0px',
                    boxShadow: hoveredId === t.id ? '0 0 40px 0 rgba(15,139,232,0.15)' : 'none',
                    transition: 'outline 200ms, box-shadow 200ms',
                  }}
                >
                  <div className="mb-6">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ color: 'rgba(59,130,246,0.7)' }}>
                      <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                      <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-white leading-relaxed text-lg font-medium flex-1 mb-8">
                    "{t.content}"
                  </p>
                  <div className="pt-6 border-t border-[#312f2e]">
                    <h4 className="font-semibold text-white">{t.name}</h4>
                    <p className="text-sm text-gray-400 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden -mx-4 sm:-mx-6">
            <div ref={mobileScrollRef} className="overflow-x-auto snap-x snap-mandatory scroll-pl-6 scrollbar-hide">
              <div className="flex gap-4 pl-6 pr-4" style={{ width: 'max-content' }}>
                {testimonials.map((t, idx) => (
                  <div
                    key={t.id}
                    data-idx={idx}
                    onClick={() => setExpandedTestimonial(t.id)}
                    className="relative overflow-visible w-[85vw] max-w-sm flex-shrink-0 snap-start"
                    style={{ cursor: 'pointer' }}
                  >
                    {CORNERS.map(corner => (
                      <div key={corner} className="absolute w-3 h-3 z-20 rounded-sm pointer-events-none" style={cornerStyle(corner)} />
                    ))}
                    <div className="bg-[#151414] px-8 py-6 flex flex-col h-full" style={{ outline: '1px solid #312f2e' }}>
                      <div className="mb-4">
                        <svg width="36" height="36" viewBox="0 0 40 40" fill="none" style={{ color: 'rgba(59,130,246,0.7)' }}>
                          <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
                          <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <p className="text-white leading-relaxed mb-8 text-lg font-medium flex-1">"{t.content}"</p>
                      <div className="pt-5 border-t border-[#312f2e]">
                        <h4 className="font-semibold text-white">{t.name}</h4>
                        <p className="text-sm text-gray-400 mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4 pb-2">
              <button onClick={prevMobile} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { if (!isAnimating) { setIsAnimating(true); setCurrentIndex(index); scrollMobileToIndex(index); setTimeout(() => setIsAnimating(false), 600) } }}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button onClick={nextMobile} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded modal */}
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
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-end pb-3 flex-shrink-0">
                  <button onClick={() => setExpandedTestimonial(null)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" aria-label="Close">
                    <X size={24} />
                  </button>
                </div>

                {isPortrait ? (
                  <>
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <ModalCard expandedTestimonial={expandedTestimonial} slideDirection={slideDirection} />
                    </div>
                    <div className="flex items-center gap-2 pt-3 flex-shrink-0">
                      <button onClick={prevModal} className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><ChevronLeft size={22} /></button>
                      <div className="flex flex-1 items-center justify-center gap-2">
                        {testimonials.map(t => (
                          <button key={t.id} onClick={() => { const ci = testimonials.findIndex(x => x.id === expandedTestimonial); const ti = testimonials.findIndex(x => x.id === t.id); setSlideDirection(ti > ci ? 'right' : 'left'); setExpandedTestimonial(t.id) }} className={`h-2 rounded-full transition-all duration-300 ${t.id === expandedTestimonial ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'}`} aria-label={`Go to testimonial ${t.id}`} />
                        ))}
                      </div>
                      <button onClick={nextModal} className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><ChevronRight size={22} /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1 min-h-0">
                      <div className="flex-shrink-0 w-12 flex justify-center">
                        <button onClick={prevModal} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><ChevronLeft size={22} /></button>
                      </div>
                      <div className="flex-1 min-w-0 overflow-y-auto">
                        <ModalCard expandedTestimonial={expandedTestimonial} slideDirection={slideDirection} />
                      </div>
                      <div className="flex-shrink-0 w-12 flex justify-center">
                        <button onClick={nextModal} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><ChevronRight size={22} /></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-3 flex-shrink-0">
                      {testimonials.map(t => (
                        <button key={t.id} onClick={() => { const ci = testimonials.findIndex(x => x.id === expandedTestimonial); const ti = testimonials.findIndex(x => x.id === t.id); setSlideDirection(ti > ci ? 'right' : 'left'); setExpandedTestimonial(t.id) }} className={`h-2 rounded-full transition-all duration-300 ${t.id === expandedTestimonial ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'}`} aria-label={`Go to testimonial ${t.id}`} />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
