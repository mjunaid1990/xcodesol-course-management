import type { Metadata } from 'next'
import { ToasterProvider } from '@/components/ui/ToasterProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fieldnotes Studio - Modern Course & Learning Management',
  description: 'Enterprise course creation, curriculum management, and learning platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
