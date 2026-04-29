import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { NoteDetail } from './NoteDetail'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

describe('NoteDetail', () => {
  const mockNote = {
    id: 123,
    title: 'Test Note',
    content: '<p>Test content</p>',
    ownerId: 'user-123',
    createdAt: '2026-04-29T00:00:00.000Z',
    updatedAt: '2026-04-29T00:00:00.000Z',
  }

  it('renders note content as HTML', () => {
    renderMantine(<NoteDetail note={mockNote} />)

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('shows creation date', () => {
    renderMantine(<NoteDetail note={mockNote} />)

    expect(screen.getByText(/Created at:/)).toBeInTheDocument()
  })

  it('has edit link', () => {
    renderMantine(<NoteDetail note={mockNote} />)

    const editLink = screen.getByRole('link', { name: /edit note/i })
    expect(editLink).toHaveAttribute('href', '/notes/123/edit')
  })

  it('has back link', () => {
    renderMantine(<NoteDetail note={mockNote} />)

    const backLink = screen.getByRole('link', { name: /back to notes/i })
    expect(backLink).toHaveAttribute('href', '/notes')
  })

  it('shows updated date when different from created', () => {
    const updatedNote = {
      ...mockNote,
      updatedAt: '2026-04-30T00:00:00.000Z',
    }

    renderMantine(<NoteDetail note={updatedNote} />)

    expect(screen.getByText(/Updated at:/)).toBeInTheDocument()
  })
})
