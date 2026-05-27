import { render, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MantineWrapper, renderMantine } from '@/test'
import { Features } from './Features'
import { featuresData } from './features.data'

describe(Features, () => {
  let container: HTMLElement

  beforeEach(() => {
    const result = renderMantine(<Features />)
    container = result.container
  })

  it('renders the section heading', () => {
    expect(
      within(container).getByText(/From zero to production in minutes/i)
    ).toBeInTheDocument()
  })

  it('renders the section subtitle', () => {
    expect(
      within(container).getByText(/carefully curated stack of modern tools/i)
    ).toBeInTheDocument()
  })

  it('renders all feature titles', () => {
    for (const feature of featuresData) {
      expect(within(container).getByText(feature.title)).toBeInTheDocument()
    }
  })

  it('has the features id for anchor navigation', () => {
    const section = container.querySelector('#features')
    expect(section).toBeInTheDocument()
  })

  it('renders all visual elements', () => {
    for (const feature of featuresData) {
      const Visual = feature.visual
      const { container: visualContainer } = renderMantine(<Visual />)
      expect(visualContainer.firstChild).toBeInTheDocument()
    }
  })

  it('renders section in light mode', () => {
    const { container: lightContainer } = render(<Features />, {
      wrapper: ({ children }) => (
        <MantineWrapper forceColorScheme="light">{children}</MantineWrapper>
      ),
    })
    const section = lightContainer.querySelector('#features')
    expect(section).toBeInTheDocument()
    expect(section?.parentElement).toBeInTheDocument()
  })

  it('renders section in dark mode', () => {
    const { container: darkContainer } = render(<Features />, {
      wrapper: ({ children }) => (
        <MantineWrapper forceColorScheme="dark">{children}</MantineWrapper>
      ),
    })
    const section = darkContainer.querySelector('#features')
    expect(section).toBeInTheDocument()
  })
})
