import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

type PlaceholderConfig = {
  file: string
  width: number
  height: number
  background: string
}

const placeholders: PlaceholderConfig[] = [
  { file: 'public/about/rita-photo.webp', width: 1200, height: 1600, background: '#f6ede1' },
  { file: 'public/projects/project-1-step-1.webp', width: 2400, height: 1600, background: '#f3ede4' },
  { file: 'public/projects/project-1-step-2.webp', width: 2400, height: 1600, background: '#f1e7d8' },
  { file: 'public/projects/project-1-step-3.webp', width: 2400, height: 1600, background: '#eee1cc' },
  { file: 'public/projects/project-1-step-4.webp', width: 2400, height: 1600, background: '#ecd9be' },
  { file: 'public/projects/project-2-hero.webp', width: 2800, height: 1800, background: '#ede3f9' },
  { file: 'public/projects/project-2-step-1.webp', width: 2400, height: 1600, background: '#e6d6fa' },
  { file: 'public/projects/project-2-step-2.webp', width: 2400, height: 1600, background: '#ddc4fa' },
  { file: 'public/projects/project-2-step-3.webp', width: 2400, height: 1600, background: '#d4b3f7' },
  { file: 'public/projects/project-2-step-4.webp', width: 2400, height: 1600, background: '#caa1f5' },
  { file: 'public/projects/project-3-hero.webp', width: 2800, height: 1800, background: '#dde8ff' },
  { file: 'public/projects/project-3-step-1.webp', width: 2400, height: 1600, background: '#d0ddff' },
  { file: 'public/projects/project-3-step-2.webp', width: 2400, height: 1600, background: '#c2d2ff' },
  { file: 'public/projects/project-3-step-3.webp', width: 2400, height: 1600, background: '#b5c7ff' },
  { file: 'public/projects/project-3-step-4.webp', width: 2400, height: 1600, background: '#a8bcff' },
  { file: 'public/projects/mindful-gallery-1.webp', width: 2400, height: 1600, background: '#f2e9ff' },
  { file: 'public/projects/mindful-gallery-2.webp', width: 2400, height: 1600, background: '#ebe0ff' },
  { file: 'public/projects/mindful-gallery-3.webp', width: 2400, height: 1600, background: '#e4d7ff' },
  { file: 'public/projects/smarthub-gallery-1.webp', width: 2400, height: 1600, background: '#e0edff' },
  { file: 'public/projects/smarthub-gallery-2.webp', width: 2400, height: 1600, background: '#d2e5ff' },
  { file: 'public/projects/smarthub-gallery-3.webp', width: 2400, height: 1600, background: '#c4dcff' },
]

const ensureDir = (file: string) => {
  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const createPlaceholder = async ({ file, width, height, background }: PlaceholderConfig) => {
  if (fs.existsSync(file)) {
    return
  }

  ensureDir(file)

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background,
    },
  })
    .webp({ quality: 80 })
    .toFile(file)

  console.log(`Generated placeholder ${file}`)
}

const run = async () => {
  for (const placeholder of placeholders) {
    await createPlaceholder(placeholder)
  }

  console.log('Placeholder generation complete.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

