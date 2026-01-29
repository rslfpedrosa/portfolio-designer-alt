'use client'

import { useEffect } from 'react'

const SmoothScroll = () => {
  useEffect(() => {
    // Enhanced smooth scrolling for all anchor links
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement
      
      if (link) {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1)
          const targetElement = document.getElementById(targetId)
          
          if (targetElement) {
            e.preventDefault()
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        }
      }
    }

    // Apply smooth scrolling to all internal links
    document.addEventListener('click', handleSmoothScroll, true)

    // Smooth scroll on page load if there's a hash
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1)
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }, 100)
      }
    }

    return () => {
      document.removeEventListener('click', handleSmoothScroll, true)
    }
  }, [])

  return null
}

export default SmoothScroll
