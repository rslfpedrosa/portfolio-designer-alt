'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const CYCLING_PHRASES = ["Hi, I'm Rita.", 'I Design.', 'I Simplify.', 'I Explore.', 'I Create.', 'I Prototype.', 'I Question.', 'I Iterate.']

interface StickyNote {
  id: string
  x: number
  y: number
  content: string
  color: string
  rotation: number
}

const STICKY_COLORS = ['#fff176', '#ffd6e0', '#b9fbc0', '#bde0fe', '#ffc8dd', '#fde68a']
const PEN_COLORS = ['#241f21', '#e03535', '#f07030', '#f0b830', '#38c060', '#5ba8e8', '#7040d0', '#ffffff']

const PEN_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M3 17 L7 13 L15 2 L18 5 L7 13 Z' fill='white' stroke='%23444' stroke-width='1.3' stroke-linejoin='round'/%3E%3Ccircle cx='3' cy='17' r='1.8' fill='%23333'/%3E%3C/svg%3E") 3 17, crosshair`
const ERASER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='16' viewBox='0 0 22 16'%3E%3Crect x='1' y='1' width='20' height='14' rx='3' fill='%23fce4ec' stroke='%23aaa' stroke-width='1.5'/%3E%3C/svg%3E") 11 8, cell`
const STAMP_CURSOR = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 13V8.5C14 7 15 7 15 5C15 4.20435 14.6839 3.44129 14.1213 2.87868C13.5587 2.31607 12.7956 2 12 2C11.2044 2 10.4413 2.31607 9.87868 2.87868C9.31607 3.44129 9 4.20435 9 5C9 7 10 7 10 8.5V13M5 22H19M20 15.5C20 14.837 19.7366 14.2011 19.2678 13.7322C18.7989 13.2634 18.163 13 17.5 13H6.5C5.83696 13 5.20107 13.2634 4.73223 13.7322C4.26339 14.2011 4 14.837 4 15.5V17C4 17.2652 4.10536 17.5196 4.29289 17.7071C4.48043 17.8946 4.73478 18 5 18H19C19.2652 18 19.5196 17.8946 19.7071 17.7071C19.8946 17.5196 20 17.2652 20 17V15.5Z' stroke='%23333' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 12 22, crosshair`

const STICKERS = [
  { name: '+1',          src: '/toolbox/stickers/+1.svg' },
  { name: 'Heart',       src: '/toolbox/stickers/Heart.svg' },
  { name: 'Star',        src: '/toolbox/stickers/Star.svg' },
  { name: 'Thumbs up',   src: '/toolbox/stickers/Thumbs up.svg' },
  { name: 'Thumbs down', src: '/toolbox/stickers/Thumbs down.svg' },
  { name: 'Question',    src: '/toolbox/stickers/Question.svg' },
  { name: 'Dot',         src: '/toolbox/stickers/Dot.svg' },
]

interface PlacedSticker {
  id: string
  x: number
  y: number
  src: string
  name: string
  rotation: number
}

function StampPicker({ onSelect }: { onSelect: (src: string, name: string) => void }) {
  const count = STICKERS.length
  const size = 216
  const cx = size / 2
  const cy = size / 2
  const outerR = 100
  const innerR = 26
  const stickerR = 65
  const angleStep = (2 * Math.PI) / count

  return (
    <motion.div
      initial={{ scale: 0.72, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.72, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.16))' }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <circle cx={cx} cy={cy} r={outerR} fill="white" />
        {Array.from({ length: count }).map((_, i) => {
          const angle = i * angleStep - Math.PI / 2
          const x1 = cx + innerR * Math.cos(angle)
          const y1 = cy + innerR * Math.sin(angle)
          const x2 = cx + outerR * Math.cos(angle)
          const y2 = cy + outerR * Math.sin(angle)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" />
        })}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={innerR} fill="#f5f5f4" stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
      </svg>

      {STICKERS.map((sticker, i) => {
        const angle = (i + 0.5) * angleStep - Math.PI / 2
        const x = cx + stickerR * Math.cos(angle)
        const y = cy + stickerR * Math.sin(angle)
        return (
          <button
            key={sticker.name}
            onClick={() => onSelect(sticker.src, sticker.name)}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              width: 44,
              height: 44,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'transform 0.12s ease',
              zIndex: 1,
              padding: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1.28)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1)' }}
          >
            <img src={sticker.src} alt={sticker.name} width={34} height={34} draggable={false} />
          </button>
        )
      })}
    </motion.div>
  )
}

interface HeroSectionProps {
  cursorLabel?: string | null
  showCursorPill?: boolean
  onLabelChange?: (label: string | null) => void
}

