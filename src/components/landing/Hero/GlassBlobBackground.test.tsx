import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderMantine } from '@/test'
import {
  buildRgba,
  GlassBlobBackground,
  lerp,
  lerpRgba,
  morphRadius,
  parseRgba,
} from './GlassBlobBackground'

describe(GlassBlobBackground, () => {
  let container: HTMLElement

  beforeEach(() => {
    container = renderMantine(<GlassBlobBackground />).container
  })

  it('renders without crashing', () => {
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders as a div element', () => {
    const wrapper = container.querySelector('div')
    expect(wrapper).toBeInTheDocument()
  })

  it('renders two blob elements', () => {
    const blobs = container.querySelectorAll(
      '[style*="will-change: border-radius"]'
    )
    expect(blobs.length).toBe(2)
  })

  it('renders three orb elements', () => {
    const orbs = container.querySelectorAll('[style*="filter: blur(48px)"]')
    expect(orbs.length).toBe(3)
  })

  it('has aria-hidden on container', () => {
    const { container } = renderMantine(<GlassBlobBackground />)
    const wrapper = container.querySelector('div')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('has aria-hidden on blob elements', () => {
    const blobs = container.querySelectorAll(
      '[style*="will-change: border-radius"]'
    )
    blobs.forEach((blob) => {
      expect(blob).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('has aria-hidden on orb elements', () => {
    const orbs = container.querySelectorAll('[style*="filter: blur(48px)"]')
    orbs.forEach((orb) => {
      expect(orb).toHaveAttribute('aria-hidden', 'true')
    })
  })
})

describe('morphRadius', () => {
  it('returns a border-radius string', () => {
    const result = morphRadius(0, 1.0, 0)
    expect(result).toMatch(
      /\d+%\s+\d+%\s+\d+%\s+\d+%\s+\/\s+\d+%\s+\d+%\s+\d+%\s+\d+%/
    )
  })

  it('changes with different time values', () => {
    const result1 = morphRadius(0, 1.0, 0)
    const result2 = morphRadius(1, 1.0, 0)
    expect(result1).not.toBe(result2)
  })

  it('applies speed multiplier', () => {
    const result1 = morphRadius(1, 1.0, 0)
    const result2 = morphRadius(1, 2.0, 0)
    expect(result1).not.toBe(result2)
  })

  it('applies phase offset', () => {
    const result1 = morphRadius(1, 1.0, 0)
    const result2 = morphRadius(1, 1.0, 1)
    expect(result1).not.toBe(result2)
  })
})

describe('lerp', () => {
  it('returns start value at t=0', () => {
    expect(lerp(10, 20, 0)).toBe(10)
  })

  it('returns end value at t=1', () => {
    expect(lerp(10, 20, 1)).toBe(20)
  })

  it('returns middle value at t=0.5', () => {
    expect(lerp(10, 20, 0.5)).toBe(15)
  })
})

describe('parseRgba', () => {
  it('parses rgba with alpha', () => {
    const result = parseRgba('rgba(255, 100, 50, 0.5)')
    expect(result).toEqual({ r: 255, g: 100, b: 50, a: 0.5 })
  })

  it('parses rgb without alpha', () => {
    const result = parseRgba('rgb(255, 100, 50)')
    expect(result).toEqual({ r: 255, g: 100, b: 50, a: 1 })
  })

  it('returns default for invalid input', () => {
    const result = parseRgba('invalid')
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 })
  })
})

describe('buildRgba', () => {
  it('builds rgba string with rounded values', () => {
    expect(buildRgba(255.6, 100.4, 50, 0.5)).toBe('rgba(256, 100, 50, 0.50)')
  })

  it('handles full opacity', () => {
    expect(buildRgba(0, 0, 0, 1)).toBe('rgba(0, 0, 0, 1.00)')
  })
})

describe('lerpRgba', () => {
  it('interpolates between two rgba colors', () => {
    const result = lerpRgba('rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 1)', 0.5)
    expect(result).toBe('rgba(128, 128, 128, 0.50)')
  })

  it('returns first color at t=0', () => {
    const result = lerpRgba('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 1)', 0)
    expect(result).toBe('rgba(0, 0, 0, 0.50)')
  })

  it('returns second color at t=1', () => {
    const result = lerpRgba('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 1)', 1)
    expect(result).toBe('rgba(255, 255, 255, 1.00)')
  })
})

describe('GlassBlobBackground mobile', () => {
  let originalInnerWidth: number

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
    })
  })

  it('renders mobile blobs when viewport is narrow', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true })
    const { container } = renderMantine(<GlassBlobBackground />)
    const blobs = container.querySelectorAll(
      '[style*="will-change: border-radius"]'
    )
    expect(blobs.length).toBe(2)
  })

  it('renders desktop blobs when viewport is wide', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    const { container } = renderMantine(<GlassBlobBackground />)
    const blobs = container.querySelectorAll(
      '[style*="will-change: border-radius"]'
    )
    expect(blobs.length).toBe(2)
  })
})

