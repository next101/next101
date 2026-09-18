'use client'

import { Group, Text } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import { sizes } from '@/app/(frontend)/design'

type LogoProps = {
  width?: number
  height?: number
}

export function Logo({ height = sizes.x8i, width = sizes.x8i }: LogoProps) {
  return (
    <Image
      alt="Next101"
      height={height}
      width={width}
      src="/static/assets/logo/next101.png"
    />
  )
}

export function LogoWithTitle({
  height = sizes.x8i,
  width = sizes.x8i,
}: LogoProps) {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Group gap="sm">
        <Logo height={height} width={width} />
        <Text fw={700} size="md" c="bright">
          Next101
        </Text>
      </Group>
    </Link>
  )
}
