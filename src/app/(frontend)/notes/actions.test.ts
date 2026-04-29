import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/server', () => ({
  getPayloadClient: vi.fn(),
  getSession: vi.fn(),
}))

import { getPayloadClient, getSession } from '@/lib/server'
import { createNote, deleteNote, updateNote } from './actions'

const mockPayload = {
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findByID: vi.fn(),
}

describe('notes actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getPayloadClient).mockResolvedValue(
      mockPayload as unknown as Awaited<ReturnType<typeof getPayloadClient>>
    )
  })

  describe('createNote', () => {
    it('creates a note for authenticated user', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as unknown as Awaited<ReturnType<typeof getSession>>)

      const formData = new FormData()
      formData.set('title', 'Test Note')
      formData.set('content', 'Test content')

      await createNote(formData)

      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'notes',
        data: {
          title: 'Test Note',
          content: 'Test content',
          ownerId: 'user-123',
        },
      })
    })

    it('rejects unauthenticated users', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      const formData = new FormData()
      formData.set('title', 'Test')
      formData.set('content', 'Content')

      await expect(createNote(formData)).rejects.toThrow('Unauthorized')
    })

    it('rejects missing title or content', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as unknown as Awaited<ReturnType<typeof getSession>>)

      const formData = new FormData()
      await expect(createNote(formData)).rejects.toThrow(
        'Title and content are required'
      )
    })
  })

  describe('updateNote', () => {
    it('updates note for owner', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as unknown as Awaited<ReturnType<typeof getSession>>)
      vi.mocked(mockPayload.findByID).mockResolvedValue({
        ownerId: 'user-123',
      })

      const formData = new FormData()
      formData.set('title', 'Updated Title')
      formData.set('content', 'Updated content')

      await updateNote('note-1', formData)

      expect(mockPayload.findByID).toHaveBeenCalledWith({
        collection: 'notes',
        id: 'note-1',
      })
      expect(mockPayload.update).toHaveBeenCalledWith({
        collection: 'notes',
        id: 'note-1',
        data: {
          title: 'Updated Title',
          content: 'Updated content',
        },
      })
    })

    it('rejects non-owner', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as unknown as Awaited<ReturnType<typeof getSession>>)
      vi.mocked(mockPayload.findByID).mockResolvedValue({
        ownerId: 'user-456',
      })

      const formData = new FormData()
      formData.set('title', 'Updated Title')
      formData.set('content', 'Updated content')

      await expect(updateNote('note-1', formData)).rejects.toThrow(
        'Unauthorized'
      )
      expect(mockPayload.update).not.toHaveBeenCalled()
    })

    it('rejects missing title or content', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as unknown as Awaited<ReturnType<typeof getSession>>)
      vi.mocked(mockPayload.findByID).mockResolvedValue({
        ownerId: 'user-123',
      })

      const formData = new FormData()
      await expect(updateNote('note-1', formData)).rejects.toThrow(
        'Title and content are required'
      )
    })

    it('rejects unauthenticated users', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      const formData = new FormData()
      formData.set('title', 'Test')
      formData.set('content', 'Content')

      await expect(updateNote('note-1', formData)).rejects.toThrow(
        'Unauthorized'
      )
    })
  })

  describe('deleteNote', () => {
    it('deletes note for owner', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as unknown as Awaited<ReturnType<typeof getSession>>)
      vi.mocked(mockPayload.findByID).mockResolvedValue({
        ownerId: 'user-123',
      })

      await deleteNote('note-1')

      expect(mockPayload.findByID).toHaveBeenCalledWith({
        collection: 'notes',
        id: 'note-1',
      })
      expect(mockPayload.delete).toHaveBeenCalledWith({
        collection: 'notes',
        id: 'note-1',
      })
    })

    it('rejects non-owner', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as unknown as Awaited<ReturnType<typeof getSession>>)
      vi.mocked(mockPayload.findByID).mockResolvedValue({
        ownerId: 'user-456',
      })

      await expect(deleteNote('note-1')).rejects.toThrow('Unauthorized')
      expect(mockPayload.delete).not.toHaveBeenCalled()
    })

    it('rejects unauthenticated users', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(deleteNote('note-1')).rejects.toThrow('Unauthorized')
    })
  })
})
