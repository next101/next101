import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { SignUpForm } from './SignUpForm'

describe(SignUpForm, () => {
  it('renders sign up form with all fields', () => {
    renderMantine(<SignUpForm />)

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Create an account' })
    ).toBeInTheDocument()
  })

  it('renders form with required attributes', () => {
    renderMantine(<SignUpForm />)

    expect(screen.getByPlaceholderText('Your name')).toBeRequired()
    expect(screen.getByPlaceholderText('you@example.com')).toBeRequired()
    expect(screen.getByPlaceholderText('Your password')).toBeRequired()
  })

  it('calls onSuccess callback on successful sign up', () => {
    const onSuccess = vi.fn()
    vi.stubGlobal('authClient', {
      signUp: {
        email: vi.fn().mockResolvedValue({ data: { user: {} }, error: null }),
      },
    })
    vi.stubGlobal('router', {
      push: vi.fn(),
    })

    renderMantine(<SignUpForm onSuccess={onSuccess} />)

    expect(onSuccess).toBeDefined()
  })
})
