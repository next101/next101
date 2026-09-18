import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  describe('landing mode', () => {
    let container: HTMLElement

    beforeEach(() => {
      const result = renderMantine(<Navbar landing />)
      container = result.container
    })

    it('renders logo and nav links', () => {
      expect(within(container).getByText('Next101')).toBeInTheDocument()
      // Nav links are now rendered in both desktop and mobile dropdown
      // So we check they exist at least once
      const features = within(container).getAllByText('Features')
      const pricing = within(container).getAllByText('Pricing')
      const faq = within(container).getAllByText('FAQ')

      expect(features.length).toBeGreaterThanOrEqual(1)
      expect(pricing.length).toBeGreaterThanOrEqual(1)
      expect(faq.length).toBeGreaterThanOrEqual(1)
    })

    it('renders actions component with sign in button', () => {
      // Sign in button is rendered in both desktop and mobile dropdown
      const signInButtons = within(container).getAllByText('Sign in')
      expect(signInButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('has toggle button for mobile', () => {
      const toggleButton = within(container).getByLabelText('Toggle navigation')
      expect(toggleButton).toBeInTheDocument()
    })
  })

  describe('non-landing mode', () => {
    it('renders logo with title', () => {
      const { container } = renderMantine(<Navbar />)
      expect(within(container).getByText('Next101')).toBeInTheDocument()
    })

    it('renders user menu when user is provided', () => {
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const { container } = renderMantine(<Navbar user={user} />)
      expect(within(container).getByTestId('user-avatar')).toBeInTheDocument()
    })

    it('does not render nav links', () => {
      const { container } = renderMantine(<Navbar />)
      expect(within(container).queryByText('Features')).not.toBeInTheDocument()
      expect(within(container).queryByText('Pricing')).not.toBeInTheDocument()
      expect(within(container).queryByText('FAQ')).not.toBeInTheDocument()
    })
  })
})
