'use client'

import { ActionIcon, Button, Group, Stack, Table, Text } from '@mantine/core'
import { IconPencil, IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { icon, sizes } from '@/app/(frontend)/design'
import { siteLinks } from '@/config'
import type { Note } from '@/payload-types'
import { DeleteNoteButton } from './DeleteNoteButton'

interface NotesTableProps {
  notes: Note[]
}

export function NotesTable({ notes }: NotesTableProps) {
  const router = useRouter()

  const handleRowClick = useCallback(
    (id: number | string) => {
      router.push(siteLinks.notes.detail(id))
    },
    [router]
  )

  return (
    <Stack>
      <Group justify="flex-start">
        <Button
          component={Link}
          href={siteLinks.notes.new}
          leftSection={
            <IconPlus size={icon.sizes.md} stroke={icon.strokes.md} />
          }
        >
          Create New Note
        </Button>
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={120}>Title</Table.Th>
            <Table.Th>Content</Table.Th>
            <Table.Th w={120}>Created At</Table.Th>
            <Table.Th w={80}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {notes.map((note) => (
            <Table.Tr
              key={note.id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleRowClick(note.id)}
            >
              <Table.Td>
                <Text
                  maw={100}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {note.title}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text
                  size="sm"
                  c="dimmed"
                  maw={{
                    xs: 200,
                    md: 600,
                    lg: 800,
                  }}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {note.content
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()}
                </Text>
              </Table.Td>
              <Table.Td>
                {new Date(note.createdAt).toLocaleDateString()}
              </Table.Td>
              <Table.Td>
                <Group gap={sizes.x1}>
                  <ActionIcon
                    component={Link}
                    href={siteLinks.notes.edit(note.id)}
                    variant="subtle"
                    title="Edit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                  <DeleteNoteButton
                    noteId={note.id}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  )
}
