import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { SignOutOverlay } from './SignOutOverlay'

describe('SignOutOverlay', () => {
  it('renders nothing when visible is false', () => {
    renderMantine(<SignOutOverlay visible={false} />)
    // MantineWrapper adds style tags, so check for overlay-specific content
    expect(screen.queryByText('Signing out...')).not.toBeInTheDocument()
  })

  it('renders overlay when visible is true', () => {
    renderMantine(<SignOutOverlay visible={true} />)
    expect(screen.getByText('Signing out...')).toBeInTheDocument()
  })

  it('renders Logo component', () => {
    renderMantine(<SignOutOverlay visible={true} />)
    const logo = screen.getByAltText('Starfold')
    expect(logo).toBeInTheDocument()
  })

  it('renders Loader component', () => {
    renderMantine(<SignOutOverlay visible={true} />)
    const loader = document.querySelector('.mantine-Loader-root')
    expect(loader).toBeInTheDocument()
  })

  it('hides overlay when visible changes to false', () => {
    const { rerender } = renderMantine(<SignOutOverlay visible={true} />)

    expect(screen.getByText('Signing out...')).toBeInTheDocument()

    // Hide overlay
    rerender(<SignOutOverlay visible={false} />)

    // Component should be removed from DOM
    expect(screen.queryByText('Signing out...')).not.toBeInTheDocument()
  })

  it('has fixed positioning', () => {
    renderMantine(<SignOutOverlay visible={true} />)

    const center = document.querySelector('.mantine-Center-root')
    expect(center).toBeInTheDocument()
    // Check for fixed position style
    expect(center).toHaveStyle({ position: 'fixed' })
  })

  it('has centered content layout', () => {
    renderMantine(<SignOutOverlay visible={true} />)

    const stack = document.querySelector('.mantine-Stack-root')
    expect(stack).toBeInTheDocument()
  })
})
