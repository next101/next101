'use client'

import { useEffect } from 'react'

const PLAUSIBLE_ENABLED = process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED === 'true'
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const PLAUSIBLE_ENDPOINT = process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT

export function PlausibleTracker() {
  useEffect(() => {
    if (!PLAUSIBLE_ENABLED || !PLAUSIBLE_DOMAIN || !PLAUSIBLE_ENDPOINT) {
      return
    }

    import('@plausible-analytics/tracker').then(({ init }) => {
      init({
        domain: PLAUSIBLE_DOMAIN,
        endpoint: PLAUSIBLE_ENDPOINT,
        hashBasedRouting: true,
        outboundLinks: true,
      })
    })
  }, [])

  return null
}
