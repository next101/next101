import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { siteLinks } from '@/config'
import { renderMantine } from '@/test'
import { SignInFormFields } from './SignInFormFields'

describe('SignInFormFields', () => {
  const mockGetInputProps = vi.fn((_field: string) => ({
    value: '',
    onChange: vi.fn(),
    error: null,
  }))

  const mockForm = {
    getInputProps: mockGetInputProps,
  }

  it('renders email input field', () => {
    renderMantine(<SignInFormFields form={mockForm} isLoading={false} />)

    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
  })

  it('renders password input field', () => {
    renderMantine(<SignInFormFields form={mockForm} isLoading={false} />)

    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument()
  })

  it('renders forgot password link', () => {
    renderMantine(<SignInFormFields form={mockForm} isLoading={false} />)

    const forgotPasswordLink = screen.getByRole('link', {
      name: 'Forgot password?',
    })
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink).toHaveAttribute(
      'href',
      siteLinks.auth.forgotPassword
    )
  })

  it('renders sign in button', () => {
    renderMantine(<SignInFormFields form={mockForm} isLoading={false} />)

    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows loading state on button when isLoading is true', () => {
    renderMantine(<SignInFormFields form={mockForm} isLoading={true} />)

    const button = screen.getByRole('button', { name: 'Sign in' })
    expect(button).toBeDisabled()
  })

  it('calls getInputProps for email field', () => {
    renderMantine(<SignInFormFields form={mockForm} isLoading={false} />)

    expect(mockGetInputProps).toHaveBeenCalledWith('email')
  })

  it('calls getInputProps for password field', () => {
    renderMantine(<SignInFormFields form={mockForm} isLoading={false} />)

    expect(mockGetInputProps).toHaveBeenCalledWith('password')
  })

  it('renders form with correct structure', () => {
    const { container } = renderMantine(
      <SignInFormFields form={mockForm} isLoading={false} />
    )

    // Check that the component renders a Stack (flex container)
    const stack = container.querySelector('.mantine-Stack-root')
    expect(stack).toBeInTheDocument()
  })
})
