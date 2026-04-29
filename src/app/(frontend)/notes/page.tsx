import { verifySession } from '@/lib/server'
import { getPayloadClient } from '@/lib/server/payload'
import { NotesEmptyState, NotesShell, NotesTable } from './components'

export default async function NotesPage() {
  const session = await verifySession()

  const payload = await getPayloadClient()
  const notes = await payload.find({
    collection: 'notes',
    where: {
      ownerId: {
        equals: session.user.id,
      },
    },
    sort: '-createdAt',
  })

  return (
    <NotesShell title="Notes">
      {notes.docs.length === 0 ? (
        <NotesEmptyState />
      ) : (
        <NotesTable notes={notes.docs} />
      )}
    </NotesShell>
  )
}
