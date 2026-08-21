import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandX,
} from '@tabler/icons-react'
import { siteLinks } from '@/config'

export const FOOTER_LINKS = {
  product: {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '/docs' },
      { label: 'GitHub', href: siteLinks.github.repo },
      { label: 'Discord', href: siteLinks.discord },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: siteLinks.mail },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'License', href: `${siteLinks.github.repo}/blob/main/LICENSE` },
    ],
  },
} as const

export const FOOTER_SOCIALS = [
  {
    label: 'GitHub',
    href: siteLinks.github.repo,
    icon: IconBrandGithub,
  },
  {
    label: 'Discord',
    href: siteLinks.discord,
    icon: IconBrandDiscord,
  },
  {
    label: 'X',
    href: siteLinks.twitter,
    icon: IconBrandX,
  },
] as const
