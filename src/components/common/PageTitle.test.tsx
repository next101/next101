import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { PageTitle } from './PageTitle'

describe('PageTitle', () => {
  it('renders the title text', () => {
    renderMantine(<PageTitle title="Test Page" />)

    expect(screen.getByText('Test Page')).toBeInTheDocument()
  })

  it('renders as h1 by default', () => {
    renderMantine(<PageTitle title="Default Order" />)

    const heading = screen.getByRole('heading', { name: 'Default Order' })
    expect(heading.tagName).toBe('H1')
  })

  it('renders with custom order', () => {
    renderMantine(<PageTitle title="Heading 2" order={2} />)

    const heading = screen.getByRole('heading', { name: 'Heading 2' })
    expect(heading.tagName).toBe('H2')
  })

  it('applies bottom border styling', () => {
    const { container } = renderMantine(<PageTitle title="Styled Title" />)

    const heading = container.querySelector('h1')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveStyle({
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
    })
  })
})
