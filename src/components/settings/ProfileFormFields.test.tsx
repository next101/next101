import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine, verifiedUser } from '@/test'
import { ProfileFormFields } from './ProfileFormFields'

describe('ProfileFormFields', () => {
  const mockGetInputProps = vi.fn((_field: string) => ({
    value: '',
    onChange: vi.fn(),
    error: null,
  }))

  const mockForm = {
    getInputProps: mockGetInputProps,
  }

  it('renders title and description', () => {
    renderMantine(
      <ProfileFormFields
        form={mockForm}
        isLoading={false}
        email={verifiedUser.email}
      />
    )

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(
      screen.getByText('Manage your public profile information')
    ).toBeInTheDocument()
  })

  it('renders name input field', () => {
    renderMantine(
      <ProfileFormFields
        form={mockForm}
        isLoading={false}
        email={verifiedUser.email}
      />
    )

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
  })

  it('renders email input as disabled', () => {
    renderMantine(
      <ProfileFormFields
        form={mockForm}
        isLoading={false}
        email={verifiedUser.email}
      />
    )

    const emailInput = screen.getByDisplayValue(
      verifiedUser.email
    ) as HTMLInputElement
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toBeDisabled()
  })

  it('renders update profile button', () => {
    renderMantine(
      <ProfileFormFields
        form={mockForm}
        isLoading={false}
        email={verifiedUser.email}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Update profile' })
    ).toBeInTheDocument()
  })

  it('shows loading state on button when isLoading is true', () => {
    renderMantine(
      <ProfileFormFields
        form={mockForm}
        isLoading={true}
        email={verifiedUser.email}
      />
    )

    const button = screen.getByRole('button', { name: 'Update profile' })
    expect(button).toBeDisabled()
  })

  it('calls getInputProps for name field', () => {
    renderMantine(
      <ProfileFormFields
        form={mockForm}
        isLoading={false}
        email={verifiedUser.email}
      />
    )

    expect(mockGetInputProps).toHaveBeenCalledWith('name')
  })
})
