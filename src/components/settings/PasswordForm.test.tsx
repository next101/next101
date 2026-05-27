import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authClient } from '@/lib/client'
import { renderMantine } from '@/test'
import { PasswordForm } from './PasswordForm'

vi.mock('@/lib/client', () => ({
  authClient: {
    changePassword: vi.fn(),
  },
}))

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}))

describe('PasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and description', () => {
    renderMantine(<PasswordForm />)

    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(
      screen.getByText('Manage your account security and password')
    ).toBeInTheDocument()
  })

  it('renders all password inputs', () => {
    renderMantine(<PasswordForm />)

    expect(
      screen.getByPlaceholderText('Your current password')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your new password')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Confirm your new password')
    ).toBeInTheDocument()
  })

  it('submits form and calls changePassword', async () => {
    vi.mocked(authClient.changePassword).mockResolvedValueOnce({
      data: { token: 'new-token', user: {} },
      error: null,
    } as never)

    renderMantine(<PasswordForm />)

    fireEvent.change(screen.getByPlaceholderText('Your current password'), {
      target: { value: 'oldpassword123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your new password'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm your new password'), {
      target: { value: 'newpassword123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    await waitFor(() => {
      expect(authClient.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      })
    })
  })

  it('shows validation error when passwords do not match', async () => {
    renderMantine(<PasswordForm />)

    fireEvent.change(screen.getByPlaceholderText('Your current password'), {
      target: { value: 'oldpassword123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your new password'), {
      target: { value: 'newpassword123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm your new password'), {
      target: { value: 'different123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('shows validation error for short new password', async () => {
    renderMantine(<PasswordForm />)

    fireEvent.change(screen.getByPlaceholderText('Your current password'), {
      target: { value: 'oldpassword123' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your new password'), {
      target: { value: 'short' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm your new password'), {
      target: { value: 'short' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 8 characters')
      ).toBeInTheDocument()
    })
  })
})
