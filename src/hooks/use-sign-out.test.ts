import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { siteLinks } from '@/config'
import { MantineWrapper } from '@/test'
import { useSignOut } from './use-sign-out'

const mockPush = vi.fn()

vi.mock('next/navigation', () => {
  let currentPathname = '/'
  return {
    useRouter: () => ({
      push: mockPush,
    }),
    usePathname: vi.fn(() => {
      return currentPathname
    }),
    __setPathname: (path: string) => {
      currentPathname = path
    },
  }
})

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}))

vi.mock('@/lib/client', () => ({
  authClient: {
    signOut: vi.fn(),
  },
}))

describe('useSignOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with isSigningOut as false', () => {
    const { result } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    expect(result.current.isSigningOut).toBe(false)
  })

  it('sets isSigningOut to true when signOut is called', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signOut).mockResolvedValueOnce({} as never)

    const { result } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    // Start sign out but don't await yet
    act(() => {
      result.current.signOut()
    })

    // Should be true immediately
    expect(result.current.isSigningOut).toBe(true)
  })

  it('calls authClient.signOut when signOut is invoked', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signOut).mockResolvedValueOnce({} as never)

    const { result } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signOut()
    })

    expect(authClient.signOut).toHaveBeenCalled()
  })

  it('redirects to sign in page after successful sign out', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signOut).mockResolvedValueOnce({} as never)

    const { result } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signOut()
    })

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith(siteLinks.auth.signIn)
      },
      { timeout: 3000 }
    )
  })

  it('skips delay when sign out takes longer than minDelay', async () => {
    const { authClient } = await import('@/lib/client')
    // Mock signOut to take longer than 2000ms
    vi.mocked(authClient.signOut).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 2500))
    )

    const { result } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    const startTime = Date.now()

    await act(async () => {
      await result.current.signOut()
    })

    const elapsed = Date.now() - startTime

    // Should complete without additional delay (total ~2500ms, not ~4500ms)
    expect(elapsed).toBeLessThan(4000)
    expect(mockPush).toHaveBeenCalledWith(siteLinks.auth.signIn)
  })

  it('shows error notification when sign out fails', async () => {
    const { notifications } = await import('@mantine/notifications')
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signOut).mockRejectedValueOnce(new Error('Failed'))

    const { result } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signOut()
    })

    await waitFor(() => {
      expect(vi.mocked(notifications.show)).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error',
          message: 'Failed to sign out',
          color: 'red',
        })
      )
    })
  })

  it('sets isSigningOut to false when pathname changes to sign-in page', async () => {
    const { authClient } = await import('@/lib/client')
    const navigation = (await import('next/navigation')) as unknown as {
      __setPathname: (path: string) => void
    }
    const { __setPathname } = navigation
    vi.mocked(authClient.signOut).mockResolvedValueOnce({} as never)

    const { result, rerender } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    act(() => {
      result.current.signOut()
    })

    expect(result.current.isSigningOut).toBe(true)

    __setPathname(siteLinks.auth.signIn)
    rerender()

    await waitFor(() => {
      expect(result.current.isSigningOut).toBe(false)
    })
  })

  it('sets isSigningOut back to false when sign out fails', async () => {
    const { authClient } = await import('@/lib/client')
    vi.mocked(authClient.signOut).mockRejectedValueOnce(new Error('Failed'))

    const { result } = renderHook(() => useSignOut(), {
      wrapper: MantineWrapper,
    })

    await act(async () => {
      await result.current.signOut()
    })

    await waitFor(() => {
      expect(result.current.isSigningOut).toBe(false)
    })
  })
})
