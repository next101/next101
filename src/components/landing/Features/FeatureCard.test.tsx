import { fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { FeatureCard } from './FeatureCard'
import { featuresData } from './features.data'

describe(FeatureCard, () => {
  it('applies hover styles on mouse enter', () => {
    const feature = featuresData[0]
    const { container } = renderMantine(
      <FeatureCard feature={feature} index={0} />
    )

    const card = container.querySelector('.mantine-Card-root') as HTMLElement
    expect(card).toBeInTheDocument()

    fireEvent.mouseEnter(card)
    expect(card.style.transform).toBe('translateY(-4px)')
  })

  it('restores styles on mouse leave', () => {
    const feature = featuresData[0]
    const { container } = renderMantine(
      <FeatureCard feature={feature} index={0} />
    )

    const card = container.querySelector('.mantine-Card-root') as HTMLElement
    expect(card).toBeInTheDocument()

    fireEvent.mouseEnter(card)
    fireEvent.mouseLeave(card)
    expect(card.style.transform).toBe('translateY(0)')
  })
})
