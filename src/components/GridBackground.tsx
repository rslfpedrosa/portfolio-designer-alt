'use client'

export default function GridBackground({ dark = false }: { dark?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={dark ? 'cf-dots-dark' : 'cf-dots'} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="0.75" fill={dark ? 'rgba(255,255,255,0.12)' : 'rgba(36,31,33,0.14)'} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={dark ? 'transparent' : 'white'} />
          <rect width="100%" height="100%" fill={`url(#${dark ? 'cf-dots-dark' : 'cf-dots'})`} />
        </svg>
      </div>
    </div>
  )
}
