import api from './client'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios') // mock axios if needed

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token')

    // Create a dummy config to simulate interceptor input
    const config = { url: '/api/v1/test', headers: {} as Record<string, string> }

    // Simulate the interceptor by running request.use manually
    const requestInterceptor = (api as any).interceptors.request['handlers'][0]?.fulfilled
    if (requestInterceptor) {
      const result = await requestInterceptor(config)
      expect(result.headers.Authorization).toBe('Bearer mock-token')
    } else {
      // Fallback: test via an actual request using axios mock
      const spy = vi.spyOn(axios, 'request').mockResolvedValueOnce({ data: {} })
      await api.get('/api/v1/test')
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
        })
      )
    }
  })

  it('skips Authorization for /auth/login', async () => {
    localStorage.setItem('token', 'mock-token')
    const spy = vi.spyOn(axios, 'request').mockResolvedValueOnce({ data: {} })
    await api.post('/api/v1/auth/login')
    expect(spy).toHaveBeenCalledWith(
      expect.not.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
      })
    )
  })
})
