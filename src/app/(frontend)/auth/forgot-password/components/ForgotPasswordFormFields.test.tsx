import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { ForgotPasswordFormFields } from './ForgotPasswordFormFields'

describe('ForgotPasswordFormFields', () => {
  const mockGetInputProps = vi.fn((_field: string) => ({
    value: '',
    onChange: vi.fn(),
    error: null,
  }))

  const mockForm = {
    getInputProps: mockGetInputProps,
  }

  it('renders email input field', () => {
    renderMantine(
      <ForgotPasswordFormFields form={mockForm} isLoading={false} />
    )

    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderMantine(
      <ForgotPasswordFormFields form={mockForm} isLoading={false} />
    )

    expect(
      screen.getByRole('button', { name: 'Send password reset email' })
    ).toBeInTheDocument()
  })

  it('shows loading state on button when isLoading is true', () => {
    renderMantine(<ForgotPasswordFormFields form={mockForm} isLoading={true} />)

    const button = screen.getByRole('button', {
      name: 'Send password reset email',
    })
    expect(button).toBeDisabled()
  })

  it('calls getInputProps for email field', () => {
    renderMantine(
      <ForgotPasswordFormFields form={mockForm} isLoading={false} />
    )

    expect(mockGetInputProps).toHaveBeenCalledWith('email')
  })

  it('disables input when isLoading is true', () => {
    renderMantine(<ForgotPasswordFormFields form={mockForm} isLoading={true} />)

    const input = screen.getByPlaceholderText('you@example.com')
    expect(input).toBeDisabled()
  })
})
