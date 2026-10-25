'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  required,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
        {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-rose-400 animate-fadeIn">{error}</p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all',
          error
            ? 'border-rose-500/80 focus:ring-1 focus:ring-rose-500'
            : 'border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl border bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all resize-none',
          error
            ? 'border-rose-500/80 focus:ring-1 focus:ring-rose-500'
            : 'border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all',
          error
            ? 'border-rose-500/80 focus:ring-1 focus:ring-rose-500'
            : 'border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-500 active:scale-95',
      secondary: 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95',
      danger: 'bg-rose-600/90 text-white shadow-md shadow-rose-600/25 hover:bg-rose-500 active:scale-95',
      ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/60',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-4 py-2.5 text-xs font-semibold rounded-xl',
      lg: 'px-5 py-3 text-sm font-bold rounded-2xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-all font-semibold disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
