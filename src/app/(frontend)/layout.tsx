import '@mantine/core/styles.layer.css'
import '@mantine/dates/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import '@mantine/tiptap/styles.layer.css'
import './globals.css'

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { Metadata } from 'next'
import { siteConfig } from '@/config'
import { resolver, theme } from './theme'

const defaultTitle = `${siteConfig.name} - ${siteConfig.description}`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.description,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator.twitter,
  },
  icons: {
    icon: [
      {
        url: '/static/favicons/favicon-96x96.png',
        type: 'image/png',
        sizes: '96x96',
      },
      {
        url: '/static/favicons/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: {
      rel: 'shortcut icon',
      url: '/static/favicons/favicon.ico',
    },
    apple: {
      rel: 'apple-touch-icon',
      url: '/static/favicons/apple-touch-icon.png',
      sizes: '180x180',
    },
  },
  appleWebApp: {
    title: siteConfig.shortName,
  },
  manifest: '/static/favicons/site.webmanifest',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider
          theme={theme}
          cssVariablesResolver={resolver}
          defaultColorScheme="auto"
        >
          <Notifications position="top-right" />
          <main>{children}</main>
        </MantineProvider>
      </body>
    </html>
  )
}
