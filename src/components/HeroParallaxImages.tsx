'use client'

import { useEffect, useRef, useCallback } from 'react'

export interface ParallaxImageDef {
  src: string
  left: string
  top: string
  width: number
  height: number
  rotation: number
}

interface Props {
  images: ParallaxImageDef[]
  entered?: boolean
}

// 9 simultaneous slots cycling through the full image pool
const ACTIVE = 9
const CYCLE = 5400 // ms per full animation per slot

function computeOffset(img: ParallaxImageDef, W: number, H: number) {
  return {
    dx: W / 2 - (parseFloat(img.left) / 100 * W + img.width / 2),
    dy: H / 2 - (parseFloat(img.top) / 100 * H + img.height / 2),
  }
}

export default function HeroParallaxImages({ images, entered = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const slotDivRefs = useRef<(HTMLDivElement | null)[]>([])
  const slotImgRefs = useRef<(HTMLImageElement | null)[]>([])

  // Which image index each slot is currently showing
  const slotIdxRef = useRef<number[]>(Array.from({ length: ACTIVE }, (_, s) => s % images.length))
  // How many full cycles each slot has completed (used to detect cycle boundary)
  const slotCycleRef = useRef<number[]>(new Array(ACTIVE).fill(0))
  // Precomputed center-to-landing-position vector per slot
  const slotOffsetRef = useRef<{ dx: number; dy: number }[]>([])
  const containerSizeRef = useRef({ W: 1440, H: 900 })

  const updateSize = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const { width: W, height: H } = rect
    containerSizeRef.current = { W, H }
    slotOffsetRef.current = slotIdxRef.current.map(idx => computeOffset(images[idx], W, H))
  }, [images])

  useEffect(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [updateSize])

  useEffect(() => {
    if (!entered) return

    const stagger = CYCLE / ACTIVE
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const { W, H } = containerSizeRef.current

      for (let s = 0; s < ACTIVE; s++) {
        const el = slotDivRefs.current[s]
        if (!el) continue

        const rawElapsed = elapsed - s * stagger
        const completedCycles = Math.floor(Math.max(0, rawElapsed) / CYCLE)

        // Swap image at the start of each new cycle (opacity is ~0 at this moment)
        if (completedCycles > slotCycleRef.current[s]) {
          slotCycleRef.current[s] = completedCycles
          const nextIdx = (s + completedCycles * ACTIVE) % images.length
          slotIdxRef.current[s] = nextIdx

          const next = images[nextIdx]
          const imgEl = slotImgRefs.current[s]
          if (imgEl) imgEl.src = next.src
          el.style.width = `${next.width}px`
          el.style.height = `${next.height}px`
          el.style.left = next.left
          el.style.top = next.top
          slotOffsetRef.current[s] = computeOffset(next, W, H)
        }

        const off = slotOffsetRef.current[s]
        if (!off) continue

        const img = images[slotIdxRef.current[s]]
        const phase = Math.max(0, rawElapsed % CYCLE) / CYCLE

        let dx: number, dy: number, scale: number

        if (phase <= 0.68) {
          // Approach: emerge from center, ease-in (accelerates as it gets "closer")
          const t = phase / 0.68
          const e = t * t
          dx = off.dx * (1 - e)
          dy = off.dy * (1 - e)
          scale = 0.1 + e * 0.9
        } else {
          // Exit: continue outward past the landing position and off-screen
          const t = (phase - 0.68) / 0.32
          dx = -off.dx * t
          dy = -off.dy * t
          scale = 1 + t * t * 0.9
        }

        let opacity: number
        if (phase < 0.07) opacity = phase / 0.07
        else if (phase < 0.78) opacity = 1
        else opacity = 1 - (phase - 0.78) / 0.22

        el.style.opacity = String(Math.max(0, Math.min(1, opacity)))
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${img.rotation}deg)`
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [entered, images])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: ACTIVE }, (_, s) => {
        const img = images[s % images.length]
        return (
          <div
            key={s}
            ref={el => { slotDivRefs.current[s] = el }}
            className="absolute rounded-2xl overflow-hidden"
            style={{
              left: img.left,
              top: img.top,
              width: img.width,
              height: img.height,
              opacity: 0,
              willChange: 'transform, opacity',
              boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            <img
              ref={el => { slotImgRefs.current[s] = el }}
              src={img.src}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </div>
        )
      })}
    </div>
  )
}
