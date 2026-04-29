import type { TextField } from 'payload'
import { ValidationError } from 'payload'
import { auth } from '@/lib/server/auth'

/**
 * A field that records the owner ID of the user who created the document.
 * Auto-populated from better-auth session on create.
 */
export const ownerIdField: TextField = {
  name: 'ownerId',
  label: 'Owner ID',
  type: 'text',
  required: true,
  index: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      /**
       * This hook ensures that the ownerId is set to the ID of the
       * authenticated user on create.
       *
       * If the user is not authenticated, the hook throws an error to prevent
       * document creation.
       */
      async ({ operation, value, req }) => {
        if (operation !== 'create' || value) return value

        const session = await auth.api
          .getSession({
            headers: req.headers,
          })
          .catch((error: unknown) => {
            console.error('Failed to get session in ownerIdField:', error)
            return null
          })

        if (!session)
          throw new ValidationError({
            errors: [
              {
                message: 'Authentication required',
                path: 'ownerId',
              },
            ],
          })
        return session.user.id
      },
    ],
  },
}