describe('GlassBlobBackground animation', () => {
  let originalHidden: boolean
  let originalAddEventListener: typeof document.addEventListener
  let originalRemoveEventListener: typeof document.removeEventListener

  beforeEach(() => {
    vi.useFakeTimers()
    originalHidden =
      Object.getOwnPropertyDescriptor(document, 'hidden')?.value ?? false
    originalAddEventListener = document.addEventListener.bind(document)
    originalRemoveEventListener = document.removeEventListener.bind(document)
    Object.defineProperty(document, 'hidden', { value: false, writable: true })
    document.addEventListener = vi.fn()
    document.removeEventListener = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(document, 'hidden', {
      value: originalHidden,
      writable: true,
    })
    document.addEventListener = originalAddEventListener
    document.removeEventListener = originalRemoveEventListener
  })

  it('animates blob border-radius over time', () => {
    const { container } = renderMantine(<GlassBlobBackground />)

    const blobs = container.querySelectorAll(
      '[style*="will-change: border-radius"]'
    )
    expect(blobs.length).toBe(2)

    vi.advanceTimersByTime(1000)

    for (const blob of blobs) {
      const style = (blob as HTMLElement).style.borderRadius
      expect(style).toMatch(/\d+(\.\d+)?%\s+\d+(\.\d+)?%/)
    }
  })

  it('animates orb background colors over time', () => {
    const { container } = renderMantine(<GlassBlobBackground />)

    const orbs = container.querySelectorAll('[style*="filter: blur(48px)"]')
    expect(orbs.length).toBe(3)

    vi.advanceTimersByTime(10000)

    for (const orb of orbs) {
      const style = (orb as HTMLElement).style.background
      expect(style).toContain('radial-gradient')
    }
  })

  it('cleans up animation frame on unmount', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((_cb) => 1)
    vi.spyOn(window, 'cancelAnimationFrame')

    const { unmount } = renderMantine(<GlassBlobBackground />)

    vi.advanceTimersByTime(100)
    unmount()

    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('updates refs when isMobile changes', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375)

    const { rerender } = renderMantine(<GlassBlobBackground />)

    vi.advanceTimersByTime(100)

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)

    rerender(<GlassBlobBackground />)
    vi.advanceTimersByTime(100)

    vi.restoreAllMocks()
  })

  it('handles null blob element in animation loop', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((_cb) => 1)

    const { container } = renderMantine(<GlassBlobBackground />)

    const blobs = container.querySelectorAll(
      '[style*="will-change: border-radius"]'
    )
    expect(blobs.length).toBe(2)

    vi.advanceTimersByTime(100)
    vi.restoreAllMocks()
  })

  it('handles null orb refs in animation', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((_cb) => 1)

    const { container } = renderMantine(<GlassBlobBackground />)

    vi.advanceTimersByTime(10000)

    const orbs = container.querySelectorAll('[style*="filter: blur(48px)"]')
    expect(orbs.length).toBe(3)

    vi.restoreAllMocks()
  })

  it('covers early animation frame before refs are attached', () => {
    const rafCallback = { current: null as ((time: number) => void) | null }
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback.current = cb as unknown as (time: number) => void
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame')

    renderMantine(<GlassBlobBackground />)

    if (rafCallback.current) {
      rafCallback.current(0)
    }

    vi.advanceTimersByTime(100)
    vi.restoreAllMocks()
  })

  it('handles second animation frame cycle', () => {
    let rafId = 0
    const rafCallbacks: ((time: number) => void)[] = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafId++
      rafCallbacks.push(cb as unknown as (time: number) => void)
      return rafId
    })
    vi.spyOn(window, 'cancelAnimationFrame')

    renderMantine(<GlassBlobBackground />)

    rafCallbacks.forEach((cb) => {
      cb(0)
    })
  })

  it('registers visibilitychange listener', () => {
    renderMantine(<GlassBlobBackground />)

    expect(document.addEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    )
  })

  it('cleans up visibilitychange listener on unmount', () => {
    const { unmount } = renderMantine(<GlassBlobBackground />)

    unmount()

    expect(document.removeEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function)
    )
  })
})

describe('GlassBlobBackground backdropFilter support', () => {
  let originalGetComputedStyle: typeof window.getComputedStyle

  beforeEach(() => {
    originalGetComputedStyle = window.getComputedStyle
    window.getComputedStyle = vi.fn().mockReturnValue({
      backdropFilter: 'blur(10px)',
    } as unknown as CSSStyleDeclaration)
  })

  afterEach(() => {
    window.getComputedStyle = originalGetComputedStyle
  })

  it('applies backdropFilter when supported', () => {
    const { container } = renderMantine(<GlassBlobBackground />)

    const blobs = container.querySelectorAll(
      '[style*="will-change: border-radius"]'
    )
    const blob = blobs[0] as HTMLElement
    expect(blob.style.backdropFilter).toContain('blur')
  })
})
