import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'

import { GitHubLink } from './GitHubLink'

describe(GitHubLink, () => {
  let button: HTMLElement

  beforeEach(() => {
    const { container } = renderMantine(<GitHubLink />)
    button = within(container).getByLabelText('GitHub')
  })

  it('renders GitHub button with correct aria-label', () => {
    expect(button).toBeInTheDocument()
  })

  it('renders link with correct href', () => {
    expect(button).toHaveAttribute('href', 'https://github.com/next101/next101')
  })

  it('has correct target and rel attributes', () => {
    expect(button).toHaveAttribute('target', '_blank')
    expect(button).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders GitHub icon', () => {
    expect(screen.getByTestId('icon-github')).toBeInTheDocument()
  })
})
