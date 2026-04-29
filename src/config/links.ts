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
    repo: 'https://github.com/starfold/starfold',
  },
} as const
