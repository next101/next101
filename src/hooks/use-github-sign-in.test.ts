import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MantineWrapper } from '@/test'
import { useGitHubSignIn } from './use-github-sign-in'

const mockGetSafeRedirectUrl = vi.fn()

vi.mock('@/lib/common/redirect', () => ({
  getSafeRedirectUrl: (...args: unknown[]) => mockGetSafeRedirectUrl(...args),
}))

vi.mock('@/lib/client', () => ({
  authClient: {
    signIn: {
      social: vi.fn(),
    },
  },
}))

describe('useGitHubSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSafeRedirectUrl.mockReturnValue('/')
  })

  it('initializes with isLoading false', () => {
    const { result } = renderHook(() => useGitHubSignIn(), {
      wrapper: MantineWrapper,
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('signInWithGithub is a function', () => {
    const { result } = renderHook(() => useGitHubSignIn(), {
      wrapper: MantineWrapper,
    })

    expect(typeof result.current.signInWithGithub).toBe('function')
  })

  it('sets isLoading to true when signInWithGithub is called', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signIn.social).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    const { result } = renderHook(() => useGitHubSignIn(), {
      wrapper: MantineWrapper,
    })

    act(() => {
      result.current.signInWithGithub()
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('calls authClient.signIn.social with github provider and redirect url', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signIn.social).mockResolvedValueOnce({} as never)

    mockGetSafeRedirectUrl.mockReturnValue('/notes')

    const { result } = renderHook(() => useGitHubSignIn(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signInWithGithub()
    })

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: 'github',
      callbackURL: '/notes',
    })
  })

  it('falls back to /dashboard when redirectUrl is empty', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signIn.social).mockResolvedValueOnce({} as never)

    mockGetSafeRedirectUrl.mockReturnValue('')

    const { result } = renderHook(() => useGitHubSignIn(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signInWithGithub()
    })

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: 'github',
      callbackURL: '/dashboard',
    })
  })
})
