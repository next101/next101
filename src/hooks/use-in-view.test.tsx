import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInView } from './use-in-view'

function TestComponent() {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} data-testid="test-div">
      {inView ? 'in-view' : 'not-in-view'}
    </div>
  )
}

function NullRefComponent() {
  const { inView } = useInView()
  // Intentionally not attaching ref to test null case
  return <div data-testid="null-div">{inView ? 'in-view' : 'not-in-view'}</div>
}

describe('useInView', () => {
  let observerCallback:
    | ((entries: IntersectionObserverEntry[]) => void)
    | null = null
  let mockDisconnect = vi.fn()
  let mockObserve = vi.fn()

  beforeEach(() => {
    observerCallback = null
    mockDisconnect = vi.fn()
    mockObserve = vi.fn()

    global.IntersectionObserver = class MockIntersectionObserver {
      callback: (entries: IntersectionObserverEntry[]) => void

      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        this.callback = callback
        observerCallback = callback
      }

      observe = mockObserve
      disconnect = mockDisconnect
      takeRecords = vi.fn()
      root = null
      rootMargin = ''
      thresholds = []
    } as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false initially', () => {
    const { getByTestId } = render(<TestComponent />)
    expect(getByTestId('test-div')).toHaveTextContent('not-in-view')
  })

  it('returns true when element intersects', () => {
    const { getByTestId } = render(<TestComponent />)
    expect(getByTestId('test-div')).toHaveTextContent('not-in-view')

    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: getByTestId('test-div'),
      time: Date.now(),
    } as IntersectionObserverEntry

    act(() => observerCallback?.([mockEntry]))

    expect(getByTestId('test-div')).toHaveTextContent('in-view')
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('returns false when element does not intersect', () => {
    const { getByTestId } = render(<TestComponent />)

    const mockEntry = {
      isIntersecting: false,
      intersectionRatio: 0,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: getByTestId('test-div'),
      time: Date.now(),
    } as IntersectionObserverEntry

    act(() => observerCallback?.([mockEntry]))

    expect(getByTestId('test-div')).toHaveTextContent('not-in-view')
  })

  it('cleans up observer on unmount', () => {
    const { unmount } = render(<TestComponent />)
    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('handles null ref gracefully', () => {
    const { getByTestId } = render(<NullRefComponent />)
    expect(getByTestId('null-div')).toHaveTextContent('not-in-view')
    expect(mockObserve).not.toHaveBeenCalled()
  })
})
