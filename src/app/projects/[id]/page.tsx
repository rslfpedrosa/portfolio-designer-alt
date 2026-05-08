'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
import { RefreshCw, MessageSquare, Settings, Eye, Search, MapPin, Lightbulb, Clock, BookOpen, Link2, FileText, Layers, Compass, Heart, Sparkles, Globe } from 'lucide-react'
import {
  projectsData,
  getNextProject,
  type IconKey,
  type ProjectMediaItem,
  type ProjectTheme,
} from '@/data/projects'
import FigmaCursor from '@/components/FigmaCursor'

const defaultTheme: ProjectTheme = {
  tagBg: 'rgba(163, 163, 163, 0.15)',
  tagText: '#a3a3a3',
  badgeBg: 'rgba(163, 163, 163, 0.15)',
  badgeText: '#a3a3a3',
  accentText: '#a3a3a3',
  accentHoverText: '#d4d4d4',
  iconBg: 'rgba(163, 163, 163, 0.15)',
  iconText: '#a3a3a3',
  surfaceBg: 'rgba(163, 163, 163, 0.1)',
  surfaceRing: 'rgba(163, 163, 163, 0.2)',
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
    solution: `The Bocca experience was designed to blend emotion and elegance transforming a simple product into a ritual of connection. The brand and digital touchpoints were crafted to feel intimate, sensory, and story-driven.

Key design focuses included:

- Emotional Storytelling: A narrative-led website that guides users through discovery, curiosity, and anticipation reflecting the journey of receiving the box.
- Warm Visual Identity: Earthy tones, delicate typography, and soft motion evoke the brand’s artisanal, grounded character.
- Seamless User Flow: A clear, minimal purchase path that emphasizes exclusivity one edition at a time.
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
      gradient: 'from-gray-400 to-pink-500',
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
      gradient: 'from-gray-400 to-pink-500',
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
        gradient: 'from-gray-400 to-gray-500',
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
      gradient: 'from-gray-400 to-gray-500',
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
        gradient: 'from-green-400 to-gray-500',
      },
    },
  }
  */

  // Content navigation for case studies
  const [activeSection, setActiveSection] = useState<string>('')
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const heroRef = useRef<HTMLElement | null>(null)
  const nextProjectRef = useRef<HTMLElement | null>(null)

  // Custom cursor state
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Define sections based on project
    const sections: { id: string; label: string }[] = []

    if (project.id === 1) {
      // Bocca sections
      sections.push(
        { id: 'summary', label: 'Project Summary' },
        { id: 'overview', label: 'Overview' },

        { id: 'context', label: 'My Role' },
        { id: 'design-focus', label: 'Designing the Experience' },
        { id: 'branding', label: 'Branding & Visual Identity' },
        { id: 'packaging', label: 'Packaging Design' },
        { id: 'digital', label: 'Digital Experience' },
        { id: 'impact', label: 'Impact' },
        { id: 'reflection-bocca', label: 'Reflection' }
      )
    } else if (project.id === 2) {
      // Cortado sections
      sections.push(
        { id: 'summary', label: 'Project Summary' },
        { id: 'overview', label: 'Overview' },

        { id: 'context', label: 'My Role' },
        { id: 'understanding', label: 'Understanding the Users' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'solution', label: 'Solution' },
        { id: 'reflection', label: 'Reflection' }
      )
    } else if (project.id === 3) {
      // Onyx sections
      sections.push(
        { id: 'summary', label: 'Project Summary' },
        { id: 'overview', label: 'Overview' },

        { id: 'context', label: 'My Role' },
        { id: 'design-sprint', label: 'The Design Sprint' },
        { id: 'understanding', label: 'Understanding the Problem' },
        { id: 'clinician', label: 'The Clinician Perspective' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'features', label: 'The Solution' },
        { id: 'reflection', label: 'Reflection' }
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

  // Desktop detection for custom cursor
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Hide default cursor when custom cursor should be visible
  useEffect(() => {
    if (isDesktop) {
      document.body.style.cursor = 'none'
    } else {
      document.body.style.cursor = 'default'
    }
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [isDesktop])

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
    if (project.id === 1) {
      return [
        { id: 'summary', label: 'Project Summary' },
        { id: 'overview', label: 'Overview' },

        { id: 'context', label: 'My Role' },
        { id: 'design-focus', label: 'Designing the Experience' },
        { id: 'branding', label: 'Branding & Visual Identity' },
        { id: 'packaging', label: 'Packaging Design' },
        { id: 'digital', label: 'Digital Experience' },
        { id: 'impact', label: 'Impact' },
        { id: 'reflection-bocca', label: 'Reflection' },
      ]
    } else if (project.id === 2) {
      return [
        { id: 'summary', label: 'Project Summary' },
        { id: 'overview', label: 'Overview' },

        { id: 'context', label: 'My Role' },
        { id: 'understanding', label: 'Understanding the Users' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'solution', label: 'Solution' },
        { id: 'reflection', label: 'Reflection' },
      ]
    } else if (project.id === 3) {
      return [
        { id: 'summary', label: 'Project Summary' },
        { id: 'overview', label: 'Overview' },

        { id: 'context', label: 'My Role' },
        { id: 'design-sprint', label: 'The Design Sprint' },
        { id: 'understanding', label: 'Understanding the Problem' },
        { id: 'clinician', label: 'The Clinician Perspective' },
        { id: 'design-focus', label: 'Design Focus' },
        { id: 'features', label: 'The Solution' },
        { id: 'reflection', label: 'Reflection' },
      ]
    }
    return []
  }

  const navigationSections = getNavigationSections()

  return (
    <div className="min-h-screen bg-white dark:bg-[#171717] relative z-10">
      {/* Hero Section */}
      <section 
        ref={(el) => {
          if (el) heroRef.current = el
        }}
        className="relative -mt-16 pt-36 sm:pt-36 pb-0 bg-white dark:bg-[#171717] overflow-hidden"
      >
        {/* Radial gradient accent */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[70vh] opacity-50 blur-3xl"
          style={{ background: `radial-gradient(ellipse at top, ${themeColors.accentText} 0%, transparent 70%)` }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-0">
          <div className="flex flex-col lg:flex-row lg:min-h-[80vh] lg:items-center gap-x-20">

            {/* ── MOBILE/TABLET ONLY ── */}

            {/* 1. Back Link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden order-1 mb-6"
            >
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <ArrowLeft size={14} />
                <span>All Projects</span>
              </Link>
            </motion.div>

            {/* 2. Logo + Title (mobile/tablet only) */}
            <div className="lg:hidden order-3 mb-2 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {project.id === 1 ? (
                  <Image src="/Logos/Logo.svg" alt="Bocca Moments Logo" width={200} height={45} className="h-7 w-auto brightness-0 invert" />
                ) : project.id === 3 ? (
                  <Image src="/Logos/Onyx.svg" alt="Onyx Logo" width={473} height={169} className="h-7 w-auto brightness-0 invert" />
                ) : project.id === 2 ? (
                  <Image src="/Logos/Cortado.svg" alt="Cortado Logo" width={132} height={44} className="h-7 w-auto brightness-0 invert" />
                ) : null}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl font-semibold text-white leading-tight tracking-tight"
              >
                {project.subtitle}
              </motion.h1>
            </div>

            {/* 3. Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="order-2 lg:order-2 relative w-full lg:flex-1 lg:min-w-0 aspect-square rounded-2xl overflow-hidden mb-8 lg:mb-0"
            >
              {project.heroImage ? (
                <Image
                  src={project.heroImage}
                  alt={`${project.title} hero image`}
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className={`w-20 h-20 bg-gradient-to-br ${project.gradient} rounded-2xl flex items-center justify-center`}>
                    <span className="text-white text-2xl font-medium">{projectInitials}</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 4. Tagline + Details (mobile/tablet only) */}
            <div className="lg:hidden order-4 pb-12">
              {project.tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8"
                >
                  {project.tagline}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="border-t border-gray-800 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Typology</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full border border-gray-700 text-sm text-gray-300">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Industry</p>
                  <p className="text-base text-gray-400">{project.industry}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Year</p>
                  <p className="text-base text-gray-400">{project.year}</p>
                </div>
              </motion.div>
            </div>

            {/* ── DESKTOP ONLY ── Full left column */}
            <div className="hidden lg:flex order-1 flex-col justify-center py-16 w-full max-w-[calc(50%-4rem)] pl-2 pr-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                  <ArrowLeft size={14} />
                  <span>All Projects</span>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                {project.id === 1 ? (
                  <Image src="/Logos/Logo.svg" alt="Bocca Moments Logo" width={200} height={45} className="h-7 w-auto brightness-0 invert" />
                ) : project.id === 3 ? (
                  <Image src="/Logos/Onyx.svg" alt="Onyx Logo" width={473} height={169} className="h-7 w-auto brightness-0 invert" />
                ) : project.id === 2 ? (
                  <Image src="/Logos/Cortado.svg" alt="Cortado Logo" width={132} height={44} className="h-7 w-auto brightness-0 invert" />
                ) : null}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight mb-4"
              >
                {project.subtitle}
              </motion.h1>
              {project.tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8"
                >
                  {project.tagline}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="border-t border-gray-800 pt-6 grid grid-cols-3 gap-6"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Typology</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full border border-gray-700 text-sm text-gray-300">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Industry</p>
                  <p className="text-base text-gray-400">{project.industry}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Year</p>
                  <p className="text-base text-gray-400">{project.year}</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Content Wrapper - Centered with Navigation */}
      <div className="max-w-7xl mx-auto lg:flex lg:relative lg:gap-x-20">
        {/* Content Navigation - Desktop Only - Sticky Left */}
        {navigationSections.length > 0 && (
          <nav className="hidden lg:block sticky top-24 w-48 flex-shrink-0 pl-2 pr-4 pt-8 pb-8 self-start">
            <div className="relative">
              {/* Vertical Line - Full Height */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-800">
                {/* Active indicator line segment */}
                {activeSection && (
                  <div
                    className="absolute left-0 w-full bg-white transition-all duration-300"
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
                      className="text-left transition-colors duration-200 group h-6 whitespace-nowrap cursor-pointer"
                    >
                    <div className="flex items-center h-6">
                      <span
                        className={`text-base transition-colors duration-200 leading-6 h-6 ${
                          isActive
                            ? 'text-white font-medium'
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

          {/* Project Summary Section */}
          {project.projectSummary && (
            <section
              id="summary"
              ref={(el) => { if (el) sectionRefs.current['summary'] = el }}
              className="py-6 sm:py-8 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm overflow-hidden"
                >
                  <div className="px-6 sm:px-10 pt-8 pb-2">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Project Summary</h2>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 px-6 sm:px-10 pb-4">
                    {(
                      [
                        { label: 'Problem', value: project.projectSummary.problem },
                        { label: 'Solution', value: project.projectSummary.solution },
                        { label: 'Impact', value: project.projectSummary.impact },
                        { label: 'Role', value: project.projectSummary.role },
                      ] as { label: string; value: string }[]
                    ).map(({ label, value }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.07 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-[120px,1fr] gap-1 sm:gap-8 py-5"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide pt-1 text-gray-400">{label}</span>
                        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">{value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* Overview Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="overview"
          ref={(el) => {
            if (el) sectionRefs.current['overview'] = el
          }}
          className="pt-8 sm:pt-16 pb-0 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Overview</h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Bocca is a curated gastronomic gifting experience designed to celebrate food, craft, and storytelling. The project brings together physical products and digital touchpoints to create a sensorial journey that begins before the box is opened and continues beyond the moment of gifting.
                </p>
                <p>
                  The challenge was to design a brand and digital experience that feels premium yet approachable, transforming a simple gift into a meaningful, memorable ritual.
                </p>
              </div>

              {/* Bento-style Gallery */}
              <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4" style={{ marginTop: '5rem' }}>
                {/* Large card - spans 2 columns */}
                <div className="relative overflow-hidden rounded-2xl col-span-2 aspect-[16/9] lg:aspect-[2/1]">
                  <Image
                    src="/projects/bocca/2.webp"
                    alt="Bocca Moments overview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>

                {/* Tall card - spans 2 rows on large screens, hidden on mobile */}
                <div className="hidden lg:block relative overflow-hidden rounded-2xl lg:row-span-2 aspect-square lg:aspect-auto lg:h-full">
                  <Image
                    src="/projects/bocca/1.webp"
                    alt="Bocca Moments details"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Square card */}
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <Image
                    src="/projects/bocca/4.webp"
                    alt="Bocca Moments experience"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Square card - hidden on mobile */}
                <div className="hidden lg:block relative overflow-hidden rounded-2xl aspect-square">
                  <Image
                    src="/projects/bocca/3.webp"
                    alt="Bocca Moments highlights"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* My Role Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="context"
          ref={(el) => {
            if (el) sectionRefs.current['context'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">My Role</h2>
              <div className="mt-2 mb-6 divide-y divide-gray-100 dark:divide-gray-800">
                {([
                  { icon: <BookOpen className="w-5 h-5" strokeWidth={1.5} />, title: 'Brand concept & storytelling', description: 'Defining the brand concept and storytelling' },
                  { icon: <Palette className="w-5 h-5" strokeWidth={1.5} />, title: 'Packaging & printed materials', description: 'Designing packaging and printed materials' },
                  { icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} />, title: 'Digital presence & website', description: 'Designing the digital presence and website' },
                  { icon: <Compass className="w-5 h-5" strokeWidth={1.5} />, title: 'Experience strategy', description: 'Developing the overall experience strategy' },
                ] as { icon: React.ReactNode; title: string; description: string }[]).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 py-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-base text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Design Focus Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="design-focus"
          ref={(el) => {
            if (el) sectionRefs.current['design-focus'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Design Focus</h2>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                The project focused on designing for depth over novelty, guided by three core principles.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { icon: Heart, title: 'Intimacy through design', description: 'Every element, from tone of voice to interaction pacing, reinforces closeness and attention.', image: '/projects/bocca/2.webp' },
                  { icon: Clock, title: 'Ritual instead of routine', description: 'The experience encourages slowing down, transforming consumption into a shared moment.', image: '/projects/bocca/3.webp' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-gray-800 overflow-hidden flex flex-col"
                    style={{ backgroundColor: '#171717' }}
                  >
                    <div className="p-6 space-y-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(99, 88, 51, 0.25)' }}>
                        <item.icon size={16} style={{ color: '#c9a84c' }} />
                      </div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="p-4 mt-auto">
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 800px"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Branding & Visual Identity Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="branding"
          ref={(el) => {
            if (el) sectionRefs.current['branding'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Branding & Visual Identity</h2>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                Bocca&apos;s visual identity was designed to reflect warmth, authenticity, and the joy of sharing food.
              </p>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                The brand needed to feel premium while remaining approachable, drawing inspiration from Mediterranean culinary culture and artisanal food markets.
              </p>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                The visual language combines earthy tones, expressive typography, and organic textures to create a brand that feels both refined and personal.
              </p>
              <div className="relative w-full rounded-2xl overflow-hidden">
                <Image
                  src="/projects/Bocca/Branding Bocca.webp"
                  alt="Bocca branding and visual identity"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Packaging Design Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="packaging"
          ref={(el) => {
            if (el) sectionRefs.current['packaging'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Packaging Design</h2>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                Packaging plays a key role in the Bocca experience.
              </p>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                The design needed to feel premium, warm and personal, and visually distinctive. Natural textures, earthy colors, and simple typography were used to create a brand identity that feels authentic and timeless.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  '/projects/Bocca/packaging-1.webp',
                  '/projects/Bocca/packaging-2.webp',
                  '/projects/Bocca/packaging-3.webp',
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Bocca packaging ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Digital Experience Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="digital"
          ref={(el) => {
            if (el) sectionRefs.current['digital'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Digital Experience</h2>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                To complement the physical product, I also designed a digital presence for Bocca.
              </p>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                The website allows users to explore the different box experiences, discover the stories behind each box, and purchase curated gastronomic gifts. The design emphasizes storytelling and visual immersion to reflect the tactile nature of the product.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Impact Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="impact"
          ref={(el) => {
            if (el) sectionRefs.current['impact'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Impact</h2>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                Bocca demonstrates how thoughtful design can elevate everyday experiences.
              </p>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                The project explores how branding, product design, and storytelling can work together to transform a simple gift into a meaningful shared moment.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Reflection Section - Bocca Only */}
      {project.id === 1 && (
        <section
          id="reflection-bocca"
          ref={(el) => {
            if (el) sectionRefs.current['reflection-bocca'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Reflection</h2>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                Designing Bocca highlighted the importance of thinking beyond individual touchpoints and designing complete experiences.
              </p>
              <div className="mt-2 mb-6 divide-y divide-gray-100 dark:divide-gray-800">
                {([
                  { icon: <Heart className="w-5 h-5" strokeWidth={1.5} />, title: 'Emotion over function', description: 'Experiences create stronger emotional connections than products alone.' },
                  { icon: <Sparkles className="w-5 h-5" strokeWidth={1.5} />, title: 'Storytelling as design', description: 'Storytelling can transform simple products into memorable moments.' },
                  { icon: <Globe className="w-5 h-5" strokeWidth={1.5} />, title: 'Cohesive identity', description: 'Cohesive design across physical and digital touchpoints strengthens brand identity.' },
                ] as { icon: React.ReactNode; title: string; description: string }[]).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 py-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-base text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

          {/* Overview Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="overview"
          ref={(el) => {
            if (el) sectionRefs.current['overview'] = el
          }}
          className="pt-8 sm:pt-16 pb-0 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Overview</h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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
          className="pt-8 sm:pt-16 pb-0 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Overview</h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  This project originated from the Loka Innovators Award, an initiative designed to explore new opportunities in healthcare innovation.
                </p>
                <p>
                  Working alongside Stanford Biodesign student winners, we conducted a design sprint to investigate how digital tools could improve the care journey for patients with Chronic Pelvic Pain Syndrome (CPPS).
                </p>
                <p>
                  The sprint brought together designers, healthcare innovators, and a physical therapist to explore the problem space and prototype potential solutions. The result was Onyx, a platform concept designed to help clinicians track treatment progress and communicate with patients more effectively.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Image Section - Cortado Only */}
      {project.id === 2 && (
        <section className="py-4 sm:py-8 px-0 sm:px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]">
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
                  src="/projects/Cortado/Ai-co-pilot.webp"
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
        <section className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]">
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

      {/* My Role Section - Onyx Only */}
      {project.id === 3 && (
        <section
          id="context"
          ref={(el) => {
            if (el) sectionRefs.current['context'] = el
          }}
          className="pt-8 sm:pt-16 pb-2 sm:pb-4 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">My Role</h2>
              <div className="mt-2 mb-6 divide-y divide-gray-100 dark:divide-gray-800">
                {([
                  { icon: <Search className="w-5 h-5" strokeWidth={1.5} />, title: 'Discovery & Synthesis', description: 'Participated in end-to-end discovery and synthesis' },
                  { icon: <MapPin className="w-5 h-5" strokeWidth={1.5} />, title: 'Design Sprint', description: 'Led an on-site, cross-functional design sprint at Stanford University to define the problem space, and explore early solution directions' },
                  { icon: <PenLine className="w-5 h-5" strokeWidth={1.5} />, title: 'Experience Definition', description: 'Contributed to overall experience definition and product framing' },
                  { icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} />, title: 'UI/UX Design', description: 'Owned the UI/UX design for the Physical Therapist viewport' },
                ] as { icon: React.ReactNode; title: string; description: string }[]).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 py-4"
                  >
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white"
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-base text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stanford Images Section - Onyx Only */}
      {project.id === 3 && (
        <section className="pt-4 pb-8 sm:pb-16 px-0 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]">
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

      {/* Design Sprint Section - Onyx Only */}
      {project.id === 3 && (
        <section
          id="design-sprint"
          ref={(el) => {
            if (el) sectionRefs.current['design-sprint'] = el
          }}
          className="pt-8 sm:pt-16 pb-8 sm:pb-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">The Design Sprint</h2>
              <div className="w-full rounded-2xl overflow-hidden">
                <video
                  src="/projects/Onyx/Design Sprint.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-2xl"
                />
              </div>
              <div className="space-y-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  We conducted a design sprint with Loka designers, Stanford Biodesign student winners, and a physical therapist to better understand the CPPS care journey and explore potential solutions.
                </p>
                <p>
                  Through exercises such as <span className="text-white font-medium">user persona creation, problem framing, journey mapping, and rapid ideation</span>, the team identified key opportunities to improve clinician visibility into patient progress and communication.
                </p>
                <p>
                  The sprint ultimately shaped the core direction for the Onyx platform.
                </p>
              </div>
              <div className="w-full rounded-2xl overflow-hidden">
                <Image
                  src="/projects/Onyx/Design Sprint board.webp"
                  alt="Design Sprint board"
                  width={1200}
                  height={800}
                  className="w-full rounded-2xl"
                />
              </div>
            </motion.div>
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
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Understanding the Problem</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* Text Content - Left Side */}
                <div className="space-y-6 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed flex flex-col">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium text-white mb-4">CPPS as a Care Challenge</h3>
                    <p>
                      CPPS affects a significant portion of the population, yet patients often spend years navigating unclear diagnoses, fragmented care, and inconsistent treatment plans. Symptoms fluctuate, progress is rarely linear, and setbacks are common.
                    </p>
                  </div>
                  <p>
                    <span className="text-white font-medium">Patients</span> often interact with multiple specialists throughout their treatment journey, which makes care coordination challenging.
                  </p>
                  <p>
                    <span className="text-white font-medium">Clinicians</span> frequently lack tools to track patient progress between visits and maintain consistent communication with patients.
                  </p>
                  <p>
                    This creates fragmented care and limited visibility into treatment adherence.
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
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">The Clinician Perspective</h2>
              <div className="space-y-6 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Through discovery and direct collaboration with pelvic floor physical therapists, several recurring constraints emerged:
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {([
                  { icon: <Clock className="w-5 h-5" strokeWidth={1.5} />, title: 'Limited Session Time', description: 'Requiring fast context-building and decision-making within each appointment' },
                  { icon: <BookOpen className="w-5 h-5" strokeWidth={1.5} />, title: 'High Education Burden', description: 'Therapists must tailor explanations to different learning styles, every session' },
                  { icon: <Link2 className="w-5 h-5" strokeWidth={1.5} />, title: 'Low Continuity', description: 'Cancellations, flare-ups, and remote disengagement break the care thread between visits' },
                  { icon: <FileText className="w-5 h-5" strokeWidth={1.5} />, title: 'Fragmented Charting', description: 'Existing systems make it hard to track symptom progression over time' },
                  { icon: <Layers className="w-5 h-5" strokeWidth={1.5} />, title: 'CPPS Complexity', description: 'Spanning physical, emotional, dietary, sexual, and stress-related factors simultaneously' },
                ] as { icon: React.ReactNode; title: string; description: string }[]).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-gray-800 p-6 flex flex-col items-start gap-4"
                    style={{ backgroundColor: '#171717' }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center" style={{ color: themeColors.iconText }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-base text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
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
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Design Focus</h2>
              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                Based on research insights, we identified key design priorities to guide the platform experience.
              </p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Focus areas</p>
                <div className="divide-y divide-gray-800">
                  {[
                    { title: 'Improve visibility into patient progress', description: 'Design a clear dashboard that helps clinicians quickly understand patient status and treatment activity.' },
                    { title: 'Enable clinician-patient communication', description: 'Provide an integrated messaging system to support ongoing communication and follow-ups.' },
                    { title: 'Support treatment tracking', description: 'Allow clinicians to monitor exercises and patient activity over time.' },
                    { title: 'Reduce workflow friction', description: 'Design an interface that fits naturally into clinicians\' existing workflows.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className="py-4 flex gap-4"
                    >
                      <span className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-sm font-semibold text-white shrink-0">{i + 1}</span>
                      <div>
                        <p className="text-base font-semibold text-white">{item.title}</p>
                        <p className="text-base text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* The Physical Therapist Viewport / Key Features Section - Onyx Only */}
      {project.id === 3 && (
        <section 
          id="features"
          ref={(el) => {
            if (el) sectionRefs.current['features'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">The Solution</h2>

              {/* Feature Cards */}
              <div className="space-y-10">
                {[
                  {
                    title: 'Patient Management Dashboard',
                    video: '/projects/Onyx/Patient-Profile.webm',
                    problem: 'Clinicians needed a clear overview of patient status and treatment progress.',
                    solution: 'A dashboard that centralizes patient information, treatment progress, and activity updates.',
                    outcome: 'Clinicians can quickly understand patient status and prioritize follow-ups.',
                  },
                  {
                    title: 'In-App Messaging & Care Coordination',
                    video: '/projects/Onyx/Messages.webm',
                    problem: 'Clinicians often rely on external tools like email or phone calls to communicate with patients, which fragments conversations and raises patient data privacy concerns.',
                    solution: 'A secure in-app messaging system enables clinicians and patients to communicate directly within the platform.',
                    outcome: 'Centralized conversations, faster communication, and improved protection of sensitive patient information.',
                  },
                  {
                    title: 'Exercise Creation & Library',
                    video: '/projects/Onyx/Library.webm',
                    problem: 'Creating exercise plans from scratch for every patient slowed down clinicians and created inconsistent treatment workflows.',
                    solution: 'An exercise creation tool combined with a reusable library allows therapists to quickly assign previously created exercises to patients.',
                    outcome: 'Faster treatment plan creation and more consistent exercise programs across patients.',
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-gray-800 overflow-hidden"
                    style={{ backgroundColor: '#171717' }}
                  >
                    <div className="relative w-full aspect-video">
                      <video
                        src={feature.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="border-t border-gray-800">
                      <div className="p-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-sm font-semibold text-white shrink-0">{i + 1}</span>
                        <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                      </div>
                      <div className="divide-y divide-gray-800">
                        {[
                          { label: 'Problem', text: feature.problem },
                          { label: 'Solution', text: feature.solution },
                          { label: 'Outcome', text: feature.outcome },
                        ].map((item) => (
                          <div key={item.label} className="px-6 py-4 flex gap-4">
                            <span className="text-xs font-semibold uppercase tracking-widest w-20 shrink-0 pt-0.5 text-gray-500">{item.label}</span>
                            <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Reflection Section - Onyx Only */}
      {project.id === 3 && (
        <section
          id="reflection"
          ref={(el) => {
            if (el) sectionRefs.current['reflection'] = el
          }}
          className="pt-8 sm:pt-16 pb-24 sm:pb-32 px-6 sm:px-6 lg:px-12 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Reflection</h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                <p>
                  Designing Onyx highlighted how important visibility and communication are in complex healthcare journeys. Working closely with clinicians helped ensure the platform addressed real workflow challenges rather than theoretical ones.
                </p>
                <p>
                  The design sprint proved particularly valuable in aligning stakeholders and quickly identifying the most impactful product opportunities.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* My Role Section - Cortado Only */}
      {project.id === 2 && (
        <section 
          id="context"
          ref={(el) => {
            if (el) sectionRefs.current['context'] = el
          }}
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">My Role</h2>
              <div className="mt-2 mb-6 divide-y divide-gray-100 dark:divide-gray-800">
                {([
                  { icon: <Eye className="w-5 h-5" strokeWidth={1.5} />, title: 'Research Synthesis', description: 'Reviewing and synthesizing insights generated from the design sprint' },
                  { icon: <PenLine className="w-5 h-5" strokeWidth={1.5} />, title: 'Experience & UX', description: 'Translating research outcomes into product concepts and UX decisions' },
                  { icon: <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} />, title: 'UI Design', description: 'Designing key UI screens and interaction patterns' },
                  { icon: <Grid className="w-5 h-5" strokeWidth={1.5} />, title: 'Design System', description: 'Supporting the team with visual clarity and system-level consistency' },
                ] as { icon: React.ReactNode; title: string; description: string }[]).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 py-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-base text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
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
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Understanding the Users</h2>
              <div className="space-y-6 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm p-6 flex flex-col items-start"
                >
                  <RefreshCw className="w-6 h-6 text-gray-400 mb-3" />
                  <h3 className="font-medium text-white mb-2">Work is fragmented across too many tools</h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm">Listings, guest communication, pricing, and operations live in separate platforms, forcing constant context switching.</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm p-6 flex flex-col items-start"
                >
                  <MessageSquare className="w-6 h-6 text-gray-400 mb-3" />
                  <h3 className="font-medium text-white mb-2">Guest communication dominates daily work</h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm">Responding to repetitive guest messages takes up several hours a day and frequently interrupts higher-value tasks.</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm p-6 flex flex-col items-start"
                >
                  <Eye className="w-6 h-6 text-gray-400 mb-3" />
                  <h3 className="font-medium text-white mb-2">Automation must remain transparent</h3>
                  <p className="text-gray-800 dark:text-gray-200 text-sm">Operators are open to AI assistance, but only when they can understand, review, and stay in control of system actions.</p>
                </motion.div>
              </div>
              <div className="mt-6 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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
          className="pt-8 sm:pt-16 pb-0 px-6 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Design Focus</h2>
              <div className="space-y-6 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm p-6 flex flex-col items-start"
                >
                  <Accessibility className="w-6 h-6 text-gray-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Reducing cognitive load in message-heavy workflows</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm p-6 flex flex-col items-start"
                >
                  <Eye className="w-6 h-6 text-gray-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Making AI assistance visible without feeling intrusive</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm p-6 flex flex-col items-start"
                >
                  <Settings className="w-6 h-6 text-gray-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Supporting fast decisions while preserving user control</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm p-6 flex flex-col items-start"
                >
                  <LayoutDashboard className="w-6 h-6 text-gray-400 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200">Structuring complex information into calm, scannable layouts</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Design Focus Images Section - Cortado Only */}
      {project.id === 2 && (
        <section className="pt-4 pb-8 sm:pb-16 px-0 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]">
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
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]"
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
                <h2 className="text-2xl sm:text-3xl font-medium text-white mb-2">Solution</h2>
                <h3 className="text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-6">An AI-Assisted Inbox</h3>
              </div>
              <div className="space-y-6 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm overflow-hidden flex flex-col"
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
                    <PenLine className="w-6 h-6 text-gray-400 mb-3" />
                    <p className="text-gray-800 dark:text-gray-200">Suggests draft replies that users can review and edit</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm overflow-hidden flex flex-col"
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
                    <LayoutDashboard className="w-6 h-6 text-gray-400 mb-3" />
                    <p className="text-gray-800 dark:text-gray-200">Pulls context from reservations, policies, and property data</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-sm overflow-hidden flex flex-col"
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
                    <Rocket className="w-6 h-6 text-gray-400 mb-3" />
                    <p className="text-gray-800 dark:text-gray-200">Learns from user feedback to improve future suggestions</p>
                  </div>
                </motion.div>
              </div>
              <div className="mt-6 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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
          className="py-8 sm:py-16 px-6 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl sm:text-3xl font-medium text-white border-b border-white/10 pb-4">Reflection</h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
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
        className="py-24 px-6 sm:px-6 lg:px-8 bg-[#171717]"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
              <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-12 tracking-tight">Next Project</h2>
              <Link href={`/projects/${nextProject.id}`} className="group">
              <div
                className="relative cursor-pointer bg-[#1e1e1e]/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl hover:shadow-gray-500/10 hover:scale-[1.05] transition-all duration-500 ease-out overflow-visible"
                style={{ ['--hover-border' as string]: '2px solid #0f8be8' }}
                onMouseEnter={e => (e.currentTarget.style.outline = '2px solid #0f8be8')}
                onMouseLeave={e => (e.currentTarget.style.outline = '')}
              >
                {/* Corner Squares */}
                <div className="absolute -top-[5px] -left-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
                <div className="absolute -top-[5px] -right-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
                <div className="absolute -bottom-[5px] -left-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
                <div className="absolute -bottom-[5px] -right-[5px] w-2 h-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#0f8be8' }} />
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[300px] overflow-hidden">
                    <div className="relative overflow-hidden min-h-[300px]">
                      {nextProject.heroImage ? (
                        <Image
                          src={nextProject.heroImage}
                          alt={`${nextProject.title} hero image`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div className={`bg-gradient-to-br ${nextProject.gradient} flex items-center justify-center h-full min-h-[300px]`}>
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
                    <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center text-left space-y-5">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight">
                        {nextProject.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        {nextProject.description}
                    </p>
                    <div className="flex items-center font-medium text-gray-400 group-hover:translate-x-2 transition-transform duration-300 pt-2">
                      <span>View case study</span>
                      <ArrowRight size={18} className="ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
      )}

      {/* Custom Cursor - Rendered via Portal to ensure it's above all elements */}
      {mounted && createPortal(
        <FigmaCursor
          label={null}
          showPill={false}
          shouldReduceMotion={shouldReduceMotion || false}
          isDesktop={isDesktop}
        />,
        document.body
      )}
    </div>
  )
}

export default ProjectDetailPage
