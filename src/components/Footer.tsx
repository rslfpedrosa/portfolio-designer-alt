'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Linkedin, Mail, Dribbble } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { name: 'Dribbble', href: 'https://dribbble.com/ritaslfpedrosa', icon: Dribbble },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rita-pedrosa-9957151aa/', icon: Linkedin },
    { name: 'Email', href: 'mailto:ritaslfpedrosa@gmail.com', icon: Mail },
  ]

  return (
    <footer className="bg-[#151414] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div style={{ width: 16, height: 16, backgroundColor: '#3b82f6', borderRadius: 3, flexShrink: 0 }}></div>
              <span className="font-semibold text-white">Rita Pedrosa</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Product Designer & Creative Thinker crafting meaningful digital experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/projects"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Work
              </Link>
              <Link
                href="/about"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/10 border border-white/10 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={18} className="text-gray-400" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2024 Rita Pedrosa. All rights reserved.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                All images and content are protected by copyright law. Unauthorized use is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
