'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Linkedin, Mail, Dribbble, ArrowUpRight } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { name: 'Dribbble', href: 'https://dribbble.com/ritaslfpedrosa', icon: Dribbble },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rita-pedrosa-9957151aa/', icon: Linkedin },
    { name: 'Email', href: 'mailto:ritaslfpedrosa@gmail.com', icon: Mail },
  ]

  const navLinks = [
    { name: 'Work', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer
      className="bg-black"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Main row */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10"
        style={{ padding: 'clamp(40px, 5vw, 64px) clamp(24px, 5vw, 80px)' }}
      >
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div style={{ width: 11, height: 11, backgroundColor: '#d9ee72', borderRadius: 2, flexShrink: 0 }} />
            <span
              className="font-medium text-white"
              style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
            >
              Rita Pedrosa
            </span>
          </Link>
          <p
            style={{
              fontSize: '12px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.25)',
              maxWidth: '28ch',
            }}
          >
            Product Designer crafting meaningful digital experiences.
          </p>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="group flex items-center gap-1 transition-colors duration-300"
              style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}
            >
              <span className="group-hover:text-white transition-colors duration-300">{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Social */}
        <div className="flex items-center gap-4">
          {socialLinks.map(social => {
            const Icon = social.icon
            return (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                className="transition-colors duration-300"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                aria-label={social.name}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
              >
                <Icon size={16} strokeWidth={1.5} />
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Bottom row */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{
          padding: 'clamp(16px, 2vw, 24px) clamp(24px, 5vw, 80px)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.05em' }}>
          © 2024 Rita Pedrosa. All rights reserved.
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.04em' }}>
          All images and content are protected by copyright law.
        </p>
      </div>
    </footer>
  )
}

export default Footer
