'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Send, Mail, Linkedin, Dribbble } from 'lucide-react'
import FigmaCursor from '@/components/FigmaCursor'

const ContactPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
              timestamp: new Date().toISOString(),
        }),
      })
        } catch (sheetsError) {
          console.log('Google Sheets submission failed (non-critical):', sheetsError)
          // Continue with email submission even if Sheets fails
        }
      }
      
      // 2. Send email via FormSubmit
      const form = e.target as HTMLFormElement
      form.action = 'https://formsubmit.co/ritaslfpedrosa@gmail.com'
      form.method = 'POST'
      
      // Add hidden fields for FormSubmit
      const hiddenInputs = [
        { name: '_subject', value: `New Contact Form Message from ${formData.name}` },
        { name: '_next', value: `${window.location.origin}/contact?success=true` },
        { name: '_captcha', value: 'false' },
        { name: '_template', value: 'table' },
        { name: '_autoresponse', value: `Thank you for reaching out, ${formData.name}! I'll get back to you soon.` }
      ]
      
      // Remove any existing hidden inputs first
      const existingHidden = form.querySelectorAll('input[type="hidden"]')
      existingHidden.forEach(input => input.remove())
      
      // Add hidden inputs
      hiddenInputs.forEach(({ name, value }) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        form.appendChild(input)
      })
      
      // Submit the form
      form.submit()
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error sending your message. Please try again or email me directly at ritaslfpedrosa@gmail.com')
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
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl sm:text-6xl font-medium text-gray-900 dark:text-white">
              Let's Create Something <span className="text-gradient">Meaningful</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
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
                <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-4">
                  Send me a message
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-gray-900 px-6 py-3 rounded-2xl font-medium text-base hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
                <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-4">
                  Get in touch
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Prefer to reach out directly? Here are a few ways to connect with me.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <motion.a
                      key={info.title}
                      href={info.href}
                      whileHover={{ x: 8 }}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors">
                        <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
                  )
                })}
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Follow me
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-200`}
                        aria-label={social.name}
                      >
                        <Icon size={20} />
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Current Availability
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
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
