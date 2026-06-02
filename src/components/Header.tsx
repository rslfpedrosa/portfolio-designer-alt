'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const isCaseStudy = /^\/projects\/\d+/.test(pathname)
  const isLightPage = isCaseStudy || pathname === '/'

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Work', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  const colors = isLightPage
    ? {
        scrolledBg: 'rgba(242,239,234,0.94)',
        scrolledBorder: 'rgba(36,31,33,0.08)',
        logoText: '#241f21',
        navActive: '#241f21',
        navMuted: 'rgba(36,31,33,0.55)',
        navHover: '#241f21',
        mobileBg: 'rgba(242,239,234,0.97)',
        mobileDivider: 'rgba(36,31,33,0.08)',
        mobileLinkColor: 'rgba(36,31,33,0.8)',
        burgerBg: 'bg-[#241f21]',
      }
    : {
        scrolledBg: 'rgba(4,45,43,0.94)',
        scrolledBorder: 'rgba(255,255,255,0.06)',
        logoText: '#ffffff',
        navActive: '#ffffff',
        navMuted: 'rgba(255,255,255,0.45)',
        navHover: '#ffffff',
        mobileBg: 'rgba(4,45,43,0.97)',
        mobileDivider: 'rgba(255,255,255,0.06)',
        mobileLinkColor: 'rgba(255,255,255,0.85)',
        burgerBg: 'bg-white',
      }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[10001]"
      style={{
        backgroundColor: scrolled ? colors.scrolledBg : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.scrolledBorder}` : '1px solid transparent',
        transition: 'background-color 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease',
      }}
    >
      <div
        className="flex justify-between items-center"
        style={{ padding: '0 clamp(24px, 5vw, 80px)', height: 'clamp(56px, 5vw, 68px)' }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 group"
        >
          <motion.div
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.3 }}
            style={{ width: 11, height: 11, backgroundColor: '#d9ee72', borderRadius: 2, flexShrink: 0 }}
          />
          <span
            className="font-medium tracking-tight transition-colors duration-500"
            style={{ fontSize: '13px', letterSpacing: '-0.01em', color: colors.logoText }}
          >
            Rita Pedrosa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center" style={{ gap: 'clamp(24px, 3vw, 48px)' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative group pb-0.5"
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  color: isActive || hoveredNav === item.name ? colors.navActive : colors.navMuted,
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={() => setHoveredNav(item.name)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {item.name}
                <span
                  className="absolute bottom-0 left-0 h-px transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] w-0 group-hover:w-full"
                  style={{ backgroundColor: isActive ? '#d9ee72' : colors.navHover }}
                />
              </Link>
            )
          })}
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          style={{ gap: '5px' }}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            className={`block h-px transition-all duration-350 ${colors.burgerBg}`}
            style={{
              width: '20px',
              transform: isOpen ? 'rotate(45deg) translate(3.5px, 3.5px)' : 'none',
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
          <span
            className={`block h-px ${colors.burgerBg}`}
            style={{
              width: '20px',
              transform: isOpen ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none',
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              backgroundColor: colors.mobileBg,
              borderTop: `1px solid ${colors.mobileDivider}`,
            }}
          >
            <div
              className="flex flex-col"
              style={{ padding: 'clamp(28px, 5vw, 48px) clamp(24px, 5vw, 80px)' }}
            >
              {navItems.map((item, i) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ borderBottom: `1px solid ${colors.mobileDivider}` }}
                    className="py-5"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      style={{
                        fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
                        fontWeight: 500,
                        letterSpacing: '-0.03em',
                        color: isActive ? '#d9ee72' : colors.mobileLinkColor,
                      }}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
