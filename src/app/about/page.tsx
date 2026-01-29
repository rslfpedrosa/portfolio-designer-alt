'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Download, Award, Users, Lightbulb, Heart, Figma, Palette, Layers, Code, Coffee, Dog, Plane, ArrowRight, Calendar, Briefcase, Globe } from 'lucide-react'
import { useState, useRef } from 'react'

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
    photos: string[]
  }
  index: number 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-large transition-all overflow-visible"
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
          className="absolute top-1/4 left-0 w-48 h-48 rounded-xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-700"
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
          className="absolute bottom-1/4 right-0 w-48 h-48 rounded-xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-700"
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
          className="absolute top-0 right-1/4 w-44 h-44 rounded-xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-700"
        >
          <img src={conference.photos[2]} alt="Conference photo" className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Ticket-style design */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Perforated edge effect */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 dark:bg-slate-900 rounded-full -ml-2 z-10" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 dark:bg-slate-900 rounded-full -mr-2 z-10" />
        
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
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {conference.description}
        </p>
      </div>
    </motion.div>
  )
}

// Video Card Component with auto-play on hover
const VideoCard = ({ joy, index }: { joy: { title: string; description: string; video: string }; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex-shrink-0 w-80 snap-start group cursor-pointer"
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-large transition-all overflow-hidden h-full">
        {/* Video container */}
        <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-2xl">
          <video
            ref={videoRef}
            src={joy.video}
            muted
            loop
            playsInline
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Enhanced gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        
        {/* Text below video - always readable */}
        <div className="p-6 bg-white dark:bg-slate-800">
          <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
            {joy.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {joy.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const AboutPage = () => {
  const timeline = [
    {
      year: '2024',
      title: 'Senior Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Currently leading product design efforts across multiple AI-driven tools at Loka. I collaborate closely with product managers and engineers to shape the design vision, drive design strategy, and ship scalable solutions. I mentor junior designers, refine design systems, and ensure our interfaces are intuitive, efficient, and aligned with both user needs and business goals.',
      tags: ['Product Strategy', 'Design Systems', 'Mentorship', 'AI Tools', 'Cross-Functional Collaboration']
    },
    {
      year: '2022',
      title: 'Mid Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Contributed to the design of AI-powered web platforms used in healthcare and property management. I was responsible for improving user flows, enhancing visual consistency, and supporting usability testing. Collaborated with cross-functional teams to rapidly iterate on solutions, resulting in cleaner interfaces and increased task completion rates.',
      tags: ['UI Design', 'UX Optimization', 'Prototyping', 'Usability Testing', 'Agile Teams']
    },
    {
      year: '2022',
      title: 'Junior Product Designer',
      company: 'Loka',
      companyUrl: 'https://loka.com',
      description: 'Joined the Loka team as a junior designer, assisting in interface design and user research. I contributed to design explorations, refined components within existing systems, and supported hand-off workflows with developers. This role helped me build strong foundations in UX principles and collaborative design processes.',
      tags: ['UI Design', 'User Research', 'Component Design', 'Dev Handoff', 'Foundational UX']
    },
    {
      year: '2020',
      title: 'UX & UI Specialization',
      company: 'Edit.',
      companyUrl: 'https://edit.com.pt',
      description: 'An intensive course focused on human-centered design, usability, and digital product strategy. I developed skills in user research, journey mapping, wireframing, and prototyping using modern tools and practices. As part of the final project, I collaborated with a team to redesign a real e-commerce experience for Fnac.pt, addressing key UX pain points and proposing data-informed improvements.',
      tags: ['Human-Centered Design', 'Wireframing', 'Team Collaboration', 'Design Thinking', 'UX Case Study']
    },
    {
      year: '2019',
      title: 'Summer Internship',
      company: 'Whitesmith',
      companyUrl: 'https://whitesmith.co',
      description: 'During this internship, I took on the role of Product Owner for a self-initiated product idea. I led early-stage product discovery by conducting market research, user interviews, and questionnaires to validate the concept. This experience gave me a full view of the business side of product development, from identifying user pain points to shaping value propositions. It was a foundational moment that sparked my transition into product design.',
      tags: ['Product Discovery', 'Market Research', 'User Interviews', 'Concept Validation', 'Business Thinking']
    },
    {
      year: '2017',
      title: 'Bachelor\'s in Design and Multimedia',
      company: 'University of Coimbra',
      companyUrl: 'https://www.uc.pt',
      description: 'A multidisciplinary design program with a strong digital focus. I explored everything from web development and interactive installations to motion graphics and game design. This broad foundation gave me both creative range and technical adaptability.',
      tags: ['Web Design', 'Motion Design', 'Creative Coding', 'Interactive Media', 'Design Foundations']
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Clarity over complexity',
      description: 'I aim to make complex systems feel understandable and usable.',
    },
    {
      icon: Lightbulb,
      title: 'Human-centered thinking',
      description: 'Decisions start with real user needs, not assumptions.',
    },
    {
      icon: Users,
      title: 'Collaboration by default',
      description: 'The best outcomes come from working closely with engineers and stakeholders.',
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24"
          >
            <div className="relative order-2 lg:order-1">
      <div className="w-96 h-96 sm:w-[28rem] sm:h-[28rem] mx-auto rounded-2xl overflow-hidden shadow-large">
        <img
          src="/Me/IMG_0426.webp"
          alt="Rita Pedrosa"
          className="w-full h-full object-cover"
        />
      </div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h1 className="text-5xl sm:text-6xl font-medium text-gray-900 dark:text-white mb-6">
                About <span className="text-gradient">Me</span>
              </h1>
              <div className="space-y-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  I'm a Product Designer with a background in building digital products in healthcare, B2B, and consumer spaces.
                </p>
                <p>
                  I focus on clarity, usability, and collaboration, working closely with teams to turn complex problems into products that work in real-world constraints.
                </p>
              </div>
              
              {/* Stats Tags */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="status-badge inline-flex items-center space-x-2 rounded-full px-4 py-2">
                  <Calendar size={16} className="text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    4+ Years of Experience
                  </span>
                </div>
                <div className="status-badge inline-flex items-center space-x-2 rounded-full px-4 py-2">
                  <Briefcase size={16} className="text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    20+ Projects & Clients
                  </span>
                </div>
                <div className="status-badge inline-flex items-center space-x-2 rounded-full px-4 py-2">
                  <Globe size={16} className="text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Worked with teams from 5+ countries
                  </span>
                </div>
      </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              My Design <span className="text-gradient">Philosophy</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Three core principles that guide every design decision I make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className="flex flex-col items-start">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                        <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              My Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              A timeline of my design career and key milestones
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-600" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year + item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start space-x-8"
                >
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 border-4 border-indigo-500 rounded-full flex items-center justify-center relative z-10">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft">
                    <div className="mb-3">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      {item.company && (
                        item.companyUrl ? (
                          <a 
                            href={item.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                          >
                            {item.company}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {item.company}
                          </p>
                        )
                      )}
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Expertise Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              Tools & Expertise
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Figma', category: 'Design', icon: Figma },
              { name: 'Framer', category: 'Design', icon: Code },
              { name: 'Adobe Suite', category: 'Design', icon: Palette },
              { name: 'After Effects', category: 'Animation', icon: Award },
              { name: 'Premiere Pro', category: 'Animation', icon: Award },
              { name: 'Cinema 4D', category: 'Animation', icon: Lightbulb },
              { name: 'Lovable', category: 'AI tools', icon: Code },
              { name: 'Claude', category: 'AI tools', icon: Code },
              { name: 'ChatGPT', category: 'AI tools', icon: Code },
              { name: 'Notion', category: 'Process & communication', icon: Layers },
              { name: 'Slack', category: 'Process & communication', icon: Users },
              { name: 'Jira', category: 'Process & communication', icon: Layers },
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all"
              >
                <tool.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tool.category}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Small Joys Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 tracking-wider uppercase">
              Offline Mode
            </p>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              Small Joys, <span className="text-gradient">Big Inspiration</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              These are the little things that refill my creative energy.
            </p>
          </motion.div>

          {/* Horizontal scrollable carousel */}
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
              <div className="flex gap-6 px-4 sm:px-6 lg:px-8" style={{ width: 'max-content' }}>
              {[
                {
                  title: 'Beautiful, Overpriced Coffees',
                  description: '€5 for vibes and foam art? Worth it.',
                  video: '/videos/coffee.mp4'
                },
                {
                  title: 'Falling in Love with Every Dog I Meet',
                  description: 'Dogs are my weakness.',
                  video: '/videos/dogs.mp4'
                },
                {
                  title: 'Design Shop Wandering',
                  description: 'My favorite kind of field trip.',
                  video: '/videos/design-shop.mp4'
                },
                {
                  title: "Nature's Biggest Fan",
                  description: 'Trees, fresh air, no emails. Perfect.',
                  video: '/videos/nature.mp4'
                },
                {
                  title: 'Learning by Leaving',
                  description: 'New cities. New ways of seeing.',
                  video: '/videos/travel.mp4'
                },
              ].map((joy, index) => (
                <VideoCard key={joy.title} joy={joy} index={index} />
              ))}
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Conferences Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 tracking-wider uppercase">
              Learning & Growth
            </p>
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white mb-6">
              Favourite Design Conferences <span className="text-gradient">I Attended</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
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
                gradient: 'from-blue-400 to-indigo-500',
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
                description: 'Explored cutting-edge digital design topics and connected with global UX leaders.',
                gradient: 'from-orange-400 to-red-500',
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

      {/* Let's Build Something Together Section */}
      <section className="relative py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 overflow-hidden">
        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -120, 80, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, -180, 60, 0],
            y: [0, 120, -40, 0],
            scale: [1, 0.7, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl pointer-events-none"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{
            x: [0, 220, -80, 0],
            y: [0, -80, 100, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 dark:text-white">
              Let's Build Something <span className="text-gradient">Together</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm always open to collaborating on thoughtful projects, from early product strategy to polished, production ready experiences.
            </p>
            <div className="flex justify-center">
              <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                  <span>Get In Touch</span>
                  <ArrowRight size={20} />
              </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
