import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { Logo, LogoWithTitle } from './Logo'

describe('Logo', () => {
  let container: HTMLElement

  beforeEach(() => {
    const result = renderMantine(<Logo />)
    container = result.container
  })

  it('renders logo image with alt text', () => {
    const img = within(container).getByAltText('Next101')
    expect(img).toBeInTheDocument()
  })
})

describe('LogoWithTitle', () => {
  let container: HTMLElement

  beforeEach(() => {
    const result = renderMantine(<LogoWithTitle />)
    container = result.container
  })

  it('renders logo image with alt text', () => {
    const img = within(container).getByAltText('Next101')
    expect(img).toBeInTheDocument()
  })

  it('renders the Next101 title text', () => {
    const title = within(container).getByText('Next101')
    expect(title).toBeInTheDocument()
  })

  it('wraps content in a link to home page', () => {
    const link = container.querySelector('a[href="/"]')
    expect(link).toBeInTheDocument()
  })

  it('applies custom width and height to logo', () => {
    const { container: customContainer } = renderMantine(
      <LogoWithTitle width={100} height={50} />
    )
    const img = within(customContainer).getByAltText('Next101')
    expect(img).toHaveAttribute('width', '100')
    expect(img).toHaveAttribute('height', '50')
  })
})
