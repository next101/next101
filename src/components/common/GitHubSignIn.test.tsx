import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { GitHubSignIn } from './GitHubSignIn'

const mockSignInWithGithub = vi.fn()
const mockUseGitHubSignIn = vi.fn()

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks')
  return {
    ...actual,
    useGitHubSignIn: () => mockUseGitHubSignIn(),
  }
})

describe('GitHubSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGitHubSignIn.mockReturnValue({
      isLoading: false,
      signInWithGithub: mockSignInWithGithub,
    })
  })

  it('renders GitHub button', () => {
    renderMantine(<GitHubSignIn />)
    expect(screen.getByRole('button', { name: /GitHub/i })).toBeInTheDocument()
  })

  it('calls signInWithGithub when button is clicked', () => {
    renderMantine(<GitHubSignIn />)

    const button = screen.getByRole('button', { name: /GitHub/i })
    fireEvent.click(button)

    expect(mockSignInWithGithub).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isLoading is true', () => {
    mockUseGitHubSignIn.mockReturnValue({
      isLoading: true,
      signInWithGithub: mockSignInWithGithub,
    })

    renderMantine(<GitHubSignIn />)

    const button = screen.getByRole('button', { name: /GitHub/i })
    expect(button).toHaveAttribute('data-loading', 'true')
  })
})
