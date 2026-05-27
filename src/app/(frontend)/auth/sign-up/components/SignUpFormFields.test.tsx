import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { SignUpFormFields } from './SignUpFormFields'

describe('SignUpFormFields', () => {
  const mockGetInputProps = vi.fn((_field: string) => ({
    value: '',
    onChange: vi.fn(),
    error: null,
  }))

  const mockForm = {
    getInputProps: mockGetInputProps,
  }

  it('renders name input field', () => {
    renderMantine(<SignUpFormFields form={mockForm} isLoading={false} />)

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
  })

  it('renders email input field', () => {
    renderMantine(<SignUpFormFields form={mockForm} isLoading={false} />)

    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
  })

  it('renders password input field', () => {
    renderMantine(<SignUpFormFields form={mockForm} isLoading={false} />)

    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument()
  })

  it('renders Create an account button', () => {
    renderMantine(<SignUpFormFields form={mockForm} isLoading={false} />)

    expect(
      screen.getByRole('button', { name: 'Create an account' })
    ).toBeInTheDocument()
  })

  it('shows loading state on button when isLoading is true', () => {
    renderMantine(<SignUpFormFields form={mockForm} isLoading={true} />)

    const button = screen.getByRole('button', { name: 'Create an account' })
    expect(button).toBeDisabled()
  })

  it('calls getInputProps for all form fields', () => {
    renderMantine(<SignUpFormFields form={mockForm} isLoading={false} />)

    expect(mockGetInputProps).toHaveBeenCalledWith('name')
    expect(mockGetInputProps).toHaveBeenCalledWith('email')
    expect(mockGetInputProps).toHaveBeenCalledWith('password')
  })

  it('renders form with correct structure', () => {
    const { container } = renderMantine(
      <SignUpFormFields form={mockForm} isLoading={false} />
    )

    const stack = container.querySelector('.mantine-Stack-root')
    expect(stack).toBeInTheDocument()
  })
})
