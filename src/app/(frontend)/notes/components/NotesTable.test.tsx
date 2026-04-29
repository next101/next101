import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { NotesTable } from './NotesTable'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode
    href: string
    onClick?: (e: React.MouseEvent) => void
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}))

vi.mock('../actions', () => ({
  deleteNote: vi.fn(),
}))

describe('NotesTable', () => {
  const mockNotes = [
    {
      id: 'note-1',
      title: 'First Note',
      content: 'This is the first note content',
      createdAt: '2026-04-29T00:00:00.000Z',
    },
    {
      id: 'note-2',
      title: 'Second Note',
      content: 'This is the second note content',
      createdAt: '2026-04-28T00:00:00.000Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders table with notes', () => {
    renderMantine(<NotesTable notes={mockNotes} />)

    expect(screen.getByText('First Note')).toBeInTheDocument()
    expect(screen.getByText('Second Note')).toBeInTheDocument()
  })

  it('has create new note button', () => {
    renderMantine(<NotesTable notes={mockNotes} />)

    const button = screen.getByRole('link', { name: /create new note/i })
    expect(button).toHaveAttribute('href', '/notes/new')
  })

  it('shows formatted date', () => {
    const toLocaleDateString = Date.prototype.toLocaleDateString
    Date.prototype.toLocaleDateString = function (this: Date) {
      return `${this.getMonth() + 1}/${this.getDate()}/${this.getFullYear()}`
    }

    renderMantine(<NotesTable notes={mockNotes} />)

    expect(screen.getByText('4/29/2026')).toBeInTheDocument()
    expect(screen.getByText('4/28/2026')).toBeInTheDocument()

    Date.prototype.toLocaleDateString = toLocaleDateString
  })

  it('has edit links for each note', () => {
    renderMantine(<NotesTable notes={mockNotes} />)

    const editLinks = screen.getAllByRole('link', { name: '' })
    const editHrefLinks = editLinks.filter((link) =>
      link.getAttribute('href')?.includes('/edit')
    )
    expect(editHrefLinks).toHaveLength(2)
  })

  it('has delete button for each note', () => {
    renderMantine(<NotesTable notes={mockNotes} />)

    const deleteButtons = screen.getAllByTitle('Delete')
    expect(deleteButtons).toHaveLength(2)
  })

  it('navigates to note detail when row is clicked', () => {
    renderMantine(<NotesTable notes={mockNotes} />)

    const rows = screen.getAllByRole('row')
    // Skip header row
    fireEvent.click(rows[1])

    expect(mockPush).toHaveBeenCalledWith('/notes/note-1')
  })

  it('does not navigate when clicking delete button', () => {
    renderMantine(<NotesTable notes={mockNotes} />)

    const deleteButton = screen.getAllByTitle('Delete')[0]
    fireEvent.click(deleteButton)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('does not navigate when clicking edit button', () => {
    renderMantine(<NotesTable notes={mockNotes} />)

    const editLink = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href')?.includes('/edit'))
    expect(editLink).toBeDefined()
    if (editLink) fireEvent.click(editLink)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('truncates long content', () => {
    const longNote = {
      ...mockNotes[0],
      content: 'a'.repeat(100),
    }

    renderMantine(<NotesTable notes={[longNote]} />)

    const contentCell = screen.getByText('a'.repeat(100))
    expect(contentCell).toHaveStyle({
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    })
  })
})
