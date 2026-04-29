'use client'

import { alpha, Button, Group, Stack, Text } from '@mantine/core'
import { IconArrowLeft, IconPencil } from '@tabler/icons-react'
import DOMPurify from 'dompurify'
import Link from 'next/link'
import { icon } from '@/app/(frontend)/design'
import { siteLinks } from '@/config'
import type { Note } from '@/payload-types'

// @ts-expect-error — ESM default may be nested under `.default` depending on bundler
const sanitize = DOMPurify.default?.sanitize ?? DOMPurify.sanitize

/* c8 ignore next 3 */
if (!sanitize) {
  throw new Error('DOMPurify sanitize function is not available')
}

interface NoteDetailProps {
  note: Note
}

export function NoteDetail({ note }: NoteDetailProps) {
  return (
    <Stack>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitize(note.content),
        }}
        style={{ lineHeight: 1.6 }}
      />

      <Group
        justify="space-between"
        style={{
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: alpha('var(--mantine-color-dark-5)', 0.2),
        }}
      >
        <Group mt="sm">
          <Button
            component={Link}
            href={siteLinks.notes.edit(note.id)}
            leftSection={
              <IconPencil size={icon.sizes.md} stroke={icon.strokes.md} />
            }
          >
            Edit Note
          </Button>
          <Button
            component={Link}
            href={siteLinks.notes.landing}
            leftSection={
              <IconArrowLeft size={icon.sizes.md} stroke={icon.strokes.md} />
            }
          >
            Back to Notes
          </Button>
        </Group>

        <Text size="sm">
          Created at: {new Date(note.createdAt).toLocaleDateString()}
          {note.updatedAt !== note.createdAt && (
            <> · Updated at: {new Date(note.updatedAt).toLocaleDateString()}</>
          )}
        </Text>
      </Group>
    </Stack>
  )
}
