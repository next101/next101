'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/client'
import { getSafeRedirectUrl } from '@/lib/common/redirect'

interface UseGoogleSignInReturn {
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
}

export function useGoogleSignIn(): UseGoogleSignInReturn {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectUrl = getSafeRedirectUrl(searchParams.get('redirect'))

  const signInWithGoogle = async () => {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: redirectUrl || '/dashboard',
    })
  }

  return {
    isLoading,
    signInWithGoogle,
  }
}
