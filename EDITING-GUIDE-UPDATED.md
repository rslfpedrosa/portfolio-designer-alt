# ✨ Updated Editing Guide - Single Source of Truth!

Great news! The project data has been refactored so you only need to edit **ONE FILE** for all your project content!

---

## 📍 ONE Place to Edit Everything

### **File:** `src/data/projects.ts`

This single file controls:
- ✅ Project cards on the homepage
- ✅ Project cards on /projects page
- ✅ Full case study details on /projects/[id]
- ✅ "Next Project" links

**Edit once, updates everywhere!** 🎉

---

## 📝 What You Can Edit

Open `/src/data/projects.ts` and you'll see all 3 projects (starting around line 18).

### For Each Project, You Can Change:

```typescript
{
  id: 1,                          // ← Keep this (1, 2, or 3)
  
  // ═══════════════════════════════════════════
  // DISPLAYED EVERYWHERE
  // ═══════════════════════════════════════════
  title: 'Bocca Moments',         // ← Project name (cards + detail page)
  description: 'Designing a...',  // ← Short description (homepage card)
  category: 'Web Design',         // ← Category badge
  gradient: 'from-green-400...',  // ← Card gradient colors
  tags: ['Brand Identity', 'Web Design'],         // ← Skill tags
  heroImage: '/projects/...',     // ← Main cover image
  gallery: [                      // ← Final results gallery (optional but recommended)
    { src: '/projects/project-1-gallery-1.webp', alt: 'Short alt text', caption: 'Visible caption (optional)' },
    // ... add as many images as you need
  ],
  
  // ═══════════════════════════════════════════
  // CASE STUDY DETAIL PAGE ONLY
  // ═══════════════════════════════════════════
  subtitle: 'Designing a sensorial...',  // ← Longer description
  type: 'Case Study',             // ← Project type
  role: 'Lead Product Designer',  // ← Your role
  timeline: '6 months',           // ← Duration
  team: '1 Designer, 1 Developer',         // ← Team composition
  tools: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects'],    // ← Tools used
  productWebsite: { url: 'https://www.boccamoments.com/', label: 'Visit website' }, // ← Optional live link
  
  challenge: `The challenge was to bring emotional depth to a market saturated with subscription boxes focused on convenience. Bocca aimed to stand apart by offering a curated, sensorial experience, not just products, designed to surprise, nurture, and connect people through moments around the table.`,  // ← The challenge section
  
  process: [                      // ← Design process (4 steps)
    {
      title: 'User Research',
      description: 'What you did...',
      image: '/projects/project-1-step-1.webp',
    },
    // ... 3 more steps
  ],
  
  solution: `What you built...    // ← Solution (supports markdown)
  
• **Bold feature**: Description
• **Another feature**: Description`,
  
  impact: [                       // ← Impact metrics (4 metrics)
    {
      metric: 'User Engagement',
      value: '+45%',
      description: 'Details...',
    },
    // ... 3 more metrics
  ],
}
```

---

## 🎯 Quick Edit Example

### Before:
```typescript
1: {
  id: 1,
  title: 'EcoFlow Dashboard',
  description: 'Redesigning the energy management...',
  category: 'Product Design',
```

### After (your change):
```typescript
1: {
  id: 1,
  title: 'Bocca Moments',
  description: 'Designing a sensorial brand and digital experience...',
  category: 'Web Design',
```

✅ **Result:** This changes the title EVERYWHERE:
- Homepage featured project card
- /projects page card
- Case study detail page title
- Next project link text

---

## 📂 Image Path Reference

When editing image paths, use these:

### Hero Images (shown on cards):
- `heroImage: '/projects/bocca-moments-hero.webp'`
- `heroImage: '/projects/project-2-hero.webp'`
- `heroImage: '/projects/project-3-hero.webp'`

### Process Step Images:
- `image: '/projects/project-1-step-1.webp'`
- `image: '/projects/project-1-step-2.webp'`
- `image: '/projects/project-1-step-3.webp'`
- `image: '/projects/project-1-step-4.webp'`

(Same pattern for project 2 and 3)

### Final Results Gallery
- `gallery: [{ src: '/projects/bocca-gallery-1.webp', alt: 'Describe the scene', caption: 'Optional caption' }]`
- Links: set `productWebsite: { url: 'https://link.com', label: 'Optional label' }`

---

## 🔢 All Three Projects

The file contains 3 projects:

### **Project 1** (lines ~18-85)
- Currently: "Bocca Moments"
- Edit all content here

### **Project 2** (lines ~86-153)
- Currently: "Mindful Meditation"
- Edit all content here

### **Project 3** (lines ~154-221)
- Currently: "Smart Home Hub"
- Edit all content here

---

## ✅ Editing Checklist

For each project in `src/data/projects.ts`:

- [ ] **Basic Info**
  - [ ] Title
  - [ ] Description (short, for cards)
  - [ ] Subtitle (longer, for detail page)
  - [ ] Category
  - [ ] Tags

- [ ] **Project Details**
  - [ ] Role
  - [ ] Timeline
  - [ ] Team
  - [ ] Tools

- [ ] **Content**
  - [ ] Challenge (problem statement)
  - [ ] Process (4 steps with descriptions)
  - [ ] Solution (what you built)
  - [ ] Impact (4 metrics with results)

- [ ] **Media**
  - [ ] Hero image path
  - [ ] 4 process step image paths
  - [ ] Final results gallery images (as many as you want)

---

## 💡 Pro Tips

1. **Keep the structure** - don't remove fields, just change values
2. **Process steps** - always have exactly 4 steps
3. **Impact metrics** - always have exactly 4 metrics
4. **Markdown in solution** - use `**bold**` and `•` for bullets
5. **Image paths** - must match files in `/public/projects/`
6. **Gradients** - use Tailwind gradient classes (e.g., `from-blue-400 to-indigo-500`)

---

## 🚀 How It Works

The refactored system works like this:

```
src/data/projects.ts
         ↓
    (single source of truth)
         ↓
    ┌────┴────┬────────┐
    ↓         ↓        ↓
Homepage   Projects   Detail
  Card       List      Page
```

**One edit, everywhere updated!** 🎉

---

## 📋 Summary

### Old Way (BAD ❌):
- Edit homepage: `src/app/page.tsx`
- Edit projects list: `src/app/projects/page.tsx`
- Edit case studies: `src/app/projects/[id]/page.tsx`
- **Total: 3 files to keep in sync** 😰

### New Way (GOOD ✅):
- Edit everything: `src/data/projects.ts`
- **Total: 1 file!** 🎉

---

## 🎯 Next Steps

1. Open `src/data/projects.ts`
2. Find your project (1, 2, or 3)
3. Edit the content
4. Save the file
5. Refresh browser - see changes everywhere!

Done! 🚀✨

---

## 📖 Need Help?

- **Media files**: See `MEDIA-REPLACEMENT-GUIDE.md`
- **Image paths**: All in `/public/projects/`
- **Markdown formatting**: Use `**bold**` and `•` bullets in `solution` field

Happy editing! 🎨

