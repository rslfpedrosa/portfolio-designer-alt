'use client'

import { useEffect, useRef } from 'react'

interface FigmaCursorProps {
  label: string | null
  showPill: boolean
  shouldReduceMotion: boolean
  isDesktop: boolean
}

export default function FigmaCursor({ label, showPill, shouldReduceMotion, isDesktop }: FigmaCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const mouseXRef = useRef<number>(0)
  const mouseYRef = useRef<number>(0)
  const cursorXRef = useRef<number>(0)
  const cursorYRef = useRef<number>(0)
  const hasMousePositionRef = useRef<boolean>(false)
  const rafIdRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    if (!isDesktop) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX
      mouseYRef.current = e.clientY

      if (!hasMousePositionRef.current) {
        cursorXRef.current = mouseXRef.current
        cursorYRef.current = mouseYRef.current
        hasMousePositionRef.current = true
        if (cursorRef.current) {
          cursorRef.current.style.display = 'block'
          cursorRef.current.style.transform = `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`
        }
      }
    }

    // Throttled animation loop - ~60fps
    const animate = (timestamp: number) => {
      if (!cursorRef.current || !hasMousePositionRef.current) {
        rafIdRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle to ~60fps (16.67ms)
      if (timestamp - lastUpdateRef.current < 16) {
        rafIdRef.current = requestAnimationFrame(animate)
        return
      }
      lastUpdateRef.current = timestamp

      if (shouldReduceMotion) {
        cursorXRef.current = mouseXRef.current
        cursorYRef.current = mouseYRef.current
      } else {
        // Smooth lerp
        const lerp = 0.3
        cursorXRef.current += (mouseXRef.current - cursorXRef.current) * lerp
        cursorYRef.current += (mouseYRef.current - cursorYRef.current) * lerp
      }

      cursorRef.current.style.transform = `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`
      rafIdRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [isDesktop, shouldReduceMotion])

  // Animate pill appearance
  useEffect(() => {
    if (!pillRef.current || !label) return

    if (showPill && label) {
      pillRef.current.style.opacity = '1'
      pillRef.current.style.transform = 'scale(1) translateY(0)'
    } else {
      pillRef.current.style.opacity = '0'
      pillRef.current.style.transform = 'scale(0.8) translateY(-4px)'
    }
  }, [showPill, label, shouldReduceMotion])

  if (!isDesktop) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[999999] will-change-transform"
      style={{
        display: hasMousePositionRef.current ? 'block' : 'none',
        transform: `translate3d(${cursorXRef.current}px, ${cursorYRef.current}px, 0)`,
      }}
    >
      <div className="relative" style={{ transform: 'translate(2px, 2px)' }}>
        {/* Figma cursor arrow */}
        <svg 
          width="20" 
          height="22" 
          viewBox="0 0 144 159" 
          fill="none" 
          className="absolute -top-3 -left-1.5 text-indigo-600 dark:text-indigo-400"
        >
          <path
            d="M32.1753 150.405C21.3357 104.423 6.46159 40.2274 0.218053 9.72129C-1.32121 2.20039 5.56282 -2.44979 12.2294 1.35683L138.377 73.3872C146.115 77.8056 144.646 89.3743 136.049 91.7188L86.8595 105.134C84.6005 105.75 82.6292 107.14 81.2894 109.06L50.0785 153.796C45.1371 160.878 34.1568 158.811 32.1753 150.405Z"
            fill="currentColor"
          />
        </svg>
        {/* Pill label */}
        {label && (
          <span 
            ref={pillRef}
            className="bg-indigo-600 dark:bg-indigo-500 text-white text-base font-semibold px-4 py-2 rounded-full whitespace-nowrap shadow-lg inline-block mt-1 ml-2"
            style={{
              opacity: 0,
              transform: 'scale(0.8) translateY(-4px)',
              transition: shouldReduceMotion ? 'none' : 'opacity 200ms ease-out, transform 200ms ease-out',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
