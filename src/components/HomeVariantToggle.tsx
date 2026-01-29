'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const HomeVariantToggle = () => {
  const [isDev, setIsDev] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Only show in development
    setIsDev(process.env.NODE_ENV === 'development')
  }, [])

  if (!isDev) return null

  const isV2 = pathname === '/home-v2'

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600 dark:text-gray-400">Home:</span>
        <Link
          href="/"
          className={`px-2 py-1 rounded ${
            !isV2
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          } transition-colors`}
        >
          V1
        </Link>
        <Link
          href="/home-v2"
          className={`px-2 py-1 rounded ${
            isV2
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          } transition-colors`}
        >
          V2
        </Link>
      </div>
    </div>
  )
}

export default HomeVariantToggle
