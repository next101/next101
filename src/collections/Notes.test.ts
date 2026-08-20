import type { AccessArgs, PayloadRequest } from 'payload'
import { fieldAffectsData } from 'payload/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/server/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

vi.mock('@/lib/server/access/payload', () => ({
  isPayloadUser: vi.fn(),
  isCustomer: vi.fn(),
  isOwner: vi.fn(),
}))

import { isCustomer, isOwner, isPayloadUser } from '@/lib/server/'
import { Notes } from './Notes'

const mockHeaders = new Headers()

const mockPayloadReq = {
  user: { id: 'admin-123', collection: 'users' },
  headers: mockHeaders,
} as unknown as PayloadRequest

const mockGuestReq = {
  user: null,
  headers: mockHeaders,
} as unknown as PayloadRequest

describe('Notes collection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('has correct slug', () => {
    expect(Notes.slug).toBe('notes')
  })

  it('uses title as admin title field', () => {
    expect(Notes.admin?.useAsTitle).toBe('title')
  })

  it('has title, content, and ownerId fields', () => {
    const fieldNames = Notes.fields.filter(fieldAffectsData).map((f) => f.name)
    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('content')
    expect(fieldNames).toContain('ownerId')
  })

  describe('access control', () => {
    describe('read', () => {
      it('allows Payload user to read all', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(true)

        const result = await Notes.access?.read?.({
          req: mockPayloadReq,
        } as AccessArgs)

        expect(result).toBe(true)
      })

      it('allows owner to read own notes', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isOwner).mockResolvedValue({
          ownerId: { equals: 'user-123' },
        })

        const result = await Notes.access?.read?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toEqual({ ownerId: { equals: 'user-123' } })
      })

      it('denies guests', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isOwner).mockResolvedValue(false)

        const result = await Notes.access?.read?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toBe(false)
      })
    })

    describe('create', () => {
      it('allows Payload user to create', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(true)

        const result = await Notes.access?.create?.({
          req: mockPayloadReq,
        } as AccessArgs)

        expect(result).toBe(true)
      })

      it('allows authenticated customer to create', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isCustomer).mockResolvedValue(true)

        const result = await Notes.access?.create?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toBe(true)
      })

      it('denies guests', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isCustomer).mockResolvedValue(false)

        const result = await Notes.access?.create?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toBe(false)
      })
    })

    describe('update', () => {
      it('allows Payload user to update any note', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(true)

        const result = await Notes.access?.update?.({
          req: mockPayloadReq,
        } as AccessArgs)

        expect(result).toBe(true)
      })

      it('allows owner to update own note', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isOwner).mockResolvedValue({
          ownerId: { equals: 'user-123' },
        })

        const result = await Notes.access?.update?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toEqual({ ownerId: { equals: 'user-123' } })
      })

      it('denies guests to update notes', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isOwner).mockResolvedValue(false)

        const result = await Notes.access?.update?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toBe(false)
      })
    })

    describe('delete', () => {
      it('allows Payload user to delete any note', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(true)

        const result = await Notes.access?.delete?.({
          req: mockPayloadReq,
        } as AccessArgs)

        expect(result).toBe(true)
      })

      it('allows owner to delete own note', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isOwner).mockResolvedValue({
          ownerId: { equals: 'user-123' },
        })

        const result = await Notes.access?.delete?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toEqual({ ownerId: { equals: 'user-123' } })
      })

      it('denies guests to delete notes', async () => {
        vi.mocked(isPayloadUser).mockReturnValue(false)
        vi.mocked(isOwner).mockResolvedValue(false)

        const result = await Notes.access?.delete?.({
          req: mockGuestReq,
        } as AccessArgs)

        expect(result).toBe(false)
      })
    })
  })
})
