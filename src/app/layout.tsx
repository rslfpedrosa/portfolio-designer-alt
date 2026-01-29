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
    'font-link': 'https://api.fontshare.com/v2/css?f[]=clash-grotesk@200,300,400,500,600,700&display=swap',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}