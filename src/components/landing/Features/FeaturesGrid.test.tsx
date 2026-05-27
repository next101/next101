import { act, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import { FeaturesGrid } from './FeaturesGrid'
import { featuresData } from './features.data'

describe(FeaturesGrid, () => {
  let observerCallbacks: ((entries: IntersectionObserverEntry[]) => void)[] = []

  beforeEach(() => {
    observerCallbacks = []
    global.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallbacks.push(callback)
      }
      observe = vi.fn()
      disconnect = vi.fn()
      takeRecords = vi.fn()
      root = null
      rootMargin = ''
      thresholds = []
    } as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('renders all feature cards', () => {
    const { container } = renderMantine(<FeaturesGrid />)

    for (const feature of featuresData) {
      expect(within(container).getByText(feature.title)).toBeInTheDocument()
    }
  })

  it('renders the correct number of feature cards', () => {
    const { container } = renderMantine(<FeaturesGrid />)

    const cards = container.querySelectorAll('.mantine-Card-root')
    expect(cards).toHaveLength(featuresData.length)
  })

  it('renders all feature descriptions', () => {
    const { container } = renderMantine(<FeaturesGrid />)

    for (const feature of featuresData) {
      expect(
        within(container).getByText(feature.description)
      ).toBeInTheDocument()
    }
  })

  it('renders with initial opacity 0', () => {
    const { getAllByTestId } = renderMantine(<FeaturesGrid />)

    const animatedDivs = getAllByTestId('animated-feature-card')
    expect(animatedDivs.length).toBe(featuresData.length)
    for (const div of animatedDivs) {
      expect(div).toHaveStyle('opacity: 0')
      expect(div).toHaveStyle('transform: translateY(20px)')
    }
  })

  it('animates to visible when intersecting', () => {
    const { getAllByTestId } = renderMantine(<FeaturesGrid />)

    const animatedDivs = getAllByTestId('animated-feature-card')
    const firstDiv = animatedDivs[0]

    // Trigger intersection for all observers
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: firstDiv,
      time: Date.now(),
    } as IntersectionObserverEntry

    act(() => {
      for (const callback of observerCallbacks) {
        callback([mockEntry])
      }
    })

    expect(firstDiv).toHaveStyle('opacity: 1')
    expect(firstDiv).toHaveStyle('transform: translateY(0)')
  })
})
