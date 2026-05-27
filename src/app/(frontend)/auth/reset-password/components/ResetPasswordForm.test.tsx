import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { ResetPasswordForm } from './ResetPasswordForm'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn((key) => (key === 'token' ? 'valid-token' : null)),
  }),
}))

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}))

vi.mock('@/lib/client', () => ({
  authClient: {
    resetPassword: vi.fn(),
  },
}))

describe('ResetPasswordForm', () => {
  it('renders password inputs', () => {
    renderMantine(<ResetPasswordForm />)
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderMantine(<ResetPasswordForm />)
    expect(
      screen.getByRole('button', { name: 'Reset password' })
    ).toBeInTheDocument()
  })

  it('shows success state after form submission', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.resetPassword).mockResolvedValueOnce({} as never)

    renderMantine(<ResetPasswordForm />)

    const passwordInput = screen.getByLabelText(/new password/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: 'Reset password' })

    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } })
    fireEvent.change(confirmInput, { target: { value: 'newpassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/your password has been reset/i)
      ).toBeInTheDocument()
    })
  })

  it('shows validation error when passwords do not match', async () => {
    renderMantine(<ResetPasswordForm />)

    const passwordInput = screen.getByLabelText(/new password/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)
    const submitButton = screen.getByRole('button', { name: 'Reset password' })

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmInput, { target: { value: 'differentpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })
})
