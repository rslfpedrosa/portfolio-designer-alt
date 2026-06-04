'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const PILLS = [
  { label: 'Need a workshop?',          color: '#d9ee72', textColor: '#1e3300' },
  { label: 'Exploring AI?',             color: '#c4b5fd', textColor: '#3b0764' },
  { label: 'Early-stage idea?',         color: '#fca5a5', textColor: '#7f1d1d' },
  { label: 'Product redesign?',         color: '#93c5fd', textColor: '#1e3a5f' },
  { label: 'Looking for a designer?',   color: '#fde68a', textColor: '#713f12' },
  { label: 'Product feeling complex?',  color: '#a7f3d0', textColor: '#064e3b' },
  { label: 'Low user adoption?',        color: '#fdba74', textColor: '#7c2d12' },
  { label: 'High drop-off rates?',      color: '#f9a8d4', textColor: '#831843' },
  { label: 'Redesigning a workflow?',   color: '#6ee7b7', textColor: '#064e3b' },
  { label: 'Building for humans?',      color: '#bfdbfe', textColor: '#1e3a5f' },
  { label: 'Simplifying the experience?', color: '#ddd6fe', textColor: '#3b0764' },
  { label: 'Improving onboarding?',     color: '#fef08a', textColor: '#713f12' },
  { label: 'Creating better journeys?', color: '#fda4af', textColor: '#881337' },
  { label: 'Making it intuitive?',      color: '#86efac', textColor: '#14532d' },
  { label: 'Designing for trust?',      color: '#7dd3fc', textColor: '#0c4a6e' },
]

// Shared style used for both measurement and rendered pills — must be identical
const PILL_STYLE: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '0.01em',
  padding: '13px 26px',
  borderRadius: '10px',
  whiteSpace: 'nowrap',
  lineHeight: '1',
  display: 'inline-block',
}

