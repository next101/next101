import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { MobileDropdown } from './MobileDropdown'

describe('MobileDropdown', () => {
  const onClose = vi.fn()
  const toggleRef = { current: null }

  beforeEach(() => {
    onClose.mockClear()
  })

  it('renders NavLinks and Actions when opened', () => {
    renderMantine(
      <MobileDropdown opened={true} onClose={onClose} toggleRef={toggleRef} />
    )
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByLabelText('Color scheme')).toBeInTheDocument()
  })

  it('renders divider when opened', () => {
    const { container } = renderMantine(
      <MobileDropdown opened={true} onClose={onClose} toggleRef={toggleRef} />
    )
    const divider = container.querySelector('[role="separator"]')
    expect(divider).toBeInTheDocument()
  })
})
