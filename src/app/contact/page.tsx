'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Send, Mail, Linkedin, Dribbble, CheckCircle, X } from 'lucide-react'
import FigmaCursor from '@/components/FigmaCursor'
import GridBackground from '@/components/GridBackground'

const ContactPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsDesktop(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Hide default cursor globally on desktop
  useEffect(() => {
    if (isDesktop) {
      document.body.style.cursor = 'none'
      return () => {
        document.body.style.cursor = ''
      }
    }
  }, [isDesktop])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Send to Google Sheets (if configured)
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              message: formData.message,
              timestamp: new Date().toISOString(),
            }),
          })
        } catch (sheetsError) {
          console.log('Google Sheets submission failed (non-critical):', sheetsError)
        }
      }

      // 2. Send email via FormSubmit AJAX endpoint (stays on page, returns JSON)
      const res = await fetch('https://formsubmit.co/ajax/ritaslfpedrosa@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Contact Form Message from ${formData.name}`,
          _captcha: 'false',
          _template: 'table',
          _autoresponse: `Thank you for reaching out, ${formData.name}! I'll get back to you soon.`,
        }),
      })

      if (!res.ok) throw new Error('FormSubmit request failed')

      setFormData({ name: '', email: '', message: '' })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error sending your message. Please try again or email me directly at ritaslfpedrosa@gmail.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const socialLinks = [
    { name: 'Dribbble', href: 'https://dribbble.com/ritaslfpedrosa', icon: Dribbble, color: 'hover:text-pink-500' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rita-pedrosa-9957151aa/', icon: Linkedin, color: 'hover:text-blue-600' },
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'ritaslfpedrosa@gmail.com',
      href: 'mailto:ritaslfpedrosa@gmail.com',
    },
  ]

  return (
    <div className="min-h-screen pt-16 bg-[#171717] relative overflow-hidden">
      {/* Grid Pattern */}
      <GridBackground />

      {/* Animated Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25), rgba(96,165,250,0.25))' }}
        animate={{ x: [0, 150, -50, 0], y: [0, -120, 80, 0], scale: [1, 1.3, 0.9, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.25), rgba(59,130,246,0.25))' }}
        animate={{ x: [0, -180, 60, 0], y: [0, 120, -40, 0], scale: [1, 0.7, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.25), rgba(37,99,235,0.25))' }}
        animate={{ x: [0, 220, -80, 0], y: [0, -80, 100, 0], scale: [1, 1.15, 0.85, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      />

      {/* Page content above background layers */}
      <div className="relative z-10">

      {/* Hero Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl sm:text-6xl font-medium text-white">
              Let's Create Something <span className="text-gradient">Meaningful</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              I'm always excited to collaborate on projects that make a difference. 
              Whether you need help with product strategy, design systems, or creating 
              beautiful user experiences, I'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-medium text-white mb-4">
                  Send me a message
                </h2>
                <p className="text-gray-400">
                  Fill out the form below and I'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white placeholder-white/40 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white placeholder-white/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white placeholder-white/40 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-medium text-base hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  style={isDesktop ? { cursor: 'none' } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-medium text-white mb-4">
                  Get in touch
                </h2>
                <p className="text-gray-400">
                  Prefer to reach out directly? Here are a few ways to connect with me.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <motion.a
                      key={info.title}
                      href={info.href}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/15 transition-colors">
                        <Icon size={18} className="text-white/70 group-hover:text-white transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white/40 uppercase tracking-widest mb-0.5">{info.title}</p>
                        <p className="font-medium text-white group-hover:text-white/90 truncate">
                          {info.value}
                        </p>
                      </div>
                      <div className="ml-auto text-white/30 group-hover:text-white/60 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </motion.a>
                  )
                })}
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest">
                  Follow me
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all duration-200"
                        aria-label={social.name}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">{social.name}</span>
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-medium text-white mb-2">
                  Current Availability
                </h3>
                <p className="text-gray-400 mb-4">
                  I'm currently available for select projects and collaborations. 
                  Let's discuss how we can work together.
                </p>
                <div className="status-badge inline-flex items-center space-x-2 rounded-full px-4 py-2">
                  <div className="relative flex items-center justify-center w-2 h-2">
                    <div className="status-dot-inner absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                    <div className="status-dot-pulse absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available for new projects
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      </div>{/* end relative z-10 */}

      {/* Success snackbar */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
          >
            <CheckCircle size={20} className="text-green-400 shrink-0" />
            <span className="text-white text-sm font-medium whitespace-nowrap">
              Message sent! I'll get back to you soon.
            </span>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-1 text-white/50 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Figma Cursor */}
      <FigmaCursor
        label={null}
        showPill={false}
        shouldReduceMotion={shouldReduceMotion || false}
        isDesktop={isDesktop}
      />
    </div>
  )
}

export default ContactPage
