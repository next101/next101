import type { Field, FieldHook } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

vi.mock('../lib/server/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

import { createMockSession } from '@/test'
import { auth } from '../lib/server/auth'
import { ownerIdField } from './owner-id'

type TextField = Extract<Field, { type: 'text' }>

const mockHeaders = new Headers()

describe('OwnerIdField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('has correct field configuration', () => {
    const field = ownerIdField

    expect(field.name).toBe('ownerId')
    expect(field.type).toBe('text')
    expect(field.required).toBe(true)
    expect(field.index).toBe(true)
  })

  describe('beforeValidate hook', () => {
    it('auto-populates ownerId from session on create', async () => {
      const mockSession = createMockSession('user-123')
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession)

      const field = ownerIdField
      const hook = field.hooks?.beforeValidate?.[0]

      const result = await hook?.({
        operation: 'create',
        value: undefined,
        req: { headers: mockHeaders },
      } as Parameters<FieldHook>[0])

      expect(result).toBe('user-123')
      expect(auth.api.getSession).toHaveBeenCalledWith({ headers: mockHeaders })
    })

    it('preserves explicit value when provided', async () => {
      const field = ownerIdField
      const hook = field.hooks?.beforeValidate?.[0]

      const result = await hook?.({
        operation: 'create',
        value: 'explicit-id',
        req: { headers: mockHeaders },
      } as Parameters<FieldHook>[0])

      expect(result).toBe('explicit-id')
      expect(auth.api.getSession).not.toHaveBeenCalled()
    })

    it('throws ValidationError when no session and no value', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const field = ownerIdField
      const hook = field.hooks?.beforeValidate?.[0]

      await expect(
        hook?.({
          operation: 'create',
          value: undefined,
          req: { headers: mockHeaders },
        } as Parameters<FieldHook>[0])
      ).rejects.toThrow(/The following field is invalid/)
    })

    it('throws ValidationError when getSession throws', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(auth.api.getSession).mockRejectedValue(
        new Error('Network error')
      )

      const field = ownerIdField
      const hook = field.hooks?.beforeValidate?.[0]

      await expect(
        hook?.({
          operation: 'create',
          value: undefined,
          req: { headers: mockHeaders },
        } as Parameters<FieldHook>[0])
      ).rejects.toThrow(/The following field is invalid/)
      consoleSpy.mockRestore()
    })

    it('returns existing value on update', async () => {
      const field = ownerIdField as TextField
      const hook = field.hooks?.beforeValidate?.[0]

      const result = await hook?.({
        operation: 'update',
        value: 'existing-id',
        req: { headers: mockHeaders },
      } as Parameters<FieldHook>[0])

      expect(result).toBe('existing-id')
      expect(auth.api.getSession).not.toHaveBeenCalled()
    })

    it('returns existing value on delete', async () => {
      const field = ownerIdField
      const hook = field.hooks?.beforeValidate?.[0]

      const result = await hook?.({
        operation: 'delete',
        value: 'existing-id',
        req: { headers: mockHeaders },
      } as Parameters<FieldHook>[0])

      expect(result).toBe('existing-id')
      expect(auth.api.getSession).not.toHaveBeenCalled()
    })
  })
})
