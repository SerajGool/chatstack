'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  message: string
  type?: AlertType
  inline?: boolean
  duration?: number
  onClose?: () => void
}

export function Alert({
  message,
  type = 'info',
  inline = false,
  duration = 3000,
  onClose
}: AlertProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (!inline && duration > 0) {
      timeoutId = setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, duration)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [duration, inline, onClose])

  if (!visible) return null

  const alertClasses = cn(
    'p-3 rounded-md text-sm font-medium flex items-center justify-between',
    {
      'bg-red-100 text-red-800 border border-red-200': type === 'error',
      'bg-green-100 text-green-800 border border-green-200': type === 'success',
      'bg-yellow-100 text-yellow-800 border border-yellow-200': type === 'warning',
      'bg-blue-100 text-blue-800 border border-blue-200': type === 'info',
      'w-full': inline,
      'fixed top-4 right-4 z-50 max-w-sm shadow-lg': !inline
    }
  )

  return (
    <div className={alertClasses}>
      <span>{message}</span>
      {!inline && (
        <button 
          onClick={() => setVisible(false)} 
          className="ml-2 hover:opacity-75"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}