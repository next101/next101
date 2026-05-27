import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import NotesLoading from './loading'

describe('NotesLoading', () => {
  it('renders without error', () => {
    const { container } = renderMantine(<NotesLoading />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders title and content skeleton elements', () => {
    const { container } = renderMantine(<NotesLoading />)

    const skeletons = container.querySelectorAll('[class*="Skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(1)
  })
})
