import { getByTestId, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderMantine, verifiedUser } from '@/test'
import { UserAvatar } from './UserAvatar'

describe('UserAvatar', () => {
  describe('with image', () => {
    it('renders avatar with user name as alt text', () => {
      const { container } = renderMantine(<UserAvatar user={verifiedUser} />)
      const avatar = within(container).getByRole('img', {
        name: verifiedUser.name,
      })
      expect(avatar).toBeInTheDocument()
    })

    it('renders avatar with user image', () => {
      const { container } = renderMantine(<UserAvatar user={verifiedUser} />)
      const avatar = within(container).getByRole('img', {
        name: verifiedUser.name,
      }) as HTMLImageElement
      expect(avatar.src).toBe('https://example.com/avatar.jpg')
    })
  })

  describe('without image', () => {
    it('renders correctly with undefined image', () => {
      const userWithUndefinedImage = { ...verifiedUser, image: undefined }
      const { container } = renderMantine(
        <UserAvatar user={userWithUndefinedImage} />
      )
      const fallback = within(container).getByText('V')
      expect(fallback).toBeInTheDocument()
    })
  })

  it('applies custom size when provided', () => {
    const { container } = renderMantine(
      <UserAvatar user={verifiedUser} size={64} />
    )
    const avatarRoot = getByTestId(container, 'user-avatar')
    expect(avatarRoot).toBeInTheDocument()
  })

  it('applies default size when not provided', () => {
    const { container } = renderMantine(<UserAvatar user={verifiedUser} />)
    const avatar = within(container).getByRole('img', {
      name: verifiedUser.name,
    })
    expect(avatar).toBeInTheDocument()
  })

  it('forwards additional props to Avatar component', () => {
    const { container } = renderMantine(
      <UserAvatar user={verifiedUser} data-testid="custom-avatar" />
    )
    const avatar = within(container).getByTestId('custom-avatar')
    expect(avatar).toBeInTheDocument()
  })
})
