import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { ColorSchemeSwitch } from './ColorSchemeSwitch'

describe('ColorSchemeSwitch', () => {
  beforeEach(() => {
    renderMantine(<ColorSchemeSwitch />)
  })

  describe('target button', () => {
    it('renders ActionIcon with color scheme aria-label', () => {
      const button = screen.getByLabelText('Color scheme')
      expect(button).toBeInTheDocument()
    })

    it('renders target icon based on current color scheme', () => {
      const icon = screen.getByTestId('icon-colorscheme')
      expect(icon).toHaveClass('tabler-icon-sun')
    })

    it('renders menu target with aria attributes', () => {
      const button = screen.getByLabelText('Color scheme')
      expect(button).toHaveAttribute('aria-haspopup', 'menu')
    })
  })

  describe('menu interactions', () => {
    it('opens menu and renders dropdown items', async () => {
      const button = screen.getByLabelText('Color scheme')
      fireEvent.click(button)

      await waitFor(() => {
        expect(within(document.body).getByText('Light')).toBeInTheDocument()
      })

      expect(within(document.body).getByText('Dark')).toBeInTheDocument()
      expect(within(document.body).getByText('Auto')).toBeInTheDocument()
    })

    it('shows check icon on selected option', async () => {
      const button = screen.getByLabelText('Color scheme')
      fireEvent.click(button)

      const lightItem = await waitFor(() =>
        within(document.body).getByText('Light')
      )
      expect(
        within(lightItem.parentElement as HTMLElement).getByTestId('icon-check')
      ).toBeInTheDocument()
    })

    it('calls setColorScheme when menu item is clicked', async () => {
      const button = screen.getByLabelText('Color scheme')
      fireEvent.click(button)

      const darkItem = await waitFor(() =>
        within(document.body).getByText('Dark')
      )
      fireEvent.click(darkItem)

      await waitFor(() => {
        const icon = screen.getByTestId('icon-colorscheme')
        expect(icon).toHaveClass('tabler-icon-moon')
      })
    })
  })
})
