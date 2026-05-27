import { fireEvent, getByTestId, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { siteLinks } from '@/config'
import { renderMantine, verifiedUser } from '@/test'
import { UserMenu } from './UserMenu'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: vi.fn(() => '/'),
}))

vi.mock('@mantine/notifications', () => ({
  notifications: {
    show: vi.fn(),
  },
}))

vi.mock('@/lib/client', () => ({
  authClient: {
    signOut: vi.fn(),
  },
}))

describe('UserMenu', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('avatar rendering', () => {
    it('renders avatar with image when user has image', () => {
      const { container } = renderMantine(<UserMenu user={verifiedUser} />)
      const avatarImage = container.querySelector('.mantine-Avatar-image')
      expect(avatarImage).toBeInTheDocument()
    })

    it('renders avatar with fallback when user has null image', () => {
      const userWithoutImage = { ...verifiedUser, image: null }
      const { container } = renderMantine(<UserMenu user={userWithoutImage} />)
      const avatar = within(container).getByText('V')
      expect(avatar).toBeInTheDocument()
    })

    it('renders avatar with fallback when user image is undefined', () => {
      const userWithUndefinedImage = { ...verifiedUser, image: undefined }
      const { container } = renderMantine(
        <UserMenu user={userWithUndefinedImage} />
      )
      const avatar = within(container).getByText('V')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Menu component', () => {
    it('renders Menu.Target with aria attributes', () => {
      const { container } = renderMantine(<UserMenu user={verifiedUser} />)
      const target = container.querySelector('[aria-haspopup="menu"]')
      expect(target).toBeInTheDocument()
    })

    it('renders Avatar component with correct root class', () => {
      const { container } = renderMantine(<UserMenu user={verifiedUser} />)
      const avatarRoot = getByTestId(container, 'user-avatar')
      expect(avatarRoot).toBeInTheDocument()
    })

    it('renders user avatar with pointer cursor', () => {
      const { container } = renderMantine(<UserMenu user={verifiedUser} />)
      const avatar = getByTestId(container, 'user-avatar')
      expect(avatar).toHaveStyle({ cursor: 'pointer' })
    })
  })

  describe('menu interactions', () => {
    it('opens menu and renders dropdown items', async () => {
      const { container } = renderMantine(<UserMenu user={verifiedUser} />)

      // Click on the avatar to open the menu
      const avatar = getByTestId(container, 'user-avatar')
      expect(avatar).toBeInTheDocument()
      fireEvent.click(avatar as Element)

      // Wait for the menu dropdown to render in the portal
      await waitFor(() => {
        const dashboardItem = within(document.body).getByText('Dashboard')
        expect(dashboardItem).toBeInTheDocument()
      })

      expect(within(document.body).getByText('Settings')).toBeInTheDocument()
      expect(within(document.body).getByText('Sign out')).toBeInTheDocument()
      expect(
        within(document.body).getByText(verifiedUser.name)
      ).toBeInTheDocument()
    })

    describe('Notes menu item', () => {
      it('renders with IconNotes', async () => {
        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        fireEvent.click(avatar as Element)

        await waitFor(() => {
          const notesItem = within(document.body).getByText('Notes')
          const menuItem = notesItem.parentElement
          expect(menuItem).toHaveClass('mantine-Menu-item')
          const icon = menuItem?.querySelector('svg.tabler-icon-notes')
          expect(icon).toBeInTheDocument()
        })
      })

      it('navigates to notes when clicked', async () => {
        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        expect(avatar).toBeInTheDocument()
        fireEvent.click(avatar as Element)

        const notesItem = await waitFor(() =>
          within(document.body).getByText('Notes')
        )
        fireEvent.click(notesItem)
        expect(mockPush).toHaveBeenCalledWith(siteLinks.notes.landing)
      })
    })

    describe('Dashboard menu item', () => {
      it('renders with IconDashboard', async () => {
        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        fireEvent.click(avatar as Element)

        await waitFor(() => {
          const dashboardItem = within(document.body).getByText('Dashboard')
          const menuItem = dashboardItem.parentElement
          expect(menuItem).toHaveClass('mantine-Menu-item')
          const icon = menuItem?.querySelector('svg.tabler-icon-dashboard')
          expect(icon).toBeInTheDocument()
        })
      })

      it('navigates to dashboard when clicked', async () => {
        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        expect(avatar).toBeInTheDocument()
        fireEvent.click(avatar as Element)

        const dashboardItem = await waitFor(() =>
          within(document.body).getByText('Dashboard')
        )
        fireEvent.click(dashboardItem)
        expect(mockPush).toHaveBeenCalledWith(siteLinks.dashboard)
      })
    })

    describe('Settings menu item', () => {
      it('renders with IconSettings', async () => {
        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        fireEvent.click(avatar as Element)

        await waitFor(() => {
          const settingsItem = within(document.body).getByText('Settings')
          const menuItem = settingsItem.parentElement
          expect(menuItem).toHaveClass('mantine-Menu-item')
          const icon = menuItem?.querySelector('svg.tabler-icon-settings')
          expect(icon).toBeInTheDocument()
        })
      })

      it('navigates to settings when clicked', async () => {
        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        expect(avatar).toBeInTheDocument()
        fireEvent.click(avatar as Element)

        const settingsItem = await waitFor(() =>
          within(document.body).getByText('Settings')
        )
        fireEvent.click(settingsItem)
        expect(mockPush).toHaveBeenCalledWith(siteLinks.settings.landing)
      })
    })

    describe('Sign out menu item', () => {
      it('renders with IconLogout', async () => {
        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        fireEvent.click(avatar as Element)

        await waitFor(() => {
          const signOutItem = within(document.body).getByText('Sign out')
          const menuItem = signOutItem.parentElement
          expect(menuItem).toHaveClass('mantine-Menu-item')
          const icon = menuItem?.querySelector('svg.tabler-icon-logout')
          expect(icon).toBeInTheDocument()
        })
      })

      it('calls signOut and redirects to sign in when clicked', async () => {
        const { authClient } = await import('@/lib/client')
        vi.mocked(authClient.signOut).mockResolvedValueOnce({} as never)

        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        expect(avatar).toBeInTheDocument()
        fireEvent.click(avatar as Element)

        const signOutItem = await waitFor(() =>
          within(document.body).getByText('Sign out')
        )
        fireEvent.click(signOutItem)

        await waitFor(
          () => {
            expect(authClient.signOut).toHaveBeenCalled()
            expect(mockPush).toHaveBeenCalledWith(siteLinks.auth.signIn)
          },
          { timeout: 3000 }
        )
      })

      it('shows error notification when sign out fails', async () => {
        const { notifications } = await import('@mantine/notifications')
        const { authClient } = await import('@/lib/client')
        vi.mocked(authClient.signOut).mockRejectedValueOnce(new Error('Failed'))

        const { container } = renderMantine(<UserMenu user={verifiedUser} />)

        const avatar = getByTestId(container, 'user-avatar')
        fireEvent.click(avatar as Element)

        const signOutItem = await waitFor(() =>
          within(document.body).getByText('Sign out')
        )
        fireEvent.click(signOutItem)

        await waitFor(() => {
          expect(vi.mocked(notifications.show)).toHaveBeenCalledWith(
            expect.objectContaining({
              title: 'Error',
              message: 'Failed to sign out',
              color: 'red',
            })
          )
        })
      })
    })
  })
})
