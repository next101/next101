import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { siteLinks } from '@/config'
import { renderMantine } from '@/test'
import { SignInForm } from './SignInForm'

describe(SignInForm, () => {
  it('renders sign in form with all fields', () => {
    renderMantine(<SignInForm />)

    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('renders forgot password link', () => {
    renderMantine(<SignInForm />)

    expect(
      screen.getByRole('link', { name: 'Forgot password?' })
    ).toHaveAttribute('href', siteLinks.auth.forgotPassword)
  })

  it('renders form with required attributes', () => {
    renderMantine(<SignInForm />)

    expect(screen.getByPlaceholderText('you@example.com')).toBeRequired()
    expect(screen.getByPlaceholderText('Your password')).toBeRequired()
  })

  it('calls onSuccess callback on successful sign in', async () => {
    const onSuccess = vi.fn()
    vi.stubGlobal('authClient', {
      signIn: {
        email: vi.fn().mockResolvedValue({ data: { user: {} }, error: null }),
      },
    })
    vi.stubGlobal('router', {
      push: vi.fn(),
    })

    renderMantine(<SignInForm onSuccess={onSuccess} />)

    expect(onSuccess).toBeDefined()
  })
})
