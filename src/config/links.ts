export const siteLinks = {
  landing: '/',
  dashboard: '/dashboard',
  notes: {
    landing: '/notes',
    new: '/notes/new',
    detail: (id: number | string) => `/notes/${id}`,
    edit: (id: number | string) => `/notes/${id}/edit`,
  },
  settings: {
    landing: '/settings',
    account: '/settings/account',
  },
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  github: {
    repo: 'https://github.com/next101/next101',
  },
  discord: 'https://discord.gg/next101',
  twitter: 'https://x.com/next101dev',
  mail: 'mailto:hello@next101.dev',
} as const
