'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ViewportBounds {
  left: number
  top: number
  width: number
  height: number
}

export type HeroHoverVariant = 'rita' | 'design'

interface HeroHoverImagesProps {
  bounds: ViewportBounds | null
  isVisible: boolean
  photos: [string, string, string]
  variant: HeroHoverVariant
}

/** Above selection frame (99999) so images appear on top when they overlap */
const PORTAL_Z_INDEX = 100000
const GAP = 24
const GAP_ABOVE_TITLE = 0
const GAP_SIDE = 8
const GAP_BOTTOM_SIDE = 0
const IMG_W = 220
const IMG_H = 220
const IMG_W_SM = 200
const IMG_H_SM = 200
const ROTATE_1 = -12
const ROTATE_2 = 12
const ROTATE_3 = 5

function HoverImagesContent({
  bounds,
  photos,
  isVisible,
  variant,
}: {
  bounds: ViewportBounds
  photos: [string, string, string]
  isVisible: boolean
  variant: HeroHoverVariant
}) {
  const cx = bounds.left + bounds.width / 2
  const cy = bounds.top + bounds.height / 2
  const right = bounds.left + bounds.width
  const bottom = bounds.top + bounds.height
  const top = bounds.top

  // Image 1: always top center
  const aboveY = top - IMG_H - GAP_ABOVE_TITLE
  const x1 = cx - IMG_W / 2
  const y1 = aboveY

  // Image 2: rita = left (vertically centered), design = right (vertically centered)
  const belowY = bottom + GAP
  const leftX = bounds.left - IMG_W - GAP_SIDE
  const rightX = right + GAP_SIDE
  const x2 = variant === 'design' ? leftX : rightX
  const y2 = cy - IMG_H / 2

  // Image 3: always below center
  const x3 = cx - IMG_W_SM / 2
  const y3 = belowY

  return (
    <div
      role="presentation"
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-visible"
      style={{ zIndex: PORTAL_Z_INDEX }}
    >
      <div
        className="absolute rounded-xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-700 transition-[opacity,transform] duration-300 ease-out"
        style={{
          left: x1,
          top: y1,
          width: IMG_W,
          height: IMG_H,
          transform: `rotate(${ROTATE_1}deg) scale(${isVisible ? 1 : 0.92})`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <img src={photos[0].replace(',', '%2C')} alt="" className="w-full h-full object-cover" />
      </div>
      <div
        className="absolute rounded-xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-700 transition-[opacity,transform] duration-300 ease-out delay-75"
        style={{
          left: x2,
          top: y2,
          width: IMG_W,
          height: IMG_H,
          transform: `rotate(${ROTATE_2}deg) scale(${isVisible ? 1 : 0.92})`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <img src={photos[1].replace(',', '%2C')} alt="" className="w-full h-full object-cover" />
      </div>
      <div
        className="absolute rounded-xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-700 transition-[opacity,transform] duration-300 ease-out delay-150"
        style={{
          left: x3,
          top: y3,
          width: IMG_W_SM,
          height: IMG_H_SM,
          transform: `rotate(${ROTATE_3}deg) scale(${isVisible ? 1 : 0.92})`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <img src={photos[2].replace(',', '%2C')} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

export default function HeroHoverImages({ bounds, isVisible, photos, variant }: HeroHoverImagesProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || typeof document === 'undefined' || !bounds) {
    return null
  }

  return createPortal(
    <HoverImagesContent bounds={bounds} photos={photos} isVisible={isVisible} variant={variant} />,
    document.body
  )
}
