'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import FigmaCursor from '@/components/FigmaCursor'
import CTASection from '@/components/home/CTASection'

// Conference Card Component with floating photos on hover
const ConferenceCard = ({
  conference,
  index
}: {
  conference: {
    name: string
    year: string
    location: string
    destination: string
    code: string
    destCode: string
    description: string
    gradient: string
    cardBg: string
    photos: string[]
  }
  index: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl shadow-soft hover:shadow-large transition-all overflow-visible"
      style={{ background: conference.cardBg }}
    >
      {/* Floating photos on hover */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <motion.div
          initial={{ x: -50, y: -25, rotate: -15, scale: 0, opacity: 0 }}
          animate={isHovered ? { 
            x: -150, 
            y: -80, 
            rotate: -12, 
            scale: 1, 
            opacity: 1 
          } : { 
            x: -50, 
            y: -25, 
            rotate: -15, 
            scale: 0, 
            opacity: 0 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-1/4 left-0 w-48 h-48 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10"
        >
          <img src={conference.photos[0]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>
        
        <motion.div
          initial={{ x: 50, y: 50, rotate: 15, scale: 0, opacity: 0 }}
          animate={isHovered ? { 
            x: 150, 
            y: 150, 
            rotate: 12, 
            scale: 1, 
            opacity: 1 
          } : { 
            x: 50, 
            y: 50, 
            rotate: 15, 
            scale: 0, 
            opacity: 0 
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="absolute bottom-1/4 right-0 w-48 h-48 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10"
        >
          <img src={conference.photos[1]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>
        
        <motion.div
          initial={{ y: -40, rotate: 8, scale: 0, opacity: 0 }}
          animate={isHovered ? { 
            y: -120, 
            rotate: 5, 
            scale: 1, 
            opacity: 1 
          } : { 
            y: -40, 
            rotate: 8, 
            scale: 0, 
            opacity: 0 
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-0 right-1/4 w-44 h-44 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10"
        >
          <img src={conference.photos[2]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Ticket-style design */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Perforated edge effect */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#151414] rounded-full -ml-2 z-10" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#151414] rounded-full -mr-2 z-10" />
        
        <motion.div 
          animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-br ${conference.gradient} p-8 text-white relative z-0`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm opacity-90 mb-1">{conference.location}</p>
              <div className="text-5xl font-medium">{conference.code}</div>
            </div>
            <motion.div
              animate={isHovered ? { x: 8 } : { x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Plane className="w-6 h-6 opacity-70" />
            </motion.div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">{conference.destination}</p>
              <div className="text-5xl font-medium">{conference.destCode}</div>
            </div>
          </div>
          
          <div className="border-t border-white/30 pt-4">
            <h3 className="text-2xl font-medium mb-2">{conference.name} '{conference.year}</h3>
          </div>
        </motion.div>
      </div>

      <div className="p-6 relative z-0">
        <p className="text-gray-300 leading-relaxed">
          {conference.description}
        </p>
      </div>
    </motion.div>
  )
}

// Bento joy cell with auto-play video
const BentoJoyCell = ({ joy, index }: { joy: { title: string; description: string; video: string }; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      className="relative overflow-visible"
    >
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
        <div
          key={corner}
          className="absolute w-3 h-3 z-20 rounded-sm"
          style={{
            backgroundColor: '#151414',
            border: '1px solid #312f2e',
            top: corner.startsWith('top') ? '-6px' : undefined,
            bottom: corner.startsWith('bottom') ? '-6px' : undefined,
            left: corner.endsWith('left') ? '-6px' : undefined,
            right: corner.endsWith('right') ? '-6px' : undefined,
          }}
        />
      ))}
      <div
        className="relative h-full flex flex-col bg-[#151414]"
        style={{ outline: '1px solid #312f2e', outlineOffset: '0px' }}
      >
        <div className="relative w-full overflow-hidden flex-shrink-0 bg-[#151414]" style={{ height: '320px' }}>
          <video
            ref={videoRef}
            src={joy.video}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="p-5 flex-1" style={{ borderTop: '1px solid #312f2e' }}>
          <h3 className="text-base font-medium text-white mb-1">{joy.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{joy.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

const JOYS = [
  { title: 'Beautiful, Overpriced Coffees', description: '€5 for vibes and foam art? Worth it.', video: '/videos/coffee.mp4' },
  { title: 'Falling in Love with Every Dog I Meet', description: 'Dogs are my weakness.', video: '/videos/dogs.mp4' },
  { title: 'Design Shop Wandering', description: 'My favorite kind of field trip.', video: '/videos/design-shop.mp4' },
  { title: "Nature's Biggest Fan", description: 'Trees, fresh air, no emails. Perfect.', video: '/videos/nature.mp4' },
  { title: 'Learning by Leaving', description: 'New cities. New ways of seeing.', video: '/videos/travel.mp4' },
]

const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start end', 'end end'] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Hide default cursor globally on desktop
  useEffect(() => {
    if (isDesktop) {
      document.body.style.cursor = 'none'
      return () => {
        document.body.style.cursor = ''
      }
    }
  }, [isDesktop])

  const timeline = [
    {
      year: '2024',
      period: '2024 – Present',
      location: 'Remote',
      title: 'Senior Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Leading end-to-end design for complex digital products, with a focus on healthcare and emerging technologies.',
      bullets: [
        'Facilitated design sprints and discovery workshops',
        'Designed scalable systems and end-to-end flows',
        'Bridged design, product, and engineering teams',
      ],
    },
    {
      year: '2022',
      period: '2022 – 2024',
      location: 'Remote',
      title: 'Mid Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Owned key product areas, contributing from early concepts to high-fidelity delivery.',
      bullets: [
        'Translated complex requirements into clear experiences',
        'Collaborated closely with engineers to ensure feasibility',
        'Improved usability across core product journeys',
      ],
    },
    {
      year: '2022',
      period: '2022',
      location: 'Remote',
      title: 'Junior Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Built a strong foundation in UX and UI across multiple projects and industries.',
      bullets: [
        'Supported user research',
        'Designed interfaces and interaction patterns',
        'Balanced user needs with business goals',
      ],
    },
    {
      year: '2020',
      period: '2020 – 2021',
      location: 'Lisbon, Portugal',
      title: 'UX & UI Specialization',
      company: 'Edit.',
      companyUrl: 'https://edit.com.pt',
      description: 'An intensive course focused on human-centered design, usability, and digital product strategy. I developed skills in user research, journey mapping, wireframing, and prototyping using modern tools and practices. As part of the final project, I collaborated with a team to redesign a real e-commerce experience for Fnac.pt, addressing key UX pain points and proposing data-informed improvements.',
    },
    {
      year: '2019',
      period: '2019',
      location: 'Coimbra, Portugal',
      title: 'Summer Internship',
      company: 'Whitesmith',
      companyUrl: 'https://whitesmith.co',
      description: 'During this internship, I took on the role of Product Owner for a self-initiated product idea. I led early-stage product discovery by conducting market research, user interviews, and questionnaires to validate the concept. This experience gave me a full view of the business side of product development, from identifying user pain points to shaping value propositions. It was a foundational moment that sparked my transition into product design.',
    },
    {
      year: '2017',
      period: '2017 – 2020',
      location: 'Coimbra, Portugal',
      title: 'Bachelor\'s in Design and Multimedia',
      company: 'University of Coimbra',
      companyUrl: 'https://www.uc.pt',
      description: 'A multidisciplinary design program with a strong digital focus. I explored everything from web development and interactive installations to motion graphics and game design. This broad foundation gave me both creative range and technical adaptability.',
    },
  ]

  const values = [
    {
      illustration: '/Me/Light bulb.svg',
      title: 'Clarity over complexity',
      description: 'I aim to make complex systems feel understandable and usable.',
    },
    {
      illustration: '/Me/Scribble.svg',
      title: 'Human-centered thinking',
      description: 'Decisions start with real user needs, not assumptions.',
    },
    {
      illustration: '/Me/Wave.svg',
      title: 'Collaboration by default',
      description: 'The best outcomes come from working closely with engineers and stakeholders.',
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-[#151414] relative overflow-x-hidden">
      {/* Grid background — matches home page GridBackground */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dot pattern — wide container, bleeds past content edges */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1600px]">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="0.75" fill="#312f2e" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-dots)" />
          </svg>
        </div>
        {/* Center cover — hides dots behind content, leaving side strips */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl" style={{ backgroundColor: '#151414' }} />
        {/* Dashed vertical lines at content container edges */}
        <div className="absolute inset-y-0 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
        {/* Dashed vertical lines at outer dot container edges */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1600px]">
          <div className="absolute top-0 left-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
          <div className="absolute top-0 right-0 h-full w-px" style={{ backgroundImage: 'linear-gradient(to bottom, #312f2e 50%, transparent 50%)', backgroundSize: '1px 16px', backgroundRepeat: 'repeat-y' }} />
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Horizontal rule just below the navbar */}
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        {/* Horizontal rule midway through bottom gap */}
        <div className="absolute bottom-12 sm:bottom-24 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        <div className="max-w-7xl mx-auto">
          <div className="relative h-px pointer-events-none mb-0">
            <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
          </div>
          {/* Cloudflare-style bordered card */}
          <div className="relative bg-[#151414]" style={{ outline: '1px solid #312f2e', outlineOffset: '0px' }}>
            {/* Outer corner squares */}
            {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
              <div
                key={corner}
                className="absolute w-3 h-3 z-20 rounded-sm"
                style={{
                  backgroundColor: '#151414',
                  border: '1px solid #312f2e',
                  top: corner.startsWith('top') ? '-6px' : undefined,
                  bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                  left: corner.endsWith('left') ? '-6px' : undefined,
                  right: corner.endsWith('right') ? '-6px' : undefined,
                }}
              />
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
              {/* Left: Photo — full bleed */}
              <div
                className="relative min-h-[280px] border-b lg:border-b-0 lg:border-r"
                style={{ borderColor: '#312f2e' }}
              >
                <img
                  src="/Me/IMG_0426.webp"
                  alt="Rita Pedrosa"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>

              {/* Right: Single section with internal dividers */}
              <div className="relative flex flex-col justify-center p-8 lg:px-10 lg:pb-10 lg:pt-20">
                {/* Corner squares at center-column junctions */}
                {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
                  <div
                    key={corner}
                    className="absolute w-3 h-3 z-20 rounded-sm"
                    style={{
                      backgroundColor: '#151414',
                      border: '1px solid #312f2e',
                      top: corner.startsWith('top') ? '-6px' : undefined,
                      bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                      left: corner.endsWith('left') ? '-6px' : undefined,
                      right: corner.endsWith('right') ? '-6px' : undefined,
                    }}
                  />
                ))}

                {/* Group 1: Name + subtitle */}
                <div className="pb-6">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-6xl sm:text-7xl font-medium text-white mb-3 flex items-center gap-1"
                  >
                    Hi, I&apos;m Rita
                    <img src="/Me/Sparkle.svg" alt="" className="w-16 h-16 inline-block rotate-45" />
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-xl sm:text-2xl text-gray-300 font-medium"
                  >
                    A Product Designer crafting clarity in complex products
                  </motion.p>
                </div>

                <div className="w-full h-px" style={{ backgroundColor: '#312f2e' }} />

                {/* Group 2: Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="py-6 text-base sm:text-lg text-gray-400 leading-relaxed"
                >
                  Over the past few years, I&apos;ve worked on end-to-end product experiences, from early discovery to final implementation, collaborating closely with cross-functional teams to turn ideas into meaningful, usable solutions.
                </motion.p>

                <div className="w-full h-px" style={{ backgroundColor: '#312f2e' }} />

                {/* Group 3: Highlights */}
                <ul className="text-base sm:text-lg text-white divide-y divide-white/10 pt-2">
                  {['4+ years designing complex digital products', 'Led design sprints with cross-functional teams', 'Focused on healthcare and AI-driven experiences'].map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                      className="py-3"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="relative z-[1] py-8 lg:pt-8 lg:pb-0 px-4 sm:px-6 lg:px-8">
        {/* Animated blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2), rgba(96,165,250,0.2))' }}
          animate={{ x: [0, 150, -50, 0], y: [0, -120, 80, 0], scale: [1, 1.3, 0.9, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2), rgba(59,130,246,0.2))' }}
          animate={{ x: [0, -180, 60, 0], y: [0, 120, -40, 0], scale: [1, 0.7, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.2), rgba(37,99,235,0.2))' }}
          animate={{ x: [0, 220, -80, 0], y: [0, -80, 100, 0], scale: [1, 1.15, 0.85, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
        />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-left sm:text-center mb-8 sm:mb-16"
          >
            <h2 className="text-[4rem] font-semibold text-white mb-6">
              My Design Philosophy
            </h2>
            <p className="text-xl text-gray-400 sm:max-w-3xl sm:mx-auto">
              Three core principles that guide every design decision I make
            </p>
          </motion.div>

          <div className="relative h-px pointer-events-none">
            <div className="absolute left-1/2 -translate-x-1/2 w-screen h-px" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true }}
                className="relative overflow-visible"
              >
                {/* Corner squares */}
                {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
                  <div
                    key={corner}
                    className="absolute w-3 h-3 z-20 rounded-sm"
                    style={{
                      backgroundColor: '#151414',
                      border: '1px solid #312f2e',
                      top: corner.startsWith('top') ? '-6px' : undefined,
                      bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                      left: corner.endsWith('left') ? '-6px' : undefined,
                      right: corner.endsWith('right') ? '-6px' : undefined,
                    }}
                  />
                ))}
                <div
                  className="relative bg-[#151414] p-8 h-full flex flex-col"
                  style={{ outline: '1px solid #312f2e', outlineOffset: '0px' }}
                >
                  <div className="mb-4">
                    <img src={value.illustration} alt="" className="w-20 h-20 object-contain" style={{ filter: 'brightness(0) invert(50%) sepia(100%) saturate(2000%) hue-rotate(183deg) brightness(92%)' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-left sm:text-center mb-8 sm:mb-16"
          >
            <h2 className="text-[4rem] font-semibold text-white mb-6 flex items-center justify-start sm:justify-center gap-3">
              My Journey
              <img src="/Me/Arrow.svg" alt="" className="w-20 h-20 inline-block" />
            </h2>
            <p className="text-xl text-gray-400">
              A path shaped by curiosity, ownership, and continuous learning
            </p>
          </motion.div>

          <div className="relative" ref={timelineRef}>
            {/* Timeline Line background */}
            <div className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-white/10" />
            {/* Timeline Line fill */}
            <motion.div
              className="absolute left-[9px] top-0 bottom-0 w-0.5 bg-blue-500 origin-top"
              style={{ scaleY: lineProgress }}
            />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year + item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  viewport={{ once: true }}
                  className="relative flex items-center gap-8"
                >
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 w-5 flex justify-center items-center">
                    <motion.div
                      className="w-[10px] h-[10px] rounded-full relative z-10"
                      initial={{ backgroundColor: 'rgba(255,255,255,0.15)', boxShadow: '0 0 0 3px rgba(59,130,246,0)' }}
                      whileInView={{ backgroundColor: 'rgb(59, 130, 246)', boxShadow: '0 0 0 3px rgba(59,130,246,0.25)' }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 relative overflow-visible">
                    {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
                      <div
                        key={corner}
                        className="absolute w-3 h-3 z-20 rounded-sm"
                        style={{
                          backgroundColor: '#151414',
                          border: '1px solid #312f2e',
                          top: corner.startsWith('top') ? '-6px' : undefined,
                          bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                          left: corner.endsWith('left') ? '-6px' : undefined,
                          right: corner.endsWith('right') ? '-6px' : undefined,
                        }}
                      />
                    ))}
                  <div
                    className="bg-[#151414] p-8 h-full"
                    style={{ outline: '1px solid #312f2e', outlineOffset: '0px' }}
                  >
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">
                        {item.period}{item.location && <span className="ml-3">·<span className="ml-3">{item.location}</span></span>}
                      </p>
                      <h3 className="text-xl font-medium text-white mb-1">
                        {item.title}
                        {item.company && (
                          <>
                            {' at '}
                            {item.companyUrl ? (
                              <a
                                href={item.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-gray-300 transition-colors"
                              >
                                {item.company}
                              </a>
                            ) : (
                              item.company
                            )}
                          </>
                        )}
                      </h3>
                    </div>
                    <p className="text-[1rem] text-gray-400 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    {'bullets' in item && item.bullets && item.bullets.length > 0 && (
                      <ul className="mb-4 space-y-1">
                        {item.bullets.map((bullet: string) => (
                          <li key={bullet} className="text-[1rem] text-gray-400 flex items-start gap-2">
                            <span className="mt-2 w-1 h-1 rounded-full bg-gray-500 flex-shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Small Joys Section */}
      <section className="relative z-[1] px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Header cell */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true }}
              className="relative overflow-visible"
            >
              {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
                <div
                  key={corner}
                  className="absolute w-3 h-3 z-20 rounded-sm"
                  style={{
                    backgroundColor: '#151414',
                    border: '1px solid #312f2e',
                    top: corner.startsWith('top') ? '-6px' : undefined,
                    bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                    left: corner.endsWith('left') ? '-6px' : undefined,
                    right: corner.endsWith('right') ? '-6px' : undefined,
                  }}
                />
              ))}
              <div
                className="relative p-8 lg:p-10 h-full flex flex-col justify-center bg-[#151414]"
                style={{ outline: '1px solid #312f2e', outlineOffset: '0px' }}
              >
                <img src="/Me/Vinyl.svg" alt="" className="w-14 h-14 mb-6" />
                <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight">
                  Small Joys, Big Inspiration
                </h2>
                <p className="text-base lg:text-lg text-gray-400 leading-relaxed">
                  These are the little things that refill my creative energy.
                </p>
              </div>
            </motion.div>

            {/* Joy cells */}
            {JOYS.map((joy, index) => (
              <BentoJoyCell key={joy.title} joy={joy} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Design Conferences Section */}
      <section className="relative pt-12 sm:pt-24 pb-20 sm:pb-40 px-4 sm:px-6 lg:px-8 bg-[#151414] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #312f2e 50%, transparent 50%)', backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-left sm:text-center mb-12 sm:mb-24"
          >
            <img src="/Me/Airplane.svg" alt="" className="w-28 h-28 sm:mx-auto mb-4" />
            <h2 className="text-[4rem] font-semibold text-white mb-6">
              Favourite Conferences I&apos;ve Attended
            </h2>
            <p className="text-xl text-gray-400 sm:max-w-3xl sm:mx-auto mb-2">
              Design Conferences are one of my favourite ways of being inspired and to learn from
              other companies and Designers. A great place for networking and become a better professional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'OFFF',
                year: '23',
                location: 'Lisbon, Portugal',
                destination: 'Barcelona, Spain',
                code: 'LIS',
                destCode: 'BCN',
                description: 'Drew inspiration from top creatives across motion, branding, and interactive design.',
                gradient: 'from-[#3372D6] to-[#1a3a8a]',
                cardBg: 'linear-gradient(to bottom right, #3372D6, #1a3a8a)',
                photos: [
                    '/conferences/offf-group.jpg',
                    '/conferences/offf-stage.jpg',
                    '/conferences/offf-badge.jpg'
                ]
              },
              {
                name: 'Design Matters',
                year: '24',
                location: 'Lisbon, Portugal',
                destination: 'Copenhagen, Denmark',
                code: 'LIS',
                destCode: 'CPH',
                description: 'Gained new perspectives on AI in product design, and learned from real-world case studies.',
                gradient: 'from-[#FE7747] to-[#c2410c]',
                cardBg: 'linear-gradient(to bottom right, #FE7747, #c2410c)',
                photos: [
                    '/conferences/dm-coffee.jpg',
                    '/conferences/dm-group.jpg',
                    '/conferences/dm-venue.jpg'
                ]
              },
            ].map((conference, index) => (
              <ConferenceCard key={conference.name} conference={conference} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CTASection isDesktop={isDesktop} />

      {/* Unified Figma Cursor */}
      <FigmaCursor
        label={null}
        showPill={false}
        shouldReduceMotion={shouldReduceMotion || false}
        isDesktop={isDesktop}
      />
    </div>
  )
}

export default AboutPage
