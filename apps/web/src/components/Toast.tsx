import { useCallback, useEffect, useRef } from 'react'

interface ToastProps {
  kind?: 'info' | 'ok' | 'warn'
  message: string
  onDismiss: () => void
  duration?: number
}

export function Toast({ kind = 'info', message, onDismiss, duration = 3000 }: ToastProps) {
  const timerRef = useRef<number | null>(null)

  const clearDismissTimer = useCallback(() => {
    if (timerRef.current === null) return
    window.clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  const startDismissTimer = useCallback(() => {
    clearDismissTimer()
    timerRef.current = window.setTimeout(onDismiss, duration)
  }, [clearDismissTimer, duration, onDismiss])

  useEffect(() => {
    startDismissTimer()
    return clearDismissTimer
  }, [clearDismissTimer, startDismissTimer])

  return (
    <div
      className={`toast toast--${kind}`}
      role="status"
      onMouseEnter={clearDismissTimer}
      onMouseLeave={startDismissTimer}
    >
      {message}
    </div>
  )
}
