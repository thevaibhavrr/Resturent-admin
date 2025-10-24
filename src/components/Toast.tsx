import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

let toasts: ToastMessage[] = []
let listeners: Array<(toasts: ToastMessage[]) => void> = []

const addToast = (message: string, type: ToastType) => {
  const id = Date.now()
  toasts = [...toasts, { id, message, type }]
  listeners.forEach(listener => listener(toasts))
  
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    listeners.forEach(listener => listener(toasts))
  }, 3000)
}

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
}

export function Toaster() {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  useEffect(() => {
    listeners.push(setMessages)
    return () => {
      listeners = listeners.filter(l => l !== setMessages)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map(({ id, message, type }) => (
        <div
          key={id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-full ${
            type === 'success' ? 'bg-green-50 text-green-900 border border-green-200' :
            type === 'error' ? 'bg-red-50 text-red-900 border border-red-200' :
            'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          {type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
          {type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
          {type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
          <p className="flex-1 text-sm font-medium">{message}</p>
          <button
            onClick={() => {
              toasts = toasts.filter(t => t.id !== id)
              listeners.forEach(listener => listener(toasts))
            }}
            className="text-current opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
