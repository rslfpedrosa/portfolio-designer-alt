'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

const photos = [
  { src: '/conferences/dm-group.jpg', alt: 'Rita at a conference', rotate: -11, x: -90, y: 20, z: 1, hoverRotate: -24, hoverX: -195, hoverY: 40, w: 260, h: 346 },
  { src: '/random/dog-mom.webp', alt: 'Rita with her dog', rotate: -2, x: 0, y: -15, z: 3, hoverRotate: -2, hoverX: 0, hoverY: -60, w: 310, h: 412 },
  { src: '/conferences/offf-group.jpg', alt: 'Rita at OFFF conference', rotate: 9, x: 90, y: 20, z: 2, hoverRotate: 22, hoverX: 195, hoverY: 40, w: 260, h: 346 },
]

export default function AboutPreview() {
  return (
    <section className="relative" style={{ background: '#ffffff', paddingTop: 'clamp(80px, 9vh, 96px)', paddingBottom: 'clamp(40px, 5vh, 80px)' }}>
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-dots)" />
        </svg>
      </div>
      {/* Horizontal dashed lines aligned with panel top/bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px pointer-events-none" style={{ top: 'clamp(80px, 9vh, 96px)', backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x', zIndex: 2 }} />
      <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px pointer-events-none" style={{ bottom: 'clamp(40px, 5vh, 80px)', backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x', zIndex: 2 }} />
      {/* Vertical dashed lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} aria-hidden>
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 8px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 8px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 3 }}>
        <div className="max-w-7xl mx-auto">

          {/* Wrapper — corners and border live here */}
          <div
            className="relative"
            style={{ isolation: 'isolate' }}
          >
            {/* Figma component label */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: 0,
                display: 'flex', alignItems: 'center', gap: 6,
                color: '#9747FF',
                zIndex: 50, pointerEvents: 'none',
              }}
            >
              <img src="/icons/component.svg" alt="" width={14} height={14} style={{ display: 'block' }} />
              <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1 }}>About Me</span>
            </div>

            {/* Corner squares */}
            {CORNERS.map(corner => (
              <div
                key={corner}
                className="absolute w-3 h-3 z-20 rounded-sm"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #9747FF',
                  top: corner.startsWith('top') ? '-6px' : undefined,
                  bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                  left: corner.endsWith('left') ? '-6px' : undefined,
                  right: corner.endsWith('right') ? '-6px' : undefined,
                }}
              />
            ))}

            {/* Panel background */}
            <div
              className="absolute inset-0"
              style={{
                background: '#ffffff',
                boxShadow: '0 0 0 1.5px #9747FF',
                zIndex: 1,
              }}
            />

            {/* Grid */}
            <div
              className="relative grid grid-cols-1 lg:grid-cols-2 items-center"
              style={{ minHeight: 'clamp(400px, 45vw, 580px)', zIndex: 2 }}
            >
              {/* Left — fanned photos */}
              <div
                className="relative flex items-center justify-center order-2 lg:order-1"
                style={{ minHeight: 'clamp(300px, 34vw, 460px)' }}
              >
                <Link href="/about" className="block" style={{ cursor: 'pointer' }}>
                  <div className="scale-[0.6] sm:scale-100 -my-[92px] sm:my-0">
                  <motion.div
                    className="relative"
                    style={{ width: '420px', height: '460px' }}
                    initial="initial"
                    whileHover="hovered"
                  >
                    {photos.map((photo) => (
                      <motion.div
                        key={photo.src}
                        className="absolute overflow-hidden"
                        variants={{
                          initial: { rotate: photo.rotate, x: photo.x, y: photo.y, scale: 1 },
                          hovered: { rotate: photo.hoverRotate, x: photo.hoverX, y: photo.hoverY, scale: 1.04 },
                        }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          width: `${photo.w}px`,
                          height: `${photo.h}px`,
                          borderRadius: '16px',
                          zIndex: photo.z,
                          top: '50%',
                          left: '50%',
                          marginTop: `${-photo.h / 2}px`,
                          marginLeft: `${-photo.w / 2}px`,
                          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
                        }}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          sizes={`${photo.w}px`}
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                  </div>
                </Link>
              </div>

              {/* Right — editorial text */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                className="order-1 lg:order-2 flex flex-col justify-center"
                style={{ padding: 'clamp(48px, 6vw, 96px) clamp(28px, 5vw, 80px)' }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(2rem, 3.8vw, 4.5rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.05,
                    color: '#151414',
                    marginBottom: 'clamp(20px, 2.5vw, 32px)',
                  }}
                >
                  Design is about{' '}
                  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', verticalAlign: 'top' }}>
                    <span>connection</span>
                    <img src="/icons/line.svg" alt="" style={{ width: '100%', height: 'auto', marginTop: '-2px', filter: 'brightness(0)' }} />
                  </span>
                </h2>

                <p
                  style={{
                    fontSize: '18px',
                    lineHeight: 1.8,
                    color: 'rgba(36,31,33,0.55)',
                    maxWidth: '44ch',
                    marginBottom: 'clamp(28px, 3.5vw, 48px)',
                  }}
                >
                  I believe great design starts with deeply understanding the people behind the product.
                  It&apos;s about creating experiences that feel intuitive, meaningful, and genuinely useful in real life.
                </p>

                <Link href="/about" data-cursor="meet-rita">
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '17px',
                      fontWeight: 500,
                      color: '#151414',
                      background: 'transparent',
                      border: '1px solid rgba(36,31,33,0.5)',
                      borderRadius: '999px',
                      padding: '10px 24px',
                      transition: 'border-color 0.18s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(36,31,33,0.9)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(36,31,33,0.5)')}
                  >
                    How I approach design
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
