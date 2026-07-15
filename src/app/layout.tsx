import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  icons: {
    icon: '/icons/favicon.svg',
  },
  title: 'Rita Pedrosa - Product Designer & Creative Thinker',
  description: 'Crafting meaningful digital experiences through thoughtful design, empathy, and systems thinking.',
  keywords: ['product design', 'UX design', 'UI design', 'design systems', 'user experience'],
  authors: [{ name: 'Rita Pedrosa' }],
  creator: 'Rita Pedrosa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alexchen.design',
    title: 'Rita Pedrosa - Product Designer & Creative Thinker',
    description: 'Crafting meaningful digital experiences through thoughtful design, empathy, and systems thinking.',
    siteName: 'Rita Pedrosa Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rita Pedrosa - Product Designer & Creative Thinker',
    description: 'Crafting meaningful digital experiences through thoughtful design, empathy, and systems thinking.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Viewport meta for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}