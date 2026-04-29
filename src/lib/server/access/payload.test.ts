import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockSession } from '@/test'
import { isCustomer, isOwner, isPayloadUser } from './payload'

vi.mock('../auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

import { auth } from '../auth'

describe('isPayloadUser', () => {
  it('returns true when req.user is a Payload user', () => {
    const mockPayloadReq = {
      user: { id: 'admin-1', collection: 'users' },
    } as unknown as Parameters<typeof isPayloadUser>[0]

    expect(isPayloadUser(mockPayloadReq)).toBe(true)
  })

  it('returns false when req.user is from a different collection', () => {
    const mockOtherReq = {
      user: { id: 'customer-1', collection: 'customers' },
    } as unknown as Parameters<typeof isPayloadUser>[0]

    expect(isPayloadUser(mockOtherReq)).toBe(false)
  })

  it('returns false when req.user is undefined', () => {
    const mockGuestReq = {} as unknown as Parameters<typeof isPayloadUser>[0]

    expect(isPayloadUser(mockGuestReq)).toBe(false)
  })
})

describe('isCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns session when valid session exists', async () => {
    const mockSession = createMockSession('user-1')
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

    const mockReq = {
      headers: new Headers(),
    } as unknown as Parameters<typeof isCustomer>[0]

    const result = await isCustomer(mockReq)

    expect(result).toBe(true)
    expect(auth.api.getSession).toHaveBeenCalledWith({
      headers: mockReq.headers,
    })
  })

  it('returns false when getSession throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(auth.api.getSession).mockRejectedValue(new Error('fail'))

    const mockReq = {
      headers: new Headers(),
    } as unknown as Parameters<typeof isCustomer>[0]

    const result = await isCustomer(mockReq)

    expect(result).toBe(false)
    consoleSpy.mockRestore()
  })
})

describe('isOwner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns Where clause when user is customer owner', async () => {
    const mockSession = createMockSession('user-1')
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

    const mockReq = {
      headers: new Headers(),
    } as unknown as Parameters<typeof isOwner>[0]

    const result = await isOwner(mockReq)

    expect(result).toEqual({
      ownerId: {
        equals: 'user-1',
      },
    })
  })

  it('returns false when user is Payload user', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const mockPayloadReq = {
      user: { id: 'admin-1', collection: 'users' },
      headers: new Headers(),
    } as unknown as Parameters<typeof isOwner>[0]

    const result = await isOwner(mockPayloadReq)

    expect(result).toBe(false)
  })

  it('returns false when no session exists', async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)

    const mockReq = {
      headers: new Headers(),
    } as unknown as Parameters<typeof isOwner>[0]

    const result = await isOwner(mockReq)

    expect(result).toBe(false)
  })

  it('returns false when getSession throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(auth.api.getSession).mockRejectedValue(new Error('fail'))

    const mockReq = {
      headers: new Headers(),
    } as unknown as Parameters<typeof isOwner>[0]

    const result = await isOwner(mockReq)

    expect(result).toBe(false)
    consoleSpy.mockRestore()
  })
})
