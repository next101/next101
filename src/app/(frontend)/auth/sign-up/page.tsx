import { Suspense } from 'react'
import { AuthCard, AuthHeader } from '@/components/common'
import { siteLinks } from '@/config'
import { SignUpForm } from './components'

export default function SignUpPage() {
  return (
    <AuthCard
      header={
        <AuthHeader
          title="Create an account"
          linkPrefix="Already have an account?"
          linkText="Sign in"
          linkHref={siteLinks.auth.signIn}
        />
      }
    >
      <Suspense>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  )
}
