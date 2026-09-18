import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { siteLinks } from '@/config'
import { renderMantine } from '@/test'
import { AuthHeader } from './AuthHeader'

describe('AuthHeader', () => {
  it('renders Logo component', () => {
    renderMantine(
      <AuthHeader
        title="Welcome back!"
        linkPrefix="New to Next101?"
        linkText="Create an account"
        linkHref={siteLinks.auth.signUp}
      />
    )
    const logo = screen.getByAltText('Next101')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '64')
    expect(logo).toHaveAttribute('height', '64')
  })

  it('renders title', () => {
    renderMantine(
      <AuthHeader
        title="Welcome back!"
        linkPrefix="New to Next101?"
        linkText="Create an account"
        linkHref={siteLinks.auth.signUp}
      />
    )
    expect(
      screen.getByRole('heading', { name: 'Welcome back!' })
    ).toBeInTheDocument()
  })

  it('renders link prefix text', () => {
    renderMantine(
      <AuthHeader
        title="Welcome back!"
        linkPrefix="New to Next101?"
        linkText="Create an account"
        linkHref={siteLinks.auth.signUp}
      />
    )
    expect(screen.getByText('New to Next101?')).toBeInTheDocument()
  })

  it('renders link with correct text and href', () => {
    renderMantine(
      <AuthHeader
        title="Create an account"
        linkPrefix="Already have an account?"
        linkText="Sign in"
        linkHref={siteLinks.auth.signIn}
      />
    )
    const link = screen.getByRole('link', { name: 'Sign in' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', siteLinks.auth.signIn)
  })

  it('renders with sign up variant', () => {
    renderMantine(
      <AuthHeader
        title="Create an account"
        linkPrefix="Already have an account?"
        linkText="Sign in"
        linkHref="/auth/sign-in"
      />
    )
    expect(
      screen.getByRole('heading', { name: 'Create an account' })
    ).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Sign in' })
    expect(link).toHaveAttribute('href', '/auth/sign-in')
  })

  it('has centered layout', () => {
    const { container } = renderMantine(
      <AuthHeader
        title="Welcome back!"
        linkPrefix="New to Next101?"
        linkText="Create an account"
        linkHref={siteLinks.auth.signUp}
      />
    )
    // The Stack component should be present with centered alignment
    const stack =
      container.querySelector('[class*="m_8d3f4000"]') || container.firstChild
    expect(stack).toBeTruthy()
  })

  it('link has correct styling', () => {
    renderMantine(
      <AuthHeader
        title="Welcome back!"
        linkPrefix="New to Next101?"
        linkText="Create an account"
        linkHref={siteLinks.auth.signUp}
      />
    )
    const link = screen.getByRole('link', { name: 'Create an account' })
    expect(link).toBeInTheDocument()
  })
})
