import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

export const metadata: Metadata = {
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
  other: {
    'font-link': 'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
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
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Font loading with display=swap for better performance */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        
        {/* Viewport meta for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body className="overflow-x-clip">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}