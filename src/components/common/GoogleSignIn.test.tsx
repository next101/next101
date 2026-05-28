import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { GoogleSignIn } from './GoogleSignIn'

const mockSignInWithGoogle = vi.fn()
const mockUseGoogleSignIn = vi.fn()

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useGoogleSignIn: () => mockUseGoogleSignIn(),
  }
})

describe('GoogleSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGoogleSignIn.mockReturnValue({
      isLoading: false,
      signInWithGoogle: mockSignInWithGoogle,
    })
  })

  it('renders Google button', () => {
    renderMantine(<GoogleSignIn />)
    expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument()
  })

  it('calls signInWithGoogle when button is clicked', () => {
    renderMantine(<GoogleSignIn />)

    const button = screen.getByRole('button', { name: /Google/i })
    fireEvent.click(button)

    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isLoading is true', () => {
    mockUseGoogleSignIn.mockReturnValue({
      isLoading: true,
      signInWithGoogle: mockSignInWithGoogle,
    })

    renderMantine(<GoogleSignIn />)

    const button = screen.getByRole('button', { name: /Google/i })
    expect(button).toHaveAttribute('data-loading', 'true')
  })
})
