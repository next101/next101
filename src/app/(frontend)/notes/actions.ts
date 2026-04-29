'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { siteLinks } from '@/config'
import { getPayloadClient, getSession } from '@/lib/server'

/*
 * Auth note: these server actions only accept Better Auth sessions
 * (frontend users).
 *
 * Payload CMS admin users are not authenticated here — they manage notes via
 * the admin panel instead, where the collection access control's
 * isPayloadUser() check allows them through.
 *
 * This is an intentional separation of auth domains.
 */

/**
 * Assert that the current session user owns the note, and return the session
 * and note on success.
 *
 * @throws if the user is unauthenticated or is not the owner
 */
async function requireOwnership(id: string) {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const payload = await getPayloadClient()
  const note = await payload.findByID({
    collection: 'notes',
    id,
  })

  if (note.ownerId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  return { session, note }
}

/**
 * Create a new note for the current session user.
 *
 * @throws if the user is unauthenticated or title/content is missing
 */
export async function createNote(formData: FormData) {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const content = (formData.get('content') as string | null)?.trim() ?? ''

  if (!title || !content) {
    throw new Error('Title and content are required')
  }

  const payload = await getPayloadClient()

  await payload.create({
    collection: 'notes',
    data: {
      title,
      content,
      ownerId: session.user.id,
    },
  })

  revalidatePath(siteLinks.notes.landing)
  redirect(siteLinks.notes.landing)
}

/**
 * Update an existing note owned by the current user.
 *
 * @throws if the user is not the owner or title/content is missing
 */
export async function updateNote(id: string, formData: FormData) {
  await requireOwnership(id)

  const title = (formData.get('title') as string | null)?.trim() ?? ''
  const content = (formData.get('content') as string | null)?.trim() ?? ''

  if (!title || !content) {
    throw new Error('Title and content are required')
  }

  const payload = await getPayloadClient()

  await payload.update({
    collection: 'notes',
    id,
    data: {
      title,
      content,
    },
  })

  revalidatePath(siteLinks.notes.landing)
  revalidatePath(siteLinks.notes.detail(id))
  redirect(siteLinks.notes.landing)
}

/**
 * Delete a note owned by the current user.
 *
 * @throws if the user is not the owner
 */
export async function deleteNote(id: string) {
  await requireOwnership(id)

  const payload = await getPayloadClient()

  await payload.delete({
    collection: 'notes',
    id,
  })

  revalidatePath(siteLinks.notes.landing)
  redirect(siteLinks.notes.landing)
}
