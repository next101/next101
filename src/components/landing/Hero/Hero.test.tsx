import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { Hero } from './Hero'

describe(Hero, () => {
  let container: HTMLElement

  beforeEach(() => {
    const result = renderMantine(<Hero />)
    container = result.container
  })

  it('renders HeroBadge component', () => {
    expect(
      within(container).getByText(/Next\.js SaaS Kit Done Right/i)
    ).toBeInTheDocument()
  })

  it('renders HeroTitle component', () => {
    expect(
      within(container).getByText(/Next\.js SaaS Kit Done Right/i)
    ).toBeInTheDocument()
    expect(
      within(container).getByText(/An opinionated Next\.js 16 boilerplate/i)
    ).toBeInTheDocument()
  })

  it('renders HeroCTA component with Get Started button', () => {
    expect(within(container).getByText('Get Started')).toBeInTheDocument()
  })

  it('renders HeroCTA component with Try Demo button', () => {
    expect(within(container).getByText('Try Demo')).toBeInTheDocument()
  })

  it('renders as a div element', () => {
    const div = container.querySelector('div')
    expect(div).toBeInTheDocument()
  })
})
