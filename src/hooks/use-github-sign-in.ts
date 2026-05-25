'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/client'
import { getSafeRedirectUrl } from '@/lib/common/redirect'

interface UseGitHubSignInReturn {
  isLoading: boolean
  signInWithGithub: () => Promise<void>
}

export function useGitHubSignIn(): UseGitHubSignInReturn {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectUrl = getSafeRedirectUrl(searchParams.get('redirect'))

  const signInWithGithub = async () => {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: redirectUrl || '/dashboard',
    })
  }

  return {
    isLoading,
    signInWithGithub,
  }
}
