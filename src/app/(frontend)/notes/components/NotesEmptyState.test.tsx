import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { NotesEmptyState } from './NotesEmptyState'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

describe('NotesEmptyState', () => {
  it('renders empty state message', () => {
    renderMantine(<NotesEmptyState />)

    expect(screen.getByText('No Notes Yet')).toBeInTheDocument()
    expect(
      screen.getByText(
        "You haven't created any notes yet. Start by creating your first note!"
      )
    ).toBeInTheDocument()
  })

  it('has a link to create new note', () => {
    renderMantine(<NotesEmptyState />)

    const link = screen.getByRole('link', { name: /create your first note/i })
    expect(link).toHaveAttribute('href', '/notes/new')
  })
})
