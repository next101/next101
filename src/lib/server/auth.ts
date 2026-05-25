import 'server-only'

import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'
import { Resend } from 'resend'
import { getResetPasswordEmailTemplates } from '@/lib/common/email'

const pool = new Pool({
  connectionString: process.env.BETTER_AUTH_DATABASE_URL,
})

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const { html, text } = getResetPasswordEmailTemplates(url)
      resend.emails
        .send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@starfold.dev',
          to: user.email,
          subject: 'Reset your password',
          html,
          text,
        })
        .catch((error) => {
          console.error('Failed to send reset password email:', error)
        })
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },
  plugins: [nextCookies()],
})
