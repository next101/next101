import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { FeatureNumberWatermark } from './FeatureNumberWatermark'

describe(FeatureNumberWatermark, () => {
  it('renders the provided number', () => {
    const { container } = renderMantine(<FeatureNumberWatermark number="05" />)

    expect(within(container).getByText('05')).toBeInTheDocument()
  })

  it('has absolute positioning', () => {
    const { container } = renderMantine(<FeatureNumberWatermark number="01" />)

    const text = container.querySelector('.mantine-Text-root')
    expect(text).toHaveStyle({ position: 'absolute' })
  })
})
