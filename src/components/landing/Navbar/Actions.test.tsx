import { within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { Actions } from './Actions'

describe('Actions', () => {
  let container: HTMLElement

  beforeEach(() => {
    const result = renderMantine(<Actions mode="desktop" />)
    container = result.container
  })

  it('renders color scheme switch button', () => {
    const colorSchemeButton = within(container).getByLabelText('Color scheme')
    expect(colorSchemeButton).toBeInTheDocument()
  })

  it('renders GitHub link button', () => {
    const githubButton = within(container).getByTestId('icon-github')
    expect(githubButton).toBeInTheDocument()
  })

  it('renders language switch button', () => {
    const languageButton = within(container).getByTestId('icon-language')
    expect(languageButton).toBeInTheDocument()
  })
})
