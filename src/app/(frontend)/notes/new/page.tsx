import { createNote } from '../actions'
import { NoteForm, NotesShell } from '../components'

export default function NewNotePage() {
  return (
    <NotesShell title="Create New Note">
      <NoteForm action={createNote} />
    </NotesShell>
  )
}
