import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MantineWrapper } from '@/test'
import NotesLoading from './loading'

describe('NotesLoading', () => {
  it('renders without error', () => {
    const { container } = render(<NotesLoading />, { wrapper: MantineWrapper })

    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders title and content skeleton elements', () => {
    const { container } = render(<NotesLoading />, { wrapper: MantineWrapper })

    const skeletons = container.querySelectorAll('[class*="Skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(1)
  })
})
