'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
        background: '#ffffff',
        color: '#151414',
      }}
    >
      <p style={{ fontSize: '18px', fontWeight: 500 }}>Something went wrong loading this page.</p>
      <button
        onClick={reset}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '15px',
          fontWeight: 500,
          color: '#151414',
          background: 'transparent',
          border: '1px solid rgba(36,31,33,0.5)',
          borderRadius: '999px',
          padding: '10px 24px',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
