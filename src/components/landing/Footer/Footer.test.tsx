import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { siteConfig } from '@/config'
import { renderMantine } from '@/test'
import { Footer } from './Footer'
import { FOOTER_LINKS, FOOTER_SOCIALS } from './footer.data'

describe(Footer, () => {
  let container: HTMLElement

  beforeEach(() => {
    const result = renderMantine(<Footer />)
    container = result.container
  })

  it('renders brand name and tagline', () => {
    expect(within(container).getByText(siteConfig.name)).toBeInTheDocument()
    expect(
      within(container).getByText(siteConfig.description)
    ).toBeInTheDocument()
  })

  it('renders all social links with correct hrefs', () => {
    for (const social of FOOTER_SOCIALS) {
      const link = within(container).getByLabelText(social.label)
      expect(link).toHaveAttribute('href', social.href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('renders all footer section titles', () => {
    for (const section of Object.values(FOOTER_LINKS)) {
      expect(
        within(container).getAllByText(section.title).length
      ).toBeGreaterThanOrEqual(1)
    }
  })

  it('renders all footer links', () => {
    for (const section of Object.values(FOOTER_LINKS)) {
      for (const link of section.links) {
        const links = within(container).getAllByText(link.label)
        expect(links.length).toBeGreaterThanOrEqual(1)

        const anchor = links[0]?.closest('a')
        expect(anchor).toHaveAttribute('href', link.href)
      }
    }
  })

  it('renders copyright with current year', () => {
    const currentYear = new Date().getFullYear()
    expect(
      within(container).getByText(new RegExp(`© ${currentYear}`))
    ).toBeInTheDocument()
  })

  it('renders built-with attribution', () => {
    expect(
      within(container).getByText(/Built with Next\.js & Mantine/i)
    ).toBeInTheDocument()
  })
})
