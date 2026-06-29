'use client'

const CARDS = [
  '/explorations/petunia.webp',
  '/projects/Bocca/cover.webp',
  '/explorations/23126508_195.webp',
  '/projects/Cortado/collage.webp',
  '/explorations/012-2.webp',
  '/explorations/Smart-Reply.webp',
  '/projects/Onyx/Stanford.webp',
  '/projects/Bocca/2.webp',
]

const CENTER_I = 4       // Math.floor(8 / 2)
const CARD_W = 248
const CARD_H = 390
const X_STEP = 248       // px between card centers along world X
const ANGLE_STEP = 16    // rotateY degrees per step

export default function SandboxCarousel() {
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {/* 3D perspective scene */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: '1100px',
          perspectiveOrigin: '50% 56%',
          overflow: 'hidden',
        }}
      >
        {CARDS.map((src, i) => {
          const offset = i - CENTER_I
          const angle = offset * ANGLE_STEP
          const zIndex = CENTER_I - Math.abs(offset) + 1

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(50% + ${offset * X_STEP}px - ${CARD_W / 2}px)`,
                bottom: 0,
                width: CARD_W,
                height: CARD_H,
                transform: `rotateY(${angle}deg)`,
                borderRadius: 16,
                overflow: 'hidden',
                zIndex,
                boxShadow: '0 20px 56px rgba(0,0,0,0.75), 0 4px 14px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </div>
          )
        })}
      </div>

      {/* Gradient fades — all fade to the page's dark background color */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '55%',
        background: 'linear-gradient(to top, #000000 25%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '30%',
        background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, #000000 0%, transparent 18%, transparent 82%, #000000 100%)',
      }} />
    </div>
  )
}
