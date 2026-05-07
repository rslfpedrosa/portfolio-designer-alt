// Central project data - edit once, use everywhere!

export type IconKey =
  | 'type'
  | 'droplet'
  | 'camera'
  | 'map'
  | 'cog'
  | 'shopping-cart'
  | 'rocket'
  | 'grid'
  | 'accessibility'
  | 'pen-line'
  | 'package'

export interface ProjectTheme {
  tagBg: string
  tagText: string
  badgeBg: string
  badgeText: string
  accentText: string
  accentHoverText?: string
  iconBg: string
  iconText: string
  surfaceBg?: string
  surfaceRing?: string
}

export interface ProjectMediaItem {
  src: string
  alt: string
  caption?: string
  type?: 'image' | 'video'
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface ProjectMediaStack {
  stacked: ProjectMediaItem[]
}

export interface ProjectMediaGrid {
  grid: ProjectMediaItem[]
}

export type SectionBreakMedia = ProjectMediaItem | ProjectMediaStack | ProjectMediaGrid

export interface ProjectSectionCard {
  title: string
  description: string
  icon?: IconKey
}

export interface ProjectVisualDesignSection {
  tag: string
  heading: string
  description: string
  pillars: ProjectSectionCard[]
  media?: ProjectMediaItem[]
}

export interface ProjectPhysicalTouchpointSection {
  tag: string
  heading: string
  description: string
  bullets: string[]
  media?: ProjectMediaItem[]
}

export interface ProjectDesignSystemSection {
  tag: string
  heading: string
  description: string
  pillars: ProjectSectionCard[]
  media?: ProjectMediaItem[]
}

export interface ProjectSolutionSection {
  tag: string
  heading: string
  description: string
  highlights: ProjectSectionCard[]
}

export interface ProjectProcessSection {
  tag: string
  heading: string
  items: ProjectSectionCard[]
}

export interface ProjectKeyScreensSection {
  tag: string
  heading: string
  media: ProjectMediaItem[]
}

export interface ProjectReflectionSection {
  tag: string
  heading: string
  outcome: string
  quote?: string
  learnings: string[]
  nextSteps: string[]
}

export interface ProjectSections {
  visualDesign?: ProjectVisualDesignSection
  physicalTouchpoint?: ProjectPhysicalTouchpointSection
  designSystem?: ProjectDesignSystemSection
  solution?: ProjectSolutionSection
  process?: ProjectProcessSection
  keyScreens?: ProjectKeyScreensSection
  reflection?: ProjectReflectionSection
}

export interface ProjectSummary {
  problem: string
  solution: string
  impact: string
  role: string
}

export interface ProjectTimelinePhase {
  phase: string
  duration: string
  activities: string[]
  date?: string
  description?: string
  marker?: 'dot' | 'shield' | 'square'
  startWeek?: number
  endWeek?: number
}

export interface Project {
  id: number
  title: string
  subtitle: string
  tagline?: string
  description: string
  category: string
  type: string
  role: string
  timeline: string
  industry: string
  year: string
  team: string
  tools: string[]
  productWebsite?: {
    label?: string
    url: string
  }
  gradient: string
  tags: string[]
  heroImage: string
  cardImage?: string
  challenge: string
  projectSummary?: ProjectSummary
  projectTimeline?: ProjectTimelinePhase[]
  timelineColumnLabels?: string[]
  theme: ProjectTheme
  sections: ProjectSections
  sectionBreaks?: SectionBreakMedia[]
}

export const projectsData: { [key: number]: Project } = {
  1: {
    id: 1,
    title: 'Bocca Moments',
    subtitle: 'Crafting a sensorial digital commerce experience',
    tagline: 'A premium brand and e-commerce experience built around the ritual of gifting.',
    description:
      'Crafting a premium digital experience around the ritual of gifting.',
    category: 'Web Design',
    type: 'Case Study',
    role: 'Lead Product Designer',
    timeline: '6 months',
    industry: 'E-Commerce',
    year: '2023',
    team: '1 Designer, 1 Developer',
    tools: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects'],
    productWebsite: {
      url: 'https://www.boccamoments.com/',
      label: 'Visit Bocca Moments',
    },
    gradient: 'from-amber-200 to-stone-500',
    tags: ['Brand Experience', 'E-commerce', 'Digital Launch'],
    heroImage: '/projects/bocca-moments-hero.webp',
    cardImage: '/projects/bocca-moments-hero.webp',
    challenge: `The challenge was to bring emotional depth to a market saturated with subscription boxes focused on convenience. Bocca aimed to stand apart by offering a curated, sensorial experience, not just products, designed to surprise, nurture, and connect people through moments around the table.`,
    projectSummary: {
      problem: 'The gifting market lacked emotional depth most boxes felt transactional rather than meaningful or memorable.',
      solution: 'A premium brand and e-commerce experience that transforms a gastronomic gift into a curated, sensorial ritual.',
      impact: 'A cohesive brand identity and digital presence that launched Bocca Moments as a distinctive, story-driven product.',
      role: 'Lead Product Designer brand identity, packaging design, and full e-commerce experience.',
    },
    projectTimeline: [
      { phase: 'Brand Discovery', duration: 'Month 1', activities: [], startWeek: 1, endWeek: 1 },
      { phase: 'Identity Design', duration: 'Month 2', activities: [], startWeek: 2, endWeek: 2 },
      { phase: 'Packaging Design', duration: 'Month 3', activities: [], startWeek: 3, endWeek: 3 },
      { phase: 'Digital Design', duration: 'Months 4–5', activities: [], startWeek: 4, endWeek: 5 },
      { phase: 'Launch', duration: 'Month 6', activities: [], startWeek: 6, endWeek: 6 },
    ],
    theme: {
      tagBg: 'rgba(99, 88, 51, 0.2)',
      tagText: '#635833',
      badgeBg: 'rgba(99, 88, 51, 0.2)',
      badgeText: '#635833',
      accentText: '#965534',
      accentHoverText: '#b86a43',
      iconBg: 'rgba(150, 85, 52, 0.2)',
      iconText: '#965534',
      surfaceBg: 'rgba(99, 88, 51, 0.08)',
      surfaceRing: 'rgba(99, 88, 51, 0.25)',
    },
    sectionBreaks: [
      {
        src: '/videos/boccademo2.webm',
        alt: 'Bocca Moments hero motion interlude',
        type: 'video',
        poster: '/projects/bocca-moments-hero.webp',
        autoPlay: true,
        loop: true,
        muted: true,
      },
      {
        grid: [
          {
            src: '/projects/bocca_print_1.webp',
            alt: 'Bocca packaging collage card 1',
          },
          {
            src: '/projects/bocca_print_3.webp',
            alt: 'Bocca packaging collage card 2',
          },
        ],
      },
      {
        stacked: [
          {
            src: '/videos/boccademo.webm',
            alt: 'Bocca material mood board interlude motion',
            type: 'video',
            poster: '/projects/bocca_print_3.webp',
            autoPlay: true,
            loop: true,
            muted: true,
          },
          {
            src: '/projects/emails.webp',
            alt: 'Bocca material mood board interlude still',
          },
        ],
      },
      {
        stacked: [
          {
            src: '/projects/boccasolution1.webp',
            alt: 'Bocca final experience interlude 1',
          },
          {
            src: '/projects/boccasolution1.webp',
            alt: 'Bocca final experience interlude 2',
          },
          {
            src: '/projects/boccasolution1.webp',
            alt: 'Bocca final experience interlude 3',
          },
        ],
      },
    ],
    sections: {
      visualDesign: {
        tag: 'Visual design',
        heading: 'A warm, tactile identity that carries emotion',
        description:
          'Playful typography, grounded colors, and human-centric motion unite to bring the sensorial Bocca ritual online while preserving calm and focus.',
        pillars: [
          {
            title: 'Typography',
            description:
              'Playfair for headlines to add intimacy and ceremony, paired with a clean sans for clarity. Tight tracking on titles, generous line-height for long-form calm.',
            icon: 'type',
          },
          {
            title: 'Color',
            description:
              'Earthy neutrals with subtle rosé accents echo kraft, cotton, and wax packaging. Contrast stays soft while meeting AA for readability.',
            icon: 'droplet',
          },
          {
            title: 'Motion & Imagery',
            description:
              'Slow fades with 200–350ms easings. Human-first photography featuring hands and texture keeps presence over perfection.',
            icon: 'camera',
          },
        ],
        media: [
          {
            src: '/projects/bocca_visual_design_1.webp',
            alt: 'Typography specimen for Bocca Moments hero',
            caption: 'Type scale & specimen',
          },
          {
            src: '/projects/bocca_visual_design_2.webp',
            alt: 'Bocca Moments color palette swatches',
            caption: 'Palette swatches & ratios',
          },
        ],
      },
      physicalTouchpoint: {
        tag: 'Physical touchpoint',
        heading: 'The Bocca box a ritual of opening',
        description:
          'The digital story mirrors the unboxing journey: anticipation → reveal → savor. Materials and colors in the UI echo kraft, ribbon, and wax packaging while CTAs adopt ceremonial language.',
        bullets: [
          'Photography frames hands and textures for tactile presence.',
          'Subtle confetti on success becomes a small celebration.',
          'Edition accent colors extend to packaging details and stickers.',
        ],
        media: [
          {
            src: '/projects/bocca_print_1.webp',
            alt: 'Bocca Moments unboxing ritual',
            caption: 'Unboxing journey highlights',
          },
        ],
      },
      designSystem: {
        tag: 'Design system',
        heading: 'A lightweight system for consistency and calm',
        description:
          'Tokens, components, and content guidelines keep every edition cohesive without feeling templated. The system stays small enough to adapt while preserving ritual.',
        pillars: [
          {
            title: 'Tokens',
            description: 'Spacing (4/8/12/16), type scale, radii, shadows, and motion durations.',
            icon: 'grid',
          },
          {
            title: 'Components',
            description: 'Buttons, pills, media cards, product panel, size selector, toast, modal.',
            icon: 'cog',
          },
          {
            title: 'Accessibility',
            description: 'Color contrast for text, focus rings, touch targets, and semantic labels.',
            icon: 'accessibility',
          },
          {
            title: 'Content',
            description: 'Microcopy tone: calm, present-tense, short lines; cadence guide for headlines.',
            icon: 'pen-line',
          },
        ],
        media: [
          {
            src: '/projects/bocca_designsystem.webp',
            alt: 'Bocca Moments design system components',
            caption: 'Component specimens (buttons, selectors, cards)',
          },
        ],
      },
      solution: {
        tag: 'Solution',
        heading: 'A narrative-led experience that feels like opening a gift',
        description:
          'I structured the site as a guided story: gentle motion to suggest tactility, warm typography, and focused decisions. The purchase moment is intentionally quiet fewer choices, more certainty amplifying exclusivity rather than variety.',
        highlights: [
          {
            title: 'Emotional Storytelling',
            description: 'Sections map to curiosity → discovery → anticipation → purchase → connection.',
          },
          {
            title: 'Warm Visual Identity',
            description: 'Earthy palette, Playfair accents, soft motion, intimate photography.',
          },
          {
            title: 'Seamless Purchase Flow',
            description: 'A calm, minimal checkout with clear size options and stock cues.',
          },
          {
            title: 'Launch Ecosystem',
            description: 'Newsletter + social assets to introduce each limited edition.',
          },
        ],
      },
      process: {
        tag: 'Process',
        heading: 'How I worked',
        items: [
          {
            title: 'Experience Mapping',
            description:
              'Defined a flow that mirrors gift-giving: set the scene → reveal → savor → share. This shaped the content rhythm and micro-interactions.',
            icon: 'map',
          },
          {
            title: 'Design System & Motion',
            description:
              'Built a small token system (spacing, type scales, elevations). Motion emphasizes presence, not spectacle 200–350ms easing, stagger on enter.',
            icon: 'cog',
          },
          {
            title: 'Purchase Flow Simplification',
            description:
              'Reduced cognitive load: fewer visible choices, clear stock states, accessible labels, and strong mobile ergonomics.',
            icon: 'shopping-cart',
          },
          {
            title: 'Launch Content',
            description: 'Designed reusable post templates and an email block to announce each edition consistently.',
            icon: 'rocket',
          },
        ],
      },
      keyScreens: {
        tag: 'Key screens',
        heading: 'Highlights from the final experience',
        media: [
      {
        src: '/projects/bocca-gallery-1.webp',
        alt: 'Bocca Moments website hero showcasing the curated gift box and wine pairing',
        caption: 'Homepage hero framing the ritual of gifting and sharing Bocca Moments.',
      },
      {
        src: '/projects/bocca-gallery-2.webp',
        alt: 'Mobile layout of Bocca Moments highlighting the experience on smaller screens',
        caption: 'Responsive mobile layout preserves warmth and storytelling on the go.',
      },
      {
        src: '/projects/bocca-gallery-3.webp',
        alt: 'Detail view of the Bocca Moments product story and ingredient highlights',
        caption: 'Product storytelling module highlighting ingredients and chef notes.',
      },
    ],
      },
      reflection: {
        tag: 'Reflection',
        heading: 'What mattered & what I’d do next',
        outcome:
          'The final experience communicates care and exclusivity through rhythm, motion, and language. While we didn’t capture quantified metrics, qualitative feedback emphasized how “calm and intentional” the journey felt.',
        quote:
          'Luxury isn’t about complexity it’s about intention. The simplest path, crafted well, felt premium.',
        learnings: [
          'Designing emotion requires pacing as much as visuals.',
          'Micro-copy and motion timing shape perceived quality.',
          'Exclusivity benefits from fewer, clearer decisions.',
        ],
        nextSteps: [
          'A/B test alternative story lengths.',
          'Explore a guided unboxing micro-site for each edition.',
          'Add subtle audio haptics opt-in for ritual moments.',
        ],
      },
    },
  },
  2: {
    id: 2,
    title: 'Cortado',
    subtitle: 'Simplifying rental workflows through AI',
    tagline: 'Reducing operational complexity for landlords through AI-powered workflows.',
    description: 'Reducing operational complexity for landlords through AI-powered workflows',
    category: 'UX Design',
    type: 'Case Study',
    role: 'Product Designer',
    timeline: '4 months',
    industry: 'PropTech / SaaS',
    year: '2024',
    team: '4 designers',
    tools: ['Figma', 'FigJam'],
    gradient: 'from-gray-400 to-pink-500',
    tags: ['GenAI', 'Automation', 'SaaS'],
    heroImage: '/projects/Cortado/012.webp',
    cardImage: '/projects/Cortado/012.webp',
    challenge: `Cortado is a GenAI-powered SaaS platform built to simplify the lives of independent landlords
and small property managers. The goal: to take fragmented, manual rental operations and
centralize them into one AI-assisted workspace, from messaging and leasing to maintenance and
marketing.`,
    projectSummary: {
      problem: 'Independent landlords manage rentals across disconnected tools leading to missed messages, slow responses, and operational chaos.',
      solution: 'A GenAI-powered SaaS workspace that centralizes messaging, leasing, maintenance, and marketing in one place.',
      impact: 'Reduced operational overhead for small landlords, with AI automating the most repetitive and time-consuming tasks.',
      role: 'Product Designer end-to-end UX, user research, and interaction design across a 4-month sprint.',
    },
    projectTimeline: [
      { phase: 'Research', duration: 'Month 1', activities: [], startWeek: 1, endWeek: 1 },
      { phase: 'Architecture', duration: 'Month 2', activities: [], startWeek: 2, endWeek: 2 },
      { phase: 'Design', duration: 'Month 3', activities: [], startWeek: 3, endWeek: 3 },
      { phase: 'Testing & Handoff', duration: 'Month 4', activities: [], startWeek: 4, endWeek: 4 },
    ],
    theme: {
      tagBg: 'rgba(163, 163, 163, 0.15)',
      tagText: '#525252',
      badgeBg: 'rgba(163, 163, 163, 0.15)',
      badgeText: '#525252',
      accentText: '#A074FA',
      accentHoverText: '#a3a3a3',
      iconBg: 'rgba(163, 163, 163, 0.15)',
      iconText: '#737373',
      surfaceBg: 'rgba(163, 163, 163, 0.1)',
      surfaceRing: 'rgba(163, 163, 163, 0.2)',
    },
    sections: {
      visualDesign: {
        tag: 'Visual design',
        heading: 'A calming interface that adapts to every session',
        description:
          'Soft gradients, intentional typography, and gentle motion create a digital sanctuary that flexes with user intention and energy.',
        pillars: [
          {
            title: 'Typography',
            description: 'Rounded sans for calm reading with a serif accent for moments of guidance and gratitude.',
            icon: 'type',
          },
          {
            title: 'Color',
            description: 'Twilight gradients shift based on streaks and mood check-ins while keeping contrast AA compliant.',
            icon: 'droplet',
          },
          {
            title: 'Motion & Sound',
            description: 'Breathing-inspired easing and ambient audio pairings reinforce mindful cadence.',
            icon: 'camera',
          },
        ],
        media: [
          {
            src: '/projects/mindful-gallery-1.webp',
            alt: 'Mindful Meditation dashboard with calming gradients',
            caption: 'Adaptive home dashboard',
          },
          {
            src: '/projects/mindful-gallery-2.webp',
            alt: 'Mindful Meditation session selection screen',
            caption: 'Session selector and mood pairing',
          },
        ],
      },
      physicalTouchpoint: {
        tag: 'Habit loop',
        heading: 'Designing a ritual that rewards consistency',
        description:
          'Daily rhythm is supported through mindful prompts and motion that never startles. The experience bridges in-app focus with offline breathing exercises.',
        bullets: [
          'Microcopy speaks in present tense to keep attention anchored.',
          'Haptic nudge and chime mark the end of each milestone, creating closure.',
          'Guided cards suggest off-screen breathing or stretching when streak fatigue is detected.',
        ],
        media: [
          {
            src: '/projects/bocca_print_1.webp',
            alt: 'Mindful Meditation onboarding screens',
            caption: 'Onboarding + goal setting',
          },
          {
            src: '/projects/bocca_print_2.webp',
            alt: 'Mindful Meditation persona insights',
            caption: 'Persona and journey artifacts',
          },
          {
            src: '/projects/bocca_print_3.webp',
            alt: 'Mindful Meditation journey map snapshot',
            caption: 'Journey map checkpoints',
          },
          {
            src: '/projects/bocca_print_3.webp',
            alt: 'Mindful Meditation UI design system',
            caption: 'UI system specimen',
          },
        ],
      },
      designSystem: {
        tag: 'Design system',
        heading: 'A mindful kit for rapid experimentation',
        description:
          'A compact set of tokens and components keeps experimentation lightweight while preserving the calm tone across flows.',
        pillars: [
          {
            title: 'Tokens',
            description: 'Time-based spacing scale synced with breathing count (4/6/8/10).',
            icon: 'grid',
          },
          {
            title: 'Components',
            description: 'Meditation cards, streak tracker, mood selector, breathing timer, ritual library.',
            icon: 'cog',
          },
          {
            title: 'Accessibility',
            description: 'Voice guidance scripts, adjustable motion, dark mode with same emotional palette.',
            icon: 'accessibility',
          },
          {
            title: 'Content',
            description: 'Tone guidelines for supportive, invitational language across notifications.',
            icon: 'pen-line',
          },
        ],
        media: [
          {
            src: '/projects/mindful-gallery-3.webp',
            alt: 'Mindful Meditation progress tracking analytics view',
            caption: 'Component specimens and progress visuals',
          },
        ],
      },
      solution: {
        tag: 'Solution',
        heading: 'A personalized meditation companion that meets users where they are',
        description:
          'Adaptive programs, mindful reminders, and ambient soundscapes respond to the user’s energy and available time.',
        highlights: [
          {
            title: 'Personalized Programs',
            description: 'Adaptive meditation plans based on goals, streaks, and preferred guidance levels.',
          },
          {
            title: 'Progress Tracking',
            description: 'Visual journey mapping keeps focus on momentum instead of perfect streaks.',
          },
          {
            title: 'Ambient Soundscapes',
            description: 'Gentle audio environments match focus intent without overwhelming.',
          },
          {
            title: 'Mindful Reminders',
            description: 'Smart notifications respect quiet hours and reflect user mood logs.',
          },
        ],
      },
      process: {
        tag: 'Process',
        heading: 'How I worked',
        items: [
      {
        title: 'User Research',
            description: 'Interviewed 20 practitioners to uncover ritual blockers and motivation cues.',
            icon: 'map',
      },
      {
        title: 'Persona Development',
            description: 'Framed archetypes around energy levels, daily cadence, and accountability needs.',
            icon: 'cog',
      },
      {
        title: 'Journey Mapping',
            description: 'Mapped discovery → commitment → celebration loops to surface key drop-offs.',
            icon: 'shopping-cart',
      },
      {
        title: 'UI Design',
            description: 'Crafted a calming interface with motion patterns tied to breath cadence.',
            icon: 'rocket',
          },
        ],
      },
      keyScreens: {
        tag: 'Key screens',
        heading: 'Moments from the final experience',
        media: [
      {
        src: '/projects/mindful-gallery-1.webp',
        alt: 'Mindful Meditation mobile dashboard with calming gradients',
            caption: 'Adaptive dashboard with progress cues',
      },
      {
        src: '/projects/mindful-gallery-2.webp',
        alt: 'Mindful Meditation personalized session selection screen',
            caption: 'Personalized session picker',
      },
      {
        src: '/projects/mindful-gallery-3.webp',
        alt: 'Mindful Meditation progress tracking analytics view',
            caption: 'Progress and reflection insights',
          },
        ],
      },
      reflection: {
        tag: 'Reflection',
        heading: 'Lessons from building a mindful habit companion',
        outcome:
          'Qualitative feedback highlighted how approachable the flow felt compared to existing meditation apps. The design balanced personalization with calm defaults.',
        learnings: [
          'Routine support needs to be flexible rigid streaks discourage newcomers.',
          'Session transitions must feel deliberate; fast UI equals anxious UI in this context.',
          'Tone guidelines are as critical as visual design for perceived care.',
        ],
        nextSteps: [
          'Pair meditation streaks with journaling prompts for deeper reflection.',
          'Test community accountability loops without harming introvert experiences.',
          'Integrate with wearable breathing feedback for richer personalization.',
        ],
      },
    },
  },
  3: {
    id: 3,
    title: 'Onyx',
    subtitle: 'Rethinking care management for CPPS treatment',
    tagline: 'Making it easier for physical therapists to track progress, make decisions, and adapt care with confidence.',
    description: 'Making it easier for physical therapists to track progress, make decisions, and adapt care with confidence.',
    category: 'UI Design',
    type: 'Case Study',
    role: 'Senior UI Designer',
    timeline: '5 months',
    industry: 'Digital Health',
    year: '2024',
    team: '4 designers, 5 developers, 2 PMs',
    tools: ['Figma', 'After Effects', 'ProtoPie', 'Zeplin'],
    gradient: 'from-gray-400 to-gray-600',
    tags: ['Healthcare', 'Design Sprint', 'Care Management'],
    heroImage: '/projects/Onyx/B-Mockups, PSD.webp',
    cardImage: '/projects/Onyx/B-Mockups, PSD.webp',
    challenge: `This project originated from the Loka Innovators Award, an initiative designed to explore new opportunities in healthcare innovation.

Working alongside Stanford Biodesign fellows and a cross-functional team, we conducted a design sprint to investigate how digital tools could improve the care journey for patients with Chronic Pelvic Pain Syndrome (CPPS).

The sprint brought together clinicians, designers, and engineers to explore the problem space and prototype potential solutions. The result was Onyx, a platform designed to help clinicians track treatment progress and communicate with patients more effectively.`,
    projectSummary: {
      problem: 'CPPS patients face fragmented care, years of uncertainty, and little structured guidance.',
      solution: 'A health platform for symptom tracking, education, and clinician-patient communication.',
      impact: 'Clearer care continuity, better treatment tracking, and a more supported patient experience.',
      role: 'Interface design, design system, and prototyping in collaboration with clinicians and Stanford Biodesign participants.',
    },
    projectTimeline: [
      { phase: 'Award', duration: 'June 2025', activities: [], description: 'Team Onyx wins the 1st Loka Innovators Award.', marker: 'dot' },
      { phase: 'Project Kick-off', duration: 'June – July 2025', activities: [], description: 'Project prep and goal alignment', marker: 'dot' },
      { phase: 'Design Sprint', duration: 'July 2025', activities: [], description: 'In-person Design Sprint: Understand, Define, Ideate', marker: 'shield' },
      { phase: 'Synthesis', duration: 'July – August 2025', activities: [], description: 'Insights synthesis and prototype development', marker: 'square' },
      { phase: 'Delivery', duration: 'August 2025', activities: [], description: 'Prototype delivery and presentation', marker: 'dot' },
    ],
    theme: {
      tagBg: 'rgba(67, 106, 255, 0.15)',
      tagText: '#436aff',
      badgeBg: 'rgba(67, 106, 255, 0.15)',
      badgeText: '#436aff',
      accentText: '#436aff',
      accentHoverText: '#7a96ff',
      iconBg: 'rgba(67, 106, 255, 0.15)',
      iconText: '#436aff',
      surfaceBg: 'rgba(67, 106, 255, 0.1)',
      surfaceRing: 'rgba(67, 106, 255, 0.2)',
    },
    sections: {
      visualDesign: {
        tag: 'Visual design',
        heading: 'Clarity-first interface for every room and resident',
        description:
          'High-contrast UI, responsive layouts, and contextual motion keep complex device orchestration approachable for the whole household.',
        pillars: [
          {
            title: 'Typography',
            description: 'Variable sans enables large type at glance and condensed labels for dense data.',
            icon: 'type',
          },
          {
            title: 'Color',
            description: 'Functional palette encodes device status while preserving WCAG AAA ratios.',
            icon: 'droplet',
          },
          {
            title: 'Motion & Feedback',
            description: 'Micro-interactions confirm device state changes with haptic and visual reinforcement.',
            icon: 'camera',
          },
        ],
        media: [
          {
            src: '/projects/smarthub-gallery-1.webp',
            alt: 'Smart Home Hub dashboard showing connected devices overview',
            caption: 'Responsive device dashboard',
          },
          {
            src: '/projects/smarthub-gallery-2.webp',
            alt: 'Smart Home Hub automation builder canvas with drag and drop blocks',
            caption: 'Automation builder canvas',
          },
        ],
      },
      physicalTouchpoint: {
        tag: 'In-home context',
        heading: 'From wall-mounted display to couch-side tablet',
        description:
          'The hub adapts to communal and personal contexts, synchronizing states across screens and enabling accessibility-first control.',
        bullets: [
          'Voice and touch parity ensures hands-free or fine-grain control.',
          'At-a-glance cards show device health and room temperature deltas.',
          'Scene triggers can be initiated from the app, voice, or NFC tag on the box.',
        ],
        media: [
          {
            src: '/projects/project-3-step-1.webp',
            alt: 'Competitive analysis boards for smart home products',
            caption: 'Competitive audit snapshots',
          },
          {
            src: '/projects/project-3-step-2.webp',
            alt: 'Accessibility research artifacts for smart home hub',
            caption: 'Accessibility research artifacts',
          },
          {
            src: '/projects/project-3-step-3.webp',
            alt: 'Smart Home Hub design system components overview',
            caption: 'Design system specimen',
          },
          {
            src: '/projects/project-3-step-4.webp',
            alt: 'Interaction design prototypes for smart home hub',
            caption: 'Interaction prototypes',
          },
        ],
      },
      designSystem: {
        tag: 'Design system',
        heading: 'An accessible design language for connected living',
        description:
          'A flexible component kit handles wall displays, tablets, and mobile while keeping control states consistent and accessible.',
        pillars: [
          {
            title: 'Tokens',
            description: 'Multi-device spacing, elevation, and color tokens sync to platform guidelines.',
            icon: 'grid',
          },
          {
            title: 'Components',
            description: 'Device tiles, routine builder, notification center, scene carousel, quick actions.',
            icon: 'cog',
          },
          {
            title: 'Accessibility',
            description: 'Voice narration scripts, focus order maps, and haptic confirmation templates.',
            icon: 'accessibility',
          },
          {
            title: 'Content',
            description: 'Plain-language device labels and contextual helper text for new automations.',
            icon: 'pen-line',
          },
        ],
        media: [
          {
            src: '/projects/smarthub-gallery-3.webp',
            alt: 'Smart Home Hub accessibility friendly device control interface',
            caption: 'High-contrast control modes',
          },
        ],
      },
      solution: {
        tag: 'Solution',
        heading: 'One command center for the entire smart home ecosystem',
        description:
          'Households manage routines, devices, and automations from a single interface tuned for accessibility and shared ownership.',
        highlights: [
          {
            title: 'Unified Dashboard',
            description: 'All rooms and devices in one place with status summaries and quick actions.',
          },
          {
            title: 'Voice & Touch Parity',
            description: 'Natural language commands mirror tactile interactions across devices.',
          },
          {
            title: 'Automation Builder',
            description: 'Visual routines with guardrails for safety and accessibility.',
          },
          {
            title: 'Shared Control',
            description: 'Profiles and permissions keep preferences personal but routines communal.',
          },
        ],
      },
      process: {
        tag: 'Process',
        heading: 'How I worked',
        items: [
      {
        title: 'Competitive Analysis',
            description: 'Benchmarked device ecosystems to find fragmentation gaps.',
            icon: 'map',
      },
      {
        title: 'Accessibility Research',
            description: 'Partnered with diverse ability groups to audit flows and identify blockers.',
            icon: 'accessibility',
      },
      {
        title: 'Design System',
            description: 'Built a cross-platform kit to ship updates fast without losing cohesion.',
            icon: 'cog',
      },
      {
        title: 'Interaction Design',
            description: 'Prototyped micro-interactions that affirm state changes instantly.',
            icon: 'rocket',
          },
        ],
      },
      keyScreens: {
        tag: 'Key screens',
        heading: 'Moments from the connected home hub',
        media: [
      {
        src: '/projects/smarthub-gallery-1.webp',
        alt: 'Smart Home Hub dashboard showing connected devices overview',
            caption: 'Multi-room device dashboard',
      },
      {
        src: '/projects/smarthub-gallery-2.webp',
        alt: 'Smart Home Hub automation builder canvas with drag and drop blocks',
            caption: 'Automation builder workflow',
      },
      {
        src: '/projects/smarthub-gallery-3.webp',
        alt: 'Smart Home Hub accessibility friendly device control interface',
            caption: 'Accessibility-first control mode',
          },
        ],
      },
      reflection: {
        tag: 'Reflection',
        heading: 'Designing for shared spaces and shared control',
        outcome:
          'The hub unified disparate device experiences into one accessible platform and gave households shared visibility into automations.',
        learnings: [
          'Household roles vary interfaces must flex between admins and casual users.',
          'Accessibility upfront prevents retrofitting later; it also benefits power users.',
          'Device ecosystems change rapidly, so the design system must prefer composability.',
        ],
        nextSteps: [
          'Experiment with energy-usage insights layered into routine creation.',
          'Test canine and child-friendly control modes with simplified voice intents.',
          'Integrate with manufacturer diagnostics for proactive device maintenance.',
        ],
      },
    },
  },
}

// Helper function to get next project
export const getNextProject = (currentId: number): Project | null => {
  const nextId = currentId === 3 ? 1 : currentId + 1
  return projectsData[nextId] || null
}

// Get all projects as array
export const getAllProjects = (): Project[] => {
  return Object.values(projectsData)
}

// Get featured projects (for homepage)
export const getFeaturedProjects = (): Project[] => {
  return getAllProjects()
}

