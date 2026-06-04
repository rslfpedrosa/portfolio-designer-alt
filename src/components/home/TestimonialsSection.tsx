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

function ModalCard({ expandedTestimonial, slideDirection, onPrev, onNext, onGoTo, onClose }: {
  expandedTestimonial: number
  slideDirection: 'left' | 'right'
  onPrev: () => void
  onNext: () => void
  onGoTo: (id: number) => void
  onClose: () => void
}) {
  const t = testimonials.find(t => t.id === expandedTestimonial)
  return (
    <div className="bg-white p-8 md:p-12 relative overflow-hidden md:h-[600px]" style={{ boxShadow: '0 0 0 1px rgba(36,31,33,0.13)', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between flex-shrink-0" style={{ marginBottom: '24px' }}>
        <img src="/icons/aspas.svg" alt="" width={48} height={46} />
        <button onClick={onClose} className="p-2 text-[#241f21] transition-colors hover:text-[#241f21]/60" style={{ border: '1px solid rgba(36,31,33,0.15)', borderRadius: '4px' }} aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
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
            <p className="leading-relaxed text-xl md:text-3xl font-medium" style={{ color: '#241f21' }}>
              {t?.fullContent}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
        <motion.div
          key={`attr-${expandedTestimonial}`}
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
          className="pt-4 md:pt-2 pb-4"
          style={{ flexShrink: 0 }}
        >
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#241f21', marginBottom: '1px' }}>{t?.name}</h4>
          <p style={{ fontSize: '15px', color: 'rgba(36,31,33,0.45)', letterSpacing: '0.02em' }}>{t?.role}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center gap-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(36,31,33,0.08)', paddingTop: '20px' }}>
        <button onClick={onPrev} className="p-2 text-[#241f21] transition-colors hover:text-[#241f21]/60" style={{ border: '1px solid rgba(36,31,33,0.15)', borderRadius: '4px' }} aria-label="Previous">
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          {testimonials.map(dot => (
            <button
              key={dot.id}
              onClick={() => onGoTo(dot.id)}
              className="rounded-full transition-all duration-300"
              style={{ height: '6px', width: dot.id === expandedTestimonial ? '24px' : '6px', backgroundColor: dot.id === expandedTestimonial ? '#241f21' : 'rgba(36,31,33,0.2)' }}
              aria-label={`Go to testimonial ${dot.id}`}
            />
          ))}
        </div>
        <button onClick={onNext} className="p-2 text-[#241f21] transition-colors hover:text-[#241f21]/60" style={{ border: '1px solid rgba(36,31,33,0.15)', borderRadius: '4px' }} aria-label="Next">
          <ChevronRight size={16} />
        </button>
      </div>
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
        className="relative bg-[#f2efea] pt-[80px] md:pt-[clamp(80px,10vw,140px)]"
        style={{
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
                  minHeight: 'clamp(320px, 40vw, 540px)',
                  height: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Quote icon */}
                <img src="/icons/aspas.svg" alt="" width={60} height={57} style={{ marginBottom: 'clamp(24px, 3vw, 40px)', flexShrink: 0 }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Quote area — height locked by the longest quote rendered as invisible ghost */}
                  <div style={{ position: 'relative', flex: 1 }}>
                    <p
                      aria-hidden="true"
                      style={{ fontSize: 'clamp(1.6rem, 3vw, 3rem)', lineHeight: 1.2, fontWeight: 500, visibility: 'hidden', pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {testimonials.reduce((a, b) => a.content.length >= b.content.length ? a : b).content}
                    </p>
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                      <AnimatePresence mode="popLayout" initial={false} custom={mobileDirection}>
                        <motion.p
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
                          style={{ fontSize: 'clamp(1.6rem, 3vw, 3rem)', lineHeight: 1.2, color: '#241f21', fontWeight: 500 }}
                        >
                          {testimonials[currentIndex].content}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* Name/role — outside quote animation so it stays at fixed position */}
                  <div style={{ flexShrink: 0, paddingTop: '12px', marginBottom: '20px', overflow: 'hidden' }}>
                    <AnimatePresence mode="popLayout" initial={false} custom={mobileDirection}>
                      <motion.div
                        key={`attr-${currentIndex}`}
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
                        <p style={{ fontSize: '18px', fontWeight: 600, color: '#241f21', marginBottom: '2px' }}>{testimonials[currentIndex].name}</p>
                        <p style={{ fontSize: '15px', color: 'rgba(36,31,33,0.45)', letterSpacing: '0.02em' }}>{testimonials[currentIndex].role}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(36,31,33,0.08)', paddingTop: '20px' }} onClick={e => e.stopPropagation()}>
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
              className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8"
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
                <div className="flex-1 overflow-y-auto min-h-0">
                  <ModalCard
                    expandedTestimonial={expandedTestimonial}
                    slideDirection={slideDirection}
                    onPrev={prevModal}
                    onNext={nextModal}
                    onClose={() => setExpandedTestimonial(null)}
                    onGoTo={(id) => {
                      const ci = testimonials.findIndex(x => x.id === expandedTestimonial)
                      const ti = testimonials.findIndex(x => x.id === id)
                      setSlideDirection(ti > ci ? 'right' : 'left')
                      setExpandedTestimonial(id)
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
