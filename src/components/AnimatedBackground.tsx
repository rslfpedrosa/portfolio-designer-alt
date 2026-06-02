'use client'

import { motion } from 'framer-motion'
import GridBackground from '@/components/GridBackground'

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      
      <GridBackground />
    </div>
  )
}

export default AnimatedBackground
