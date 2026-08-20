import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { NoteForm } from './NoteForm'

vi.mock('./TipTapEditor', () => ({
  TipTapEditor: ({
    content,
    onChange,
  }: {
    content: string
    onChange: (v: string) => void
  }) => (
    <div data-testid="tiptap-editor">
      <textarea
        data-testid="tiptap-content"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

describe('NoteForm', () => {
  const mockAction = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders create form', () => {
    renderMantine(<NoteForm action={mockAction} />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create note/i })
    ).toBeInTheDocument()
  })

  it('renders edit form with note data', () => {
    const note = {
      id: 123,
      title: 'Test Note',
      content: 'Test content',
    }

    renderMantine(<NoteForm action={mockAction} note={note} />)

    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /update note/i })
    ).toBeInTheDocument()
  })

  it('has cancel link to notes list when creating', () => {
    renderMantine(<NoteForm action={mockAction} />)

    const cancelLink = screen.getByRole('link', { name: /cancel/i })
    expect(cancelLink).toHaveAttribute('href', '/notes')
  })

  it('has cancel link to note detail when editing', () => {
    const note = {
      id: 123,
      title: 'Test Note',
      content: 'Test content',
    }

    renderMantine(<NoteForm action={mockAction} note={note} />)

    const cancelLink = screen.getByRole('link', { name: /cancel/i })
    expect(cancelLink).toHaveAttribute('href', '/notes/123')
  })

  it('submits form with data', async () => {
    mockAction.mockResolvedValue(undefined)

    const { container } = renderMantine(<NoteForm action={mockAction} />)

    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'New Note' } })

    const contentInput = screen.getByTestId('tiptap-content')
    fireEvent.change(contentInput, { target: { value: 'Note content' } })

    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    if (form) {
      await act(async () => {
        fireEvent.submit(form)
      })
    }

    // Wait for async action
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled()
    })

    const formData = mockAction.mock.calls[0][0] as FormData
    expect(formData.get('title')).toBe('New Note')
    expect(formData.get('content')).toBe('Note content')
  })

  it('resets submitting state on error', async () => {
    mockAction.mockRejectedValue(new Error('Action failed'))

    const { container } = renderMantine(<NoteForm action={mockAction} />)

    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'New Note' } })

    const contentInput = screen.getByTestId('tiptap-content')
    fireEvent.change(contentInput, { target: { value: 'Note content' } })

    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    if (form) {
      await act(async () => {
        fireEvent.submit(form)
      })
    }

    // Wait for async action to complete (error path resets isSubmitting)
    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled()
    })

    // Form should still be interactive after error
    expect(screen.getByRole('button', { name: /create note/i })).toBeEnabled()
  })

  it('shows generic error when action throws non-Error', async () => {
    mockAction.mockRejectedValue('string error')

    const { container } = renderMantine(<NoteForm action={mockAction} />)

    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'New Note' } })

    const contentInput = screen.getByTestId('tiptap-content')
    fireEvent.change(contentInput, { target: { value: 'Note content' } })

    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
    if (form) {
      await act(async () => {
        fireEvent.submit(form)
      })
    }

    // Wait for error to be shown
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong'
      )
    })
  })
})
