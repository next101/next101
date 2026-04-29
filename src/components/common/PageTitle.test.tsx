import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MantineWrapper } from '@/test'
import { PageTitle } from './PageTitle'

describe('PageTitle', () => {
  it('renders the title text', () => {
    render(<PageTitle title="Test Page" />, { wrapper: MantineWrapper })

    expect(screen.getByText('Test Page')).toBeInTheDocument()
  })

  it('renders as h1 by default', () => {
    render(<PageTitle title="Default Order" />, { wrapper: MantineWrapper })

    const heading = screen.getByRole('heading', { name: 'Default Order' })
    expect(heading.tagName).toBe('H1')
  })

  it('renders with custom order', () => {
    render(<PageTitle title="Heading 2" order={2} />, {
      wrapper: MantineWrapper,
    })

    const heading = screen.getByRole('heading', { name: 'Heading 2' })
    expect(heading.tagName).toBe('H2')
  })

  it('applies bottom border styling', () => {
    const { container } = render(<PageTitle title="Styled Title" />, {
      wrapper: MantineWrapper,
    })

    const heading = container.querySelector('h1')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveStyle({
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
    })
  })
})
