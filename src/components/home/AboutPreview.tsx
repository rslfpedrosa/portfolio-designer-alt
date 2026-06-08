'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const photos = [
  { src: '/random/hobbies.webp', alt: 'Rita with friends outdoors', rotate: -11, x: -90, y: 20, z: 1, hoverRotate: -24, hoverX: -195, hoverY: 40, w: 260, h: 346 },
  { src: '/random/dog-mom.webp', alt: 'Rita with her dog', rotate: -2, x: 0, y: -15, z: 3, hoverRotate: -2, hoverX: 0, hoverY: -60, w: 310, h: 412 },
  { src: '/random/dumpling.webp', alt: 'Rita with friends', rotate: 9, x: 90, y: 20, z: 2, hoverRotate: 22, hoverX: 195, hoverY: 40, w: 260, h: 346 },
]

export default function AboutPreview() {
  return (
    <section className="relative" style={{ background: '#ffffff', padding: 'clamp(24px, 4vw, 48px) 0' }}>
      {/* Dot pattern — fills the full section including gutters and bottom padding */}
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
      <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px pointer-events-none" style={{ top: 'clamp(24px, 4vw, 48px)', backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x', zIndex: 2 }} />
      <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px pointer-events-none" style={{ bottom: 'clamp(24px, 4vw, 48px)', backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x', zIndex: 2 }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} aria-hidden>
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>

      {/* Dark panel between the vertical dashed lines */}
      <div className="absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto" style={{ top: 'clamp(24px, 4vw, 48px)', bottom: 'clamp(24px, 4vw, 48px)', background: '#151414', borderRadius: '20px', zIndex: 1 }} />

      <div className="px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 3 }}>
      <div className="max-w-7xl mx-auto">
      <div
        className="relative grid grid-cols-1 lg:grid-cols-2 items-center"
        style={{ minHeight: 'clamp(400px, 45vw, 580px)' }}
      >
        {/* Left — fanned photos */}
        <div
          className="relative flex items-center justify-center order-2 lg:order-1"
          style={{ minHeight: 'clamp(300px, 34vw, 460px)' }}
        >
          <Link href="/about" className="block" style={{ cursor: 'pointer' }}>
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
              color: '#ffffff',
              marginBottom: 'clamp(20px, 2.5vw, 32px)',
            }}
          >
            Design is about{' '}
            <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', verticalAlign: 'top' }}>
              <span>connection</span>
              <img src="/icons/line.svg" alt="" style={{ width: '100%', height: 'auto', marginTop: '-2px', filter: 'brightness(0) invert(1)' }} />
            </span>
          </h2>

          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.5)',
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
                background: '#ffffff',
                border: '1px solid rgba(36,31,33,0.5)',
                borderRadius: '999px',
                padding: '10px 24px',
                transition: 'border-color 0.18s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#151414')}
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
    </section>
  )
}
