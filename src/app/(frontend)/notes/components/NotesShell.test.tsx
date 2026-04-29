import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { NotesShell } from './NotesShell'

describe('NotesShell', () => {
  it('renders the title', () => {
    renderMantine(
      <NotesShell title="Test Notes">
        <div>Content</div>
      </NotesShell>
    )

    expect(screen.getByText('Test Notes')).toBeInTheDocument()
  })

  it('renders children', () => {
    renderMantine(
      <NotesShell title="Test Notes">
        <div data-testid="child">Child content</div>
      </NotesShell>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
