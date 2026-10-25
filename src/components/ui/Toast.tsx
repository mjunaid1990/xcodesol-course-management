'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextValue {
  toast: {
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
    info: (title: string, message?: string) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, type, title, message }])
  }, [])

  const toast = {
    success: (title: string, message?: string) => addToast('success', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
    info: (title: string, message?: string) => addToast('info', title, message),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Viewport */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 4500)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const iconMap = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
  }

  const borderMap = {
    success: 'border-emerald-500/30 bg-[#0d1c16]/95 text-emerald-50 shadow-emerald-950/40',
    error: 'border-rose-500/30 bg-[#1c0f13]/95 text-rose-50 shadow-rose-950/40',
    info: 'border-blue-500/30 bg-[#0f172a]/95 text-blue-50 shadow-blue-950/40',
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all duration-300 animate-fadeIn ${
        borderMap[item.type]
      }`}
      role="alert"
    >
      <div className="mt-0.5">{iconMap[item.type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold tracking-tight text-white">{item.title}</h4>
        {item.message && (
          <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{item.message}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context.toast
}
