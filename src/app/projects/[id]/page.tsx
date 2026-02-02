'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  Users,
  Wrench,
  Palette,
  Package,
  LayoutDashboard,
  Type,
  Droplet,
  Camera,
  Map,
  Cog,
  ShoppingCart,
  Rocket,
  Grid,
  Accessibility,
  PenLine,
  type LucideIcon,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { RefreshCw, MessageSquare, Settings, Eye, Search, MapPin, Lightbulb, Clock, BookOpen, Link2, FileText, Layers } from 'lucide-react'
import {
  projectsData,
  getNextProject,
  type IconKey,
  type ProjectMediaItem,
  type ProjectTheme,
} from '@/data/projects'

const defaultTheme: ProjectTheme = {
  tagBg: 'rgba(199, 210, 254, 0.5)',
  tagText: '#4338ca',
  badgeBg: 'rgba(199, 210, 254, 0.5)',
  badgeText: '#4338ca',
  accentText: '#4f46e5',
  accentHoverText: '#6366f1',
  iconBg: 'rgba(165, 180, 252, 0.4)',
  iconText: '#4338ca',
  surfaceBg: 'rgba(199, 210, 254, 0.2)',
  surfaceRing: 'rgba(165, 180, 252, 0.3)',
}

const renderMediaCard = (media: ProjectMediaItem, className = '') => {
  const isVideo = media.type === 'video'

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] bg-transparent ${!isVideo ? 'min-h-[220px]' : ''} ${className}`}
    >
      {media.src ? (
        isVideo ? (
          <video
            src={media.src}
            poster={media.poster}
            autoPlay={media.autoPlay ?? true}
            loop={media.loop ?? true}
            muted={media.muted ?? true}
            playsInline
            controls={false}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            quality={95}
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 60vw, 90vw"
            className="object-cover"
          />
        )
      ) : (
        <div className="flex h-full min-h-[220px] items-center justify-center text-gray-400 dark:text-gray-600">
          <Camera size={28} />
        </div>
      )}
    </div>
  )
}

const ProjectDetailPage = () => {
  const params = useParams()
  const projectId = parseInt(params.id as string)

  const project = projectsData[projectId] || projectsData[1]
  const nextProject = getNextProject(projectId)

  if (!project) {
    return <div>Project not found</div>
  }

  const projectInitials = project.title
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const theme = project.theme ?? defaultTheme
  const themeColors = {
    tagBg: theme.tagBg ?? defaultTheme.tagBg,
    tagText: theme.tagText ?? defaultTheme.tagText,
    badgeBg: theme.badgeBg ?? defaultTheme.badgeBg,
    badgeText: theme.badgeText ?? defaultTheme.badgeText,
    iconBg: theme.iconBg ?? defaultTheme.iconBg,
    iconText: theme.iconText ?? defaultTheme.iconText,
    accentText: theme.accentText ?? defaultTheme.accentText,
    accentHoverText: theme.accentHoverText ?? theme.accentText ?? defaultTheme.accentHoverText ?? defaultTheme.accentText,
    surfaceBg: theme.surfaceBg ?? defaultTheme.surfaceBg,
    surfaceRing: theme.surfaceRing ?? defaultTheme.surfaceRing,
  }

  const sections = project.sections
  const visualDesign = sections.visualDesign
  const physicalTouchpoint = sections.physicalTouchpoint
  const designSystem = sections.designSystem
  const solution = sections.solution
  const processSection = sections.process
  const keyScreens = sections.keyScreens
  const reflection = sections.reflection
  const sectionBreaks = project.sectionBreaks ?? []
  const physicalMedia = physicalTouchpoint?.media ?? []
  const primaryPhysicalMedia = physicalMedia[0]
  const keyScreenMedia =
    keyScreens?.media?.length
      ? keyScreens.media
      : project.heroImage
        ? [{ src: project.heroImage, alt: `${project.title} hero`, caption: 'Project hero preview' }]
        : []

  const overviewImages = keyScreens?.media?.slice(0, 2) ?? []

  const iconMap: Record<IconKey, LucideIcon> = {
    type: Type,
    droplet: Droplet,
    camera: Camera,
    map: Map,
    cog: Cog,
    'shopping-cart': ShoppingCart,
    rocket: Rocket,
    grid: Grid,
    accessibility: Accessibility,
    'pen-line': PenLine,
    package: Package,
  }

  const renderBadge = (label: string, icon?: IconKey) => {
    if (icon) {
      const IconComponent = iconMap[icon]
      if (IconComponent) {
        return (
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: themeColors.iconBg, color: themeColors.iconText }}
          >
            <IconComponent size={18} strokeWidth={2} />
          </span>
        )
      }
    }
    return (
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: themeColors.iconBg, color: themeColors.iconText }}
      >
        {label.charAt(0).toUpperCase()}
      </span>
    )
  }

  const renderSectionMedia = (media: ProjectMediaItem, key?: string | number) => {
    const isVideo = media.type === 'video'
    return (
      <div key={key} className="overflow-hidden rounded-[2.75rem] shadow-soft">
        {isVideo ? (
          <video
            src={media.src}
            poster={media.poster}
            autoPlay={media.autoPlay ?? true}
            loop={media.loop ?? true}
            muted={media.muted ?? true}
            playsInline
            controls={false}
            className="w-full h-auto"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            width={1920}
            height={1080}
            quality={95}
            className="w-full h-auto"
            sizes="(min-width: 1280px) 960px, (min-width: 1024px) 80vw, 100vw"
          />
        )}
      </div>
    )
  }


  /* OLD DATA - NOW USING CENTRAL DATA FROM /src/data/projects.ts
  const projectsData: { [key: number]: any} = {
    1: {
    id: 1,
      title: 'Bocca Moments',
      subtitle: 'Designing a sensorial brand and digital experience for a curated gastronomic box.',
      heroImage: '/images/projects/bocca-hero.jpg',
      category: 'Web Design',
    type: 'Case Study',
      role: 'Creative Director & UX/UI Designer',
    timeline: '6 months',
      team: '1 Designer, 1 Developer',
      tools: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe After Effects'],
      gradient: 'from-amber-200 to-stone-500',
      tags: ['Brand Identity', 'UX/UI Design', 'Digital Launch'],
      challenge: `The challenge was to bring emotional depth to a market saturated with subscription boxes focused on convenience. Bocca aimed to stand apart by offering a curated, sensorial experience, not just products: designed to surprise, nurture, and connect people through moments around the table.`,
    process: [
      {
        title: 'User Research',
        description: 'Conducted interviews with 15 EcoFlow users to understand their pain points and energy management goals.',
        image: '/api/placeholder/600/400',
      },
      {
        title: 'Information Architecture',
        description: 'Redesigned the information hierarchy to prioritize the most important metrics and actions.',
        image: '/api/placeholder/600/400',
      },
      {
        title: 'Wireframing & Prototyping',
        description: 'Created low-fidelity wireframes and interactive prototypes to test different layout approaches.',
        image: '/api/placeholder/600/400',
      },
      {
        title: 'Visual Design',
        description: 'Developed a clean, modern interface that reflects EcoFlow\'s commitment to sustainability.',
        image: '/api/placeholder/600/400',
      },
    ],
    solution: `The Bocca experience was designed to blend emotion and elegance — transforming a simple product into a ritual of connection. The brand and digital touchpoints were crafted to feel intimate, sensory, and story-driven.

