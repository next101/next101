import { Divider, Text } from '@mantine/core'
import { GitHubSignIn } from './GitHubSignIn'
import { GoogleSignIn } from './GoogleSignIn'

export function SocialSignIn() {
  return (
    <>
      <GoogleSignIn />
      <GitHubSignIn />

      <Divider
        label={
          <Text c="dimmed" size="xs">
            or continue with
          </Text>
        }
      />
    </>
  )
}
