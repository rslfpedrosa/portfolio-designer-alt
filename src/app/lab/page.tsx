'use client'

import ShowcaseCard from '@/components/ShowcaseCard'
import CTASection from '@/components/home/CTASection'
import GridBackground from '@/components/GridBackground'

const labItems = [
  {
    id: 8,
    type: 'image',
    media: '/explorations/petunia.webp',
    description: 'Petunia — a visual exploration of organic form and texture through digital craft.',
    tags: ['Figma'],
  },
  {
    id: 7,
    type: 'video',
    media: '/explorations/hello-Post.webm',
    description: 'Post interaction motion study — exploring micro-animation and feedback timing.',
    tags: ['Figma'],
  },
  {
    id: 1,
    type: 'video',
    media: '/explorations/exploration-1.mp4',
    description: 'Exploration of fluid micro-interactions and gesture-driven navigation patterns.',
    tags: ['Figma', 'Protopie'],
  },
  {
    id: 2,
    type: 'image',
    media: '/explorations/23126508_195.webp',
    description: 'Visual direction study around typography hierarchy and spatial composition.',
    tags: ['Figma'],
  },
  {
    id: 3,
    type: 'image',
    media: '/explorations/012-2.webp',
    description: 'Colour and layout system exploration for a data-dense dashboard interface.',
    tags: ['Figma'],
  },
  {
    id: 4,
    type: 'video',
    media: '/explorations/exploration-2.mp4',
    description: 'Animated onboarding flow testing progressive disclosure and motion timing.',
    tags: ['Figma', 'After Effects'],
  },
  {
    id: 5,
    type: 'video',
    media: '/explorations/exploration-3.mp4',
    description: 'Component-level interaction study for a real-time collaboration feature.',
    tags: ['Framer', 'Figma'],
  },
  {
    id: 6,
    type: 'video',
    media: '/explorations/exploration-4.mp4',
    description: 'Scroll-driven storytelling experiment with layered depth and parallax cues.',
    tags: ['Framer'],
  },
]

const dashedLine = {
  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)',
  backgroundSize: '16px 1px',
  backgroundRepeat: 'repeat-x',
}

const dashedLineV = {
  backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 50%, transparent 50%)',
  backgroundSize: '1px 16px',
  backgroundRepeat: 'repeat-y',
}

const LabPage = () => {
  return (
    <div className="pt-16 relative overflow-x-hidden" style={{ minHeight: '80vh', backgroundColor: '#0a0a0a' }}>

      <GridBackground dark />

      {/* Vertical dashed column lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden>
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={dashedLineV} />
          <div className="absolute top-0 right-0 h-full w-px" style={dashedLineV} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-14 sm:pt-24 pb-6 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-left pl-6 sm:pl-8 lg:pl-16">
            <h1
              className="font-medium leading-none mb-3 sm:mb-6"
              style={{ fontSize: 'clamp(56px, 10vw, 120px)', color: '#ffffff' }}
            >
              Sandbox
            </h1>
            <p className="text-xl max-w-3xl" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Design explorations focused on craft, interaction, and curiosity.
            </p>
          </div>
        </div>
      </section>

      {/* Explorations */}
      <section className="relative z-10 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
          {/* Centre column dashed lines (desktop only) */}
          <div className="absolute inset-y-0 w-px pointer-events-none hidden lg:block" style={{ zIndex: 20, left: 'calc(50% - 1.5rem)', ...dashedLineV }} />
          <div className="absolute inset-y-0 w-px pointer-events-none hidden lg:block" style={{ zIndex: 20, left: 'calc(50% + 1.5rem)', ...dashedLineV }} />

          <div className="flex flex-col gap-y-6 sm:gap-y-10">
            {Array.from({ length: Math.ceil(labItems.length / 2) }, (_, rowIndex) => {
              const rowItems = labItems.slice(rowIndex * 2, rowIndex * 2 + 2)
              return (
                <div key={rowIndex}>
                  <div className="relative pointer-events-none" style={{ height: 1, zIndex: 20 }}>
                    <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={dashedLine} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
                    {rowItems.map(item => <ShowcaseCard key={item.id} item={item} />)}
                  </div>
                  <div className="relative pointer-events-none" style={{ height: 1, zIndex: 20 }}>
                    <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={dashedLine} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}

export default LabPage
