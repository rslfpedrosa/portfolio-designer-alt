# Case Study Editing Guide

This guide shows you exactly where to edit your project content.

---

## 📍 Two Files to Edit:

### 1. **Main Page Cards** → `src/app/page.tsx` (lines 29-54)
### 2. **Case Study Details** → `src/app/projects/[id]/page.tsx` (lines 14-184)

---

## 🎴 PART 1: Edit Project Cards (Main Page)

**File:** `src/app/page.tsx`

**Location:** Lines 29-54

```typescript
const featuredProjects = [
  {
    id: 1,
    title: 'Bocca Moments',              // ← Change project title
    description: 'Designing a sensorial brand and digital experience for a curated gastronomic box.', // ← Change short description
    category: 'Web Design',              // ← Change category
    image: '/projects/project-1-hero.webp',  // ← Change hero image
    gradient: 'from-green-400 to-blue-500', // ← Change gradient colors
  },
  {
    id: 2,
    title: 'Mindful Meditation',             // ← Project 2 title
    description: '...',                      // ← Project 2 description
    category: 'UX Design',
    image: '/projects/project-2-hero.webp',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    id: 3,
    title: 'Smart Home Hub',                 // ← Project 3 title
    description: '...',
    category: 'UI Design',
    image: '/projects/project-3-hero.webp',
    gradient: 'from-blue-400 to-indigo-500',
  },
]
```

---

## 📖 PART 2: Edit Full Case Studies

**File:** `src/app/projects/[id]/page.tsx`

**Location:** Lines 14-184 (contains all 3 projects)

### Structure for Each Project:

```typescript
1: {
  id: 1,
  
  // ═══════════════════════════════════════════
  // HEADER SECTION
  // ═══════════════════════════════════════════
  title: 'Bocca Moments',                    // ← Main title (you already changed this!)
  subtitle: 'Redesigning the energy...',    // ← Subtitle/tagline
  heroImage: '/api/placeholder/1200/600',   // ← Large hero image at top
  
  // ═══════════════════════════════════════════
  // PROJECT META INFO
  // ═══════════════════════════════════════════
  category: 'Product Design',               // ← Category badge
  type: 'Case Study',                       // ← Type
  role: 'Lead Product Designer',            // ← Your role
  timeline: '6 months',                     // ← Project duration
  team: '3 designers, 2 developers, 1 PM', // ← Team size
  tools: ['Figma', 'Principle', 'Maze'],   // ← Tools used
  gradient: 'from-green-400 to-blue-500',  // ← Card gradient
  tags: ['Brand Identity', 'Web Design'],  // ← Skill tags (you already changed this!)
  
  // ═══════════════════════════════════════════
  // THE CHALLENGE
  // ═══════════════════════════════════════════
  challenge: `EcoFlow's existing dashboard was cluttered...`,  // ← Problem statement
  
  // ═══════════════════════════════════════════
  // DESIGN PROCESS (4 steps with images)
  // ═══════════════════════════════════════════
  process: [
    {
      title: 'User Research',               // ← Step 1 title
      description: 'Conducted interviews...', // ← Step 1 description
      image: '/api/placeholder/600/400',    // ← Step 1 image
    },
    {
      title: 'Information Architecture',    // ← Step 2 title
      description: 'Redesigned the...',
      image: '/api/placeholder/600/400',
    },
    {
      title: 'Wireframing & Prototyping',   // ← Step 3 title
      description: 'Created low-fidelity...',
      image: '/api/placeholder/600/400',
    },
    {
      title: 'Visual Design',               // ← Step 4 title
      description: 'Developed a clean...',
      image: '/api/placeholder/600/400',
    },
  ],
  
  // ═══════════════════════════════════════════
  // THE SOLUTION
  // ═══════════════════════════════════════════
  solution: `The new EcoFlow Dashboard features...
  
• **Simplified Navigation**: Streamlined menu...
• **Smart Insights**: AI-powered recommendations...
• **Visual Data**: Interactive charts...
• **Goal Setting**: Tools for users...
• **Mobile-First Design**: Responsive interface...`,  // ← Solution (supports markdown)
  
  // ═══════════════════════════════════════════
  // IMPACT METRICS (4 key metrics)
  // ═══════════════════════════════════════════
  impact: [
    { 
      metric: 'User Engagement',            // ← Metric 1 name
      value: '+45%',                        // ← Metric 1 value
      description: 'Increase in daily...'  // ← Metric 1 description
    },
    { 
      metric: 'Task Completion', 
      value: '+60%', 
      description: 'Faster completion...' 
    },
    { 
      metric: 'User Satisfaction', 
      value: '4.8/5', 
      description: 'Average rating...' 
    },
    { 
      metric: 'Energy Savings', 
      value: '+25%', 
      description: 'Users report...' 
    },
  ],
  
  // ═══════════════════════════════════════════
  // NEXT PROJECT (auto-generated)
  // ═══════════════════════════════════════════
  nextProject: {
    id: 2,                                  // ← Links to next project
    title: 'Mindful Meditation',
    description: 'Creating a calming...',
    image: '/api/placeholder/400/300',
    gradient: 'from-purple-400 to-pink-500',
  },
},
```

---

## 🔢 All Three Projects:

### **Project 1** (lines 14-70)
- Currently: "Bocca Moments" (you started editing!)
- Full case study details

### **Project 2** (lines 71-127)
- Currently: "Mindful Meditation"
- Edit: title, subtitle, challenge, process, solution, impact

### **Project 3** (lines 128-184)
- Currently: "Smart Home Hub"
- Edit: title, subtitle, challenge, process, solution, impact

---

## ✏️ Quick Editing Checklist

For **each project**, update:

- [ ] **Card on main page** (`page.tsx` lines 29-54)
  - [ ] Title
  - [ ] Description
  - [ ] Category
  - [ ] Hero image path

- [ ] **Case study detail** (`projects/[id]/page.tsx`)
  - [ ] Title
  - [ ] Subtitle
  - [ ] Hero image
  - [ ] Role, timeline, team, tools
  - [ ] Tags (skills)
  - [ ] Challenge (problem statement)
  - [ ] Process (4 steps with descriptions & images)
  - [ ] Solution (what you built)
  - [ ] Impact (4 metrics with results)

---

## 💡 Pro Tips

1. **Keep the same structure** - just change the text content
2. **Use markdown in `solution`** - format with `**bold**` and `•` bullets
3. **Process steps** - always 4 steps with images
4. **Impact metrics** - always 4 metrics with numbers
5. **Images** - update paths to your real images (see MEDIA-REPLACEMENT-GUIDE.md)
6. **Next project** - automatically links to the next case study in sequence

---

## 🎯 Example: Updating Project 1

**Before:**
```typescript
title: 'EcoFlow Dashboard',
subtitle: 'Redesigning the energy management...',
tags: ['Product Design', 'UX Research'],
```

**After (your changes):**
```typescript
title: 'Bocca Moments',
subtitle: 'Redesigning the energy management...',  // ← Update this next!
tags: ['Brand Identity', 'Web Design', 'Digital Launch'],
```

---

## 🚀 Next Steps

1. Open `src/app/page.tsx` → Edit lines 29-54 (project cards)
2. Open `src/app/projects/[id]/page.tsx` → Edit each project's full content
3. Update all text, descriptions, and metrics
4. Replace image paths when you add your media files
5. Save and refresh to see changes!

Done! 🎉