Key design focuses included:

- Emotional Storytelling: A narrative-led website that guides users through discovery, curiosity, and anticipation — reflecting the journey of receiving the box.
- Warm Visual Identity: Earthy tones, delicate typography, and soft motion evoke the brand’s artisanal, grounded character.
- Seamless User Flow: A clear, minimal purchase path that emphasizes exclusivity — one edition at a time.
- Human Photography: Lifestyle imagery that celebrates connection and authenticity, capturing real emotion over perfection.
- Launch Ecosystem: A digital-first campaign (social + newsletter) designed to communicate the brand’s values and introduce each limited edition with excitement and calm confidence.`
,

    impact: [
      { metric: 'User Engagement', value: '+45%', description: 'Increase in daily active users' },
      { metric: 'Task Completion', value: '+60%', description: 'Faster completion of energy management tasks' },
      { metric: 'User Satisfaction', value: '4.8/5', description: 'Average rating in user feedback' },
      { metric: 'Energy Savings', value: '+25%', description: 'Users report better energy efficiency' },
    ],
    nextProject: {
        id: 2,
      title: 'Mindful Meditation',
      description: 'Creating a calming space for digital wellness and mindfulness',
      image: '/api/placeholder/400/300',
      gradient: 'from-purple-400 to-pink-500',
      },
    },
    2: {
      id: 2,
      title: 'Mindful Meditation',
      subtitle: 'Creating a calming space for digital wellness and mindfulness',
      heroImage: '/api/placeholder/1200/600',
      category: 'UX Design',
      type: 'Case Study',
      role: 'UX Designer',
      timeline: '4 months',
      team: '2 designers, 3 developers, 1 PM',
      tools: ['Figma', 'Sketch', 'InVision', 'UserTesting'],
      gradient: 'from-purple-400 to-pink-500',
      tags: ['UX Design', 'Mobile Design', 'User Research'],
      challenge: `Users were struggling to maintain consistent meditation practices due to overwhelming app interfaces and lack of personalization. The existing meditation apps felt impersonal and didn't adapt to users' individual needs and preferences.`,
      process: [
        {
          title: 'User Research',
          description: 'Interviewed 20 meditation practitioners to understand their daily routines and pain points.',
          image: '/api/placeholder/600/400',
        },
        {
          title: 'Persona Development',
          description: 'Created user personas representing different meditation experience levels and goals.',
          image: '/api/placeholder/600/400',
        },
        {
          title: 'Journey Mapping',
          description: 'Mapped out the meditation journey from discovery to daily practice.',
          image: '/api/placeholder/600/400',
        },
        {
          title: 'UI Design',
          description: 'Designed a calming, minimalist interface that promotes focus and relaxation.',
          image: '/api/placeholder/600/400',
        },
      ],
      solution: `The Mindful Meditation app features a serene, personalized experience that adapts to users' meditation journey. Key features include:

