'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const MotionLink = motion(Link)

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Work', href: '/projects' },
    { name: 'About', href: '/about' },
  ]


  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-[10001] transition-all duration-300 ${
        scrolled
          ? 'bg-[#151414]/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            onMouseEnter={() => window.dispatchEvent(new Event('cursor-logo-enter'))}
            onMouseLeave={() => window.dispatchEvent(new Event('cursor-logo-leave'))}
            className="flex items-center space-x-2"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: 16, height: 16, backgroundColor: '#3b82f6', borderRadius: 3, flexShrink: 0 }}
            ></motion.div>
            <span className="font-semibold text-white">Rita Pedrosa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <MotionLink
                  key={item.name}
                  href={item.href}
                  initial={false}
                  animate={{ color: isActive ? '#ffffff' : '#a3a3a3' }}
                  whileHover={{ color: '#ffffff', y: -1 }}
                  transition={{ duration: 0.15 }}
                  className={`relative font-medium after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:bg-white after:transition-transform after:duration-200 after:origin-left ${
                    isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  {item.name}
                </MotionLink>
              )
            })}
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#2563eb] text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-[#1d4ed8] transition-colors"
              >
                Get in Touch
              </motion.button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-2xl text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-[#151414]/95 backdrop-blur-md border-t border-b border-white/10"
          >
            <motion.div
              className="px-4 py-6 space-y-6"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
                closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              }}
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <motion.div
                    key={item.name}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -6 },
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block font-medium ${isActive ? 'text-white' : 'text-[#a3a3a3]'}`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -6 },
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Link href="/contact" onClick={() => setIsOpen(false)} className="block">
                  <button className="w-full bg-[#2563eb] text-white px-6 py-3 rounded-full font-medium text-base hover:bg-[#1d4ed8] transition-colors">
                    Get in Touch
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
