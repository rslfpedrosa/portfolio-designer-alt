'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ViewportBounds {
  left: number
  top: number
  width: number
  height: number
}

interface SelectionFramePortalProps {
  /** Viewport coordinates from getBoundingClientRect() */
  bounds: ViewportBounds | null
  isVisible: boolean
}

const HANDLE_SIZE = 8
const HANDLE_OFFSET = 4 // pixels outside the frame (half of HANDLE_SIZE)
const BORDER_WIDTH = 2
const PORTAL_Z_INDEX = 99999
const HOVER_SCALE = 1.03

function FrameContent({ bounds }: { bounds: ViewportBounds }) {
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
      {/* Frame box – fixed position at element location */}
      <div
        style={{
          position: 'fixed',
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
          boxSizing: 'border-box',
          border: `${BORDER_WIDTH}px solid rgb(99 102 241)`,
          overflow: 'visible',
          transformOrigin: 'center',
          transform: grown ? `scale(${HOVER_SCALE})` : 'scale(0.98)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
        className="dark:border-indigo-400"
      >
        {/* Corner squares – outside the frame so all 4 are visible */}
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            top: -HANDLE_OFFSET,
            left: -HANDLE_OFFSET,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
          }}
        />
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            top: -HANDLE_OFFSET,
            right: -HANDLE_OFFSET,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
          }}
        />
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            bottom: -HANDLE_OFFSET,
            left: -HANDLE_OFFSET,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
          }}
        />
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            bottom: -HANDLE_OFFSET,
            right: -HANDLE_OFFSET,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
          }}
        />
      </div>
    </div>
  )
}

export default function SelectionFramePortal({ bounds, isVisible }: SelectionFramePortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || typeof document === 'undefined' || !bounds || !isVisible) {
    return null
  }

  return createPortal(<FrameContent bounds={bounds} />, document.body)
}
