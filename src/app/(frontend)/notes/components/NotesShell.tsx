import { Container, Stack } from '@mantine/core'
import { PageTitle } from '@/components/common'

interface NotesShellProps {
  children: React.ReactNode
  title: string
}

export function NotesShell({ title, children }: NotesShellProps) {
  return (
    <Container size="xl" py="xl">
      <Stack gap={'xl'}>
        <PageTitle title={title} />
        {children}
      </Stack>
    </Container>
  )
}
