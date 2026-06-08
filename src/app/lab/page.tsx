'use client'

import ShowcaseCard from '@/components/ShowcaseCard'
import CTASection from '@/components/home/CTASection'
import GridBackground from '@/components/GridBackground'

const labItems = [
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
  backgroundImage: 'linear-gradient(to right, rgba(36,31,33,0.13) 50%, transparent 50%)',
  backgroundSize: '16px 1px',
  backgroundRepeat: 'repeat-x',
}

const LabPage = () => {
  return (
    <div className="pt-16 relative overflow-x-hidden" style={{ minHeight: '80vh', backgroundColor: '#000000' }}>

      <GridBackground />

      {/* Vertical dashed column lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-14 sm:pt-24 pb-6 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-px" style={dashedLine} />
        <div className="max-w-7xl mx-auto">
          <div className="text-left pl-6 sm:pl-8 lg:pl-16">
            <h1
              className="text-6xl sm:text-8xl font-medium mb-3 sm:mb-6 leading-none"
              style={{ color: '#241f21' }}
            >
              Sandbox
            </h1>
            <p className="text-xl max-w-3xl" style={{ color: 'rgba(36,31,33,0.5)' }}>
              Design explorations focused on craft, interaction, and curiosity.
            </p>
          </div>
        </div>
      </section>

      {/* Explorations */}
      <section className="relative z-10 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
          {labItems.map((item, index) => (
            <div key={item.id} className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-px pointer-events-none" style={dashedLine} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-px pointer-events-none" style={dashedLine} />
              <div className="relative z-10">
                <ShowcaseCard item={item} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  )
}

export default LabPage
