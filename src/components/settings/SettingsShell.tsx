'use client'

import { Box, Container, Flex, NavLink, Stack } from '@mantine/core'
import { IconLock, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { icon, sizes } from '@/app/(frontend)/design'
import { PageTitle } from '@/components/common'
import { siteLinks } from '@/config'

interface SettingsNavLinkProps {
  href: string
  label: string
  icon: React.ReactNode
}

export function SettingsNavLink({ href, label, icon }: SettingsNavLinkProps) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <NavLink
      component={Link}
      href={href}
      label={label}
      leftSection={icon}
      active={active}
      variant="light"
      color="gray"
      fw={active ? 700 : 'inherit'}
      styles={{
        section: {
          marginRight: sizes.x2,
        },
      }}
    />
  )
}

interface SettingsShellProps {
  children: React.ReactNode
}

export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <Container size="xl" py="xl">
      <Stack gap={'xl'}>
        <PageTitle title="Settings" />
        <Flex
          gap={'md'}
          direction={{
            base: 'column',
            sm: 'row',
          }}
        >
          <Box miw={60 * sizes.x1i}>
            <SettingsNavLink
              href={siteLinks.settings.landing}
              label="Profile"
              icon={<IconUser size={icon.sizes.md} stroke={icon.strokes.md} />}
            />
            <SettingsNavLink
              href={siteLinks.settings.account}
              label="Account"
              icon={<IconLock size={icon.sizes.md} stroke={icon.strokes.md} />}
            />
          </Box>

          <Box style={{ flex: 1, minWidth: 0 }}>{children}</Box>
        </Flex>
      </Stack>
    </Container>
  )
}
