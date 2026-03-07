import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addLink, getLinks, deleteLink } from '@/services/links'

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}))

import { supabase } from '@/lib/supabase/client'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('addLink', () => {
  it('throws if not authenticated', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    } as any)

    await expect(addLink('https://youtube.com')).rejects.toThrow('Not authenticated')
  })

  it('inserts link for authenticated user', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any)

    const mockFrom = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: '1', url: 'https://youtube.com', user_id: 'user-123' },
        error: null,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue(mockFrom as any)

    const result = await addLink('https://youtube.com')
    expect(result.url).toBe('https://youtube.com')
  })
})

describe('getLinks', () => {
  it('returns list of links', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: '1', url: 'https://youtube.com' }],
        error: null,
      }),
    }
    vi.mocked(supabase.from).mockReturnValue(mockFrom as any)

    const result = await getLinks()
    expect(result).toHaveLength(1)
    expect(result[0].url).toBe('https://youtube.com')
  })

  it('throws on error', async () => {
    const mockFrom = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'DB error' },
      }),
    }
    vi.mocked(supabase.from).mockReturnValue(mockFrom as any)

    await expect(getLinks()).rejects.toThrow()
  })
})

describe('deleteLink', () => {
  it('deletes a link by id', async () => {
    const mockFrom = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    vi.mocked(supabase.from).mockReturnValue(mockFrom as any)

    await expect(deleteLink('1')).resolves.not.toThrow()
  })
})