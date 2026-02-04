'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomCursorProps {
  isDesktop: boolean
  shouldReduceMotion: boolean
}

export default function CustomCursor({ isDesktop, shouldReduceMotion }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [hoverText, setHoverText] = useState('')
  const rafRef = useRef<number>()
  const cursorRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!isDesktop || shouldReduceMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      // Smooth follow with easing
      cursorRef.current.x += (targetRef.current.x - cursorRef.current.x) * 0.15
      cursorRef.current.y += (targetRef.current.y - cursorRef.current.y) * 0.15

      setPosition({
        x: cursorRef.current.x,
        y: cursorRef.current.y,
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    // Check for hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check for specific hover areas with data attributes
      const hoverArea = target.closest('[data-cursor-text]') as HTMLElement
      if (hoverArea) {
        setIsHovering(true)
        setHoverText(hoverArea.getAttribute('data-cursor-text') || '')
        return
      }

      // Check for clickable elements
      const clickable = target.closest('a, button, [role="button"]')
      if (clickable && !clickable.closest('.custom-cursor-ignore')) {
        const text = clickable.getAttribute('aria-label') || 
                     clickable.getAttribute('title') || 
                     'Click'
        setIsHovering(true)
        setHoverText(text)
      } else {
        setIsHovering(false)
        setHoverText('')
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    rafRef.current = requestAnimationFrame(animate)

    // Hide default cursor
    document.body.style.cursor = 'none'

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.style.cursor = 'auto'
    }
  }, [isDesktop, shouldReduceMotion])

  if (!isDesktop || shouldReduceMotion) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100000] mix-blend-normal"
      style={{
        x: position.x,
        y: position.y,
      }}
    >
      <motion.div
        className="relative"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
        initial={false}
      >
        {/* Small circle outline (default state) */}
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-purple-500"
          initial={false}
          animate={{
            opacity: isHovering ? 0 : 1,
            scale: isHovering ? 0 : 1,
          }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        
        {/* Large filled circle with text */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: 'translate(-50%, -50%)',
          }}
          initial={false}
          animate={{
            scale: isHovering ? 1 : 0,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center p-4 shadow-lg shadow-purple-500/30">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovering ? 1 : 0 }}
              transition={{
                duration: 0.2,
                delay: isHovering ? 0.15 : 0,
              }}
              className="text-white font-medium text-sm text-center leading-tight"
            >
              {hoverText}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
