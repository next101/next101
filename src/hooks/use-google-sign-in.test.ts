import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MantineWrapper } from '@/test'
import { useGoogleSignIn } from './use-google-sign-in'

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

describe('useGoogleSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSafeRedirectUrl.mockReturnValue('/')
  })

  it('initializes with isLoading false', () => {
    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: MantineWrapper,
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('signInWithGoogle is a function', () => {
    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: MantineWrapper,
    })

    expect(typeof result.current.signInWithGoogle).toBe('function')
  })

  it('sets isLoading to true when signInWithGoogle is called', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signIn.social).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: MantineWrapper,
    })

    act(() => {
      result.current.signInWithGoogle()
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('calls authClient.signIn.social with google provider and redirect url', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signIn.social).mockResolvedValueOnce({} as never)

    mockGetSafeRedirectUrl.mockReturnValue('/notes')

    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signInWithGoogle()
    })

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: 'google',
      callbackURL: '/notes',
    })
  })

  it('falls back to /dashboard when redirectUrl is empty', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signIn.social).mockResolvedValueOnce({} as never)

    mockGetSafeRedirectUrl.mockReturnValue('')

    const { result } = renderHook(() => useGoogleSignIn(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signInWithGoogle()
    })

    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: 'google',
      callbackURL: '/dashboard',
    })
  })
})