export default function PhysicsPills({ isInView }: { isInView: boolean }) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const measureRef     = useRef<HTMLDivElement>(null)
  const pillRefs       = useRef<(HTMLDivElement | null)[]>([])
  const sizesRef       = useRef<{ w: number; h: number }[]>([])
  const runnerRef   = useRef<any>(null)
  const engineRef   = useRef<any>(null)
  const MRef        = useRef<any>(null)
  const cleanupRef  = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)
  const didInit = useRef(false)
  const [activePills, setActivePills] = useState<typeof PILLS | null>(null)

  // Phase 0 — pick pill count based on viewport (sync before paint)
  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768
    setActivePills(isMobile ? PILLS.slice(0, Math.ceil(PILLS.length / 2)) : PILLS)
  }, [])

  // Phase 1 — measure real pill DOM sizes before touching physics
  useLayoutEffect(() => {
    if (!activePills || !measureRef.current) return
    sizesRef.current = Array.from(measureRef.current.children).map(el => ({
      w: (el as HTMLElement).offsetWidth,
      h: (el as HTMLElement).offsetHeight,
    }))
    setReady(true)
  }, [activePills])

  // Phase 2 — init physics once measured + section is visible
  useEffect(() => {
    if (!ready || !isInView || !containerRef.current || didInit.current || !activePills) return
    didInit.current = true

    const container = containerRef.current
    const W = container.offsetWidth
    const H = container.offsetHeight

    const timeouts: ReturnType<typeof setTimeout>[] = []

    import('matter-js').then(M => {
      MRef.current = M
      const { Engine, Runner, Bodies, World, Mouse, MouseConstraint, Events } = M

      const engine = Engine.create({ gravity: { y: 2.5 } })
      engineRef.current = engine

      // Static boundary walls
      const WALL = 80
      const floor     = Bodies.rectangle(W / 2,        H + WALL / 2, W + WALL * 2, WALL,  { isStatic: true, friction: 0.6 })
      const leftWall  = Bodies.rectangle(-WALL / 2,    H / 2,        WALL,         H * 4, { isStatic: true })
      const rightWall = Bodies.rectangle(W + WALL / 2, H / 2,        WALL,         H * 4, { isStatic: true })
      World.add(engine.world, [floor, leftWall, rightWall])

      // Create pill bodies — drop from random x positions above the container
      const bodies: any[] = []
      activePills.forEach((_, i) => {
        const { w, h } = sizesRef.current[i] ?? { w: 140, h: 31 }
        const x = w / 2 + 8 + Math.random() * Math.max(0, W - w - 16)
        const body = Bodies.rectangle(x, -h - i * 80, w, h, {
          chamfer:     { radius: 10 },
          restitution: 0.3,
          friction:    0.25,
          density:     0.003,
          frictionAir: 0.02,
          angle:       (Math.random() - 0.5) * 0.4,
        })
        bodies.push(body)

        // Stagger each pill's entry into the world
        const t = setTimeout(() => {
          World.add(engine.world, body)
          const el = pillRefs.current[i]
          if (el) {
            el.style.opacity = '1'
            el.style.transition = 'opacity 0.12s'
          }
        }, i * 180)
        timeouts.push(t)
      })

      // Container mouse — coordinates are always correct for in-container clicks.
      const mouse = Mouse.create(container)

      // Remove Matter's wheel capture so the page can still scroll
      ;['mousewheel', 'DOMMouseScroll', 'wheel'].forEach(ev => {
        container.removeEventListener(ev, (mouse as any).mousewheel)
      })

      // Remove Matter's touch capture so mobile touch-scroll still works
      container.removeEventListener('touchstart', (mouse as any).mousedown)
      container.removeEventListener('touchmove',  (mouse as any).mousemove)
      container.removeEventListener('touchend',   (mouse as any).mouseup)

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.15, render: { visible: false } },
      })
      World.add(engine.world, mc)

      // Window-level supplements: when the cursor leaves the container mid-drag,
      // the container's own listeners stop firing. These keep position updating
      // and ensure mouseup is always received so the pill falls back with gravity.
      const onWindowMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        ;(mouse as any).position.x = Math.max(0, Math.min(W, e.clientX - rect.left))
        ;(mouse as any).position.y = Math.max(0, Math.min(H, e.clientY - rect.top))
        ;(mouse as any).sourceEvents.mousemove = e
      }
      const onWindowUp = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        ;(mouse as any).position.x = Math.max(0, Math.min(W, e.clientX - rect.left))
        ;(mouse as any).position.y = Math.max(0, Math.min(H, e.clientY - rect.top))
        ;(mouse as any).button = -1
        ;(mouse as any).sourceEvents.mouseup = e
      }
      window.addEventListener('mousemove', onWindowMove)
      window.addEventListener('mouseup',   onWindowUp)

      Events.on(mc, 'startdrag', () => {
        document.body.style.cursor = 'grabbing'
        window.dispatchEvent(new CustomEvent('cursor:drag:start'))
      })
      Events.on(mc, 'enddrag', () => {
        document.body.style.cursor = ''
        window.dispatchEvent(new CustomEvent('cursor:drag:end'))
      })

      Events.on(engine, 'afterUpdate', () => {
        bodies.forEach((body, i) => {
          const el = pillRefs.current[i]
          if (!el) return
          const { w, h } = sizesRef.current[i] ?? { w: 140, h: 31 }
          el.style.transform =
            `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`
        })
      })

      const runner = Runner.create()
      runnerRef.current = runner
      Runner.run(runner, engine)

      cleanupRef.current = () => {
        window.removeEventListener('mousemove', onWindowMove)
        window.removeEventListener('mouseup',   onWindowUp)
        M.Runner.stop(runner)
        M.Engine.clear(engine)
        M.World.clear(engine.world, false)
      }
    })

    return () => {
      timeouts.forEach(clearTimeout)
      cleanupRef.current?.()
    }
  }, [ready, isInView, activePills])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
      aria-hidden
    >
      {/* Hidden measurement pass — identical styles give accurate body dimensions */}
      <div
        ref={measureRef}
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', top: 0, left: 0 }}
      >
        {(activePills ?? []).map(pill => (
          <div key={pill.label} style={PILL_STYLE}>{pill.label}</div>
        ))}
      </div>

      {/* Physics-driven pill divs — positions updated imperatively via afterUpdate */}
      {(activePills ?? []).map((pill, i) => (
        <div
          key={pill.label}
          ref={el => { pillRefs.current[i] = el }}
          data-cursor="drag"
          style={{
            ...PILL_STYLE,
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            color: pill.textColor,
            backgroundColor: pill.color,
            userSelect: 'none',
            cursor: 'grab',
          }}
        >
          {pill.label}
        </div>
      ))}
    </div>
  )
}
