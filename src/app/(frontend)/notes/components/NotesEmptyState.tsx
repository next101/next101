'use client'

import { Button, Paper, Stack, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { icon } from '@/app/(frontend)/design'
import { siteLinks } from '@/config'

export function NotesEmptyState() {
  return (
    <Paper p="xl" radius="sm" withBorder ta="center" maw={500} mx="auto">
      <Stack align="center" gap="md">
        <Title order={3}>No Notes Yet</Title>
        <Text c="dimmed">
          You haven't created any notes yet. Start by creating your first note!
        </Text>
        <Button
          component={Link}
          href={siteLinks.notes.new}
          leftSection={
            <IconPlus size={icon.sizes.md} stroke={icon.strokes.md} />
          }
        >
          Create Your First Note
        </Button>
      </Stack>
    </Paper>
  )
}