• **Personalized Recommendations**: AI-driven meditation suggestions based on mood and goals
• **Minimalist Design**: Distraction-free interface with calming color palettes
• **Progress Tracking**: Visual journey maps showing meditation consistency and growth
• **Customizable Sessions**: Flexible duration and guidance levels for all experience levels
• **Ambient Soundscapes**: Curated audio environments to enhance meditation`,
      impact: [
        { metric: 'User Retention', value: '+70%', description: 'Increase in 30-day retention' },
        { metric: 'Daily Sessions', value: '+85%', description: 'Average daily meditation sessions' },
        { metric: 'User Satisfaction', value: '4.9/5', description: 'App Store rating' },
        { metric: 'Session Completion', value: '+55%', description: 'Users completing full sessions' },
      ],
      nextProject: {
        id: 3,
        title: 'Smart Home Hub',
        description: 'Unifying smart home control with intuitive, accessible design',
        image: '/api/placeholder/400/300',
        gradient: 'from-blue-400 to-indigo-500',
      },
    },
    3: {
      id: 3,
      title: 'Smart Home Hub',
      subtitle: 'Unifying smart home control with intuitive, accessible design',
      heroImage: '/api/placeholder/1200/600',
      category: 'UI Design',
      type: 'Case Study',
      role: 'Senior UI Designer',
      timeline: '5 months',
      team: '4 designers, 5 developers, 2 PMs',
      tools: ['Figma', 'Framer', 'Lottie', 'Zeplin'],
      gradient: 'from-blue-400 to-indigo-500',
      tags: ['UI Design', 'IoT', 'Accessibility'],
      challenge: `Managing multiple smart home devices was fragmented across different apps, creating a confusing and inefficient user experience. Users needed a centralized hub that could control all their devices while remaining accessible to users of all technical abilities.`,
      process: [
        {
          title: 'Competitive Analysis',
          description: 'Analyzed existing smart home solutions to identify gaps and opportunities.',
          image: '/api/placeholder/600/400',
        },
        {
          title: 'Accessibility Research',
          description: 'Conducted accessibility audits and user testing with diverse ability groups.',
          image: '/api/placeholder/600/400',
        },
        {
          title: 'Design System',
          description: 'Built a comprehensive design system for consistent device control patterns.',
          image: '/api/placeholder/600/400',
        },
        {
          title: 'Interaction Design',
          description: 'Created intuitive controls and micro-interactions for seamless device management.',
          image: '/api/placeholder/600/400',
        },
      ],
      solution: `The Smart Home Hub provides a unified, accessible interface for managing all smart home devices. Key features include:

