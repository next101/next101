'use client'

import {
  ActionIcon,
  Anchor,
  Box,
  Container,
  Grid,
  Group,
  Stack,
  Text,
} from '@mantine/core'
import Link from 'next/link'
import { sizes } from '@/app/(frontend)/design'
import { LogoWithTitle } from '@/components/common'
import { siteConfig } from '@/config'
import classes from './Footer.module.css'
import { FOOTER_LINKS, FOOTER_SOCIALS } from './footer.data'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      style={{
        backgroundColor:
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-gray-9))',
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor:
          'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))',
      }}
    >
      <Container size="xl" py={sizes.x16}>
        <Grid gap={sizes.x8}>
          {/* Brand column */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md" align="flex-start">
              <LogoWithTitle />
              <Text size="sm" c="dimmed">
                {siteConfig.description}
              </Text>
              <Group gap="xs">
                {FOOTER_SOCIALS.map((social) => (
                  <ActionIcon
                    key={social.label}
                    aria-label={social.label}
                    color="gray"
                    component="a"
                    href={social.href}
                    rel="noopener noreferrer"
                    size={sizes.x8}
                    target="_blank"
                    variant="subtle"
                  >
                    <social.icon size={sizes.x5} />
                  </ActionIcon>
                ))}
              </Group>
            </Stack>
          </Grid.Col>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <Grid.Col key={section.title} span={{ base: 6, sm: 4, md: 2 }}>
              <Stack gap="sm" align="flex-start">
                <Text size="sm" fw={700} c="bright">
                  {section.title}
                </Text>
                {section.links.map((link) => {
                  const isExternal =
                    link.href.startsWith('http') ||
                    link.href.startsWith('mailto:')

                  if (isExternal) {
                    return (
                      <Anchor
                        key={link.label}
                        className={classes.link}
                        c="dimmed"
                        href={link.href}
                        rel="noopener noreferrer"
                        size="sm"
                        target="_blank"
                        underline="never"
                      >
                        {link.label}
                      </Anchor>
                    )
                  }

                  return (
                    <Anchor
                      key={link.label}
                      className={classes.link}
                      c="dimmed"
                      component={Link}
                      href={link.href}
                      size="sm"
                      underline="never"
                    >
                      {link.label}
                    </Anchor>
                  )
                })}
              </Stack>
            </Grid.Col>
          ))}
        </Grid>

        {/* Bottom bar */}
        <Box
          mt={sizes.x10}
          pt={sizes.x6}
          style={{
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderTopColor:
              'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))',
          }}
        >
          <Group justify="space-between" wrap="wrap" gap="sm">
            <Text size="xs" c="dimmed">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </Text>
            <Text size="xs" c="dimmed">
              Built with Next.js & Mantine.
            </Text>
          </Group>
        </Box>
      </Container>
    </Box>
  )
}
