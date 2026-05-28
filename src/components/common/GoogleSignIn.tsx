'use client'

import { SiGoogle } from '@icons-pack/react-simple-icons'
import { Button } from '@mantine/core'
import { sizes } from '@/app/(frontend)/design'
import { useGoogleSignIn } from '@/hooks'

export function GoogleSignIn() {
  const { isLoading, signInWithGoogle } = useGoogleSignIn()

  return (
    <Button
      variant="default"
      fullWidth
      leftSection={<SiGoogle size={sizes.x5} title="Google" />}
      loading={isLoading}
      loaderProps={{ type: 'dots' }}
      onClick={signInWithGoogle}
    >
      Google
    </Button>
  )
}
