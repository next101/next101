import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { SocialSignIn } from './SocialSignIn'

const mockSignInWithGoogle = vi.fn()
const mockSignInWithGithub = vi.fn()
const mockUseGoogleSignIn = vi.fn()
const mockUseGitHubSignIn = vi.fn()

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useGoogleSignIn: () => mockUseGoogleSignIn(),
    useGitHubSignIn: () => mockUseGitHubSignIn(),
  }
})

describe('SocialSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGoogleSignIn.mockReturnValue({
      isLoading: false,
      signInWithGoogle: mockSignInWithGoogle,
    })
    mockUseGitHubSignIn.mockReturnValue({
      isLoading: false,
      signInWithGithub: mockSignInWithGithub,
    })
  })

  it('renders Google and GitHub buttons', () => {
    renderMantine(<SocialSignIn />)

    expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /GitHub/i })).toBeInTheDocument()
  })

  it('renders divider with text', () => {
    renderMantine(<SocialSignIn />)

    expect(screen.getByText(/or continue with/i)).toBeInTheDocument()
  })

  it('calls signInWithGoogle when Google button is clicked', () => {
    renderMantine(<SocialSignIn />)

    fireEvent.click(screen.getByRole('button', { name: /Google/i }))

    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('calls signInWithGithub when GitHub button is clicked', () => {
    renderMantine(<SocialSignIn />)

    fireEvent.click(screen.getByRole('button', { name: /GitHub/i }))

    expect(mockSignInWithGithub).toHaveBeenCalledTimes(1)
  })
})
