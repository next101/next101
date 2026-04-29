'use client'

import { Menu, Text } from '@mantine/core'
import {
  IconDashboard,
  IconLogout,
  IconNotes,
  IconSettings,
} from '@tabler/icons-react'
import type { User } from 'better-auth'
import { useRouter } from 'next/navigation'
import { icon, sizes } from '@/app/(frontend)/design'
import { SignOutOverlay } from '@/components/common'
import { siteLinks } from '@/config'
import { useSignOut } from '@/hooks'
import { UserAvatar } from './UserAvatar'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const { isSigningOut, signOut } = useSignOut()

  return (
    <>
      <SignOutOverlay visible={isSigningOut} />
      <Menu
        arrowOffset={sizes.x3i}
        arrowSize={sizes.x2i}
        position="bottom-end"
        shadow="md"
        withArrow
      >
        <Menu.Target>
          <UserAvatar user={user} />
        </Menu.Target>
        <Menu.Dropdown miw={40 * sizes.x1i}>
          <Menu.Label>
            <Text c="bright">{user.name}</Text>
          </Menu.Label>
          <Menu.Divider />
          <Menu.Item
            leftSection={
              <IconDashboard size={icon.sizes.md} stroke={icon.strokes.md} />
            }
            onClick={() => router.push(siteLinks.dashboard)}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconNotes size={icon.sizes.md} stroke={icon.strokes.md} />
            }
            onClick={() => router.push(siteLinks.notes.landing)}
          >
            Notes
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSettings size={icon.sizes.md} stroke={icon.strokes.md} />
            }
            onClick={() => router.push(siteLinks.settings.landing)}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={
              <IconLogout size={icon.sizes.md} stroke={icon.strokes.md} />
            }
            onClick={signOut}
          >
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}
