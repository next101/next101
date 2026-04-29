import type { User } from 'better-auth'
import type { auth } from '@/lib/server'

export const verifiedUser: User = {
  id: '1',
  name: 'Verified User',
  email: 'verified@example.com',
  emailVerified: true,
  image: 'https://example.com/avatar.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const unverifiedUser: User = {
  id: '2',
  name: 'Unverified User',
  email: 'unverified@example.com',
  emailVerified: false,
  image: 'https://example.com/avatar.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export function createMockSession(
  userId: string
): Awaited<ReturnType<typeof auth.api.getSession>> {
  return {
    session: {
      id: `session-${userId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId,
      expiresAt: new Date(Date.now() + 3600_000),
      token: 'token_abc',
    },
    user: {
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: 'test@example.com',
      emailVerified: true,
      name: 'Test User',
    },
  }
}