export default function HeroSection(_props: HeroSectionProps = {}) {
  const shouldReduceMotion = useReducedMotion()
  const [entered, setEntered] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isCycling, setIsCycling] = useState(false)
  const [phraseWidth, setPhraseWidth] = useState(0)
  const [waveDragging, setWaveDragging] = useState(false)
  const [scribbleDragging, setScribbleDragging] = useState(false)
  const [stickyDragging, setStickyDragging] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([])
  const [activeTool, setActiveTool] = useState<'cursor' | 'pen' | 'sticky' | 'stamp'>('cursor')
  const [penColor, setPenColor] = useState('#241f21')
  const [penMode, setPenMode] = useState<'draw' | 'erase'>('draw')
  const [showPenPopup, setShowPenPopup] = useState(false)
  const [showStampPicker, setShowStampPicker] = useState(false)
  const [stampPickerX, setStampPickerX] = useState<number | null>(null)
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [activeSticker, setActiveSticker] = useState<{ src: string, name: string } | null>(null)
  const activeStickerRef = useRef<{ src: string, name: string } | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isOverInteractiveEl, setIsOverInteractiveEl] = useState(false)
  const [mounted, setMounted] = useState(false)
  const stampButtonRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const lastPtRef = useRef<{ x: number; y: number } | null>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState('')
  const displayTextRef = useRef('')
  const animTimeoutsRef = useRef<NodeJS.Timeout[]>([])
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (shouldReduceMotion) {
      setEntered(true)
      return
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntered(true)
      })
    })
  }, [shouldReduceMotion])

  useEffect(() => {
    if (!entered) return
    let interval: NodeJS.Timeout
    const startDelay = setTimeout(() => {
      setIsCycling(true)
      interval = setInterval(() => {
        setPhraseIndex(i => (i + 1) % CYCLING_PHRASES.length)
      }, 5000)
    }, 1500)
    return () => {
      clearTimeout(startDelay)
      clearInterval(interval)
    }
  }, [entered])

  useLayoutEffect(() => {
    if (measureRef.current) {
      setPhraseWidth(measureRef.current.getBoundingClientRect().width + 16)
    }
  }, [displayText, entered])

  useEffect(() => {
    let t: NodeJS.Timeout
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (measureRef.current) setPhraseWidth(measureRef.current.getBoundingClientRect().width + 16)
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    if (!entered) return

    animTimeoutsRef.current.forEach(clearTimeout)
    animTimeoutsRef.current = []

    const target = CYCLING_PHRASES[phraseIndex]
    const current = displayTextRef.current
    const ERASE_SPEED = 110
    const TYPE_SPEED = 210
    let offset = 0

    for (let i = current.length - 1; i >= 0; i--) {
      const erased = current.slice(0, i)
      const delay = (current.length - 1 - i) * ERASE_SPEED
      const t = setTimeout(() => {
        displayTextRef.current = erased
        setDisplayText(erased)
      }, delay)
      animTimeoutsRef.current.push(t)
    }

    offset = current.length * ERASE_SPEED

    for (let i = 1; i <= target.length; i++) {
      const typed = target.slice(0, i)
      const t = setTimeout(() => {
        displayTextRef.current = typed
        setDisplayText(typed)
      }, offset + i * TYPE_SPEED)
      animTimeoutsRef.current.push(t)
    }

    return () => {
      animTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [phraseIndex, entered])

  // Size the canvas to cover the full document so strokes work anywhere on the page
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = document.documentElement.scrollWidth
    const h = document.documentElement.scrollHeight
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    canvas.width = w
    canvas.height = h
  }, [mounted])

  // Stop drawing when switching away from pen
  useEffect(() => {
    if (activeTool !== 'pen') {
      isDrawingRef.current = false
      lastPtRef.current = null
      setShowPenPopup(false)
    }
  }, [activeTool])

  // Keep ref in sync so the document click handler never reads stale state
  useEffect(() => { activeStickerRef.current = activeSticker }, [activeSticker])

  // Track cursor position globally so ghost previews are ready the instant a tool activates.
  // Also detect when hovering over interactive elements so the pen canvas and stamp ghost yield.
  useEffect(() => {
    const INTERACTIVE = 'a, button, input, textarea, select, [role="button"]'
    const onMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
      const els = document.elementsFromPoint(e.clientX, e.clientY)
      const interactive = els.some(el => {
        if (el === canvasRef.current) return false
        return el.matches(INTERACTIVE) || !!el.closest(INTERACTIVE)
      })
      setIsOverInteractiveEl(interactive)
      if (interactive) {
        isDrawingRef.current = false
        lastPtRef.current = null
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Clear active sticker when leaving stamp mode
  useEffect(() => {
    if (activeTool !== 'stamp') setActiveSticker(null)
  }, [activeTool])

  // Signal CursorBlob to swap to stamp icon when stamp tool is active
  useEffect(() => {
    if (activeTool === 'stamp') {
      window.dispatchEvent(new Event('cursor:stamp:start'))
      return () => { window.dispatchEvent(new Event('cursor:stamp:end')) }
    }
  }, [activeTool])

  // Document-level click handler — bypasses all z-index/stacking issues
  useEffect(() => {
    if (activeTool !== 'stamp') return
    const handleClick = (e: MouseEvent) => {
      if (!activeStickerRef.current) return
      if ((e.target as Element)?.closest('[data-stamp-ui]')) return
      if ((e.target as Element)?.closest('a, button, input, textarea, [role="button"]')) return
      const sticker: PlacedSticker = {
        id: `sticker-${Date.now()}-${Math.random()}`,
        x: e.pageX - 32,
        y: e.pageY - 32,
        src: activeStickerRef.current.src,
        name: activeStickerRef.current.name,
        rotation: (Math.random() - 0.5) * 18,
      }
      setPlacedStickers(prev => [...prev, sticker])
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [activeTool])

  function onCanvasMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    isDrawingRef.current = true
    setShowPenPopup(false)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const canvasRect = canvasRef.current!.getBoundingClientRect()
    const pt = { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top }
    lastPtRef.current = pt
    if (penMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,1)'
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = penColor
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function onCanvasMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !lastPtRef.current) return
    const canvasRect = canvasRef.current!.getBoundingClientRect()
    const pt = { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top }
    if (penMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.lineWidth = 24
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = penColor
      ctx.lineWidth = 2.5
    }
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lastPtRef.current.x, lastPtRef.current.y)
    ctx.lineTo(pt.x, pt.y)
    ctx.stroke()
    lastPtRef.current = pt
  }

  function onCanvasMouseUp() {
    isDrawingRef.current = false
    lastPtRef.current = null
  }

  function handleStickyClick(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect()
    const note: StickyNote = {
      id: `sticky-${Date.now()}`,
      x: e.clientX - (rect?.left ?? 0) - 86,
      y: e.clientY - (rect?.top ?? 0) - 74,
      content: '',
      color: STICKY_COLORS[stickyNotes.length % STICKY_COLORS.length],
      rotation: (Math.random() - 0.5) * 12,
    }
    setStickyNotes(prev => [...prev, note])
    setActiveTool('cursor')
  }

  function handleStickerSelect(src: string, name: string) {
    setActiveSticker({ src, name })
    setShowStampPicker(false)
    // stay in stamp mode so user can click to place
  }

  return (
    <>
    <section
      ref={sectionRef}
      data-cursor="hi-there"
      className="relative z-20 flex items-center justify-center"
      style={{
        minHeight: '100svh',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}
    >
      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.14)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-none text-center relative z-20" style={{ paddingTop: 'clamp(100px, 12vw, 160px)', paddingBottom: 'clamp(80px, 10vw, 120px)' }}>
        {/* Availability badge */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-1.5 h-1.5">
              <div className="status-dot-inner absolute inset-0 rounded-full" style={{ backgroundColor: '#3caa54' }} />
              <div className="status-dot-pulse absolute inset-0 rounded-full" style={{ backgroundColor: '#3caa54' }} />
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(36,31,33,0.45)',
              }}
            >
              Available for new projects
            </span>
          </div>
        </motion.div>

        {/* Headline with selection frames */}
        <div className="relative mb-8 lg:mb-10 overflow-visible">
          <h1
            ref={headlineRef}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tight text-[#241f21] leading-tight relative flex flex-wrap justify-center items-center gap-0 sm:gap-3 overflow-visible"
          >
              <motion.span
                id="hero-right"
                className="inline-block overflow-visible pt-1 pb-3"
                initial={shouldReduceMotion ? false : { x: '100vw', opacity: 0 }}
                animate={entered ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{ display: 'inline-block' }}
              >
                <span className="relative inline-block">
                  {/* Layout spacer: widest phrase, keeps container width fixed */}
                  <span className="invisible text-gradient whitespace-nowrap" aria-hidden>I Prototype.</span>

                  {/* Measurement span: currently typed text + cursor, used for frame width */}
                  <span
                    ref={measureRef}
                    className="absolute top-0 left-0 invisible whitespace-nowrap text-gradient pointer-events-none"
                    aria-hidden
                  >
                    {displayText}
                    {entered && (
                      <span style={{ display: 'inline-block', width: '2px', height: '0.8em', marginLeft: '2px', verticalAlign: 'middle' }} />
                    )}
                  </span>

                  {/* Animated phrase text */}
                  <span
                    className="absolute top-0 left-0 right-0 whitespace-nowrap text-center"
                    style={{ bottom: '-0.25em' }}
                  >
                    <span className="text-gradient">{displayText}</span>
                    {entered && (
                      <span
                        className="typewriter-cursor"
                        aria-hidden
                        style={{
                          display: 'inline-block',
                          width: '2px',
                          height: '0.8em',
                          backgroundColor: '#042d2b',
                          marginLeft: '2px',
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                  </span>

                  {/* Frame with smoothly animated width */}
                  {phraseWidth > 0 && (
                    <motion.span
                      className="absolute top-0 h-full pointer-events-none overflow-visible"
                      animate={{ width: phraseWidth, opacity: 1 }}
                      initial={{ width: phraseWidth, opacity: 0 }}
                      transition={{ width: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
                      style={{ border: '1px solid #0d99ff', left: '50%', translateX: '-50%' }}
                    >
                      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(corner => (
                        <span
                          key={corner}
                          className="absolute w-3 h-3 rounded-sm transition-colors duration-300"
                          style={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #0d99ff',
                            top: corner.startsWith('top') ? -6 : undefined,
                            bottom: corner.startsWith('bottom') ? -6 : undefined,
                            left: corner.endsWith('left') ? -6 : undefined,
                            right: corner.endsWith('right') ? -6 : undefined,
                          }}
                        />
                      ))}
                    </motion.span>
                  )}
                </span>
              </motion.span>
          </h1>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
          <motion.p
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'rgba(36,31,33,0.5)',
              maxWidth: '44ch',
              margin: '0 auto',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          >
            From AI platforms to healthcare products, I transform complexity into experiences people understand and enjoy using.
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        >
          <Link href="/projects">
            <div
              data-cursor="explore"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '17px',
                fontWeight: 500,
                color: '#241f21',
                background: 'transparent',
                border: '1px solid rgba(36,31,33,0.35)',
                borderRadius: '999px',
                padding: '10px 24px',
                transition: 'border-color 0.18s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#241f21')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(36,31,33,0.35)')}
            >
              View My Work
            </div>
          </Link>

          <Link href="/contact">
            <div
              data-cursor="say-hello"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '17px',
                fontWeight: 500,
                color: '#ffffff',
                background: '#0a99ff',
                border: '1px solid #0a99ff',
                borderRadius: '999px',
                padding: '10px 24px',
                transition: 'opacity 0.18s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Get In Touch
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.75 10.75V0.75H0.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Floating illustrations — draggable */}
      <motion.div
        drag
        dragMomentum={false}
        data-cursor="drag"
        className="absolute hidden md:block"
        style={{ top: '30vh', left: '73%', userSelect: 'none', zIndex: 25 }}
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : { opacity: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.4, duration: 0.8 }}
        whileDrag={{ scale: 1.08, zIndex: 50 }}
        onDragStart={() => { setWaveDragging(true); window.dispatchEvent(new Event('cursor:drag:start')) }}
        onDragEnd={() => { setWaveDragging(false); window.dispatchEvent(new Event('cursor:drag:end')) }}
      >
        <motion.div
          animate={entered && !shouldReduceMotion && !waveDragging ? { rotate: [-10, 18, -10, 18, -10] } : { rotate: 0 }}
          transition={{ delay: 1.4, duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
          style={{ transformOrigin: '60% 80%', display: 'inline-block' }}
        >
          <Image src="/hero/wave.svg" alt="" width={96} height={96} draggable={false} />
        </motion.div>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        data-cursor="drag"
        className="absolute hidden md:block"
        style={{ top: '76vh', left: '61%', userSelect: 'none', zIndex: 25 }}
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : { opacity: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.7, duration: 0.8 }}
        whileDrag={{ scale: 1.08, zIndex: 50 }}
        onDragStart={() => { setScribbleDragging(true); window.dispatchEvent(new Event('cursor:drag:start')) }}
        onDragEnd={() => { setScribbleDragging(false); window.dispatchEvent(new Event('cursor:drag:end')) }}
      >
        <motion.div
          animate={entered && !shouldReduceMotion && !scribbleDragging ? { y: [0, 8, 0] } : { y: 0 }}
          transition={{ delay: 1.7, duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image src="/hero/scribble.svg" alt="" width={100} height={100} draggable={false} />
        </motion.div>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        data-cursor="drag"
        className="absolute hidden md:block"
        style={{ top: '62vh', left: '20%', userSelect: 'none', zIndex: 25 }}
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : { opacity: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 2.0, duration: 0.8 }}
        whileDrag={{ scale: 1.08, zIndex: 50 }}
        onDragStart={() => { setStickyDragging(true); window.dispatchEvent(new Event('cursor:drag:start')) }}
        onDragEnd={() => { setStickyDragging(false); window.dispatchEvent(new Event('cursor:drag:end')) }}
      >
        <motion.div
          animate={entered && !shouldReduceMotion && !stickyDragging ? { y: [0, -8, 0] } : { y: 0 }}
          transition={{ delay: 2.0, duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image src="/hero/sticky.svg" alt="" width={84} height={84} draggable={false} />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : { opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 2.2, duration: 1.2, ease: 'easeOut' }}
          aria-hidden
        >
          <span
            style={{
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(36,31,33,0.3)',
            }}
          >
            Scroll
          </span>
          <div
            className="scroll-bob"
            style={{ width: '1px', height: '28px', backgroundColor: 'rgba(36,31,33,0.2)' }}
          />
        </motion.div>
      </div>

      {/* Sticky notes — absolute inside section, scroll with page */}
      {stickyNotes.map(note => (
        <motion.div
          key={note.id}
          drag
          dragMomentum={false}
          data-cursor="grab"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileDrag={{ scale: 1.04, zIndex: 60 }}
          onDragStart={() => window.dispatchEvent(new Event('cursor:grab:start'))}
          onDragEnd={() => window.dispatchEvent(new Event('cursor:grab:end'))}
          style={{
            position: 'absolute',
            left: note.x,
            top: note.y,
            width: '172px',
            minHeight: '148px',
            background: note.color,
            borderRadius: '3px',
            padding: '10px 10px 12px',
            boxShadow: '2px 6px 18px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.08)',
            rotate: note.rotation,
            zIndex: 40,
            cursor: 'grab',
            userSelect: 'none',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          {/* Sticky top bar */}
          <div style={{
            height: '28px',
            background: `color-mix(in srgb, ${note.color} 70%, #000 30%)`,
            borderRadius: '1px',
            margin: '-10px -10px 8px',
            opacity: 0.25,
          }} />
          <button
            onClick={() => setStickyNotes(prev => prev.filter(n => n.id !== note.id))}
            onPointerDown={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '5px',
              right: '7px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(0,0,0,0.45)',
              fontSize: '15px',
              lineHeight: 1,
              padding: '2px 4px',
              zIndex: 1,
            }}
            aria-label="Delete note"
          >×</button>
          <textarea
            autoFocus
            placeholder="Write a note…"
            value={note.content}
            onChange={e => setStickyNotes(prev => prev.map(n => n.id === note.id ? { ...n, content: e.target.value } : n))}
            onPointerDown={e => e.stopPropagation()}
            style={{
              width: '100%',
              height: '100px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '13px',
              lineHeight: 1.55,
              color: 'rgba(0,0,0,0.72)',
              fontFamily: 'inherit',
              cursor: 'text',
            }}
          />
        </motion.div>
      ))}


    </section>

    {/* Drawing canvas — portalled to body so it covers the full document and scrolls with the page */}
    {mounted && createPortal(
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 105,
          pointerEvents: activeTool === 'pen' && !isOverInteractiveEl ? 'auto' : 'none',
          cursor: activeTool === 'pen' && !isOverInteractiveEl
            ? (penMode === 'erase' ? ERASER_CURSOR : PEN_CURSOR)
            : 'default',
        }}
        onMouseDown={onCanvasMouseDown}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
        onMouseLeave={onCanvasMouseUp}
      />,
      document.body
    )}

    {/* Ghost sticker preview — follows cursor while in stamp mode with a sticker selected.
        Hidden over interactive elements so buttons show their normal cursor. */}
    {activeTool === 'stamp' && activeSticker && !isOverInteractiveEl && (
      <div
        style={{
          position: 'fixed',
          left: cursorPos.x - 32,
          top: cursorPos.y - 32,
          width: 64,
          height: 64,
          pointerEvents: 'none',
          zIndex: 625,
          opacity: 0.72,
        }}
      >
        <img src={activeSticker.src} alt={activeSticker.name} width={64} height={64} draggable={false} style={{ display: 'block', pointerEvents: 'none' }} />
      </div>
    )}

    {/* Sticky click overlay — captures clicks for note placement when sticky tool is active */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 595,
        pointerEvents: activeTool === 'sticky' ? 'auto' : 'none',
        cursor: 'none',
      }}
      onClick={handleStickyClick}
    />

    {/* Ghost sticky note preview — follows cursor while in sticky mode */}
    {activeTool === 'sticky' && (
      <div
        style={{
          position: 'fixed',
          left: cursorPos.x - 86,
          top: cursorPos.y - 74,
          width: '172px',
          minHeight: '148px',
          background: STICKY_COLORS[stickyNotes.length % STICKY_COLORS.length],
          borderRadius: '3px',
          padding: '10px 10px 12px',
          boxShadow: '2px 6px 18px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.08)',
          pointerEvents: 'none',
          zIndex: 625,
          opacity: 0.72,
        }}
      >
        <div style={{
          height: '28px',
          background: `color-mix(in srgb, ${STICKY_COLORS[stickyNotes.length % STICKY_COLORS.length]} 70%, #000 30%)`,
          borderRadius: '1px',
          margin: '-10px -10px 8px',
          opacity: 0.25,
        }} />
      </div>
    )}

    {/* Pen color + eraser popup — shown above toolbar when pen tool is active */}
    <AnimatePresence>
      {activeTool === 'pen' && showPenPopup && entered && (
        <motion.div
          key="pen-popup"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex"
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            x: '-50%',
            zIndex: 610,
            alignItems: 'center',
            gap: '2px',
            background: 'rgba(255,255,255,0.96)',
            borderRadius: '16px',
            padding: '8px 10px',
            boxShadow: '0 4px 28px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.07)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            userSelect: 'none',
          }}
        >
          {/* Pen draw sub-tool */}
          <button
            onClick={() => setPenMode('draw')}
            title="Pen"
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: penMode === 'draw' ? 'rgba(124,58,237,0.12)' : 'transparent',
              border: `1.5px solid ${penMode === 'draw' ? 'rgba(124,58,237,0.35)' : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s ease', flexShrink: 0,
            }}
          >
            <svg width="22" height="40" viewBox="0 0 22 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="1.5" width="8" height="6" rx="2" fill="#e8e8e8" stroke="#c8c8c8" strokeWidth="0.8"/>
              <rect x="7" y="7.5" width="8" height="3.5" fill="#bdbdbd" stroke="#a0a0a0" strokeWidth="0.6"/>
              <rect x="7" y="11" width="8" height="18" fill="#f5f0e8" stroke="#d4c8b0" strokeWidth="0.8"/>
              <path d="M7 29 L11 37 L15 29 Z" fill="#e8d5b0" stroke="#c8b890" strokeWidth="0.8"/>
              <path d="M9 34 L11 37 L13 34 Z" fill="#3a3a3a"/>
            </svg>
          </button>

          {/* Eraser sub-tool */}
          <button
            onClick={() => setPenMode('erase')}
            title="Eraser"
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: penMode === 'erase' ? 'rgba(124,58,237,0.12)' : 'transparent',
              border: `1.5px solid ${penMode === 'erase' ? 'rgba(124,58,237,0.35)' : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s ease', flexShrink: 0,
            }}
          >
            <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="7" width="26" height="16" rx="3" fill="#f5d5d5" stroke="#d0a0a0" strokeWidth="1.2"/>
              <rect x="2" y="7" width="10" height="16" rx="3" fill="#e8b8b8" stroke="#d0a0a0" strokeWidth="1.2"/>
              <line x1="2" y1="20" x2="28" y2="20" stroke="#d0a0a0" strokeWidth="1"/>
            </svg>
          </button>

          <div style={{ width: '1px', height: '26px', background: 'rgba(0,0,0,0.09)', margin: '0 4px', flexShrink: 0 }} />

          {/* Color swatches */}
          {PEN_COLORS.map((color, i) => (
            <button
              key={i}
              onClick={() => { setPenColor(color); setPenMode('draw') }}
              title={color}
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: color,
                border: penColor === color && penMode === 'draw'
                  ? '2.5px solid #7c3aed'
                  : color === '#ffffff' ? '1.5px solid rgba(0,0,0,0.15)' : '2.5px solid transparent',
                outline: penColor === color && penMode === 'draw' ? '2px solid white' : 'none',
                outlineOffset: '-4px',
                cursor: 'pointer', flexShrink: 0,
                transition: 'border-color 0.12s ease',
              }}
            />
          ))}

          {/* Custom color picker (rainbow) */}
          <label
            title="Custom color"
            style={{ width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          >
            <input
              ref={colorInputRef}
              type="color"
              value={penColor}
              onChange={e => { setPenColor(e.target.value); setPenMode('draw') }}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
            />
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
              border: '1.5px solid rgba(0,0,0,0.1)',
            }} />
          </label>

          <div style={{ width: '1px', height: '26px', background: 'rgba(0,0,0,0.09)', margin: '0 4px', flexShrink: 0 }} />

          {/* Clear all strokes */}
          <button
            onClick={() => {
              const canvas = canvasRef.current
              const ctx = canvas?.getContext('2d')
              if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
            }}
            title="Clear all"
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'transparent',
              border: '1.5px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s ease', flexShrink: 0,
              color: 'rgba(36,31,33,0.5)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(220,50,50,0.08)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,50,50,0.25)'
              ;(e.currentTarget as HTMLElement).style.color = '#dc3232'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = 'rgba(36,31,33,0.5)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4h12M6 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M13 4l-.867 8.2A1 1 0 0 1 11.14 13H4.86a1 1 0 0 1-.993-.8L3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Fixed bottom toolbar — desktop only */}
    <motion.div
      data-stamp-ui="true"
      className="hidden lg:flex"
      initial={{ opacity: 0, y: 16 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={shouldReduceMotion ? { duration: 0 } : { delay: 1.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        x: '-50%',
        zIndex: 600,
        alignItems: 'center',
        gap: '2px',
        background: 'rgba(255,255,255,0.96)',
        borderRadius: '16px',
        padding: '8px 10px',
        boxShadow: '0 4px 28px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.07)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        userSelect: 'none',
      }}
    >
      {/* Cursor tool */}
      <button
        onClick={() => { setActiveTool('cursor'); setActiveSticker(null) }}
        title="Select"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: activeTool === 'cursor' ? '#7c3aed' : 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (activeTool !== 'cursor') (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)' }}
        onMouseLeave={e => { if (activeTool !== 'cursor') (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3L15.5 9.2L10.5 10.9L8.2 16.8L5 3Z" fill={activeTool === 'cursor' ? 'white' : '#241f21'} stroke={activeTool === 'cursor' ? 'white' : '#241f21'} strokeWidth="0.6" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{ width: '1px', height: '26px', background: 'rgba(0,0,0,0.09)', margin: '0 4px', flexShrink: 0 }} />

      {/* Pen tool — click to activate/deactivate; popup appears above toolbar */}
      <button
        onClick={() => {
          if (activeTool === 'pen') {
            if (showPenPopup) {
              setActiveTool('cursor')
            } else {
              setShowPenPopup(true)
            }
          } else {
            setActiveTool('pen')
            setShowPenPopup(true)
          }
        }}
        title="Pen"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: activeTool === 'pen' ? '#7c3aed' : 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (activeTool !== 'pen') (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)' }}
        onMouseLeave={e => { if (activeTool !== 'pen') (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <svg width="26" height="46" viewBox="0 0 26 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="2" width="10" height="7" rx="2"
            fill={activeTool === 'pen' ? 'rgba(255,255,255,0.5)' : '#e8e8e8'}
            stroke={activeTool === 'pen' ? 'rgba(255,255,255,0.4)' : '#c8c8c8'} strokeWidth="0.8"/>
          <rect x="8" y="9" width="10" height="4"
            fill={activeTool === 'pen' ? 'rgba(255,255,255,0.35)' : '#bdbdbd'}
            stroke={activeTool === 'pen' ? 'rgba(255,255,255,0.3)' : '#a0a0a0'} strokeWidth="0.6"/>
          <rect x="8" y="13" width="10" height="22"
            fill={activeTool === 'pen' ? 'rgba(255,255,255,0.9)' : '#f5f0e8'}
            stroke={activeTool === 'pen' ? 'rgba(255,255,255,0.6)' : '#d4c8b0'} strokeWidth="0.8"/>
          <path d="M8 35 L13 44 L18 35 Z"
            fill={activeTool === 'pen' ? 'rgba(255,255,255,0.7)' : '#e8d5b0'}
            stroke={activeTool === 'pen' ? 'rgba(255,255,255,0.5)' : '#c8b890'} strokeWidth="0.8"/>
          <path d="M10.5 40 L13 44 L15.5 40 Z" fill={activeTool === 'pen' ? 'white' : '#3a3a3a'}/>
        </svg>
      </button>

      {/* Post-it / sticky note tool */}
      <button
        onClick={() => setActiveTool(activeTool === 'sticky' ? 'cursor' : 'sticky')}
        title="Add sticky note"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: activeTool === 'sticky' ? '#7c3aed' : 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (activeTool !== 'sticky') (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)' }}
        onMouseLeave={e => { if (activeTool !== 'sticky') (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="24" height="26" rx="2"
            fill={activeTool === 'sticky' ? 'rgba(255,255,255,0.3)' : '#aad4f0'}
            stroke={activeTool === 'sticky' ? 'rgba(255,255,255,0.4)' : '#88bbdf'} strokeWidth="0.8"/>
          <rect x="2" y="2" width="24" height="26" rx="2"
            fill={activeTool === 'sticky' ? 'rgba(255,255,255,0.9)' : '#d6eaf8'}
            stroke={activeTool === 'sticky' ? 'rgba(255,255,255,0.6)' : '#88bbdf'} strokeWidth="0.8"/>
          <path d="M18 2 L26 10 H19 Q18 10 18 9 Z"
            fill={activeTool === 'sticky' ? 'rgba(255,255,255,0.5)' : '#88bbdf'} opacity="0.75"/>
          <path d="M18 2 L26 10"
            stroke={activeTool === 'sticky' ? 'rgba(255,255,255,0.6)' : '#88bbdf'} strokeWidth="0.8"/>
          <line x1="7" y1="16" x2="21" y2="16"
            stroke={activeTool === 'sticky' ? 'rgba(255,255,255,0.7)' : '#88bbdf'} strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="7" y1="20" x2="17" y2="20"
            stroke={activeTool === 'sticky' ? 'rgba(255,255,255,0.7)' : '#88bbdf'} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      <div style={{ width: '1px', height: '26px', background: 'rgba(0,0,0,0.09)', margin: '0 4px', flexShrink: 0 }} />

      {/* Stamp tool */}
      <button
        ref={stampButtonRef}
        onClick={() => {
          if (activeTool === 'stamp' && showStampPicker) {
            setShowStampPicker(false)
            if (!activeSticker) setActiveTool('cursor')
          } else {
            setActiveTool('stamp')
            const rect = stampButtonRef.current?.getBoundingClientRect()
            if (rect) setStampPickerX(rect.left + rect.width / 2)
            setShowStampPicker(true)
          }
        }}
        title="Stamp"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: activeTool === 'stamp' ? '#7c3aed' : 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (activeTool !== 'stamp') (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = activeTool === 'stamp' ? '#7c3aed' : 'transparent' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 13V8.5C14 7 15 7 15 5C15 4.20435 14.6839 3.44129 14.1213 2.87868C13.5587 2.31607 12.7956 2 12 2C11.2044 2 10.4413 2.31607 9.87868 2.87868C9.31607 3.44129 9 4.20435 9 5C9 7 10 7 10 8.5V13M5 22H19M20 15.5C20 14.837 19.7366 14.2011 19.2678 13.7322C18.7989 13.2634 18.163 13 17.5 13H6.5C5.83696 13 5.20107 13.2634 4.73223 13.7322C4.26339 14.2011 4 14.837 4 15.5V17C4 17.2652 4.10536 17.5196 4.29289 17.7071C4.48043 17.8946 4.73478 18 5 18H19C19.2652 18 19.5196 17.8946 19.7071 17.7071C19.8946 17.5196 20 17.2652 20 17V15.5Z" stroke={activeTool === 'stamp' ? 'white' : '#3a3a3a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </motion.div>

    {/* Stamp picker backdrop */}
    {showStampPicker && (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 610 }}
        onClick={() => { setShowStampPicker(false); if (!activeSticker) setActiveTool('cursor') }}
      />
    )}

    {/* Stamp picker wheel */}
    <AnimatePresence>
      {showStampPicker && (
        <div
          data-stamp-ui="true"
          key="stamp-picker"
          style={{
            position: 'fixed',
            bottom: '104px',
            left: stampPickerX ?? '50%',
            transform: 'translateX(-50%)',
            zIndex: 620,
            pointerEvents: 'auto',
          }}
        >
          <StampPicker onSelect={handleStickerSelect} />
        </div>
      )}
    </AnimatePresence>

    {/* Placed stickers — rendered in a body portal so they appear on any section */}
    {mounted && createPortal(
      <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {placedStickers.map(sticker => (
          <motion.div
            key={sticker.id}
            drag
            dragMomentum={false}
            data-cursor="grab"
            initial={{ scale: 0, opacity: 0, rotate: sticker.rotation - 10 }}
            animate={{ scale: 1, opacity: 1, rotate: sticker.rotation }}
            whileDrag={{ scale: 1.12, zIndex: 9999 }}
            onDragStart={() => window.dispatchEvent(new Event('cursor:grab:start'))}
            onDragEnd={() => window.dispatchEvent(new Event('cursor:grab:end'))}
            style={{
              position: 'absolute',
              left: sticker.x,
              top: sticker.y,
              width: 64,
              height: 64,
              zIndex: 500,
              cursor: 'grab',
              userSelect: 'none',
              pointerEvents: 'auto',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <img src={sticker.src} alt={sticker.name} width={64} height={64} draggable={false} style={{ display: 'block' }} />
          </motion.div>
        ))}
      </div>,
      document.body
    )}
    </>
  )
}
