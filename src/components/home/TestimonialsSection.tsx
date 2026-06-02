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
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" style={{ color: 'rgba(217,238,114,0.7)' }}>
              <path d="M10 20C10 14.477 14.477 10 20 10V14C16.686 14 14 16.686 14 20H18V28H10V20Z" fill="currentColor"/>
              <path d="M24 20C24 14.477 28.477 10 34 10V14C30.686 14 28 16.686 28 20H32V28H24V20Z" fill="currentColor"/>
            </svg>
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
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  // Mobile carousel
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mobileDirection, setMobileDirection] = useState<'left' | 'right'>('right')

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
          padding: 'clamp(64px, 8vw, 120px) 0',
          borderTop: '1px solid rgba(36,31,33,0.08)',
        }}
      >
        <div
          className="relative z-10"
          style={{ padding: '0 clamp(24px, 5vw, 80px)' }}
        >
          {/* Section header */}
          <div
            className="flex items-end justify-between"
            style={{ marginBottom: 'clamp(40px, 5vw, 72px)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <p className="section-label" style={{ marginBottom: '12px' }}>Peer Feedback</p>
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
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true }}
              style={{
                fontSize: 'clamp(13px, 1.1vw, 15px)',
                lineHeight: 1.7,
                color: 'rgba(36,31,33,0.45)',
                maxWidth: '32ch',
                textAlign: 'right',
              }}
              className="hidden md:block"
            >
              Feedback from colleagues and collaborators I&apos;ve worked closely with.
            </motion.p>
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid grid-cols-3" style={{ borderTop: '1px solid rgba(36,31,33,0.08)' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                onClick={() => setExpandedTestimonial(t.id)}
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: 'pointer',
                  borderRight: i < 2 ? '1px solid rgba(36,31,33,0.08)' : 'none',
                  borderBottom: '1px solid rgba(36,31,33,0.08)',
                  transition: 'background-color 0.35s ease',
                  backgroundColor: hoveredId === t.id ? 'rgba(36,31,33,0.03)' : 'transparent',
                }}
              >
                <div
                  className="flex flex-col h-full"
                  style={{ padding: 'clamp(28px, 3vw, 48px)' }}
                >
                  {/* Quote mark */}
                  <div style={{ marginBottom: '24px' }}>
                    <svg
                      width="28" height="20" viewBox="0 0 28 20" fill="none"
                      style={{ color: hoveredId === t.id ? 'rgba(217,238,114,0.8)' : 'rgba(36,31,33,0.18)', transition: 'color 0.35s ease' }}
                    >
                      <path d="M0 20V12C0 5.373 4.477 1 11 1V5C7.686 5 5 7.686 5 11H9V20H0ZM16 20V12C16 5.373 20.477 1 27 1V5C23.686 5 21 7.686 21 11H25V20H16Z" fill="currentColor"/>
                    </svg>
                  </div>

                  <p
                    className="flex-1"
                    style={{
                      fontSize: 'clamp(14px, 1.15vw, 17px)',
                      lineHeight: 1.75,
                      color: hoveredId === t.id ? 'rgba(36,31,33,0.9)' : 'rgba(36,31,33,0.65)',
                      marginBottom: '32px',
                      transition: 'color 0.35s ease',
                    }}
                  >
                    &ldquo;{t.content}&rdquo;
                  </p>

                  <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(36,31,33,0.08)' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#241f21', marginBottom: '3px' }}>{t.name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(36,31,33,0.4)', letterSpacing: '0.04em' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: single card, text crossfades */}
          <div className="md:hidden" style={{ borderTop: '1px solid rgba(36,31,33,0.08)' }}>
            <motion.div
              layout
              transition={{ layout: { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 } }}
              className="flex flex-col overflow-hidden"
              style={{ padding: '28px 0 24px' }}
            >
              <div style={{ marginBottom: '18px' }}>
                <svg width="24" height="18" viewBox="0 0 28 20" fill="none" style={{ color: 'rgba(217,238,114,0.5)' }}>
                  <path d="M0 20V12C0 5.373 4.477 1 11 1V5C7.686 5 5 7.686 5 11H9V20H0ZM16 20V12C16 5.373 20.477 1 27 1V5C23.686 5 21 7.686 21 11H25V20H16Z" fill="currentColor"/>
                </svg>
              </div>
                <AnimatePresence mode="popLayout" initial={false} custom={mobileDirection}>
                  <motion.div
                    key={currentIndex}
                    layout
                    custom={mobileDirection}
                    variants={{
                      enter: (d: string) => ({ x: d === 'right' ? 40 : -40, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: string) => ({ x: d === 'right' ? -40 : 40, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
                  >
                    <p style={{ fontSize: '16px', lineHeight: 1.75, color: 'rgba(36,31,33,0.75)', marginBottom: '24px', fontWeight: 500 }}>
                      &ldquo;{testimonials[currentIndex].content}&rdquo;
                    </p>
                    <div style={{ paddingTop: '18px', borderTop: '1px solid rgba(36,31,33,0.08)' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#241f21', marginBottom: '3px' }}>{testimonials[currentIndex].name}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(36,31,33,0.4)' }}>{testimonials[currentIndex].role}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <div className="flex items-center justify-center gap-3 pt-4 pb-2">
                <button onClick={prevMobile} className="p-2 text-[#241f21] transition-colors hover:text-[#241f21]/60" style={{ border: '1px solid rgba(36,31,33,0.15)', borderRadius: '4px' }} aria-label="Previous">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => { if (!isAnimating) { setIsAnimating(true); setMobileDirection(index > currentIndex ? 'right' : 'left'); setCurrentIndex(index); setTimeout(() => setIsAnimating(false), 350) } }}
                      className="rounded-full transition-all duration-300"
                      style={{ height: '6px', width: index === currentIndex ? '24px' : '6px', backgroundColor: index === currentIndex ? '#241f21' : 'rgba(36,31,33,0.2)' }}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <button onClick={nextMobile} className="p-2 text-[#241f21] transition-colors hover:text-[#241f21]/60" style={{ border: '1px solid rgba(36,31,33,0.15)', borderRadius: '4px' }} aria-label="Next">
                  <ChevronRight size={16} />
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
