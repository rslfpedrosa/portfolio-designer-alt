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

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

const cornerStyle = (corner: typeof CORNERS[number]) => ({
  backgroundColor: '#f2efea',
  border: '1px solid rgba(36,31,33,0.15)',
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
    <div className="bg-[#042d2b] p-8 md:p-12 relative overflow-visible" style={{ outline: '2px solid #d9ee72', boxShadow: '0 0 70px 0 rgba(217,238,114,0.18)' }}>
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
            <img src="/icons/aspas.svg" alt="" width={48} height={46} style={{ opacity: 0.7 }} />
          </div>
          <p className="text-white leading-relaxed mb-8 text-xl md:text-2xl font-medium">
            "{t?.fullContent}"
          </p>
          <div className="pt-6 border-t border-[#22372e]">
            <h4 className="font-semibold text-white text-lg">{t?.name}</h4>
            <p className="text-base text-gray-400">{t?.role}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function TestimonialsSection() {
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [isMounted, setIsMounted] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  // Slideshow carousel
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mobileDirection, setMobileDirection] = useState<'left' | 'right'>('right')
  const [isCardHovered, setIsCardHovered] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const mq = window.matchMedia('(orientation: portrait)')
    setIsPortrait(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
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
    setMobileDirection('left')
    setCurrentIndex(i => (i - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 350)
  }

  const nextMobile = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setMobileDirection('right')
    setCurrentIndex(i => (i + 1) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 350)
  }

  return (
    <>
      <section
        id="testimonials-section"
        className="relative bg-[#f2efea]"
        style={{
          paddingTop: 'clamp(140px, 16vw, 220px)',
          paddingBottom: 'clamp(64px, 8vw, 120px)',
        }}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="testimonials-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonials-dots)" />
          </svg>
        </div>

        <div
          className="relative z-10"
          style={{ padding: '0 clamp(24px, 5vw, 80px)' }}
        >
          {/* Section header */}
          <div
            className="flex items-end justify-between"
            style={{ marginBottom: 'clamp(16px, 2vw, 32px)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  color: '#241f21',
                }}
              >
                What my peers say
              </h2>
            </motion.div>
          </div>

          {/* Slideshow */}
          <div style={{ paddingTop: 0 }}>
            {/* Outer hover wrapper — corners sit here so they're never clipped */}
            <div
              className="relative"
              style={{ isolation: 'isolate' }}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
            >
              {CORNERS.map(corner => (
                <div
                  key={corner}
                  className="absolute w-3 h-3 z-20 rounded-sm"
                  style={{
                    backgroundColor: isCardHovered ? '#ffffff' : '#f2efea',
                    border: `1px solid ${isCardHovered ? '#0a99ff' : 'rgba(36,31,33,0.13)'}`,
                    transition: 'background-color 0.15s, border-color 0.15s',
                    top: corner.startsWith('top') ? '-6px' : undefined,
                    bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                    left: corner.endsWith('left') ? '-6px' : undefined,
                    right: corner.endsWith('right') ? '-6px' : undefined,
                  }}
                />
              ))}

              {/* Inner card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpandedTestimonial(testimonials[currentIndex].id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedTestimonial(testimonials[currentIndex].id) }}
                style={{
                  position: 'relative',
                  background: 'white',
                  boxShadow: `0 0 0 1px ${isCardHovered ? '#0a99ff' : 'rgba(36,31,33,0.13)'}`,
                  padding: 'clamp(28px, 4vw, 56px)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s',
                }}
              >
                {/* Quote icon */}
                <img src="/icons/aspas.svg" alt="" width={60} height={57} style={{ marginBottom: 'clamp(24px, 3vw, 40px)' }} />

                <AnimatePresence mode="popLayout" initial={false} custom={mobileDirection}>
                  <motion.div
                    key={currentIndex}
                    custom={mobileDirection}
                    variants={{
                      enter: (d: string) => ({ x: d === 'right' ? 60 : -60, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: string) => ({ x: d === 'right' ? -60 : 60, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-end" style={{ gap: 'clamp(24px, 4vw, 64px)', marginBottom: '32px' }}>
                      <p style={{ flex: 1, fontSize: 'clamp(1.6rem, 3vw, 3rem)', lineHeight: 1.2, color: '#241f21', fontWeight: 500 }}>
                        {testimonials[currentIndex].content}
                      </p>
                      <div style={{ flexShrink: 0, minWidth: '160px' }}>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#241f21', marginBottom: '4px' }}>{testimonials[currentIndex].name}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(36,31,33,0.45)', letterSpacing: '0.02em' }}>{testimonials[currentIndex].role}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(36,31,33,0.08)', paddingTop: '20px' }} onClick={e => e.stopPropagation()}>
                  <button onClick={e => { e.stopPropagation(); prevMobile() }} className="p-2 text-[#241f21] transition-colors hover:text-[#241f21]/60" style={{ border: '1px solid rgba(36,31,33,0.15)', borderRadius: '4px' }} aria-label="Previous">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={e => { e.stopPropagation(); if (!isAnimating) { setIsAnimating(true); setMobileDirection(index > currentIndex ? 'right' : 'left'); setCurrentIndex(index); setTimeout(() => setIsAnimating(false), 350) } }}
                        className="rounded-full transition-all duration-300"
                        style={{ height: '6px', width: index === currentIndex ? '24px' : '6px', backgroundColor: index === currentIndex ? '#241f21' : 'rgba(36,31,33,0.2)' }}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button onClick={e => { e.stopPropagation(); nextMobile() }} className="p-2 text-[#241f21] transition-colors hover:text-[#241f21]/60" style={{ border: '1px solid rgba(36,31,33,0.15)', borderRadius: '4px' }} aria-label="Next">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
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
