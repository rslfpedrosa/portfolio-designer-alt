'use client'

const verticalLine = (opacity: number) => ({
  backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,${opacity}) 50%, transparent 50%)`,
  backgroundSize: '1px 16px',
  backgroundRepeat: 'repeat-y' as const,
})

export default function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>

      {/* Dot pattern — wide container, bleeds past content edges */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1600px]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cf-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(255,255,255,0.10)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cf-dots)" />
        </svg>
      </div>

      {/* Center cover — same width as content, hides dots behind content leaving side strips */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl"
        style={{ backgroundColor: '#151414' }}
      />

      {/* Dashed vertical lines at content container edges */}
      <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
        <div className="absolute top-0 left-0 h-full w-px" style={verticalLine(0.15)} />
        <div className="absolute top-0 right-0 h-full w-px" style={verticalLine(0.15)} />
      </div>

      {/* Dashed vertical lines at outer dot container edges */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1600px]">
        <div className="absolute top-0 left-0 h-full w-px" style={verticalLine(0.15)} />
        <div className="absolute top-0 right-0 h-full w-px" style={verticalLine(0.15)} />
      </div>

    </div>
  )
}
