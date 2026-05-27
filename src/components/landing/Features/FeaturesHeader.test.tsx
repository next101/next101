import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { FeaturesHeader } from './FeaturesHeader'

describe(FeaturesHeader, () => {
  it('renders the section title', () => {
    const { container } = renderMantine(<FeaturesHeader />)

    expect(
      within(container).getByText(/From zero to production in minutes/i)
    ).toBeInTheDocument()
  })

  it('renders the section subtitle', () => {
    const { container } = renderMantine(<FeaturesHeader />)

    expect(
      within(container).getByText(/A carefully curated stack of modern tools/i)
    ).toBeInTheDocument()
  })

  it('renders as an h2 element', () => {
    const { container } = renderMantine(<FeaturesHeader />)

    const heading = container.querySelector('h2')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('From zero to production in minutes')
  })
})
