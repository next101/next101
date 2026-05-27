import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { siteLinks } from '@/config'
import { renderMantine } from '@/test'
import { SignInButton } from './SignInButton'

describe('SignInButton', () => {
  let button: HTMLElement
  let link: HTMLAnchorElement | null

  beforeEach(() => {
    const { container } = renderMantine(<SignInButton />)
    button = within(container).getByText('Sign in')
    link = button.closest('a')
  })

  it('renders sign in button', () => {
    expect(button).toBeInTheDocument()
    expect(link).toHaveAttribute('href', siteLinks.auth.signIn)
  })
})
