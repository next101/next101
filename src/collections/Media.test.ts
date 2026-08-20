import type { TextField } from 'payload'
import { describe, expect, it } from 'vitest'
import { Media } from './Media'

describe('Media collection', () => {
  it('has the correct slug', () => {
    expect(Media.slug).toBe('media')
  })

  it('allows public read access', () => {
    expect(Media.access?.read).toBeDefined()
    expect(Media.access?.read?.({} as never)).toBe(true)
  })

  it('has upload enabled', () => {
    expect(Media.upload).toBe(true)
  })

  it('has required alt field', () => {
    const altField = Media.fields?.find(
      (field): field is TextField =>
        typeof field === 'object' && 'name' in field && field.name === 'alt'
    )
    expect(altField).toBeDefined()
    expect(altField?.type).toBe('text')
    expect(altField?.required).toBe(true)
  })
})
