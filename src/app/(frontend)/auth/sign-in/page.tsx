import { Suspense } from 'react'
import { AuthCard, AuthHeader } from '@/components/common'
import { siteLinks } from '@/config'
import { SignInForm } from './components'

export default function SignInPage() {
  return (
    <AuthCard
      header={
        <AuthHeader
          title="Welcome back!"
          linkPrefix="New to Next101?"
          linkText="Create an account"
          linkHref={siteLinks.auth.signUp}
        />
      }
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthCard>
  )
}
