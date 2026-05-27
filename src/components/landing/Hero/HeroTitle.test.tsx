import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { siteConfig } from '@/config'
import { renderMantine } from '@/test'
import { HeroTitle } from './HeroTitle'

describe(HeroTitle, () => {
  let container: HTMLElement

  beforeEach(() => {
    container = renderMantine(<HeroTitle />).container
  })

  it('renders main title', () => {
    expect(
      within(container).getByText(siteConfig.description)
    ).toBeInTheDocument()
  })

  it('renders description text', () => {
    expect(
      within(container).getByText(/An opinionated Next\.js 16 boilerplate/i)
    ).toBeInTheDocument()
  })

  it('renders as h1 element', () => {
    const title = container.querySelector('h1')
    expect(title).toBeInTheDocument()
  })
})
