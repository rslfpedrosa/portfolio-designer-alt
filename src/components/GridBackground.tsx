'use client'

export default function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>

      {/* Dot pattern — wide container, bleeds past content edges */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1600px]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cf-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill="rgba(36,31,33,0.10)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cf-dots)" />
        </svg>
      </div>

      {/* Center cover — same width as content, hides dots behind content leaving side strips */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl"
        style={{ backgroundColor: '#f2efea' }}
      />

    </div>
  )
}
