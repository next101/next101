import { describe, expect, it, vi } from 'vitest'

vi.mock('@payload-config', () => ({
  default: { db: {} },
}))

vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

import { getPayload } from 'payload'
import { getPayloadClient } from './payload'

describe('getPayloadClient', () => {
  it('calls getPayload with the config', async () => {
    const mockPayload = { db: {} }
    vi.mocked(getPayload).mockResolvedValue(mockPayload as never)

    const result = await getPayloadClient()

    expect(getPayload).toHaveBeenCalledWith({
      config: expect.anything(),
    })
    expect(result).toBe(mockPayload)
  })
})
