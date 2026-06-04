'use client'

import { useEffect, useRef } from 'react'

export default function CursorBlob() {
  const blobRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -400, y: -400 })
  const current = useRef({ x: -400, y: -400 })
  const vel = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      const dx = target.current.x - current.current.x
      const dy = target.current.y - current.current.y

      vel.current.x = dx * 0.09
      vel.current.y = dy * 0.09

      current.current.x += vel.current.x
      current.current.y += vel.current.y

      if (blobRef.current) {
        const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2)
        const stretch = Math.min(speed * 1.8, 40)
        const angle = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI)
        const scaleX = 1 + stretch / 100
        const scaleY = 1 - stretch / 200

        blobRef.current.style.transform = [
          `translate(${current.current.x}px, ${current.current.y}px)`,
          `translate(-50%, -50%)`,
          `rotate(${angle}deg)`,
          `scale(${scaleX}, ${scaleY})`,
        ].join(' ')
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={blobRef}
      aria-hidden
      className="cursor-blob"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 160,
        height: 160,
        background: '#d9ee72',
        opacity: 0.5,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
        animation: 'blob-morph 7s ease-in-out infinite alternate',
      }}
    />
  )
}
