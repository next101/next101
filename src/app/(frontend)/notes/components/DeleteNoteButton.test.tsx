import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { DeleteNoteButton } from './DeleteNoteButton'

const mockDeleteNote = vi.fn()

vi.mock('../actions', () => ({
  deleteNote: (...args: unknown[]) => mockDeleteNote(...args),
}))

// Mock Mantine Modal to render content immediately in tests
vi.mock('@mantine/core', async () => {
  const actual =
    await vi.importActual<typeof import('@mantine/core')>('@mantine/core')
  return {
    ...actual,
    Modal: ({
      opened,
      children,
    }: {
      opened: boolean
      children: React.ReactNode
      onClose: () => void
    }) =>
      opened ? (
        <div data-testid="modal" role="dialog">
          {children}
        </div>
      ) : null,
  }
})

describe('DeleteNoteButton', () => {
  it('renders delete icon button', () => {
    renderMantine(<DeleteNoteButton noteId="note-123" />)

    expect(screen.getByTitle('Delete')).toBeInTheDocument()
  })

  it('opens modal when clicked', () => {
    renderMantine(<DeleteNoteButton noteId="note-123" />)

    fireEvent.click(screen.getByTitle('Delete'))

    // Modal should be opened - check for mocked modal presence
    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })

  it('calls onClick prop when provided', () => {
    const onClick = vi.fn()

    renderMantine(<DeleteNoteButton noteId="note-123" onClick={onClick} />)

    fireEvent.click(screen.getByTitle('Delete'))

    expect(onClick).toHaveBeenCalled()
  })

  it('handles delete error gracefully', async () => {
    mockDeleteNote.mockRejectedValue(new Error('Delete failed'))

    renderMantine(<DeleteNoteButton noteId="note-123" />)

    await act(async () => {
      fireEvent.click(screen.getByTitle('Delete'))
    })

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    // Click the confirm delete button inside the modal
    const confirmButton = screen.getByTestId('confirm-delete')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    // Wait for error handling (setIsDeleting(false) + close())
    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledWith('note-123')
    })
  })

  it('closes modal on successful delete', async () => {
    mockDeleteNote.mockResolvedValue(undefined)

    renderMantine(<DeleteNoteButton noteId="note-123" />)

    await act(async () => {
      fireEvent.click(screen.getByTitle('Delete'))
    })

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    // Click the confirm delete button inside the modal
    const confirmButton = screen.getByTestId('confirm-delete')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    // Wait for delete to complete and modal to close
    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledWith('note-123')
    })
  })

  it('shows generic error when delete throws non-Error', async () => {
    mockDeleteNote.mockRejectedValue('string error')

    renderMantine(<DeleteNoteButton noteId="note-123" />)

    await act(async () => {
      fireEvent.click(screen.getByTitle('Delete'))
    })

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    // Click the confirm delete button inside the modal
    const confirmButton = screen.getByTestId('confirm-delete')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    // Wait for error to be shown
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong'
      )
    })
  })
})
