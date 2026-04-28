'use client'

import { useEffect, useState, memo } from 'react'
import { createPortal } from 'react-dom'

export interface ViewportBounds {
  left: number
  top: number
  width: number
  height: number
}

interface CardHoverFramePortalProps {
  bounds: ViewportBounds | null
  isVisible: boolean
}

const SQUARE_SIZE = 8
const SQUARE_OFFSET = 4
const BORDER_WIDTH = 2
const PORTAL_Z_INDEX = 1000
const HOVER_SCALE = 1.03

const FrameContent = memo<{ bounds: ViewportBounds }>(({ bounds }) => {
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      role="presentation"
      aria-hidden
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: PORTAL_Z_INDEX,
      }}
    >
      <div
        style={{
          position: 'fixed',
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
          boxSizing: 'border-box',
          border: `${BORDER_WIDTH}px solid #0f8be8`,
          overflow: 'visible',
          transformOrigin: 'center',
          transform: grown ? `scale(${HOVER_SCALE})` : 'scale(0.98)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <div style={{ position: 'absolute', top: -SQUARE_OFFSET, left: -SQUARE_OFFSET, width: SQUARE_SIZE, height: SQUARE_SIZE, backgroundColor: '#0f8be8' }} />
        <div style={{ position: 'absolute', top: -SQUARE_OFFSET, right: -SQUARE_OFFSET, width: SQUARE_SIZE, height: SQUARE_SIZE, backgroundColor: '#0f8be8' }} />
        <div style={{ position: 'absolute', bottom: -SQUARE_OFFSET, left: -SQUARE_OFFSET, width: SQUARE_SIZE, height: SQUARE_SIZE, backgroundColor: '#0f8be8' }} />
        <div style={{ position: 'absolute', bottom: -SQUARE_OFFSET, right: -SQUARE_OFFSET, width: SQUARE_SIZE, height: SQUARE_SIZE, backgroundColor: '#0f8be8' }} />
      </div>
    </div>
  )
})

FrameContent.displayName = 'FrameContent'

export default function CardHoverFramePortal({ bounds, isVisible }: CardHoverFramePortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || typeof document === 'undefined' || !bounds || !isVisible) {
    return null
  }

  return createPortal(<FrameContent bounds={bounds} />, document.body)
}
