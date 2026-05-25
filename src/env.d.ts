declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Payload
      PAYLOAD_DATABASE_URL: string
      PAYLOAD_SECRET: string

      // Better Auth
      BETTER_AUTH_SECRET: string
      BETTER_AUTH_URL: string
      BETTER_AUTH_DATABASE_URL: string
      NEXT_PUBLIC_BETTER_AUTH_URL: string

      // Resend
      RESEND_API_KEY: string
      RESEND_FROM_EMAIL: string

      /// Social sign in
      // GitHub
      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
    }
  }
}

export {}
