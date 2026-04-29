import type { CollectionConfig } from 'payload'
import { ownerIdField } from '@/fields/owner-id'
import { isCustomer, isOwner, isPayloadUser } from '@/lib/server'

export const Notes: CollectionConfig = {
  slug: 'notes',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: async ({ req }) => isPayloadUser(req) || (await isOwner(req)),
    create: async ({ req }) => isPayloadUser(req) || (await isCustomer(req)),
    update: async ({ req }) => isPayloadUser(req) || (await isOwner(req)),
    delete: async ({ req }) => isPayloadUser(req) || (await isOwner(req)),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    ownerIdField,
  ],
}
