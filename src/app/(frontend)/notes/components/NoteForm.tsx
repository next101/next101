'use client'

import { Alert, Button, Group, Stack, TextInput } from '@mantine/core'
import { IconDeviceFloppy, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'
import { icon } from '@/app/(frontend)/design'
import { siteLinks } from '@/config'
import type { Note } from '@/payload-types'
import { TipTapEditor } from './TipTapEditor'

interface NoteFormProps {
  action: (formData: FormData) => Promise<void>
  note?: Pick<Note, 'id' | 'title' | 'content'>
}

export function NoteForm({ action, note }: NoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    formData.set('content', content)
    try {
      await action(formData)
      setIsSubmitting(false)
    } catch (error) {
      /* c8 ignore next 3 */
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
      setIsSubmitting(false)
      setError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <form action={handleSubmit}>
      <Stack>
        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}
        <TextInput
          label="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter note title"
        />

        <div>
          <label
            htmlFor="content-input"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Content
          </label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <Group>
          <Button
            type="submit"
            loading={isSubmitting}
            leftSection={
              <IconDeviceFloppy size={icon.sizes.md} stroke={icon.strokes.md} />
            }
          >
            {note ? 'Update Note' : 'Create Note'}
          </Button>
          <Button
            component={Link}
            href={
              note ? siteLinks.notes.detail(note.id) : siteLinks.notes.landing
            }
            disabled={isSubmitting}
            leftSection={
              <IconX size={icon.sizes.md} stroke={icon.strokes.md} />
            }
          >
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
