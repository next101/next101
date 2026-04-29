'use client'

import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconTrash, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { icon } from '@/app/(frontend)/design'
import { deleteNote } from '../actions'

interface DeleteNoteButtonProps {
  noteId: number | string
  onClick?: (e: React.MouseEvent) => void
}

export function DeleteNoteButton({ noteId, onClick }: DeleteNoteButtonProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = (e: React.MouseEvent) => {
    onClick?.(e)
    setError(null)
    open()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteNote(String(noteId))
      setIsDeleting(false)
      close()
    } catch (error) {
      /* c8 ignore next 3 */
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
      setIsDeleting(false)
      setError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <>
      <ActionIcon variant="subtle" title="Delete" onClick={handleOpen}>
        <IconTrash size={16} />
      </ActionIcon>

      {/**
       * This Box element is necessary to prevent the Modal's onClick from
       * propagating to parent elements, which could cause unintended side
       * effects (like closing the modal immediately after opening it). By
       * stopping the propagation of the click event, we ensure that the modal
       * behaves as expected when interacting with its content.
       */}
      <Box onClick={(e) => e.stopPropagation()}>
        <Modal
          centered
          opened={opened}
          onClose={close}
          title={<Text fw={500}>Confirm Delete</Text>}
        >
          <Stack>
            {error && <Alert color="red">{error}</Alert>}

            <Text>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </Text>

            <Group justify="flex-end">
              <Button
                color="red"
                data-testid="confirm-delete"
                loading={isDeleting}
                onClick={handleDelete}
                leftSection={
                  <IconTrash size={icon.sizes.md} stroke={icon.strokes.md} />
                }
              >
                Delete
              </Button>
              <Button
                onClick={close}
                disabled={isDeleting}
                leftSection={
                  <IconX size={icon.sizes.md} stroke={icon.strokes.md} />
                }
              >
                Cancel
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Box>
    </>
  )
}
