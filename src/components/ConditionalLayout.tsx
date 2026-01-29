'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedBackground from '@/components/AnimatedBackground'
// import ContentProtection from '@/components/ContentProtection'
import SmoothScroll from '@/components/SmoothScroll'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SmoothScroll />
      {/* <ContentProtection /> */}
      <AnimatedBackground />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
