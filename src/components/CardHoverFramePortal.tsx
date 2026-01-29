'use client'

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
/** Below navbar (10001) and cursor (10002) so they stay on top */
const PORTAL_Z_INDEX = 1000

function FrameContent({ bounds }: { bounds: ViewportBounds }) {
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
          border: `${BORDER_WIDTH}px solid rgb(99 102 241)`,
          overflow: 'visible',
        }}
        className="dark:border-indigo-400"
      >
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            top: -SQUARE_OFFSET,
            left: -SQUARE_OFFSET,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
          }}
        />
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            top: -SQUARE_OFFSET,
            right: -SQUARE_OFFSET,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
          }}
        />
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            bottom: -SQUARE_OFFSET,
            left: -SQUARE_OFFSET,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
          }}
        />
        <div
          className="bg-indigo-500 dark:bg-indigo-400"
          style={{
            position: 'absolute',
            bottom: -SQUARE_OFFSET,
            right: -SQUARE_OFFSET,
            width: SQUARE_SIZE,
            height: SQUARE_SIZE,
          }}
        />
      </div>
    </div>
  )
}

export default function CardHoverFramePortal({ bounds, isVisible }: CardHoverFramePortalProps) {
  if (typeof document === 'undefined' || !bounds || !isVisible) {
    return null
  }

  return createPortal(<FrameContent bounds={bounds} />, document.body)
}
