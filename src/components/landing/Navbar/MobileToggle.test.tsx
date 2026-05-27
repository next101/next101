import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { MobileToggle } from './MobileToggle'

describe('MobileToggle', () => {
  const onToggle = vi.fn()

  beforeEach(() => {
    onToggle.mockClear()
  })

  it('renders toggle button', () => {
    renderMantine(<MobileToggle opened={false} onToggle={onToggle} />)
    expect(screen.getByLabelText('Toggle navigation')).toBeInTheDocument()
  })

  it('shows chevron down icon when closed', () => {
    renderMantine(<MobileToggle opened={false} onToggle={onToggle} />)
    expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument()
    expect(screen.queryByTestId('icon-chevron-up')).not.toBeInTheDocument()
  })

  it('shows chevron up icon when opened', () => {
    renderMantine(<MobileToggle opened={true} onToggle={onToggle} />)
    expect(screen.getByTestId('icon-chevron-up')).toBeInTheDocument()
    expect(screen.queryByTestId('icon-chevron-down')).not.toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    renderMantine(<MobileToggle opened={false} onToggle={onToggle} />)
    screen.getByLabelText('Toggle navigation').click()
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
