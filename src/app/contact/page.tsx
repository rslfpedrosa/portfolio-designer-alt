'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Send, Mail, Linkedin, Dribbble, CheckCircle, X } from 'lucide-react'
import GridBackground from '@/components/GridBackground'

const CYCLING_PHRASES = ["Let's Talk.", "Let's Connect.", "Let's Collaborate.", "Let's Create."]

const ContactPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const [entered, setEntered] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [phraseWidth, setPhraseWidth] = useState(0)
  const displayTextRef = useRef('')
  const animTimeoutsRef = useRef<NodeJS.Timeout[]>([])
  const measureRef = useRef<HTMLSpanElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) { setEntered(true); return }
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
  }, [shouldReduceMotion])

  useEffect(() => {
    if (!entered) return
    let interval: NodeJS.Timeout
    const startDelay = setTimeout(() => {
      interval = setInterval(() => {
        setPhraseIndex(i => (i + 1) % CYCLING_PHRASES.length)
      }, 5500)
    }, 1200)
    return () => { clearTimeout(startDelay); clearInterval(interval) }
  }, [entered])

  useEffect(() => {
    if (!entered) return
    animTimeoutsRef.current.forEach(clearTimeout)
    animTimeoutsRef.current = []

    const target = CYCLING_PHRASES[phraseIndex]
    const current = displayTextRef.current
    const ERASE_SPEED = 80
    const TYPE_SPEED = 120

    for (let i = current.length - 1; i >= 0; i--) {
      const erased = current.slice(0, i)
      const delay = (current.length - 1 - i) * ERASE_SPEED
      const t = setTimeout(() => { displayTextRef.current = erased; setDisplayText(erased) }, delay)
      animTimeoutsRef.current.push(t)
    }

    const offset = current.length * ERASE_SPEED
    for (let i = 1; i <= target.length; i++) {
      const typed = target.slice(0, i)
      const t = setTimeout(() => { displayTextRef.current = typed; setDisplayText(typed) }, offset + i * TYPE_SPEED)
      animTimeoutsRef.current.push(t)
    }

    return () => { animTimeoutsRef.current.forEach(clearTimeout) }
  }, [phraseIndex, entered])

  useLayoutEffect(() => {
    if (measureRef.current) setPhraseWidth(measureRef.current.getBoundingClientRect().width + 16)
  }, [displayText, entered])

  useEffect(() => {
    let t: NodeJS.Timeout
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        if (measureRef.current) setPhraseWidth(measureRef.current.getBoundingClientRect().width + 16)
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [])

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
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rita-pedrosa-9957151aa/', icon: Linkedin, color: 'hover:text-[#d9ee72]' },
  ]

  const [emailHovered, setEmailHovered] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'ritaslfpedrosa@gmail.com',
      href: 'mailto:ritaslfpedrosa@gmail.com',
    },
  ]

  const borderColor = 'rgba(36,31,33,0.13)'

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden" style={{ backgroundColor: '#f2efea' }}>
      {/* Grid Pattern */}
      <GridBackground />

      {/* Page content above background layers */}
      <div className="relative z-10">

      {/* Hero Section */}
      <section className="py-12 sm:py-24 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:pl-8 lg:pl-16"
          >
            <h1 className="text-3xl sm:text-6xl lg:text-8xl font-medium text-[#241f21] flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="relative inline-block">
                {/* Invisible spacer: keeps container at widest-phrase width */}
                <span className="invisible text-gradient whitespace-nowrap" aria-hidden>Let&apos;s Collaborate.</span>

                {/* Measurement span for frame width tracking */}
                <span
                  ref={measureRef}
                  className="absolute top-0 left-0 invisible whitespace-nowrap text-gradient pointer-events-none"
                  aria-hidden
                >
                  {displayText}
                  {entered && <span style={{ display: 'inline-block', width: '2px', height: '0.8em', marginLeft: '2px', verticalAlign: 'middle' }} />}
                </span>

                {/* Visible animated text + cursor */}
                <span className="absolute top-0 left-0 right-0 whitespace-nowrap">
                  <span className="text-gradient">{displayText}</span>
                  {entered && (
                    <span
                      className="typewriter-cursor"
                      aria-hidden
                      style={{ display: 'inline-block', width: '2px', height: '0.8em', backgroundColor: '#042d2b', marginLeft: '2px', verticalAlign: 'middle' }}
                    />
                  )}
                </span>

                {/* Animated selection frame */}
                {phraseWidth > 0 && (
                  <motion.span
                    className="absolute top-0 bottom-[0.13em] pointer-events-none overflow-visible"
                    animate={{ width: phraseWidth, opacity: 1 }}
                    initial={{ width: phraseWidth, opacity: 0 }}
                    transition={{ width: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
                    style={{ border: '1px solid #0d99ff', left: 0 }}
                  >
                    {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(corner => (
                      <span
                        key={corner}
                        className="absolute w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: '#f2efea',
                          border: '1px solid #0d99ff',
                          top: corner.startsWith('top') ? -6 : undefined,
                          bottom: corner.startsWith('bottom') ? -6 : undefined,
                          left: corner.endsWith('left') ? -6 : undefined,
                          right: corner.endsWith('right') ? -6 : undefined,
                        }}
                      />
                    ))}
                  </motion.span>
                )}
              </span>
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl" style={{ color: 'rgba(36,31,33,0.55)' }}>
              I'm always excited to collaborate on projects that make a difference.
              Whether you need help with product strategy, design systems, or creating
              beautiful user experiences, I'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="relative px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="absolute top-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, ${borderColor} 50%, transparent 50%)`, backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        <div className="absolute bottom-0 left-0 w-full h-px pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, ${borderColor} 50%, transparent 50%)`, backgroundSize: '16px 1px', backgroundRepeat: 'repeat-x' }} />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative overflow-visible"
            >
              {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
                <div
                  key={corner}
                  className="absolute w-3 h-3 z-20 rounded-sm"
                  style={{
                    backgroundColor: '#f2efea',
                    border: `1px solid ${borderColor}`,
                    top: corner.startsWith('top') ? '-6px' : undefined,
                    bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                    left: corner.endsWith('left') ? '-6px' : undefined,
                    right: corner.endsWith('right') ? '-6px' : undefined,
                  }}
                />
              ))}
              <div
                className="relative px-6 py-10 sm:p-10 lg:p-14 h-full space-y-8"
                style={{ backgroundColor: '#f2efea', outline: `1px solid ${borderColor}`, outlineOffset: '0px' }}
              >
              <div>
                <h2 className="text-3xl font-medium text-[#241f21] mb-4">
                  Send me a message
                </h2>
                <p style={{ color: 'rgba(36,31,33,0.55)' }}>
                  Fill out the form below and I'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(36,31,33,0.70)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#d9ee72] focus:border-transparent transition-colors text-[#241f21] placeholder:text-[#241f21]/40"
                    style={{ border: `1px solid ${borderColor}`, backgroundColor: 'rgba(255,255,255,0.65)', color: '#241f21' }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(36,31,33,0.70)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#d9ee72] focus:border-transparent transition-colors placeholder:text-[#241f21]/40"
                    style={{ border: `1px solid ${borderColor}`, backgroundColor: 'rgba(255,255,255,0.65)', color: '#241f21' }}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'rgba(36,31,33,0.70)' }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#d9ee72] focus:border-transparent transition-colors resize-none placeholder:text-[#241f21]/40"
                    style={{ border: `1px solid ${borderColor}`, backgroundColor: 'rgba(255,255,255,0.65)', color: '#241f21' }}
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#0f0f0f] text-white px-6 py-3 rounded-full font-medium text-base hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative overflow-visible"
            >
              {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
                <div
                  key={corner}
                  className="absolute w-3 h-3 z-20 rounded-sm"
                  style={{
                    backgroundColor: '#f2efea',
                    border: `1px solid ${borderColor}`,
                    top: corner.startsWith('top') ? '-6px' : undefined,
                    bottom: corner.startsWith('bottom') ? '-6px' : undefined,
                    left: corner.endsWith('left') ? '-6px' : undefined,
                    right: corner.endsWith('right') ? '-6px' : undefined,
                  }}
                />
              ))}
              <div
                className="relative px-6 py-10 sm:p-10 lg:p-14 h-full space-y-8"
                style={{ backgroundColor: '#f2efea', outline: `1px solid ${borderColor}`, outlineOffset: '0px' }}
              >
              <div className="-mb-4">
                <h2 className="text-3xl font-medium text-[#241f21] mb-4">
                  Get in touch
                </h2>
                <p style={{ color: 'rgba(36,31,33,0.55)' }}>
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
                      onMouseEnter={() => setEmailHovered(true)}
                      onMouseLeave={() => setEmailHovered(false)}
                      className="flex w-full items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer"
                      style={{ border: `1px solid ${borderColor}`, backgroundColor: 'rgba(36,31,33,0.04)' }}
                    >
                      <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: 'rgba(36,31,33,0.07)', border: `1px solid ${borderColor}` }}>
                        <Icon size={18} strokeWidth={1.5} style={{ color: emailHovered ? '#241f21' : 'rgba(36,31,33,0.45)', transition: 'color 0.2s' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'rgba(36,31,33,0.40)' }}>{info.title}</p>
                        <p className="font-medium text-[#241f21] truncate">{info.value}</p>
                      </div>
                      <div className="ml-auto" style={{ color: emailHovered ? '#241f21' : 'rgba(36,31,33,0.30)', transition: 'color 0.2s' }}>
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
                <h3 className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(36,31,33,0.40)' }}>
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
                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-200 text-[#241f21]/60 hover:text-[#241f21]"
                        style={{ border: `1px solid ${borderColor}`, backgroundColor: 'rgba(36,31,33,0.05)' }}
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
              <div className="p-6 rounded-2xl" style={{ border: `1px solid ${borderColor}` }}>
                <h3 className="text-lg font-medium text-[#241f21] mb-2">
                  Current Availability
                </h3>
                <p className="mb-4" style={{ color: 'rgba(36,31,33,0.55)' }}>
                  I'm currently available for select projects and collaborations.
                  Let's discuss how we can work together.
                </p>
                <div className="status-badge inline-flex items-center space-x-2 rounded-full px-4 py-2">
                  <div className="relative flex items-center justify-center w-2 h-2">
                    <div className="status-dot-inner absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                    <div className="status-dot-pulse absolute inset-0 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'rgba(36,31,33,0.70)' }}>
                    Available for new projects
                  </span>
                </div>
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
            style={{ backgroundColor: '#241f21', border: '1px solid rgba(36,31,33,0.15)' }}
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

    </div>
  )
}

export default ContactPage
