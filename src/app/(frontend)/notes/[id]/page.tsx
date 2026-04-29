import { notFound } from 'next/navigation'
import { verifySession } from '@/lib/server'
import { getPayloadClient } from '@/lib/server/payload'
import { NoteDetail, NotesShell } from '../components'

interface NotePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NotePage({ params }: NotePageProps) {
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

  return (
    <NotesShell title={note.title}>
      <NoteDetail note={note} />
    </NotesShell>
  )
}
