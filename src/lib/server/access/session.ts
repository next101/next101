import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { siteLinks } from '@/config'
import { getSafeRedirectUrl } from '@/lib/common/redirect'
import { auth } from '../auth'

/**
 * Gets the current session without redirecting.
 *
 * Use this in Server Actions where you want to handle
 * unauthenticated users manually (e.g., throw an error).
 *
 * Wrapped with React.cache() to deduplicate calls within a single render pass.
 */
export const getSession = cache(async function getSession() {
  const headersList = await headers()

  return auth.api.getSession({
    headers: headersList,
  })
})

/**
 * Verifies the current session by calling better-auth's getSession.
 * Redirects to sign-in if the session is invalid or missing.
 *
 * Preserves the current path as a `redirect` query param so users return
 * to their intended page after authenticating.
 *
 * Use this in protected Server Components and layouts.
 *
 * Wrapped with React.cache() to deduplicate calls within a single render pass.
 */
export const verifySession = cache(async function verifySession() {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (!session) {
    const nextUrl = headersList.get('next-url')
    const referer = headersList.get('referer')

    let currentPath = '/'
    if (nextUrl) {
      try {
        currentPath = new URL(nextUrl).pathname
      } catch {
        // ignore invalid URL
      }
    } else if (referer) {
      try {
        currentPath = new URL(referer).pathname
      } catch {
        // ignore invalid URL
      }
    }

    const safeRedirect = getSafeRedirectUrl(currentPath)
    const redirectUrl = `${siteLinks.auth.signIn}?redirect=${encodeURIComponent(
      safeRedirect
    )}`
    redirect(redirectUrl)
  }

  return session
})
