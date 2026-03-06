import { describe, it, expect } from 'vitest'
import { routes } from '@/config/routes'

describe('route config', () => {
  it('guest cannot access home', () => {
    const route = routes.find(r => r.path === '/')!
    expect(route.allowedRoles).not.toContain('guest')
    expect(route.redirectTo).toBe('/auth/login')
  })

  it('only admin can access invite page', () => {
    const route = routes.find(r => r.path === '/admin/invite')!
    expect(route.allowedRoles).toEqual(['admin'])
    expect(route.redirectTo).toBe('/')
  })

  it('guest cannot access set-password directly', () => {
    const route = routes.find(r => r.path === '/auth/set-password')!
    expect(route.allowedRoles).not.toContain('guest')
  })
})
