import type { PayloadRequest, Where } from 'payload'
import { cache } from 'react'
import { auth } from '../auth'

const getPayloadSession = cache(async (req: PayloadRequest) => {
  return auth.api
    .getSession({
      headers: req.headers,
    })
    .catch((error: unknown) => {
      console.error('Failed to get session:', error)
      return null
    })
})

/**
 * Check whether the request is from a user authenticated via the Payload CMS
 * console. This distinguishes Payload-admin logins from Better Auth frontend
 * sessions.
 *
 * @returns
 * - true if a Payload user is present on the request
 * - false otherwise.
 */
export function isPayloadUser(req: PayloadRequest): boolean {
  return Boolean(req.user && req.user.collection === 'users')
}

/**
 * Check whether the request has a valid better-auth session.
 *
 * @returns
 * - a better-auth session if valid
 * - false otherwise
 */
export async function isCustomer(req: PayloadRequest): Promise<boolean> {
  return Boolean(await getPayloadSession(req))
}

/**
 * Check whether the user is the owner of the resource.
 *
 * @returns
 * - a Where clause for payload to filter by ownerId if the req is a customer
 * - false otherwise
 */
export async function isOwner(req: PayloadRequest): Promise<Where | boolean> {
  const session = await getPayloadSession(req)

  return (
    Boolean(session) && {
      ownerId: {
        equals: session?.user.id,
      },
    }
  )
}
