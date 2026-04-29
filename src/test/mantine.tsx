import { MantineProvider } from '@mantine/core'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import '@mantine/core/styles.layer.css'

import { theme } from '@/app/(frontend)/theme'

interface MantineWrapperProps {
  children: ReactNode
  forceColorScheme?: 'light' | 'dark'
}

export function MantineWrapper({
  children,
  forceColorScheme,
}: MantineWrapperProps) {
  return (
    <MantineProvider theme={theme} forceColorScheme={forceColorScheme}>
      {children}
    </MantineProvider>
  )
}

export function renderMantine(ui: ReactElement) {
  return render(<MantineWrapper>{ui}</MantineWrapper>)
}
