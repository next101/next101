import { Container, Skeleton, Stack } from '@mantine/core'
import { sizes } from '@/app/(frontend)/design'

export default function NotesLoading() {
  return (
    <Container size="xl" py="xl">
      <Stack gap={'xl'}>
        <Skeleton height={sizes.x12} width={200} mb="md" />
        <Stack gap="sm">
          <Skeleton height={sizes.x6} radius="sm" />
          <Skeleton height={sizes.x6} radius="sm" width="70%" />
          <Skeleton height={sizes.x6} radius="sm" width="85%" />
          <Skeleton height={sizes.x6} radius="sm" width="40%" />
          <Skeleton height={sizes.x6} radius="sm" width="40%" />
          <Skeleton height={sizes.x6} radius="sm" width="40%" />
          <Skeleton height={sizes.x6} radius="sm" width="40%" />
        </Stack>
      </Stack>
    </Container>
  )
}
