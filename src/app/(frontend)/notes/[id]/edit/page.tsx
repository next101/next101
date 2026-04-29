import { notFound } from 'next/navigation'
import { verifySession } from '@/lib/server'
import { getPayloadClient } from '@/lib/server/payload'
import { updateNote } from '../../actions'
import { NoteForm, NotesShell } from '../../components'

interface EditNotePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params
  const session = await verifySession()

  const payload = await getPayloadClient()

  const note = await payload.findByID({
    collection: 'notes',
    id,
    disableErrors: true,
  })

  if (!note) {
    notFound()
  }

  if (note.ownerId !== session.user.id) {
    notFound()
  }

  const updateNoteWithId = updateNote.bind(null, id)

  return (
    <NotesShell title="Edit Note">
      <NoteForm action={updateNoteWithId} note={note} />
    </NotesShell>
  )
}