• **Unified Dashboard**: Single interface controlling all connected devices
• **Accessibility First**: WCAG AAA compliant with voice control and haptic feedback
• **Smart Automation**: Create custom routines and automations with visual workflow builder
• **Real-time Status**: Live updates and notifications for all connected devices
• **Responsive Design**: Optimized for phone, tablet, and wall-mounted displays`,
      impact: [
        { metric: 'Device Integration', value: '+95%', description: 'Successfully connected devices on first try' },
        { metric: 'Task Efficiency', value: '+65%', description: 'Faster device control actions' },
        { metric: 'Accessibility Score', value: 'AAA', description: 'WCAG compliance rating' },
        { metric: 'User Adoption', value: '+80%', description: 'Active users within first month' },
      ],
      nextProject: {
        id: 1,
        title: 'EcoFlow Dashboard',
        description: 'Redesigning the energy management experience for sustainable living',
        image: '/api/placeholder/400/300',
        gradient: 'from-green-400 to-blue-500',
      },
    },
  }
  */

  // Content navigation for case studies
  const [activeSection, setActiveSection] = useState<string>('')
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const heroRef = useRef<HTMLElement | null>(null)
  const nextProjectRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Define sections based on project
    const sections: { id: string; label: string }[] = []
    
    if (project.id === 2) {
      // Cortado sections
      sections.push(
        { id: 'overview', label: 'Overview' },
        { id: 'context', label: 'Context & My Role' },
        { id: 'understanding', label: 'Understanding the Users' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'solution', label: 'Solution' },
        { id: 'reflection', label: 'Reflection' }
      )
    } else if (project.id === 3) {
      // Onyx sections
      sections.push(
        { id: 'overview', label: 'Overview' },
        { id: 'context', label: 'Context & My Role' },
        { id: 'understanding', label: 'Understanding the Problem' },
        { id: 'clinician', label: 'The Clinician Perspective' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'viewport', label: 'The Physical Therapist Viewport' },
        { id: 'features', label: 'Key Features' },
        { id: 'problem', label: 'The Problem' }
      )
    }

    // Set up intersection observer for scroll-spy
    const observers: IntersectionObserver[] = []
    
    sections.forEach((section) => {
      const element = sectionRefs.current[section.id]
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(section.id)
              }
            })
          },
          {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
          }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [project.id])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  // Get sections list for navigation
  const getNavigationSections = () => {
    if (project.id === 2) {
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'context', label: 'Context & My Role' },
        { id: 'understanding', label: 'Understanding the Users' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'solution', label: 'Solution' },
        { id: 'reflection', label: 'Reflection' },
      ]
    } else if (project.id === 3) {
      return [
        { id: 'overview', label: 'Overview' },
        { id: 'context', label: 'Context & My Role' },
        { id: 'understanding', label: 'Understanding the Problem' },
        { id: 'clinician', label: 'The Clinician Perspective' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'viewport', label: 'The Physical Therapist Viewport' },
        { id: 'features', label: 'Key Features' },
        { id: 'problem', label: 'The Problem' },
      ]
    }
    return []
  }

  const navigationSections = getNavigationSections()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 bg-animated-grid relative z-10">
      {/* Hero Section */}
      <section 
        ref={(el) => {
          if (el) heroRef.current = el
        }}
        className="relative -mt-16 pt-24 sm:pt-28 pb-16 sm:pb-24 bg-white dark:bg-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-0 sm:px-0">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-8 mb-8"
          >
            <Link href="/projects">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Projects</span>
              </button>
            </Link>
          </motion.div>

          {/* Header Section - Logo, Description, Summary, and Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-8 sm:py-12 mb-8"
          >
            <div className="space-y-12">
              {/* Top Row - Logo and Description */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8 lg:gap-12 items-start">
                {/* Left Side - Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {project.id === 1 ? (
                    <Image
                      src="/Logos/Logo.svg"
                      alt="Bocca Moments Logo"
                      width={200}
                      height={45}
                      className="h-8 sm:h-10 lg:h-12 w-auto brightness-0 invert"
                    />
                  ) : project.id === 3 ? (
                    <Image
                      src="/Logos/Onyx.svg"
                      alt="Onyx Logo"
                      width={473}
                      height={169}
                      className="h-8 sm:h-10 lg:h-12 w-auto brightness-0 invert"
                    />
                  ) : project.id === 2 ? (
                    <Image
                      src="/Logos/Cortado.svg"
                      alt="Cortado Logo"
                      width={132}
                      height={44}
                      className="h-8 sm:h-10 lg:h-12 w-auto brightness-0 invert"
                    />
                  ) : null}
                </motion.div>

                {/* Right Side - Description/Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-gray-900 dark:text-white leading-tight"
                >
                  {project.subtitle}
                </motion.h1>
              </div>

              {/* Details Row - Role, Timeline, Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4 border-t border-gray-200 dark:border-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Role</p>
                  <p className="text-base text-gray-900 dark:text-white leading-relaxed">{project.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Timeline</p>
                  <p className="text-base text-gray-900 dark:text-white">{project.timeline}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Type</p>
                  <p className="text-base text-gray-900 dark:text-white">{project.category}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          </div>

          {/* Hero Image - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative aspect-[16/9] overflow-hidden mb-2 sm:mb-4 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
          >
            {project.heroImage ? (
              <Image
                src={project.heroImage}
                alt={`${project.title} hero image`}
                fill
                priority={projectId === project.id}
                quality={95}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${project.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-white text-2xl font-medium">{projectInitials}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Hero image coming soon</p>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </section>

      {/* Content Wrapper - Centered with Navigation */}
      <div className="max-w-7xl mx-auto lg:flex lg:relative">
        {/* Content Navigation - Desktop Only - Sticky Left */}
        {navigationSections.length > 0 && (
          <nav className="hidden lg:block sticky top-24 z-40 w-48 flex-shrink-0 pl-2 pr-8 pt-8 pb-8 self-start">
            <div className="relative">
              {/* Vertical Line - Full Height */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700">
                {/* Active indicator line segment */}
                {activeSection && (
                  <div
                    className="absolute left-0 w-full bg-gray-900 dark:bg-white transition-all duration-300"
                    style={{
                      height: '1.5rem',
                      top: `${(navigationSections.findIndex(s => s.id === activeSection)) * 2.5}rem`,
                    }}
                  />
                )}
              </div>
              
              {/* Navigation Items */}
              <div className="flex flex-col space-y-4 pl-5">
                {navigationSections.map((section, index) => {
                  const isActive = activeSection === section.id || (!activeSection && index === 0)
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="text-left transition-colors duration-200 group h-6 whitespace-nowrap"
                    >
                    <div className="flex items-center h-6">
                      <span
                        className={`text-sm transition-colors duration-200 leading-6 h-6 ${
                          isActive
                            ? 'text-gray-900 dark:text-white font-medium'
                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                        }`}
                      >
                        {section.label}
                      </span>
                    </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>
        )}

        {/* Main Content - Centered */}
        <div className="flex-1 min-w-0 max-w-4xl mx-auto lg:mx-0">
          {/* Overview Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="overview"
          ref={(el) => {
            if (el) sectionRefs.current['overview'] = el
          }}
          className="pt-4 sm:pt-6 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Overview</h2>
              <div className="space-y-4 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Cortado is a GenAI-powered rental management SaaS designed to simplify the day-to-day operations of independent landlords and small property managers. The goal was to reduce fragmentation across tools and automate repetitive work by bringing messaging, leasing, pricing, and maintenance into one AI-assisted workspace.
                </p>
                <p>
                  This project was completed during a fast-paced design sprint, focused on identifying real user pain points and validating a clear product direction in a short timeframe.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Overview Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="overview"
          ref={(el) => {
            if (el) sectionRefs.current['overview'] = el
          }}
          className="pt-4 sm:pt-6 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Overview</h2>
              <div className="space-y-4 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Onyx is a human-centered digital health platform designed to support people living with Chronic Pelvic Pain Syndrome (CPPS), a condition affecting millions, yet widely misunderstood, underdiagnosed, and difficult to treat.
                </p>
                <p>
                  CPPS is complex, and deeply personal. Patients often navigate years of uncertainty, fragmented care, and trial-and-error treatments with little guidance or validation. Onyx was created to change that experience by empowering patients with structure, education, and actionable insights, while supporting clinicians with clearer context and continuity of care.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Section - Cortado Only */}
      {project.id === 2 && (
        <section className="py-4 sm:py-8 px-0 sm:px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative w-full sm:rounded-2xl overflow-hidden"
            >
              <div className="relative w-full aspect-video sm:rounded-2xl overflow-hidden">
                <Image
                  src="/projects/Cortado/012.webp"
                  alt="Cortado overview image"
                  fill
                  className="object-cover sm:rounded-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  quality={85}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Section - Onyx Only */}
      {project.id === 3 && (
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative w-full aspect-video rounded-2xl overflow-hidden"
            >
              <Image
                src="/projects/Onyx/B-Mockups, PSD.webp"
                alt="Onyx overview image"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Context & My Role Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="context"
          ref={(el) => {
            if (el) sectionRefs.current['context'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Context & My Role</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  My responsibilities included:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Search className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Participated in end-to-end discovery and synthesis</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Led an on-site, cross-functional design sprint at Stanford University to define the problem space, and explore early solution directions</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <PenLine className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Contributed to overall experience definition and product framing</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Owned the UI/UX design for the Physical Therapist viewport</p>
                </motion.div>
              </div>
              <div className="mt-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  While the broader product included both patient and clinician, my hands-on design work concentrated on the therapist experience, where time constraints, cognitive load, and trust in data are especially critical.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stanford Images Section - Onyx Only */}
      {project.id === 3 && (
        <section className="pt-4 px-0 sm:px-6 lg:px-12 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative w-full sm:rounded-2xl overflow-hidden"
              >
                <div className="relative w-full aspect-square sm:rounded-2xl overflow-hidden">
                  <Image
                    src="/projects/Onyx/Stanford.webp"
                    alt="Stanford design sprint"
                    fill
                    className="object-cover sm:rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    quality={85}
                    loading="lazy"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative w-full sm:rounded-2xl overflow-hidden"
              >
                <div className="relative w-full aspect-square sm:rounded-2xl overflow-hidden">
                  <Image
                    src="/projects/Onyx/Stanford-2.webp"
                    alt="Stanford design sprint"
                    fill
                    className="object-cover sm:rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    quality={85}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Understanding the Problem Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="understanding"
          ref={(el) => {
            if (el) sectionRefs.current['understanding'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Understanding the Problem</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* Text Content - Left Side */}
                <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed flex flex-col">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white mb-4">CPPS as a Care Challenge</h3>
                    <p>
                      CPPS affects a significant portion of the population, yet patients often spend years navigating unclear diagnoses, fragmented care, and inconsistent treatment plans. Symptoms fluctuate, progress is rarely linear, and setbacks are common.
                    </p>
                  </div>
                  <p>
                    For patients, this often leads to frustration and emotional fatigue. For clinicians, particularly physical therapists. It creates a different problem: making informed decisions with incomplete, anecdotal, and hard-to-compare information.
                  </p>
                </div>
                {/* Video - Right Side */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <video
                      src="/projects/Onyx/Copy-of-MVI_5345.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* The Clinician Perspective Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="clinician"
          ref={(el) => {
            if (el) sectionRefs.current['clinician'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">The Clinician Perspective</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Through discovery and direct collaboration with pelvic floor physical therapists, several recurring constraints emerged:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Limited session time, requiring fast context-building and decision-making</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">A high education burden, with therapists needing to tailor explanations to different learning styles</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Link2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Low continuity between sessions, due to cancellations, flare-ups, and difficulty keeping patients engaged remotely</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Fragmented charting systems, making it hard to track symptom progression over time</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">The inherent complexity of CPPS, spanning physical, emotional, dietary, sexual, and stress-related factors</p>
                </motion.div>
              </div>
              <div className="mt-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Rather than a lack of data, therapists struggled with synthesizing patient information into something actionable within the realities of clinical care.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Design Focus Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="design-focus"
          ref={(el) => {
            if (el) sectionRefs.current['design-focus'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Design Focus</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Insights from discovery were synthesized into a small set of How Might We questions that guided ideation and prioritization:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-yellow-200 dark:bg-yellow-900/30 rounded-lg p-6 shadow-lg transform"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)' }}
                >
                  <p className="text-gray-900 dark:text-yellow-100 font-medium leading-relaxed">
                    How might we evaluate patient progress in the least burdensome way?
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-pink-200 dark:bg-pink-900/30 rounded-lg p-6 shadow-lg transform"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)' }}
                >
                  <p className="text-gray-900 dark:text-pink-100 font-medium leading-relaxed">
                    How might we make it easier for physical therapists to quickly scan patient data and updates?
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-blue-200 dark:bg-blue-900/30 rounded-lg p-6 shadow-lg transform"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)' }}
                >
                  <p className="text-gray-900 dark:text-blue-100 font-medium leading-relaxed">
                    How might we reduce the cognitive and emotional load of treating CPPS patients?
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 2 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-green-200 dark:bg-green-900/30 rounded-lg p-6 shadow-lg transform"
                  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)' }}
                >
                  <p className="text-gray-900 dark:text-green-100 font-medium leading-relaxed">
                    How might we support therapists in assigning personalized exercises and education, while understanding whether patients are able to complete them correctly on their own?
                  </p>
                </motion.div>
              </div>
              <div className="mt-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  These questions intentionally balanced clinical rigor with human realities, and directly informed the structure and focus of the Physical Therapist viewport.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* The Physical Therapist Viewport Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="viewport"
          ref={(el) => {
            if (el) sectionRefs.current['viewport'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">The Physical Therapist Viewport</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  The Physical Therapist viewport was designed as a connected, clinician-facing surface that works in tandem with the patient app—supporting both in-session care and between-session continuity.
                </p>
                <p>
                  Rather than existing in isolation, the viewport allows therapists to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Assign personalized therapy plans and exercises directly to patients</li>
                  <li>Review daily patient-reported symptoms, progress, and adherence collected through the patient app</li>
                  <li>See longitudinal patterns without needing to manually reconstruct history at the start of each session</li>
                </ul>
              </div>
              {/* Devices Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative w-full rounded-2xl overflow-hidden"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                  <Image
                    src="/projects/Onyx/Devices.webp"
                    alt="Physical Therapist Viewport devices"
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  />
                </div>
              </motion.div>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Instead of presenting raw logs, the interface surfaces:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Summaries of patient-reported data over time</li>
                  <li>Visual patterns that highlight change, stability, or volatility</li>
                  <li>Context that helps therapists ask better questions, faster</li>
                </ul>
                <p>
                  The viewport functions as a shared reference point during sessions—supporting conversation rather than replacing clinical judgment. By tightly coupling therapist tools with patient input, the experience reinforces continuity, accountability, and shared understanding across the care journey.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Key Features Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="features"
          ref={(el) => {
            if (el) sectionRefs.current['features'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-12 bg-white dark:bg-slate-950"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Key Features</h2>
              
              {/* Feature 1: Patient Profile & Therapy Plan */}
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Patient Profile & Therapy Plan</h3>
                {/* Video */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative w-full rounded-2xl overflow-hidden"
                >
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <video
                      src="/projects/Onyx/Patient-Profile.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </motion.div>
                {/* Text Content */}
                <div className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                  <p>
                    The patient profile serves as the central hub for each care relationship. It gives physical therapists a consolidated view of patient history, current symptoms, and progress over time, while allowing them to define and adjust personalized therapy plans as treatment evolves. By anchoring decisions in a shared profile, therapists can maintain continuity across sessions despite cancellations or non-linear recovery.
                  </p>
                </div>
              </div>

              {/* Feature 2: Exercise Creation & Library */}
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Exercise Creation & Library</h3>
                {/* Video */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative w-full rounded-2xl overflow-hidden"
                >
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <video
                      src="/projects/Onyx/Library.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </motion.div>
                {/* Text Content */}
                <div className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                  <p>
                    To support personalized care at scale, the platform includes a flexible exercise and education library. Therapists can create, customize, and reuse exercises or educational content based on individual patient needs. This reduces repetitive work while still allowing plans to be tailored, and helps standardize guidance without forcing a one-size-fits-all approach.
                  </p>
                </div>
              </div>

              {/* Feature 3: In‑App Messaging & Online Consultations */}
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">In‑App Messaging & Online Consultations</h3>
                {/* Video */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative w-full rounded-2xl overflow-hidden"
                >
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <video
                      src="/projects/Onyx/Messages.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </motion.div>
                {/* Text Content */}
                <div className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                  <p>
                    Recognizing that progress often happens between sessions, Onyx supports in-app messaging and remote consultations. These tools allow therapists to answer questions, clarify instructions, and adjust plans without requiring in-person visits. This was especially important given high cancellation rates and the sensitivity of CPPS symptoms, helping maintain engagement and continuity of care.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Context & My Role Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="context"
          ref={(el) => {
            if (el) sectionRefs.current['context'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Context & My Role</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Cortado was developed following a Loka-led design sprint that explored the challenges faced by small rental operators.
                </p>
                <p>
                  I did not participate directly in the sprint sessions. Instead, my role focused on:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Reviewing and synthesizing insights generated from the design sprint</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <PenLine className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Translating research outcomes into product concepts and UX decisions</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Designing key UI screens and interaction patterns</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Grid className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Supporting the team with visual clarity and system-level consistency</p>
                </motion.div>
              </div>
              <div className="mt-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  This allowed the team to move quickly from insight to execution.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Understanding the Users Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="understanding"
          ref={(el) => {
            if (el) sectionRefs.current['understanding'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Understanding the Users</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Reviewing the outcomes of the design sprint revealed a clear pattern in how rental operators work today:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Work is fragmented across too many tools</h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm">Listings, guest communication, pricing, and operations live in separate platforms, forcing constant context switching.</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Guest communication dominates daily work</h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm">Responding to repetitive guest messages takes up several hours a day and frequently interrupts higher-value tasks.</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Automation must remain transparent</h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm">Operators are open to AI assistance, but only when they can understand, review, and stay in control of system actions.</p>
                </motion.div>
              </div>
              <div className="mt-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  These takeaways shaped both the product scope and how AI would be positioned within the experience.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Design Focus Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="design-focus"
          ref={(el) => {
            if (el) sectionRefs.current['design-focus'] = el
          }}
          className="pt-8 sm:pt-16 pb-0 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Design Focus</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Based on the synthesized insights, guest messaging emerged as the highest-impact area for improvement.
                </p>
                <p>
                  My design work focused on:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Accessibility className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Reducing cognitive load in message-heavy workflows</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Making AI assistance visible without feeling intrusive</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Supporting fast decisions while preserving user control</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col items-start"
                >
                  <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Structuring complex information into calm, scannable layouts</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Design Focus Images Section - Cortado Only */}
      {project.id === 2 && (
        <section className="pt-4 px-0 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative w-full sm:rounded-2xl overflow-hidden"
              >
                <div className="relative w-full aspect-square sm:rounded-2xl overflow-hidden">
                  <Image
                    src="/projects/Cortado/Design System Cortado.webp"
                    alt="Design Focus image 1"
                    fill
                    className="object-cover sm:rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    quality={85}
                    loading="lazy"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative w-full sm:rounded-2xl overflow-hidden"
              >
                <div className="relative w-full aspect-square sm:rounded-2xl overflow-hidden">
                  <Image
                    src="/projects/Cortado/Analytics 2.webp"
                    alt="Design Focus image 2"
                    fill
                    className="object-cover sm:rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    quality={85}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Solution Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="solution"
          ref={(el) => {
            if (el) sectionRefs.current['solution'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white mb-2">Solution</h2>
                <h3 className="text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6">An AI-Assisted Inbox</h3>
              </div>
              <div className="space-y-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  The core experience centers around an AI-assisted inbox designed to help operators respond to guests faster and more confidently.
                </p>
                <p>
                  Rather than fully automating communication, the inbox:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                    <Image
                      src="/projects/Cortado/012.webp"
                      alt="Draft replies suggestion"
                      fill
                      className="object-cover rounded-t-2xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col items-start">
                    <PenLine className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                    <p className="text-gray-800 dark:text-gray-200">Suggests draft replies that users can review and edit</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                    <Image
                      src="/projects/Cortado/015.webp"
                      alt="Context from reservations"
                      fill
                      className="object-cover rounded-t-2xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col items-start">
                    <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                    <p className="text-gray-800 dark:text-gray-200">Pulls context from reservations, policies, and property data</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                    <Image
                      src="/projects/Cortado/012.webp"
                      alt="Learning from feedback"
                      fill
                      className="object-cover rounded-t-2xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col items-start">
                    <Rocket className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3" />
                    <p className="text-gray-800 dark:text-gray-200">Learns from user feedback to improve future suggestions</p>
                  </div>
                </motion.div>
              </div>
              <div className="mt-6 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  This approach balances efficiency with trust, keeping users in the loop at all times.
                </p>
              </div>
              {/* Solution Images */}
              <div className="mt-8 space-y-4 sm:space-y-6">
                <div className="-mx-4 sm:mx-0 sm:-mx-6 lg:-mx-8">
                  <div className="relative w-full sm:rounded-2xl overflow-hidden max-w-7xl sm:mx-auto">
                    <div className="relative w-full aspect-video sm:rounded-2xl overflow-hidden">
                        <Image
                          src="/projects/Cortado/Inbox mu.webp"
                          alt="AI-Assisted Inbox solution"
                          fill
                          className="object-cover sm:rounded-2xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                          quality={85}
                          loading="lazy"
                        />
                    </div>
                  </div>
                </div>
                {/* Two Images Side by Side */}
                <div className="-mx-4 sm:mx-0 sm:-mx-6 lg:-mx-8">
                  <div className="max-w-7xl sm:mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="relative w-full sm:rounded-2xl overflow-hidden">
                        <div className="relative w-full aspect-square sm:rounded-2xl overflow-hidden">
                          <Image
                            src="/projects/Cortado/Design System Cortado.webp"
                            alt="AI-Assisted Inbox solution detail 1"
                            fill
                            className="object-cover sm:rounded-2xl"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            quality={85}
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <div className="relative w-full sm:rounded-2xl overflow-hidden">
                        <div className="relative w-full aspect-square sm:rounded-2xl overflow-hidden">
                          <Image
                            src="/projects/Cortado/011.webp"
                            alt="AI-Assisted Inbox solution detail 2"
                            fill
                            className="object-cover sm:rounded-2xl"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            quality={85}
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="-mx-4 sm:mx-0 sm:-mx-6 lg:-mx-8">
                  <div className="relative w-full sm:rounded-2xl overflow-hidden max-w-7xl sm:mx-auto">
                    <div className="relative w-full aspect-video sm:rounded-2xl overflow-hidden">
                        <Image
                          src="/projects/Cortado/012.webp"
                          alt="AI-Assisted Inbox solution 2"
                          fill
                          className="object-cover sm:rounded-2xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                          quality={85}
                          loading="lazy"
                        />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Reflection Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="reflection"
          ref={(el) => {
            if (el) sectionRefs.current['reflection'] = el
          }}
          className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white">Reflection</h2>
              <div className="space-y-4 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  This project highlighted the value of synthesis and execution in early-stage product work. Turning research insights into a clear, usable interface was critical in making the concept tangible and credible.
                </p>
                <p>
                  Cortado reinforced a core belief in my design practice: AI products work best when they respect users' need for clarity, agency, and confidence.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

        </div>
      </div>

      {/* Next Project */}
      {nextProject && (
      <section 
        ref={(el) => {
          if (el) nextProjectRef.current = el
        }}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
              <h2 className="text-3xl font-medium text-gray-900 dark:text-white text-center mb-12">Next Project</h2>
              <Link href={`/projects/${nextProject.id}`}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group cursor-pointer bg-white dark:bg-gray-900/70 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden backdrop-blur-sm"
              >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[200px]">
                    <div className="relative overflow-hidden min-h-[200px]">
                      {nextProject.heroImage ? (
                        <Image
                          src={nextProject.heroImage}
                          alt={`${nextProject.title} hero image`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div className={`bg-gradient-to-br ${nextProject.gradient} flex items-center justify-center h-full min-h-[200px]`}>
                          <div className="text-white text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-xl font-medium">
                                {nextProject.title.charAt(0)}
                              </span>
                            </div>
                            <p className="text-sm opacity-90">Project Preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center text-left">
                    <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3 transition-colors">
                        {nextProject.title}
                    </h3>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {nextProject.description}
                    </p>
                    <div className="flex items-center font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <span>View case study</span>
                      <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
      )}
    </div>
  )
}

export default ProjectDetailPage
