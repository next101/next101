'use client'

import {
  Anchor,
  Box,
  Button,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import Link from 'next/link'
import { sizes } from '@/app/(frontend)/design'
import { GitHubSignIn } from '@/components/common'
import { siteLinks } from '@/config'
import type { SignInFormValues } from '@/hooks'

interface SignInFormFieldsProps {
  form: {
    getInputProps: (field: keyof SignInFormValues) => object
  }
  isLoading: boolean
}

export function SignInFormFields({ form, isLoading }: SignInFormFieldsProps) {
  return (
    <Stack gap="sm">
      <GitHubSignIn />
      <Divider
        label={
          <Text c="dimmed" size="xs">
            or continue with
          </Text>
        }
      />

      <TextInput
        label="Email"
        placeholder="you@example.com"
        required
        {...form.getInputProps('email')}
      />

      <Box pos="relative">
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required={true}
          {...form.getInputProps('password')}
        />
        <Anchor
          c="blue"
          component={Link}
          href={siteLinks.auth.forgotPassword}
          lh={'var(--mantine-line-height)'}
          pos={'absolute'}
          size="sm"
          top={2}
          right={0}
        >
          Forgot password?
        </Anchor>
      </Box>
      <Button
        type="submit"
        fullWidth
        loading={isLoading}
        loaderProps={{ type: 'dots' }}
        mt={sizes.x1}
      >
        Sign in
      </Button>
    </Stack>
  )
}
