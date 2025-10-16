import api from './client'
import { vi, describe, it, expect } from 'vitest'

describe('api client', () => {
  it('adds Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token')

    const cfg = await api.interceptors.request.handlers[0].fulfilled({
      url: '/api/v1/test',
      headers: {},
    })

    expect(cfg.headers.Authorization).toBe('Bearer mock-token')
  })

  it('skips Authorization for /auth/login', async () => {
    localStorage.setItem('token', 'mock-token')

    const cfg = await api.interceptors.request.handlers[0].fulfilled({
      url: '/api/v1/auth/login',
      headers: {},
    })

    expect(cfg.headers.Authorization).toBeUndefined()
  })
})
