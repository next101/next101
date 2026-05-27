import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MantineWrapper, renderMantine } from '@/test'
import {
  BetterAuthVisual,
  BlogVisual,
  DarkModeVisual,
  DocsVisual,
  EmailsVisual,
  I18nVisual,
  MantineVisual,
  NextJsVisual,
  PayloadVisual,
  PaymentsVisual,
  RichTextVisual,
  TypeScriptVisual,
} from './FeatureVisuals'

const visuals = [
  { name: 'NextJsVisual', Component: NextJsVisual },
  { name: 'MantineVisual', Component: MantineVisual },
  { name: 'BetterAuthVisual', Component: BetterAuthVisual },
  { name: 'PayloadVisual', Component: PayloadVisual },
  { name: 'PaymentsVisual', Component: PaymentsVisual },
  { name: 'EmailsVisual', Component: EmailsVisual },
  { name: 'BlogVisual', Component: BlogVisual },
  { name: 'DocsVisual', Component: DocsVisual },
  { name: 'I18nVisual', Component: I18nVisual },
  { name: 'TypeScriptVisual', Component: TypeScriptVisual },
  { name: 'DarkModeVisual', Component: DarkModeVisual },
  { name: 'RichTextVisual', Component: RichTextVisual },
]

describe('FeatureVisuals', () => {
  for (const { name, Component } of visuals) {
    describe(name, () => {
      it('renders in light mode', () => {
        const { container } = render(<Component />, {
          wrapper: ({ children }) => (
            <MantineWrapper forceColorScheme="light">{children}</MantineWrapper>
          ),
        })
        expect(container.firstChild).toBeInTheDocument()
      })

      it('renders in dark mode', () => {
        const { container } = render(<Component />, {
          wrapper: ({ children }) => (
            <MantineWrapper forceColorScheme="dark">{children}</MantineWrapper>
          ),
        })
        expect(container.firstChild).toBeInTheDocument()
      })
    })
  }

  describe('DarkModeVisual interactions', () => {
    it('toggles color scheme when clicked', async () => {
      renderMantine(<DarkModeVisual />)

      const switchInput = screen.getByRole('switch')
      const initialChecked = switchInput.getAttribute('data-checked')
      fireEvent.click(switchInput)

      await waitFor(() => {
        expect(switchInput.getAttribute('data-checked')).not.toBe(
          initialChecked
        )
      })

      // Click again to toggle back
      const currentChecked = switchInput.getAttribute('data-checked')
      fireEvent.click(switchInput)

      await waitFor(() => {
        expect(switchInput.getAttribute('data-checked')).not.toBe(
          currentChecked
        )
      })
    })
  })
})
