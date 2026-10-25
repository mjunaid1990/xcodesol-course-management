'use client'

import React from 'react'
import { Toaster as SonnerToaster } from 'sonner'

export function ToasterProvider() {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#f8fafc',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          borderRadius: '1rem',
          fontSize: '0.8125rem',
          backdropFilter: 'blur(16px)',
        },
        className: 'sonner-toast-custom',
      }}
    />
  )
}
