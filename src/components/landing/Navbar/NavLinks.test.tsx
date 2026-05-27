import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { NAV_ITEMS, NavLinks } from './NavLinks'

describe('NavLinks', () => {
  let container: HTMLElement

  beforeEach(() => {
    const result = renderMantine(<NavLinks mode="desktop" />)
    container = result.container
  })

  it('renders all nav items', () => {
    NAV_ITEMS.forEach((item) => {
      expect(within(container).getByText(item.label)).toBeInTheDocument()
    })
  })

  it('renders links with correct hrefs', () => {
    NAV_ITEMS.forEach((item) => {
      const link = within(container).getByText(item.label)
      expect(link).toHaveAttribute('href', item.href)
    })
  })
})
