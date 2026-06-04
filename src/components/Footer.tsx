'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    { name: 'Sandbox', href: '/lab' },
    { name: 'About', href: '/about' },
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
          <Link href="/" className="flex items-center group">
            <Image
              src="/Me/logo-white.svg"
              alt="Rita Pedrosa"
              width={100}
              height={32}
              style={{ height: '32px', width: 'auto' }}
            />
          </Link>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
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
        <div className="flex items-center gap-3">
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
                aria-label={social.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  transition: 'border-color 0.25s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,1)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
              >
                <Icon size={15} strokeWidth={1.5} />
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
