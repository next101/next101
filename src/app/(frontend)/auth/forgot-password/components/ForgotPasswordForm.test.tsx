import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { ForgotPasswordForm } from './ForgotPasswordForm'

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}))

vi.mock('@/lib/client', () => ({
  authClient: {
    requestPasswordReset: vi.fn(),
  } as {
    requestPasswordReset: (opts: {
      email: string
      redirectTo: string
    }) => Promise<void>
  },
}))

describe('ForgotPasswordForm', () => {
  it('renders email input', () => {
    renderMantine(<ForgotPasswordForm />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderMantine(<ForgotPasswordForm />)
    expect(
      screen.getByRole('button', { name: 'Send password reset email' })
    ).toBeInTheDocument()
  })

  it('shows success state after form submission', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.requestPasswordReset).mockResolvedValueOnce(
      {} as never
    )

    renderMantine(<ForgotPasswordForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', {
      name: 'Send password reset email',
    })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/check your email for a link/i)
      ).toBeInTheDocument()
    })
  })
})
