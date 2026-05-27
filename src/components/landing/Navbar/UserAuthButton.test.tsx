import { within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderMantine, verifiedUser } from '@/test'
import { UserAuthButton } from './UserAuthButton'

// Mock the dependencies
vi.mock('@/components/common', () => ({
  UserMenu: ({ user }: { user: { name: string; email: string } }) => (
    <div data-testid="user-menu">UserMenu: {user.name}</div>
  ),
}))

vi.mock('./SignInButton', () => ({
  SignInButton: () => <div data-testid="sign-in-button">SignInButton</div>,
}))

describe('UserAuthButton', () => {
  describe('when user is authenticated', () => {
    it('renders UserMenu component', () => {
      const { container } = renderMantine(
        <UserAuthButton user={verifiedUser} />
      )
      const userMenu = within(container).getByTestId('user-menu')
      expect(userMenu).toBeInTheDocument()
      expect(userMenu).toHaveTextContent(verifiedUser.name)
    })
  })

  describe('when user is not authenticated', () => {
    it('renders SignInButton component when user is undefined', () => {
      const { container } = renderMantine(<UserAuthButton user={undefined} />)
      const signInButton = within(container).getByTestId('sign-in-button')
      expect(signInButton).toBeInTheDocument()
    })

    it('renders SignInButton component when no user prop is provided', () => {
      const { container } = renderMantine(<UserAuthButton />)
      const signInButton = within(container).getByTestId('sign-in-button')
      expect(signInButton).toBeInTheDocument()
    })
  })
})
