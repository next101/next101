import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine } from '@/test'
import { FeatureCardBody } from './FeatureCardBody'
import { featuresData } from './features.data'

describe(FeatureCardBody, () => {
  it('renders the feature title', () => {
    const feature = featuresData[0]
    const { container } = renderMantine(<FeatureCardBody feature={feature} />)

    expect(within(container).getByText(feature.title)).toBeInTheDocument()
  })

  it('renders the feature description', () => {
    const feature = featuresData[1]
    const { container } = renderMantine(<FeatureCardBody feature={feature} />)

    expect(within(container).getByText(feature.description)).toBeInTheDocument()
  })

  it('renders the visual element container', () => {
    const feature = featuresData[0]
    const { container } = renderMantine(<FeatureCardBody feature={feature} />)

    // The visual element is wrapped in a div with display: flex
    const flexContainer = container.querySelector('[style*="display: flex"]')
    expect(flexContainer).toBeInTheDocument()
  })
})
