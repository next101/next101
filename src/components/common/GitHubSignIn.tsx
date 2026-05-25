'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { Button } from '@mantine/core'
import { sizes } from '@/app/(frontend)/design'
import { useGitHubSignIn } from '@/hooks'

export function GitHubSignIn() {
  const { isLoading, signInWithGithub } = useGitHubSignIn()

  return (
    <Button
      variant="default"
      fullWidth
      leftSection={<SiGithub size={sizes.x5} title="GitHub" />}
      loading={isLoading}
      loaderProps={{ type: 'dots' }}
      onClick={signInWithGithub}
    >
      GitHub
    </Button>
  )
}
