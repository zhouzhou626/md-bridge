import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Toast } from '../../src/components/Toast'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Toast', () => {
  it('renders the message with the info kind by default', () => {
    render(<Toast message="hello" onDismiss={() => undefined} />)
    const node = screen.getByRole('status')
    expect(node).toHaveTextContent('hello')
    expect(node).toHaveClass('toast--info')
  })

  it('applies the ok and warn variants', () => {
    const { rerender } = render(<Toast kind="ok" message="ok" onDismiss={() => undefined} />)
    expect(screen.getByRole('status')).toHaveClass('toast--ok')
    rerender(<Toast kind="warn" message="careful" onDismiss={() => undefined} />)
    expect(screen.getByRole('status')).toHaveClass('toast--warn')
  })

  it('calls onDismiss after the duration elapses', () => {
    const onDismiss = vi.fn()
    render(<Toast message="x" duration={500} onDismiss={onDismiss} />)
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('pauses auto-dismiss while hovered and restarts when the pointer leaves', () => {
    const onDismiss = vi.fn()
    render(<Toast message="read me" duration={500} onDismiss={onDismiss} />)

    const toast = screen.getByRole('status')
    fireEvent.mouseEnter(toast)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onDismiss).not.toHaveBeenCalled()

    fireEvent.mouseLeave(toast)
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(onDismiss).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
