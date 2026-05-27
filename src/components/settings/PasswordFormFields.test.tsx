import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { PasswordFormFields } from './PasswordFormFields'

describe('PasswordFormFields', () => {
  const mockGetInputProps = vi.fn((_field: string) => ({
    value: '',
    onChange: vi.fn(),
    error: null,
  }))

  const mockForm = {
    getInputProps: mockGetInputProps,
  }

  it('renders title and description', () => {
    renderMantine(<PasswordFormFields form={mockForm} isLoading={false} />)

    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(
      screen.getByText('Manage your account security and password')
    ).toBeInTheDocument()
  })

  it('renders all password input fields', () => {
    renderMantine(<PasswordFormFields form={mockForm} isLoading={false} />)

    expect(
      screen.getByPlaceholderText('Your current password')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your new password')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Confirm your new password')
    ).toBeInTheDocument()
  })

  it('renders change password button', () => {
    renderMantine(<PasswordFormFields form={mockForm} isLoading={false} />)

    expect(
      screen.getByRole('button', { name: 'Change password' })
    ).toBeInTheDocument()
  })

  it('shows loading state on button when isLoading is true', () => {
    renderMantine(<PasswordFormFields form={mockForm} isLoading={true} />)

    const button = screen.getByRole('button', { name: 'Change password' })
    expect(button).toBeDisabled()
  })

  it('calls getInputProps for all password fields', () => {
    renderMantine(<PasswordFormFields form={mockForm} isLoading={false} />)

    expect(mockGetInputProps).toHaveBeenCalledWith('currentPassword')
    expect(mockGetInputProps).toHaveBeenCalledWith('newPassword')
    expect(mockGetInputProps).toHaveBeenCalledWith('confirmPassword')
  })
})
