'use client'

import {
  Box,
  Button,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { sizes } from '@/app/(frontend)/design'
import { GitHubSignIn } from '@/components/common'
import type { SignUpFormValues } from '@/hooks'

interface SignUpFormFieldsProps {
  form: {
    getInputProps: (field: keyof SignUpFormValues) => object
  }
  isLoading: boolean
}

export function SignUpFormFields({ form, isLoading }: SignUpFormFieldsProps) {
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
        label="Name"
        placeholder="Your name"
        required
        {...form.getInputProps('name')}
      />

      <TextInput
        label="Email"
        placeholder="you@example.com"
        required
        {...form.getInputProps('email')}
      />

      <Box>
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps('password')}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        loading={isLoading}
        loaderProps={{ type: 'dots' }}
        mt={sizes.x1}
      >
        Create an account
      </Button>
    </Stack>
  )
}
