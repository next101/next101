import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { ResetPasswordFormFields } from './ResetPasswordFormFields'

describe('ResetPasswordFormFields', () => {
  const mockGetInputProps = vi.fn((_field: string) => ({
    value: '',
    onChange: vi.fn(),
    error: null,
  }))

  const mockForm = {
    getInputProps: mockGetInputProps,
  }

  it('renders password input field', () => {
    renderMantine(<ResetPasswordFormFields form={mockForm} isLoading={false} />)

    expect(
      screen.getByPlaceholderText('Enter your new password')
    ).toBeInTheDocument()
  })

  it('renders confirm password input field', () => {
    renderMantine(<ResetPasswordFormFields form={mockForm} isLoading={false} />)

    expect(
      screen.getByPlaceholderText('Confirm your new password')
    ).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderMantine(<ResetPasswordFormFields form={mockForm} isLoading={false} />)

    expect(
      screen.getByRole('button', { name: 'Reset password' })
    ).toBeInTheDocument()
  })

  it('shows loading state on button when isLoading is true', () => {
    renderMantine(<ResetPasswordFormFields form={mockForm} isLoading={true} />)

    const button = screen.getByRole('button', { name: 'Reset password' })
    expect(button).toBeDisabled()
  })

  it('calls getInputProps for password field', () => {
    renderMantine(<ResetPasswordFormFields form={mockForm} isLoading={false} />)

    expect(mockGetInputProps).toHaveBeenCalledWith('password')
  })

  it('calls getInputProps for confirmPassword field', () => {
    renderMantine(<ResetPasswordFormFields form={mockForm} isLoading={false} />)

    expect(mockGetInputProps).toHaveBeenCalledWith('confirmPassword')
  })

  it('disables inputs when isLoading is true', () => {
    renderMantine(<ResetPasswordFormFields form={mockForm} isLoading={true} />)

    const passwordInput = screen.getByPlaceholderText('Enter your new password')
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your new password'
    )
    expect(passwordInput).toBeDisabled()
    expect(confirmPasswordInput).toBeDisabled()
  })
})
