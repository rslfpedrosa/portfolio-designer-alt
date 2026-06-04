'use client'

import { motion } from 'framer-motion'
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
    <div className="min-h-screen pt-16 relative overflow-x-hidden" style={{ backgroundColor: '#f2efea' }}>

      <GridBackground />

      {/* Vertical dashed column lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(36,31,33,0.13) 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>

      {/* Hero */}
      <section className="pt-14 sm:pt-24 pb-6 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left pl-6 sm:pl-8 lg:pl-16"
          >
            <h1
              className="text-6xl sm:text-8xl font-medium mb-3 sm:mb-6 leading-none"
              style={{ color: '#241f21' }}
            >
              Sandbox
            </h1>
            <p className="text-xl max-w-3xl" style={{ color: 'rgba(36,31,33,0.5)' }}>
              Design explorations focused on craft, interaction, and curiosity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Explorations */}
      <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
          {labItems.map((item, index) => (
            <div key={item.id}>
              <div className="relative h-px pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={dashedLine} />
              </div>
              <ShowcaseCard
                item={item}
                index={index}
              />
              <div className="relative h-px pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={dashedLine} />
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
