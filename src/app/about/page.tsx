'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Plane, ChevronLeft, ChevronRight } from 'lucide-react'
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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#171717] rounded-full -ml-2 z-10" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#171717] rounded-full -mr-2 z-10" />
        
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

// Video Card Component with auto-play when in viewport
const VideoCard = ({ joy, index }: { joy: { title: string; description: string; video: string }; index: number }) => {
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
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      className="relative w-full h-full group cursor-pointer"
    >
      <div className="relative bg-[#1e1e1e] rounded-2xl shadow-soft hover:shadow-large transition-all overflow-hidden h-full flex flex-col">
        {/* Video container */}
        <div className="relative w-full h-96 bg-gray-800 overflow-hidden rounded-t-2xl flex-shrink-0">
          <video
            ref={videoRef}
            src={joy.video}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Enhanced gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Text below video - always readable */}
        <div className="p-6 bg-[#1e1e1e] flex-1">
          <h3 className="text-xl font-medium mb-2 text-white">
            {joy.title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {joy.description}
          </p>
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

const CAROUSEL_GAP = 24

const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start end', 'end end'] })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 })
  const [containerWidth, setContainerWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // Track viewport breakpoint for carousel layout decisions
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setBreakpoint(w >= 1024 ? 'desktop' : w >= 640 ? 'tablet' : 'mobile')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Measure container for dynamic card sizing
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth))
    ro.observe(el)
    setContainerWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const visibleCards = breakpoint === 'desktop' ? 3 : breakpoint === 'tablet' ? 2 : 1
  const cardWidthPx = containerWidth > 0
    ? visibleCards === 1
      ? containerWidth * 0.88                                              // mobile: slight peek
      : (containerWidth - CAROUSEL_GAP * (visibleCards - 1)) / visibleCards  // tablet/desktop: fill evenly
    : 280
  const stepPx = cardWidthPx + CAROUSEL_GAP
  const maxCarouselIndex = Math.max(0, JOYS.length - visibleCards)

  const carouselGoTo = (i: number) => {
    setActiveIndex(Math.max(0, Math.min(maxCarouselIndex, i)))
  }

  // Reset position when layout changes (e.g. resize crosses a breakpoint)
  useEffect(() => {
    setActiveIndex(0)
  }, [visibleCards])

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
    <div className="min-h-screen pt-16 bg-[#171717]">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch mb-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative order-2 lg:order-1"
            >
              <div className="w-full h-full min-h-[24rem] rounded-2xl overflow-hidden shadow-large">
                <img
                  src="/Me/IMG_0426.webp"
                  alt="Rita Pedrosa"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <div className="space-y-6 order-1 lg:order-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-5xl sm:text-6xl font-medium text-white mb-2 flex items-center gap-1"
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
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-base sm:text-lg text-gray-400 leading-relaxed"
              >
                Over the past few years, I&apos;ve worked on end-to-end product experiences, from early discovery to final implementation, collaborating closely with cross-functional teams to turn ideas into meaningful, usable solutions.
              </motion.p>

              {/* Highlights */}
              <ul className="text-base sm:text-lg text-white divide-y divide-white/10">
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
      </section>

      {/* Design Philosophy */}
      <section className="relative py-8 lg:pb-24 px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              My Design Philosophy
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Three core principles that guide every design decision I make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true }}
                className="relative"
              >
                <div
                  className="relative bg-[#1e1e1e] rounded-2xl p-8 h-full flex flex-col"
                  style={{ outline: '1px solid rgba(255,255,255,0.08)', outlineOffset: '0px' }}
                >
                  <div className="mb-4">
                    <img src={value.illustration} alt="" className="w-20 h-20 object-contain" />
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
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-3">
              My Journey
              <img src="/Me/Arrow.svg" alt="" className="w-20 h-20 inline-block" />
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
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
                  className="relative flex items-start gap-8"
                >
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 w-5 flex justify-center items-start pt-6">
                    <motion.div
                      className="w-[10px] h-[10px] rounded-full relative z-10"
                      initial={{ backgroundColor: 'rgba(255,255,255,0.15)', boxShadow: '0 0 0 3px rgba(59,130,246,0)' }}
                      whileInView={{ backgroundColor: 'rgb(59, 130, 246)', boxShadow: '0 0 0 3px rgba(59,130,246,0.25)' }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 bg-[#1e1e1e] p-8 rounded-2xl"
                    style={{ outline: '1px solid rgba(255,255,255,0.08)', outlineOffset: '0px' }}
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Small Joys Section */}
      <section className="py-24">
        {/* Heading — contained */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center"
          >
            <img src="/Me/Vinyl.svg" alt="" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              Small Joys, Big Inspiration
            </h2>
            <p className="text-xl text-gray-400">
              These are the little things that refill my creative energy.
            </p>
          </motion.div>
        </div>

        {/* Carousel — capped width, arrows outside the overflow container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-14">
          {/* Arrows — desktop only, disabled at ends */}
          <button
            onClick={() => carouselGoTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-6 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => carouselGoTo(activeIndex + 1)}
            disabled={activeIndex === maxCarouselIndex}
            aria-label="Next"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-6 z-20 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>

          {/* Overflow container — clips the track */}
          <div ref={containerRef} className="overflow-hidden">
            <motion.div
              className="flex pb-8"
              style={{ gap: CAROUSEL_GAP }}
              animate={{ x: -activeIndex * stepPx }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.5 }}
              drag="x"
              dragConstraints={{ left: -(maxCarouselIndex * stepPx), right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 400) {
                  carouselGoTo(activeIndex + (info.offset.x < 0 ? 1 : -1))
                } else {
                  carouselGoTo(activeIndex)
                }
              }}
            >
              {JOYS.map((joy, index) => (
                <div key={joy.title} style={{ width: cardWidthPx, flexShrink: 0 }}>
                  <VideoCard joy={joy} index={index} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dots — one per valid carousel position, not per card */}
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: maxCarouselIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => carouselGoTo(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Design Conferences Section */}
      <section className="pt-24 pb-40 px-4 sm:px-6 lg:px-8 bg-[#171717]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <img src="/Me/Airplane.svg" alt="" className="w-28 h-28 mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              Favourite Conferences I&apos;ve Attended
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-2">
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
